import { NextResponse } from "next/server";

import { requireRouteAdmin } from "@/lib/api-auth";
import { awardSchema, nullableString } from "@/lib/validation";

export async function POST(request: Request) {
  const authResult = await requireRouteAdmin();
  if ("error" in authResult) {
    return authResult.error;
  }

  const payload = await request.json().catch(() => null);
  const parsed = awardSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid award payload." }, { status: 400 });
  }

  const { supabase, user } = authResult;
  const { data, error } = await supabase
    .from("awards")
    .insert({
      title: parsed.data.title,
      description: nullableString(parsed.data.description),
      awarded_on: nullableString(parsed.data.awarded_on),
      created_by: user.id,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to create award." }, { status: 500 });
  }

  return NextResponse.json({ award: data });
}

export async function DELETE(request: Request) {
  const authResult = await requireRouteAdmin();
  if ("error" in authResult) {
    return authResult.error;
  }

  const id = new URL(request.url).searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Award id is required." }, { status: 400 });
  }

  const { supabase } = authResult;
  const { error } = await supabase.from("awards").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to delete award." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
