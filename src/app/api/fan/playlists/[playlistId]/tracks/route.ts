import { NextResponse } from "next/server";

import { requireRouteUser } from "@/lib/api-auth";
import { fanPlaylistTrackSchema } from "@/lib/validation";

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
