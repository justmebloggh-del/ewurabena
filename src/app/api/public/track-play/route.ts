import { NextResponse } from "next/server";

import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { trackPlaySchema } from "@/lib/validation";

// Unauthenticated: any visitor playing a track should count toward "most
// played". The DB only exposes this through a narrow security-definer
// function (increment_track_play), so this endpoint can't be abused to
// otherwise write to the tracks table.
export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true });
  }

  const payload = await request.json().catch(() => null);
  const parsed = trackPlaySchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("increment_track_play", { p_track_id: parsed.data.track_id });

  if (error) {
    return NextResponse.json({ error: "Failed to record play." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
