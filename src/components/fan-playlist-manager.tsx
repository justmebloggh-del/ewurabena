"use client";

import { useMemo, useState } from "react";

type TrackOption = {
  id: string;
  title: string;
};

type PlaylistOption = {
  id: string;
  title: string;
};

type FanPlaylistManagerProps = {
  playlists: PlaylistOption[];
  tracks: TrackOption[];
};

export function FanPlaylistManager({ playlists: initialPlaylists, tracks }: FanPlaylistManagerProps) {
  const [playlists, setPlaylists] = useState<PlaylistOption[]>(initialPlaylists);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>(initialPlaylists[0]?.id || "");
  const [selectedTrack, setSelectedTrack] = useState<string>(tracks[0]?.id || "");
  const [message, setMessage] = useState("");

  const sortedTracks = useMemo(() => [...tracks].sort((a, b) => a.title.localeCompare(b.title)), [tracks]);

  async function createPlaylist(formData: FormData) {
    setMessage("");

    const response = await fetch("/api/fan/playlists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: String(formData.get("title") || ""),
        description: String(formData.get("description") || ""),
        is_private: true,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.playlist) {
      setMessage("Unable to create playlist.");
      return;
    }

    const nextPlaylists = [data.playlist as PlaylistOption, ...playlists];
    setPlaylists(nextPlaylists);
    setSelectedPlaylist(data.playlist.id);
    setMessage("Playlist created.");
  }

  async function addTrackToPlaylist() {
    setMessage("");

    if (!selectedPlaylist || !selectedTrack) {
      setMessage("Select a playlist and track first.");
      return;
    }

    const response = await fetch(`/api/fan/playlists/${selectedPlaylist}/tracks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ track_id: selectedTrack, position: 1 }),
    });

    setMessage(response.ok ? "Track added to playlist." : "Could not add track.");
  }

  return (
    <section className="space-y-4 rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--bg-card)] p-5">
      <h3 className="text-xl font-semibold text-[color:var(--text-main)]">Your Custom Playlists</h3>

      <form action={createPlaylist} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
        <input className="input" name="title" placeholder="Playlist title" required />
        <input className="input" name="description" placeholder="Short description" />
        <button className="btn-primary" type="submit">
          Create Playlist
        </button>
      </form>

      <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
        <select className="input" value={selectedPlaylist} onChange={(event) => setSelectedPlaylist(event.target.value)}>
          {playlists.length === 0 ? <option value="">No playlists yet</option> : null}
          {playlists.map((playlist) => (
            <option key={playlist.id} value={playlist.id}>
              {playlist.title}
            </option>
          ))}
        </select>

        <select className="input" value={selectedTrack} onChange={(event) => setSelectedTrack(event.target.value)}>
          {sortedTracks.map((track) => (
            <option key={track.id} value={track.id}>
              {track.title}
            </option>
          ))}
        </select>

        <button className="btn-secondary" onClick={addTrackToPlaylist} type="button">
          Add Track
        </button>
      </div>

      {message ? <p className="text-sm text-[color:var(--text-muted)]">{message}</p> : null}
    </section>
  );
}
