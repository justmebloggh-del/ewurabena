import type { PublicContent, Track } from "@/lib/types";

export type TVVideo = {
  id: string;
  title: string;
  url: string;
  caption?: string | null;
  thumbnail_url?: string | null;
};

function trackVideoUrl(track: Track): string | null {
  return track.embed_url || track.youtube_url || null;
}

// Every YouTube video on the site — gallery videos and tracks' music-video
// links alike — feeds this one list, so "Ewura Abena TV" is the single
// place YouTube content plays, instead of being embedded piecemeal across
// the Home, Music, and Portfolio pages.
export function buildTVChannel(content: PublicContent): TVVideo[] {
  const fromMedia: TVVideo[] = content.mediaItems
    .filter((item) => item.kind === "video")
    .map((item) => ({
      id: item.id,
      title: item.title,
      url: item.url,
      caption: item.caption,
      thumbnail_url: item.thumbnail_url,
    }));

  const fromTracks: TVVideo[] = content.tracks
    .filter((track) => trackVideoUrl(track))
    .map((track) => ({
      id: `track-${track.id}`,
      title: track.title,
      url: trackVideoUrl(track) as string,
      caption: null,
      thumbnail_url: null,
    }));

  return [...fromMedia, ...fromTracks];
}

export function trackHasTvVideo(track: Track): boolean {
  return Boolean(trackVideoUrl(track));
}

export function tvLinkFor(id: string): string {
  return `/?tv=${encodeURIComponent(id)}#ewura-abena-tv`;
}
