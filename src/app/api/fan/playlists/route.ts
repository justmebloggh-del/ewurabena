import { NextResponse } from "next/server";

import { requireRouteUser } from "@/lib/api-auth";
import { fanPlaylistSchema, nullableString } from "@/lib/validation";

export async function GET() {
  const authResult = await requireRouteUser();
  if ("error" in authResult) {
    return authResult.error;
  }

  const { supabase, user } = authResult;
  const { data, error } = await supabase
    .from("fan_playlists")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to load playlists." }, { status: 500 });
  }

  return NextResponse.json({ playlists: data });
}

export async function POST(request: Request) {
  const authResult = await requireRouteUser();
  if ("error" in authResult) {
    return authResult.error;
  }

  const payload = await request.json().catch(() => null);
  const parsed = fanPlaylistSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid playlist payload." }, { status: 400 });
  }

  const { supabase, user } = authResult;
  const { error, data } = await supabase
    .from("fan_playlists")
    .insert({
      owner_id: user.id,
      title: parsed.data.title,
      description: nullableString(parsed.data.description),
      is_private: parsed.data.is_private,
    })
    .select("id, title")
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to create playlist." }, { status: 500 });
  }

  return NextResponse.json({ playlist: data });
}
