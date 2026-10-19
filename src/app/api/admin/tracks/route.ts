import { NextResponse } from "next/server";

import { requireRouteAdmin } from "@/lib/api-auth";
import { deleteStorageFileIfOwned } from "@/lib/supabase/admin";
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
      video_url: nullableString(parsed.data.video_url),
      embed_url: nullableString(parsed.data.embed_url),
      youtube_url: nullableString(parsed.data.youtube_url),
      spotify_url: nullableString(parsed.data.spotify_url),
      apple_music_url: nullableString(parsed.data.apple_music_url),
      audiomack_url: nullableString(parsed.data.audiomack_url),
      boomplay_url: nullableString(parsed.data.boomplay_url),
      facebook_url: nullableString(parsed.data.facebook_url),
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

export async function PATCH(request: Request) {
  const authResult = await requireRouteAdmin();
  if ("error" in authResult) {
    return authResult.error;
  }

  const id = new URL(request.url).searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Track id is required." }, { status: 400 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = trackSchema.partial().safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid track payload." }, { status: 400 });
  }

  const d = parsed.data;
  const update: Record<string, unknown> = {};
  if (d.album_id !== undefined) update.album_id = nullableString(d.album_id);
  if (d.title !== undefined) update.title = d.title;
  if (d.duration_seconds !== undefined) update.duration_seconds = d.duration_seconds ?? null;
  if (d.track_number !== undefined) update.track_number = d.track_number ?? null;
  if (d.audio_url !== undefined) update.audio_url = nullableString(d.audio_url);
  if (d.video_url !== undefined) update.video_url = nullableString(d.video_url);
  if (d.embed_url !== undefined) update.embed_url = nullableString(d.embed_url);
  if (d.youtube_url !== undefined) update.youtube_url = nullableString(d.youtube_url);
  if (d.spotify_url !== undefined) update.spotify_url = nullableString(d.spotify_url);
  if (d.apple_music_url !== undefined) update.apple_music_url = nullableString(d.apple_music_url);
  if (d.audiomack_url !== undefined) update.audiomack_url = nullableString(d.audiomack_url);
  if (d.boomplay_url !== undefined) update.boomplay_url = nullableString(d.boomplay_url);
  if (d.facebook_url !== undefined) update.facebook_url = nullableString(d.facebook_url);
  if (d.is_published !== undefined) update.is_published = d.is_published;

  const { supabase } = authResult;
  const { data, error } = await supabase
    .from("tracks")
    .update(update)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to update track." }, { status: 500 });
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
  const { data: existing } = await supabase.from("tracks").select("audio_url, video_url").eq("id", id).single();
  const { error } = await supabase.from("tracks").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to delete track." }, { status: 500 });
  }

  await Promise.all([
    deleteStorageFileIfOwned(existing?.audio_url),
    deleteStorageFileIfOwned(existing?.video_url),
  ]);

  return NextResponse.json({ ok: true });
}
