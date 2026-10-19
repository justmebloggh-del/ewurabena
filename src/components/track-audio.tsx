"use client";

import { recordTrackPlay } from "@/lib/record-play";

type TrackAudioProps = {
  trackId?: string;
  src?: string | null;
  style?: React.CSSProperties;
};

// Thin client wrapper so the (server-component) pages that render a raw
// native <audio> element can still record play counts — a plain onPlay
// handler can't be attached to a DOM element from a Server Component.
export function TrackAudio({ trackId, src, style }: TrackAudioProps) {
  if (!src) return null;

  return (
    <audio
      controls
      src={src}
      style={style}
      preload="none"
      onPlay={() => recordTrackPlay(trackId)}
    />
  );
}

export function TrackVideo({ trackId, src, style }: TrackAudioProps) {
  if (!src) return null;

  return (
    <video
      controls
      src={src}
      style={{ width: "100%", borderRadius: "0.75rem", display: "block", ...style }}
      preload="none"
      onPlay={() => recordTrackPlay(trackId)}
    />
  );
}
