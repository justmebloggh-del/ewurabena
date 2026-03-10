import { NextResponse } from "next/server";

import { requireRouteUser } from "@/lib/api-auth";

export async function GET() {
  const authResult = await requireRouteUser();
  if ("error" in authResult) {
    return authResult.error;
  }

  const { supabase, user } = authResult;
  const { data, error } = await supabase
    .from("fan_notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to load notifications." }, { status: 500 });
  }

  return NextResponse.json({ notifications: data });
}
