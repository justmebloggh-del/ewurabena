import { NextResponse } from "next/server";

import { requireRouteAdmin } from "@/lib/api-auth";
import { deleteStorageFileIfOwned } from "@/lib/supabase/admin";
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
      facebook_url: nullableString(parsed.data.facebook_url),
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

export async function PATCH(request: Request) {
  const authResult = await requireRouteAdmin();
  if ("error" in authResult) {
    return authResult.error;
  }

  const id = new URL(request.url).searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Media id is required." }, { status: 400 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = mediaItemSchema.partial().safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid media payload." }, { status: 400 });
  }

  const d = parsed.data;
  const update: Record<string, unknown> = {};
  if (d.title !== undefined) update.title = d.title;
  if (d.kind !== undefined) update.kind = d.kind;
  if (d.url !== undefined) update.url = d.url;
  if (d.thumbnail_url !== undefined) update.thumbnail_url = nullableString(d.thumbnail_url);
  if (d.caption !== undefined) update.caption = nullableString(d.caption);
  if (d.facebook_url !== undefined) update.facebook_url = nullableString(d.facebook_url);
  if (d.is_published !== undefined) update.is_published = d.is_published;

  const { supabase } = authResult;
  const { data, error } = await supabase
    .from("media_items")
    .update(update)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to update media item." }, { status: 500 });
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
  const { data: existing } = await supabase.from("media_items").select("url").eq("id", id).single();
  const { error } = await supabase.from("media_items").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to delete media item." }, { status: 500 });
  }

  await deleteStorageFileIfOwned(existing?.url);

  return NextResponse.json({ ok: true });
}
