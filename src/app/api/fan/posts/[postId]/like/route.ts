import { NextResponse } from "next/server";

import { requireRouteUser } from "@/lib/api-auth";

// Toggles the signed-in fan's like on a post and returns the new state.
export async function POST(_request: Request, { params }: { params: Promise<{ postId: string }> }) {
  const authResult = await requireRouteUser();
  if ("error" in authResult) return authResult.error;

  const { postId } = await params;
  const { supabase, user } = authResult;

  const { data: existing } = await supabase
    .from("fan_post_likes")
    .select("post_id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase.from("fan_post_likes").delete().eq("post_id", postId).eq("user_id", user.id);
    return NextResponse.json({ liked: false });
  }

  const { error } = await supabase.from("fan_post_likes").insert({ post_id: postId, user_id: user.id });
  if (error) return NextResponse.json({ error: "Could not like this post." }, { status: 400 });
  return NextResponse.json({ liked: true });
}
