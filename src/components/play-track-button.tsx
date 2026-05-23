"use client";

interface TrackInfo {
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

export function PlayTrackButton({ track, label }: Props) {
  if (!track.audio_url) return null;

  function play() {
    window.dispatchEvent(new CustomEvent("ea:play", { detail: track }));
  }

  return (
    <button
      type="button"
      onClick={play}
      className="platform-badge"
      style={{
        cursor: "pointer",
        background: "rgba(201,168,76,0.1)",
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
