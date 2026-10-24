"use client";

import { useState } from "react";

import { playTrackInline } from "@/components/play-track-button";

type Song = { id: string; title: string; audio_url: string | null };

export function FavoriteTrackList({ tracks, allTracks }: { tracks: Song[]; allTracks: Song[] }) {
  const [favorites, setFavorites] = useState(tracks);
  const [pick, setPick] = useState("");
  const [error, setError] = useState("");

  async function add() {
    const song = allTracks.find((t) => t.id === pick);
    if (!song) return;
    setError("");
    const response = await fetch("/api/fan/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ track_id: song.id }),
    });
    if (!response.ok) return setError("Could not save that song.");
    setFavorites((list) => (list.some((s) => s.id === song.id) ? list : [song, ...list]));
    setPick("");
  }

  async function remove(id: string) {
    const response = await fetch("/api/fan/favorites", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ track_id: id }),
    });
    if (response.ok) setFavorites((list) => list.filter((s) => s.id !== id));
    else setError("Could not remove that song.");
  }

  const available = allTracks.filter((t) => !favorites.some((f) => f.id === t.id));

  return (
    <div className="fh-stack-sm">
      <div className="fh-row">
        <select value={pick} onChange={(e) => setPick(e.target.value)} aria-label="Choose a song to save">
          <option value="">Choose a song to save…</option>
          {available.map((t) => (
            <option key={t.id} value={t.id}>{t.title}</option>
          ))}
        </select>
        <button type="button" className="btn-primary" onClick={add} disabled={!pick}>♥ Save</button>
      </div>
      {error && <p className="fh-error" role="alert">{error}</p>}

      {favorites.length === 0 ? (
        <p className="fh-muted">No favourites yet. Save songs you love and they&apos;ll live here.</p>
      ) : (
        <ul className="fh-tracklist">
          {favorites.map((song) => (
            <li key={song.id}>
              <span>♪ {song.title}</span>
              <span className="fh-row">
                {song.audio_url && (
                  <button type="button" className="fh-link" onClick={() => playTrackInline({ id: song.id, title: song.title, audio_url: song.audio_url ?? undefined })}>
                    ▶ Play
                  </button>
                )}
                <button type="button" className="fh-link fh-danger" onClick={() => remove(song.id)}>Remove</button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
