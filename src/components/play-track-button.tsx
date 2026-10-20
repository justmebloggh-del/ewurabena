"use client";

export interface TrackInfo {
  id?: string;
  title: string;
  album?: string;
  audio_url?: string;
  cover_url?: string;
  spotify_url?: string;
  apple_music_url?: string;
  audiomack_url?: string;
}

interface Props {
  track: TrackInfo;
  label?: string;
}

// Shared with PlatformEmbedPlayer: when a catalog platform (Boomplay,
// or Audiomack without a song-specific link) has no way to embed its own
// player, clicking that badge plays this exact track in-site through the
// floating player instead of ever opening a new tab.
export function playTrackInline(track: TrackInfo) {
  window.dispatchEvent(new CustomEvent("ea:play", { detail: track }));
}

export function PlayTrackButton({ track, label }: Props) {
  if (!track.audio_url) return null;

  return (
    <button
      type="button"
      onClick={() => playTrackInline(track)}
      className="platform-badge"
      style={{
        cursor: "pointer",
        background: "rgba(157,23,77,0.1)",
        border: "1px solid var(--gold)",
        color: "var(--gold)",
        fontFamily: "var(--font-body)",
      }}
      aria-label={`Play ${track.title}`}
    >
      ▶ {label ?? "Play"}
    </button>
  );
}
