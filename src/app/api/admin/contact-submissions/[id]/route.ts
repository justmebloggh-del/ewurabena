import { NextResponse } from "next/server";
import { z } from "zod";

import { requireRouteAdmin } from "@/lib/api-auth";

const contactStatusSchema = z.object({
  status: z.enum(["new", "in_review", "resolved"]),
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const authResult = await requireRouteAdmin();
  if ("error" in authResult) {
    return authResult.error;
  }

  const payload = await request.json().catch(() => null);
  const parsed = contactStatusSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status payload." }, { status: 400 });
  }

  const { id } = await context.params;
  const { supabase } = authResult;

  const { error } = await supabase
    .from("contact_submissions")
    .update({ status: parsed.data.status })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to update contact submission." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
