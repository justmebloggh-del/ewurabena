import { z } from "zod";

export const contactSubmissionSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().email().max(200),
  message: z.string().trim().min(10).max(4000),
  organization: z.string().trim().max(200).optional().default(""),
  event_date: z.string().optional().default(""),
  website: z.string().max(200).optional().default(""),
});

export const favoriteSchema = z
  .object({
    track_id: z.string().uuid().optional(),
    album_id: z.string().uuid().optional(),
  })
  .refine((value) => Boolean(value.track_id) !== Boolean(value.album_id), {
    message: "Provide either track_id or album_id.",
  });

export const fanPlaylistSchema = z.object({
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().max(500).optional().default(""),
  is_private: z.boolean().optional().default(true),
});

export const fanPlaylistTrackSchema = z.object({
  track_id: z.string().uuid(),
  position: z.number().int().min(1),
});

export const artistProfileSchema = z.object({
  stage_name: z.string().trim().min(2).max(120),
  subtitle: z.string().trim().min(2).max(200),
  bio: z.string().trim().min(20).max(5000),
  dovvsu_ambassador_note: z.string().trim().min(10).max(5000),
  hero_image_url: z.string().url().optional().or(z.literal("")),
});

export const albumSchema = z.object({
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().max(2000).optional().default(""),
  cover_image_url: z.string().url().optional().or(z.literal("")),
  release_date: z.string().optional().default(""),
  is_published: z.boolean().optional().default(true),
});

export const trackSchema = z.object({
  album_id: z.string().uuid().optional().or(z.literal("")),
  title: z.string().trim().min(2).max(120),
  duration_seconds: z.number().int().min(1).optional(),
  track_number: z.number().int().min(1).optional(),
  audio_url: z.string().url().optional().or(z.literal("")),
  embed_url: z.string().url().optional().or(z.literal("")),
  youtube_url: z.string().url().optional().or(z.literal("")),
  spotify_url: z.string().url().optional().or(z.literal("")),
  apple_music_url: z.string().url().optional().or(z.literal("")),
  audiomack_url: z.string().url().optional().or(z.literal("")),
  is_published: z.boolean().optional().default(true),
});

export const officialPlaylistSchema = z.object({
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().max(2000).optional().default(""),
  embed_url: z.string().url().optional().or(z.literal("")),
  cover_image_url: z.string().url().optional().or(z.literal("")),
  is_published: z.boolean().optional().default(true),
});

export const mediaItemSchema = z.object({
  title: z.string().trim().min(2).max(120),
  kind: z.enum(["image", "video"]),
  url: z.string().url(),
  thumbnail_url: z.string().url().optional().or(z.literal("")),
  caption: z.string().trim().max(1000).optional().default(""),
  is_published: z.boolean().optional().default(true),
});

export const awardSchema = z.object({
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().max(2000).optional().default(""),
  awarded_on: z.string().optional().default(""),
});

export const announcementSchema = z.object({
  title: z.string().trim().min(2).max(120),
  body: z.string().trim().min(10).max(4000),
  is_published: z.boolean().optional().default(true),
});

export const socialLinkSchema = z.object({
  platform: z.string().trim().min(2).max(50),
  url: z.string().url(),
  is_published: z.boolean().optional().default(true),
});

export const donationLinkSchema = z.object({
  label: z.string().trim().min(2).max(120),
  url: z.string().url(),
  is_published: z.boolean().optional().default(true),
});

export function nullableString(value?: string) {
  if (!value) {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
