import { NextResponse } from "next/server";

import { requireRouteUser } from "@/lib/api-auth";
import { fanReportSchema } from "@/lib/fan-hub";

export async function POST(request: Request, { params }: { params: Promise<{ postId: string }> }) {
  const authResult = await requireRouteUser();
  if ("error" in authResult) return authResult.error;

  const parsed = fanReportSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid report." }, { status: 400 });

  const { postId } = await params;
  const { supabase, user } = authResult;
  const { error } = await supabase
    .from("fan_post_reports")
    .upsert({ post_id: postId, reporter_id: user.id, reason: parsed.data.reason || null }, { onConflict: "post_id,reporter_id" });

  if (error) return NextResponse.json({ error: "Could not send your report." }, { status: 400 });
  return NextResponse.json({ ok: true });
}
