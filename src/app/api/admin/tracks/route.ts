import { NextResponse } from "next/server";

import { requireRouteAdmin } from "@/lib/api-auth";
import { nullableString, trackSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const authResult = await requireRouteAdmin();
  if ("error" in authResult) {
    return authResult.error;
  }

  const payload = await request.json().catch(() => null);
  const parsed = trackSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid track payload." }, { status: 400 });
  }

  const { supabase, user } = authResult;
  const { data, error } = await supabase
    .from("tracks")
    .insert({
      album_id: nullableString(parsed.data.album_id),
      title: parsed.data.title,
      duration_seconds: parsed.data.duration_seconds ?? null,
      track_number: parsed.data.track_number ?? null,
      audio_url: nullableString(parsed.data.audio_url),
      embed_url: nullableString(parsed.data.embed_url),
      youtube_url: nullableString(parsed.data.youtube_url),
      spotify_url: nullableString(parsed.data.spotify_url),
      apple_music_url: nullableString(parsed.data.apple_music_url),
      audiomack_url: nullableString(parsed.data.audiomack_url),
      is_published: parsed.data.is_published,
      created_by: user.id,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to create track." }, { status: 500 });
  }

  return NextResponse.json({ track: data });
}

export async function DELETE(request: Request) {
  const authResult = await requireRouteAdmin();
  if ("error" in authResult) {
    return authResult.error;
  }

  const id = new URL(request.url).searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Track id is required." }, { status: 400 });
  }

  const { supabase } = authResult;
  const { error } = await supabase.from("tracks").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to delete track." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
