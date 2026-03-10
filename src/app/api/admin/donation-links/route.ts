import { NextResponse } from "next/server";

import { requireRouteAdmin } from "@/lib/api-auth";
import { donationLinkSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const authResult = await requireRouteAdmin();
  if ("error" in authResult) {
    return authResult.error;
  }

  const payload = await request.json().catch(() => null);
  const parsed = donationLinkSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid donation link payload." }, { status: 400 });
  }

  const { supabase, user } = authResult;
  const { data, error } = await supabase
    .from("donation_links")
    .insert({
      label: parsed.data.label,
      url: parsed.data.url,
      is_published: parsed.data.is_published,
      created_by: user.id,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to create donation link." }, { status: 500 });
  }

  return NextResponse.json({ donationLink: data });
}

export async function DELETE(request: Request) {
  const authResult = await requireRouteAdmin();
  if ("error" in authResult) {
    return authResult.error;
  }

  const id = new URL(request.url).searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Donation link id is required." }, { status: 400 });
  }

  const { supabase } = authResult;
  const { error } = await supabase.from("donation_links").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to delete donation link." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
