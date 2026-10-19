import { toYouTubeEmbed } from "@/lib/youtube";

// Best-effort: always returns a usable src, falling back to the original
// URL untouched for non-YouTube links (direct video files, other embed
// providers) rather than null.
export function toEmbeddableVideoUrl(url: string): string {
  return toYouTubeEmbed(url) ?? url;
}
