import { NextResponse } from "next/server";

import { requireRouteAdmin } from "@/lib/api-auth";
import { albumSchema, nullableString } from "@/lib/validation";

export async function POST(request: Request) {
  const authResult = await requireRouteAdmin();
  if ("error" in authResult) {
    return authResult.error;
  }

  const payload = await request.json().catch(() => null);
  const parsed = albumSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid album payload." }, { status: 400 });
  }

  const { supabase, user } = authResult;
  const { data, error } = await supabase
    .from("albums")
    .insert({
      title: parsed.data.title,
      description: nullableString(parsed.data.description),
      cover_image_url: nullableString(parsed.data.cover_image_url),
      release_date: nullableString(parsed.data.release_date),
      is_published: parsed.data.is_published,
      created_by: user.id,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to create album." }, { status: 500 });
  }

  return NextResponse.json({ album: data });
}

export async function DELETE(request: Request) {
  const authResult = await requireRouteAdmin();
  if ("error" in authResult) {
    return authResult.error;
  }

  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Album id is required." }, { status: 400 });
  }

  const { supabase } = authResult;
  const { error } = await supabase.from("albums").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to delete album." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
