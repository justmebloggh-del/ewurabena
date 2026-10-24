import { NextResponse } from "next/server";

import { requireRouteUser } from "@/lib/api-auth";
import { FAN_MEDIA_BUCKET, SOCIAL_PLATFORMS, fanProfileSchema, normalizeSocial, type Socials } from "@/lib/fan-hub";

export async function PUT(request: Request) {
  const authResult = await requireRouteUser();
  if ("error" in authResult) return authResult.error;

  const parsed = fanProfileSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check your name (2–50 characters) and bio (up to 300)." }, { status: 400 });
  }

  const { supabase, user } = authResult;

  const socials: Socials = {};
  for (const platform of SOCIAL_PLATFORMS) {
    const raw = parsed.data.socials[platform.key] ?? "";
    const url = normalizeSocial(platform.key, raw);
    if (url === null) {
      return NextResponse.json({ error: `That doesn't look like a valid ${platform.label} handle or link.` }, { status: 400 });
    }
    if (url) socials[platform.key] = url;
  }

  const avatar = parsed.data.avatar_url || null;
  if (avatar && !avatar.includes(`/storage/v1/object/public/${FAN_MEDIA_BUCKET}/${user.id}/`)) {
    return NextResponse.json({ error: "Invalid profile picture." }, { status: 400 });
  }

  const { error } = await supabase
    .from("fan_profiles")
    .upsert({
      id: user.id,
      display_name: parsed.data.display_name,
      bio: parsed.data.bio || null,
      avatar_url: avatar,
      socials,
      updated_at: new Date().toISOString(),
    });

  if (error) return NextResponse.json({ error: "Could not save your profile." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
