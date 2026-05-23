"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface TrackInfo {
  title: string;
  album?: string;
  audio_url?: string;
  cover_url?: string;
  spotify_url?: string;
  apple_music_url?: string;
  audiomack_url?: string;
}

export function FloatingMusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [track, setTrack] = useState<TrackInfo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  // Initialize audio element once
  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    audioRef.current = audio;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    };
    const onEnded = () => setIsPlaying(false);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.pause();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Listen for play events from anywhere on the site
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<TrackInfo>).detail;
      if (!detail?.audio_url) return;
      const audio = audioRef.current;
      if (!audio) return;
      audio.src = detail.audio_url;
      audio.play().catch(() => {});
      setTrack(detail);
    };
    window.addEventListener("ea:play", handler);
    return () => window.removeEventListener("ea:play", handler);
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !track) return;
    if (isPlaying) audio.pause();
    else audio.play().catch(() => {});
  }, [isPlaying, track]);

  const seek = useCallback((pct: number) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    audio.currentTime = (pct / 100) * audio.duration;
  }, []);

  const changeVolume = useCallback((val: number) => {
    setVolume(val);
    setIsMuted(false);
    if (audioRef.current) {
      audioRef.current.volume = val;
      audioRef.current.muted = false;
    }
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = !isMuted;
    audio.muted = next;
    setIsMuted(next);
  }, [isMuted]);

  const close = useCallback(() => {
    audioRef.current?.pause();
    setTrack(null);
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  }, []);

  const fmt = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  if (!track) return null;

  return (
    <div className={`floating-player${track ? " is-visible" : ""}`} role="region" aria-label="Music player">
      {/* Progress bar — full width at top */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "rgba(255,255,255,0.06)" }}>
        <div style={{ height: "100%", width: `${progress}%`, background: "var(--gold)", transition: "width 0.25s linear" }} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto auto",
          alignItems: "center",
          gap: "1rem",
          maxWidth: "1100px",
          margin: "0 auto",
          paddingTop: "0.3rem",
        }}
        className="player-layout"
      >
        {/* Track info */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
          {track.cover_url && (
            <img
              src={track.cover_url}
              alt={track.title}
              style={{ width: "40px", height: "40px", borderRadius: "0.4rem", objectFit: "cover", flexShrink: 0 }}
            />
          )}
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: "0.82rem", fontWeight: 600, color: "var(--ivory)", fontFamily: "var(--font-body)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {track.title}
            </p>
            {track.album && (
              <p style={{ margin: 0, fontSize: "0.68rem", color: "var(--text-muted)", fontFamily: "var(--font-body)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {track.album}
              </p>
            )}
          </div>
        </div>

        {/* Controls + seek */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.35rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {/* Rewind 10s */}
            <button
              className="player-ctrl-btn"
              onClick={() => { if (audioRef.current) audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10); }}
              aria-label="Rewind 10 seconds"
              type="button"
            >
              ⏮
            </button>

            {/* Play / Pause */}
            <button
              className="player-ctrl-btn play-btn"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
              type="button"
            >
              {isPlaying ? "⏸" : "▶"}
            </button>

            {/* Forward 10s */}
            <button
              className="player-ctrl-btn"
              onClick={() => { if (audioRef.current) audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10); }}
              aria-label="Forward 10 seconds"
              type="button"
            >
              ⏭
            </button>
          </div>

          {/* Seek row */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%", minWidth: "180px", maxWidth: "340px" }}>
            <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", fontFamily: "var(--font-body)", whiteSpace: "nowrap" }}>{fmt(currentTime)}</span>
            <input
              className="player-range"
              type="range"
              min={0}
              max={100}
              step={0.1}
              value={progress}
              onChange={(e) => seek(Number(e.target.value))}
              aria-label="Seek"
              style={{ flex: 1 }}
            />
            <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", fontFamily: "var(--font-body)", whiteSpace: "nowrap" }}>{fmt(duration)}</span>
          </div>
        </div>

        {/* Volume + platform links + close */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexShrink: 0 }}>
          {/* Mute toggle */}
          <button
            className="player-ctrl-btn"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
            type="button"
            style={{ fontSize: "0.85rem" }}
          >
            {isMuted ? "🔇" : volume > 0.5 ? "🔊" : "🔉"}
          </button>

          {/* Volume slider — hide on small screens via CSS */}
          <input
            className="player-range player-vol"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(e) => changeVolume(Number(e.target.value))}
            aria-label="Volume"
            style={{ width: "72px" }}
          />

          {/* Platform quick-links */}
          {track.spotify_url && (
            <a href={track.spotify_url} target="_blank" rel="noreferrer" title="Open on Spotify"
              style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontFamily: "var(--font-body)", textDecoration: "none", padding: "0.2rem 0.5rem", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "9999px" }}>
              ♫ Spotify
            </a>
          )}
          {track.apple_music_url && (
            <a href={track.apple_music_url} target="_blank" rel="noreferrer" title="Open on Apple Music"
              style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontFamily: "var(--font-body)", textDecoration: "none", padding: "0.2rem 0.5rem", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "9999px" }}>
              ♪ Apple
            </a>
          )}

          {/* Close */}
          <button
            className="player-ctrl-btn"
            onClick={close}
            aria-label="Close player"
            type="button"
            style={{ fontSize: "0.9rem", marginLeft: "0.25rem" }}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
