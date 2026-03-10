import { NextResponse } from "next/server";

import { requireRouteAdmin } from "@/lib/api-auth";
import { artistProfileSchema, nullableString } from "@/lib/validation";

export async function POST(request: Request) {
  const authResult = await requireRouteAdmin();
  if ("error" in authResult) {
    return authResult.error;
  }

  const payload = await request.json().catch(() => null);
  const parsed = artistProfileSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid artist profile payload." }, { status: 400 });
  }

  const { supabase, user } = authResult;
  const { data: existing } = await supabase
    .from("artist_profiles")
    .select("id")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const values = {
    stage_name: parsed.data.stage_name,
    subtitle: parsed.data.subtitle,
    bio: parsed.data.bio,
    dovvsu_ambassador_note: parsed.data.dovvsu_ambassador_note,
    hero_image_url: nullableString(parsed.data.hero_image_url),
    created_by: user.id,
    updated_at: new Date().toISOString(),
  };

  const query = existing?.id
    ? supabase.from("artist_profiles").update(values).eq("id", existing.id)
    : supabase.from("artist_profiles").insert(values);

  const { error } = await query;

  if (error) {
    return NextResponse.json({ error: "Failed to save artist profile." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
