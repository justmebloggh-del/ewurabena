"use client";

import { useEffect, useMemo, useState } from "react";

type TrackOption = {
  id: string;
  title: string;
  audiomack_url?: string | null;
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
  const [playlistTracks, setPlaylistTracks] = useState<TrackOption[]>([]);
  const [playingTrack, setPlayingTrack] = useState<TrackOption | null>(null);
  const [message, setMessage] = useState("");

  const sortedTracks = useMemo(() => [...tracks].sort((a, b) => a.title.localeCompare(b.title)), [tracks]);

  // Fetch playlist tracks when playlist changes
  useEffect(() => {
    async function fetchPlaylistTracks() {
      if (!selectedPlaylist) {
        setPlaylistTracks([]);
        return;
      }

      const response = await fetch(`/api/fan/playlists/${selectedPlaylist}/tracks`);
      if (!response.ok) {
        setPlaylistTracks([]);
        return;
      }

      const data = await response.json().catch(() => null);
      if (!data?.trackIds) {
        setPlaylistTracks([]);
        return;
      }

      // Match track IDs with available tracks to get full track data
      const matchedTracks = data.trackIds
        .map((pt: { track_id: string }) => tracks.find((t) => t.id === pt.track_id))
        .filter(Boolean) as TrackOption[];
      
      setPlaylistTracks(matchedTracks);
    }

    fetchPlaylistTracks();
  }, [selectedPlaylist, tracks]);

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
      body: JSON.stringify({ track_id: selectedTrack, position: playlistTracks.length + 1 }),
    });

    if (response.ok) {
      // Refresh playlist tracks
      const trackToAdd = tracks.find((t) => t.id === selectedTrack);
      if (trackToAdd) {
        setPlaylistTracks([...playlistTracks, trackToAdd]);
      }
      setMessage("Track added to playlist.");
    } else {
      setMessage("Could not add track.");
    }
  }

  function handlePlay(track: TrackOption) {
    if (playingTrack?.id === track.id) {
      setPlayingTrack(null);
    } else {
      setPlayingTrack(track);
    }
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

      {/* Playlist Tracks with Play Buttons */}
      {playlistTracks.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-[color:var(--text-main)]">Playlist Tracks</h4>
          <ul className="space-y-2">
            {playlistTracks.map((track) => (
              <li
                key={track.id}
                className="flex items-center justify-between rounded-lg border border-[color:var(--border-soft)] bg-[color:var(--bg-soft)] p-3"
              >
                <span className="text-sm font-medium text-[color:var(--text-main)]">{track.title}</span>
                {track.audiomack_url ? (
                  <button
                    type="button"
                    onClick={() => handlePlay(track)}
                    className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                      playingTrack?.id === track.id
                        ? "bg-[color:var(--gold)] text-black"
                        : "bg-[color:var(--gold)]/20 text-[color:var:bg-[color:var(--gold)] hover(--gold)]/30"
                    }`}
                  >
                    {playingTrack?.id === track.id ? "Pause" : "Play"}
                  </button>
                ) : (
                  <span className="text-xs text-[color:var(--text-muted)]">No link</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Audio Player / Audiomack Embed */}
      {playingTrack && playingTrack.audiomack_url && (
        <div className="mt-4 rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--bg-soft)] p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-medium text-[color:var(--text-main)]">Now Playing: {playingTrack.title}</span>
            <button
              type="button"
              onClick={() => setPlayingTrack(null)}
              className="text-sm text-[color:var(--text-muted)] hover:text-[color:var(--text-main)]"
            >
              Close
            </button>
          </div>
          <iframe
            src={`https://audiomack.com/embedsong/${playingTrack.audiomack_url.replace('https://audiomack.com/', '')}?color=%23ffb400&background=%23222222&footer=no&sm=0`}
            width="100%"
            height="150"
            allow="autoplay"
            className="rounded-lg"
            title={`Play ${playingTrack.title} on Audiomack`}
          />
          <p className="mt-2 text-xs text-[color:var(--text-muted)]">
            Powered by{' '}
            <a
              href={playingTrack.audiomack_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[color:var(--gold)] hover:underline"
            >
              Audiomack
            </a>
          </p>
        </div>
      )}

      {message ? <p className="text-sm text-[color:var(--text-muted)]">{message}</p> : null}
    </section>
  );
}
