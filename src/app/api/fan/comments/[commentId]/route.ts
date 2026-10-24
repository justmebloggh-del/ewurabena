import { NextResponse } from "next/server";

import { requireRouteUser } from "@/lib/api-auth";

export async function DELETE(_request: Request, { params }: { params: Promise<{ commentId: string }> }) {
  const authResult = await requireRouteUser();
  if ("error" in authResult) return authResult.error;

  const { commentId } = await params;
  const { supabase } = authResult;
  // RLS only lets the author (or an admin) delete.
  const { data, error } = await supabase.from("fan_post_comments").delete().eq("id", commentId).select("id");
  if (error || !data?.length) return NextResponse.json({ error: "Could not delete this comment." }, { status: 403 });
  return NextResponse.json({ ok: true });
}
