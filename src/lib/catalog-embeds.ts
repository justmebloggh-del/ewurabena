// Streaming-catalog URL → embeddable iframe src converters, shared between
// the platform badge/modal picker and the Music page's inline player
// fallback (so a track with no uploaded audio file still plays something
// automatically instead of just showing link-out badges).

export function toSpotifyEmbed(url: string): string {
  const clean = url.split("?")[0];
  return clean.replace("open.spotify.com/", "open.spotify.com/embed/");
}

export function toAppleMusicEmbed(url: string): string {
  return url.replace("music.apple.com/", "embed.music.apple.com/");
}

/**
 * Returns an Audiomack embed URL only when the path identifies a specific
 * song, album, or playlist (≥2 path segments after the hostname).
 * Artist-profile-only URLs (e.g. audiomack.com/ewuraabenamusiq) cannot be
 * embedded — Audiomack has no artist-level embed/widget (confirmed: no
 * official embed docs exist at all; the unofficial /embed/<...> path only
 * ever resolves to a real player for a specific song/album/playlist).
 */
export function toAudiomackEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    const segments = u.pathname.replace(/^\/|\/$/g, "").split("/").filter(Boolean);
    if (segments.length < 2) return null;
    return `https://audiomack.com/embed/${segments.join("/")}`;
  } catch {
    /* ignore */
  }
  return null;
}

// Facebook's documented video plugin: wraps any public video permalink in
// their own iframe player, no app review or access token required.
export function toFacebookVideoEmbed(url: string): string {
  return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`;
}

export type CatalogSource = {
  spotify_url?: string | null;
  apple_music_url?: string | null;
  audiomack_url?: string | null;
};

export type EmbeddableCatalog = {
  label: "Spotify" | "Apple Music" | "Audiomack";
  embedUrl: string;
  height: number;
};

// Boomplay is intentionally excluded here — confirmed it has no embed
// capability whatsoever (official or unofficial), so it can only ever be
// an external link, never an automatic inline player.
export function firstEmbeddableCatalog(track: CatalogSource): EmbeddableCatalog | null {
  if (track.spotify_url) {
    return { label: "Spotify", embedUrl: toSpotifyEmbed(track.spotify_url), height: 380 };
  }
  if (track.apple_music_url) {
    return { label: "Apple Music", embedUrl: toAppleMusicEmbed(track.apple_music_url), height: 450 };
  }
  if (track.audiomack_url) {
    const embedUrl = toAudiomackEmbed(track.audiomack_url);
    if (embedUrl) return { label: "Audiomack", embedUrl, height: 165 };
  }
  return null;
}
