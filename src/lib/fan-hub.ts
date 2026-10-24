import { z } from "zod";

// ── Social accounts ───────────────────────────────────────────────────
// Fans link their profiles by handle or URL. We only ever store a URL on a
// known host, so a fan can't put a `javascript:` or look-alike link on the page.
export const SOCIAL_PLATFORMS = [
  { key: "tiktok", label: "TikTok", host: "tiktok.com", base: "https://www.tiktok.com/@", handlePrefix: "@" },
  { key: "facebook", label: "Facebook", host: "facebook.com", base: "https://www.facebook.com/", handlePrefix: "" },
  { key: "instagram", label: "Instagram", host: "instagram.com", base: "https://www.instagram.com/", handlePrefix: "@" },
  { key: "youtube", label: "YouTube", host: "youtube.com", base: "https://www.youtube.com/@", handlePrefix: "@" },
  { key: "x", label: "X (Twitter)", host: "x.com", base: "https://x.com/", handlePrefix: "@" },
  { key: "snapchat", label: "Snapchat", host: "snapchat.com", base: "https://www.snapchat.com/add/", handlePrefix: "" },
] as const;

export type SocialKey = (typeof SOCIAL_PLATFORMS)[number]["key"];
export type Socials = Partial<Record<SocialKey, string>>;

const HANDLE_RE = /^[A-Za-z0-9._-]{1,60}$/;

/** Returns a clean https URL, "" for empty input, or null when the input isn't valid for that platform. */
export function normalizeSocial(key: SocialKey, input: string): string | null {
  const platform = SOCIAL_PLATFORMS.find((p) => p.key === key);
  const value = input.trim();
  if (!platform) return null;
  if (!value) return "";

  if (/^https?:\/\//i.test(value)) {
    try {
      const url = new URL(value);
      const hosts = key === "x" ? ["x.com", "twitter.com"] : key === "facebook" ? ["facebook.com", "fb.com"] : [platform.host];
      const host = url.hostname.replace(/^(www|m|web)\./, "");
      if (url.protocol !== "https:" && url.protocol !== "http:") return null;
      if (!hosts.some((h) => host === h || host.endsWith(`.${h}`))) return null;
      return `https://${url.hostname}${url.pathname}${url.search}`.slice(0, 200);
    } catch {
      return null;
    }
  }

  const handle = value.replace(/^@/, "");
  if (!HANDLE_RE.test(handle)) return null;
  return `${platform.base}${handle}`;
}

export const fanProfileSchema = z.object({
  display_name: z.string().trim().min(2).max(50),
  bio: z.string().trim().max(300).optional().default(""),
  avatar_url: z.string().url().max(500).optional().or(z.literal("")),
  socials: z.record(z.string(), z.string().max(200)).optional().default({}),
});

export const fanPostSchema = z
  .object({
    track_id: z.string().uuid().optional().nullable(),
    caption: z.string().trim().max(500).optional().default(""),
    media_url: z.string().url().max(600).optional().nullable(),
    media_kind: z.enum(["image", "video"]).optional().nullable(),
  })
  .refine((v) => Boolean(v.caption) || Boolean(v.media_url) || Boolean(v.track_id), {
    message: "Add a caption, a photo or video, or pick a song.",
  })
  .refine((v) => Boolean(v.media_url) === Boolean(v.media_kind), {
    message: "Media is missing its type.",
  });

export const fanCommentSchema = z.object({ body: z.string().trim().min(1).max(300) });
export const fanReportSchema = z.object({ reason: z.string().trim().max(300).optional().default("") });
export const fanFollowSchema = z.object({ user_id: z.string().uuid() });

// ── Types shared by pages and components ──────────────────────────────
export type FanAuthor = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  is_official?: boolean;
};

export type FanPost = {
  id: string;
  created_at: string;
  caption: string | null;
  media_url: string | null;
  media_kind: "image" | "video" | null;
  author: FanAuthor;
  track: { id: string; title: string; audio_url: string | null } | null;
  like_count: number;
  comment_count: number;
  liked_by_me: boolean;
};

export type FanComment = {
  id: string;
  body: string;
  created_at: string;
  author: FanAuthor;
};

export type FanProfile = FanAuthor & {
  bio: string | null;
  socials: Socials;
  created_at: string;
};

export const FAN_MEDIA_BUCKET = "fan-media";
export const FAN_MEDIA_MAX_BYTES = 50 * 1024 * 1024;
export const FAN_PAGE_SIZE = 12;

/**
 * Supabase Storage serves public files as a download when `?download=<name>` is
 * added. Returns null for anything else (YouTube, Spotify… can't be downloaded),
 * so the UI only offers Download where it really works.
 */
export function getDownloadUrl(url: string | null | undefined, title: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (!/\.supabase\.(co|com)$/.test(parsed.hostname) || !parsed.pathname.includes("/storage/v1/object/public/")) return null;
    const ext = parsed.pathname.split(".").pop()?.toLowerCase() ?? "";
    const safe = title.replace(/[^\w\s.-]/g, "").trim().replace(/\s+/g, "-").slice(0, 80) || "ewura-abena";
    parsed.searchParams.set("download", /^[a-z0-9]{2,5}$/.test(ext) ? `${safe}.${ext}` : safe);
    return parsed.toString();
  } catch {
    return null;
  }
}
