// Fire-and-forget: a play is a nice-to-have analytics signal, never worth
// blocking playback or surfacing an error over.
export function recordTrackPlay(trackId?: string | null) {
  if (!trackId) return;
  fetch("/api/public/track-play", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ track_id: trackId }),
  }).catch(() => {});
}
