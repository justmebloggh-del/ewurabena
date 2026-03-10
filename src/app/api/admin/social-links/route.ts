import { NextResponse } from "next/server";

import { requireRouteAdmin } from "@/lib/api-auth";
import { socialLinkSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const authResult = await requireRouteAdmin();
  if ("error" in authResult) {
    return authResult.error;
  }

  const payload = await request.json().catch(() => null);
  const parsed = socialLinkSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid social link payload." }, { status: 400 });
  }

  const { supabase, user } = authResult;
  const { data, error } = await supabase
    .from("social_links")
    .insert({
      platform: parsed.data.platform,
      url: parsed.data.url,
      is_published: parsed.data.is_published,
      created_by: user.id,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to create social link." }, { status: 500 });
  }

  return NextResponse.json({ socialLink: data });
}

export async function DELETE(request: Request) {
  const authResult = await requireRouteAdmin();
  if ("error" in authResult) {
    return authResult.error;
  }

  const id = new URL(request.url).searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Social link id is required." }, { status: 400 });
  }

  const { supabase } = authResult;
  const { error } = await supabase.from("social_links").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to delete social link." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
