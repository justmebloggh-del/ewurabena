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

export async function PATCH(request: Request) {
  const authResult = await requireRouteAdmin();
  if ("error" in authResult) {
    return authResult.error;
  }

  const id = new URL(request.url).searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Album id is required." }, { status: 400 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = albumSchema.partial().safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid album payload." }, { status: 400 });
  }

  const d = parsed.data;
  const update: Record<string, unknown> = {};
  if (d.title !== undefined) update.title = d.title;
  if (d.description !== undefined) update.description = nullableString(d.description);
  if (d.cover_image_url !== undefined) update.cover_image_url = nullableString(d.cover_image_url);
  if (d.release_date !== undefined) update.release_date = nullableString(d.release_date);
  if (d.is_published !== undefined) update.is_published = d.is_published;

  const { supabase } = authResult;
  const { data, error } = await supabase
    .from("albums")
    .update(update)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to update album." }, { status: 500 });
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
