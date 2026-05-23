import { NextResponse } from "next/server";

import { requireRouteUser } from "@/lib/api-auth";
import { fanPlaylistTrackSchema } from "@/lib/validation";

export async function GET(
  request: Request,
  context: { params: Promise<{ playlistId: string }> },
) {
  const authResult = await requireRouteUser();
  if ("error" in authResult) {
    return authResult.error;
  }

  const { playlistId } = await context.params;
  const { supabase } = authResult;

  const { data: playlistTracks, error } = await supabase
    .from("fan_playlist_tracks")
    .select("track_id, position")
    .eq("playlist_id", playlistId)
    .order("position", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "Failed to load playlist tracks." }, { status: 500 });
  }

  // Get the track details from the public tracks
  const trackIds = playlistTracks?.map((pt) => pt.track_id) ?? [];
  
  if (trackIds.length === 0) {
    return NextResponse.json({ tracks: [] });
  }

  // For now, return just the track IDs and positions - 
  // the component will need to match with available tracks
  return NextResponse.json({ 
    tracks: playlistTracks,
    trackIds 
  });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ playlistId: string }> },
) {
  const authResult = await requireRouteUser();
  if ("error" in authResult) {
    return authResult.error;
  }

  const { playlistId } = await context.params;
  const payload = await request.json().catch(() => null);
  const parsed = fanPlaylistTrackSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid playlist track payload." }, { status: 400 });
  }

  const { supabase } = authResult;
  const { error, data } = await supabase
    .from("fan_playlist_tracks")
    .upsert(
      {
        playlist_id: playlistId,
        track_id: parsed.data.track_id,
        position: parsed.data.position,
      },
      { onConflict: "playlist_id,track_id" },
    )
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to add track to playlist." }, { status: 500 });
  }

  return NextResponse.json({ playlistTrack: data });
}
