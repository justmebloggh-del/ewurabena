import { NextResponse } from "next/server";

import { requireRouteAdmin } from "@/lib/api-auth";
import { nullableString, officialPlaylistSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const authResult = await requireRouteAdmin();
  if ("error" in authResult) {
    return authResult.error;
  }

  const payload = await request.json().catch(() => null);
  const parsed = officialPlaylistSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid playlist payload." }, { status: 400 });
  }

  const { supabase, user } = authResult;
  const { data, error } = await supabase
    .from("official_playlists")
    .insert({
      title: parsed.data.title,
      description: nullableString(parsed.data.description),
      embed_url: nullableString(parsed.data.embed_url),
      cover_image_url: nullableString(parsed.data.cover_image_url),
      is_published: parsed.data.is_published,
      created_by: user.id,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to create official playlist." }, { status: 500 });
  }

  return NextResponse.json({ officialPlaylist: data });
}

export async function PATCH(request: Request) {
  const authResult = await requireRouteAdmin();
  if ("error" in authResult) {
    return authResult.error;
  }

  const id = new URL(request.url).searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Playlist id is required." }, { status: 400 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = officialPlaylistSchema.partial().safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid playlist payload." }, { status: 400 });
  }

  const d = parsed.data;
  const update: Record<string, unknown> = {};
  if (d.title !== undefined) update.title = d.title;
  if (d.description !== undefined) update.description = nullableString(d.description);
  if (d.embed_url !== undefined) update.embed_url = nullableString(d.embed_url);
  if (d.cover_image_url !== undefined) update.cover_image_url = nullableString(d.cover_image_url);
  if (d.is_published !== undefined) update.is_published = d.is_published;

  const { supabase } = authResult;
  const { data, error } = await supabase
    .from("official_playlists")
    .update(update)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to update playlist." }, { status: 500 });
  }

  return NextResponse.json({ officialPlaylist: data });
}

export async function DELETE(request: Request) {
  const authResult = await requireRouteAdmin();
  if ("error" in authResult) {
    return authResult.error;
  }

  const id = new URL(request.url).searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Playlist id is required." }, { status: 400 });
  }

  const { supabase } = authResult;
  const { error } = await supabase.from("official_playlists").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to delete playlist." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
