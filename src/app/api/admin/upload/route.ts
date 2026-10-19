import { NextResponse } from "next/server";

import { requireRouteAdmin } from "@/lib/api-auth";

const MAX_BYTES = 100 * 1024 * 1024; // 100MB
const ALLOWED_PREFIXES = ["audio/", "video/", "image/"];

function safeExtension(filename: string) {
  const match = /\.([a-zA-Z0-9]+)$/.exec(filename);
  return match ? match[1].toLowerCase() : "bin";
}

export async function POST(request: Request) {
  const authResult = await requireRouteAdmin();
  if ("error" in authResult) {
    return authResult.error;
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File is too large (max 100MB)." }, { status: 400 });
  }

  if (!ALLOWED_PREFIXES.some((prefix) => file.type.startsWith(prefix))) {
    return NextResponse.json({ error: "Only audio, video, or image files are allowed." }, { status: 400 });
  }

  const folder = file.type.startsWith("audio/") ? "audio" : file.type.startsWith("video/") ? "video" : "image";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExtension(file.name)}`;

  const { supabase } = authResult;
  const { error } = await supabase.storage.from("media").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    return NextResponse.json({ error: `Upload failed: ${error.message}` }, { status: 500 });
  }

  const { data: publicUrlData } = supabase.storage.from("media").getPublicUrl(path);

  return NextResponse.json({ url: publicUrlData.publicUrl, path });
}
