import { NextResponse } from "next/server";

import { requireRouteAdmin } from "@/lib/api-auth";
import { notificationSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const authResult = await requireRouteAdmin();
  if ("error" in authResult) {
    return authResult.error;
  }

  const payload = await request.json().catch(() => null);
  const parsed = notificationSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid notification payload." }, { status: 400 });
  }

  const { supabase } = authResult;
  const { title, body, target } = parsed.data;

  let recipientIds: string[];

  if (target === "all") {
    const { data, error } = await supabase.from("profiles").select("id").eq("role", "fan");
    if (error) {
      return NextResponse.json({ error: "Failed to load fans." }, { status: 500 });
    }
    recipientIds = (data ?? []).map((row) => row.id);
  } else {
    recipientIds = [target];
  }

  if (recipientIds.length === 0) {
    return NextResponse.json({ error: "No fans to notify yet." }, { status: 400 });
  }

  const { error: insertError } = await supabase.from("fan_notifications").insert(
    recipientIds.map((userId) => ({ user_id: userId, title, body })),
  );

  if (insertError) {
    return NextResponse.json({ error: "Failed to send notification." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, sent: recipientIds.length });
}
