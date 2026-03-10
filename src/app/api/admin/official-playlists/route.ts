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
