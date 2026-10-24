import { FAN_MEDIA_BUCKET, FAN_MEDIA_MAX_BYTES } from "@/lib/fan-hub";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];
const MAX_IMAGE_EDGE = 1600;

export type UploadedMedia = { url: string; kind: "image" | "video" };

// Phone photos are often 5–10 MB. Scale them down in the browser before
// uploading so the feed stays fast and storage stays small.
async function shrinkImage(file: File): Promise<Blob> {
  if (file.type === "image/gif") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size < 1.5 * 1024 * 1024) return file;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
    return blob ?? file;
  } catch {
    return file;
  }
}

export async function uploadFanMedia(file: File, userId: string): Promise<UploadedMedia> {
  const isImage = IMAGE_TYPES.includes(file.type);
  const isVideo = VIDEO_TYPES.includes(file.type);
  if (!isImage && !isVideo) throw new Error("Please choose a JPG, PNG, WebP or GIF photo, or an MP4, MOV or WebM video.");
  if (file.size > FAN_MEDIA_MAX_BYTES * (isImage ? 2 : 1)) {
    throw new Error(isImage ? "That photo is too large." : "Videos can be up to 50 MB.");
  }

  const body = isImage ? await shrinkImage(file) : file;
  const contentType = isImage && body !== file ? "image/jpeg" : file.type;
  const ext = contentType === "image/jpeg" ? "jpg" : (contentType.split("/")[1] === "quicktime" ? "mov" : contentType.split("/")[1]);
  const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.storage.from(FAN_MEDIA_BUCKET).upload(path, body, { contentType, cacheControl: "31536000" });
  if (error) throw new Error("Upload failed. Please try again.");

  const { data } = supabase.storage.from(FAN_MEDIA_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, kind: isImage ? "image" : "video" };
}
