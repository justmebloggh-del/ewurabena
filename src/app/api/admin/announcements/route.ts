import { NextResponse } from "next/server";

import { requireRouteAdmin } from "@/lib/api-auth";
import { announcementSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const authResult = await requireRouteAdmin();
  if ("error" in authResult) {
    return authResult.error;
  }

  const payload = await request.json().catch(() => null);
  const parsed = announcementSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid announcement payload." }, { status: 400 });
  }

  const { supabase, user } = authResult;
  const { data, error } = await supabase
    .from("announcements")
    .insert({
      title: parsed.data.title,
      body: parsed.data.body,
      is_published: parsed.data.is_published,
      created_by: user.id,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to create announcement." }, { status: 500 });
  }

  if (parsed.data.is_published) {
    const { data: fans } = await supabase.from("profiles").select("id").eq("role", "fan").limit(1000);

    if (fans && fans.length > 0) {
      await supabase.from("fan_notifications").insert(
        fans.map((fan) => ({
          user_id: fan.id,
          title: parsed.data.title,
          body: parsed.data.body,
        })),
      );
    }
  }

  return NextResponse.json({ announcement: data });
}

export async function DELETE(request: Request) {
  const authResult = await requireRouteAdmin();
  if ("error" in authResult) {
    return authResult.error;
  }

  const id = new URL(request.url).searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Announcement id is required." }, { status: 400 });
  }

  const { supabase } = authResult;
  const { error } = await supabase.from("announcements").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to delete announcement." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
