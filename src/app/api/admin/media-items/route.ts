import { NextResponse } from "next/server";

import { requireRouteAdmin } from "@/lib/api-auth";
import { mediaItemSchema, nullableString } from "@/lib/validation";

export async function POST(request: Request) {
  const authResult = await requireRouteAdmin();
  if ("error" in authResult) {
    return authResult.error;
  }

  const payload = await request.json().catch(() => null);
  const parsed = mediaItemSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid media payload." }, { status: 400 });
  }

  const { supabase, user } = authResult;
  const { data, error } = await supabase
    .from("media_items")
    .insert({
      title: parsed.data.title,
      kind: parsed.data.kind,
      url: parsed.data.url,
      thumbnail_url: nullableString(parsed.data.thumbnail_url),
      caption: nullableString(parsed.data.caption),
      is_published: parsed.data.is_published,
      created_by: user.id,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to create media item." }, { status: 500 });
  }

  return NextResponse.json({ mediaItem: data });
}

export async function DELETE(request: Request) {
  const authResult = await requireRouteAdmin();
  if ("error" in authResult) {
    return authResult.error;
  }

  const id = new URL(request.url).searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Media id is required." }, { status: 400 });
  }

  const { supabase } = authResult;
  const { error } = await supabase.from("media_items").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to delete media item." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
