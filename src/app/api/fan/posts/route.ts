import { NextResponse } from "next/server";

import { requireRouteUser } from "@/lib/api-auth";
import { getCurrentUser } from "@/lib/auth";
import { getFanPosts, getFollowingIds } from "@/lib/data/fan-hub";
import { FAN_MEDIA_BUCKET, fanPostSchema } from "@/lib/fan-hub";

// Feed page: ?before=<iso timestamp>&feed=following|all&author=<uuid>
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const user = await getCurrentUser();
  const before = searchParams.get("before") || undefined;
  const author = searchParams.get("author");

  let authorIds: string[] | undefined;
  if (author) {
    authorIds = [author];
  } else if (searchParams.get("feed") === "official") {
    const posts = await getFanPosts(user?.id ?? null, { before, officialOnly: true });
    return NextResponse.json({ posts });
  } else if (searchParams.get("feed") === "following") {
    if (!user) return NextResponse.json({ posts: [] });
    authorIds = [...(await getFollowingIds(user.id)), user.id];
  }

  const posts = await getFanPosts(user?.id ?? null, { authorIds, before });
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const authResult = await requireRouteUser();
  if ("error" in authResult) return authResult.error;

  const parsed = fanPostSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid post." }, { status: 400 });
  }

  const { supabase, user } = authResult;

  // Media must be a file this fan uploaded to their own folder in our bucket.
  const { media_url, media_kind, track_id, caption } = parsed.data;
  if (media_url) {
    const marker = `/storage/v1/object/public/${FAN_MEDIA_BUCKET}/${user.id}/`;
    if (!media_url.includes(marker)) {
      return NextResponse.json({ error: "Invalid media file." }, { status: 400 });
    }
  }

  // Simple spam guard: at most 5 posts per minute per fan.
  const since = new Date(Date.now() - 60_000).toISOString();
  const { count } = await supabase
    .from("fan_posts")
    .select("*", { count: "exact", head: true })
    .eq("author_id", user.id)
    .gte("created_at", since);
  if ((count ?? 0) >= 5) {
    return NextResponse.json({ error: "You're posting too fast. Try again in a minute." }, { status: 429 });
  }

  const { data, error } = await supabase
    .from("fan_posts")
    .insert({
      author_id: user.id,
      track_id: track_id || null,
      caption: caption || null,
      media_url: media_url || null,
      media_kind: media_kind || null,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: "Could not publish your post." }, { status: 500 });
  }
  return NextResponse.json({ id: data.id }, { status: 201 });
}

export async function DELETE(request: Request) {
  const authResult = await requireRouteUser();
  if ("error" in authResult) return authResult.error;

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing post id." }, { status: 400 });

  const { supabase } = authResult;
  const { data: post } = await supabase.from("fan_posts").select("media_url").eq("id", id).maybeSingle();

  // RLS only lets the author (or an admin) delete.
  const { data: deleted, error } = await supabase.from("fan_posts").delete().eq("id", id).select("id");
  if (error || !deleted?.length) {
    return NextResponse.json({ error: "Could not delete this post." }, { status: 403 });
  }

  // Best-effort cleanup of the uploaded file.
  const marker = `/object/public/${FAN_MEDIA_BUCKET}/`;
  const path = post?.media_url?.split(marker)[1];
  if (path) await supabase.storage.from(FAN_MEDIA_BUCKET).remove([decodeURIComponent(path)]);

  return NextResponse.json({ ok: true });
}
