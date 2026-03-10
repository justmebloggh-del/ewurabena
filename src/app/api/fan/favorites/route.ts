import { NextResponse } from "next/server";

import { requireRouteUser } from "@/lib/api-auth";
import { favoriteSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const authResult = await requireRouteUser();
  if ("error" in authResult) {
    return authResult.error;
  }

  const payload = await request.json().catch(() => null);
  const parsed = favoriteSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid payload." }, { status: 400 });
  }

  const { supabase, user } = authResult;
  const { error, data } = await supabase
    .from("favorites")
    .upsert(
      {
        user_id: user.id,
        track_id: parsed.data.track_id ?? null,
        album_id: parsed.data.album_id ?? null,
      },
      { onConflict: parsed.data.track_id ? "user_id,track_id" : "user_id,album_id" },
    )
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to save favorite." }, { status: 500 });
  }

  return NextResponse.json({ favorite: data });
}

export async function DELETE(request: Request) {
  const authResult = await requireRouteUser();
  if ("error" in authResult) {
    return authResult.error;
  }

  const payload = await request.json().catch(() => null);
  const parsed = favoriteSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid payload." }, { status: 400 });
  }

  const { supabase, user } = authResult;

  const query = supabase.from("favorites").delete().eq("user_id", user.id);

  if (parsed.data.track_id) {
    query.eq("track_id", parsed.data.track_id);
  }

  if (parsed.data.album_id) {
    query.eq("album_id", parsed.data.album_id);
  }

  const { error } = await query;

  if (error) {
    return NextResponse.json({ error: "Failed to remove favorite." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
