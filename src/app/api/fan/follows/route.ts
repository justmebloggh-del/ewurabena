import { NextResponse } from "next/server";

import { requireRouteUser } from "@/lib/api-auth";
import { fanFollowSchema } from "@/lib/fan-hub";

export async function POST(request: Request) {
  const authResult = await requireRouteUser();
  if ("error" in authResult) return authResult.error;

  const parsed = fanFollowSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const { supabase, user } = authResult;
  if (parsed.data.user_id === user.id) return NextResponse.json({ error: "You can't follow yourself." }, { status: 400 });

  const { error } = await supabase
    .from("fan_follows")
    .upsert({ follower_id: user.id, following_id: parsed.data.user_id }, { onConflict: "follower_id,following_id" });
  if (error) return NextResponse.json({ error: "Could not follow this fan." }, { status: 400 });
  return NextResponse.json({ following: true });
}

export async function DELETE(request: Request) {
  const authResult = await requireRouteUser();
  if ("error" in authResult) return authResult.error;

  const parsed = fanFollowSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const { supabase, user } = authResult;
  await supabase.from("fan_follows").delete().eq("follower_id", user.id).eq("following_id", parsed.data.user_id);
  return NextResponse.json({ following: false });
}
