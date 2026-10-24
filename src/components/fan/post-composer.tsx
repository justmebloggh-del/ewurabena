"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { FanAvatar } from "@/components/fan/fan-avatar";
import type { Viewer } from "@/components/fan/post-card";
import { uploadFanMedia } from "@/lib/fan-upload";

export type SongOption = { id: string; title: string; audio_url: string | null };

type Props = {
  viewer: Viewer | null;
  songs: SongOption[];
  onPosted: () => void;
};

export function PostComposer({ viewer, songs, onPosted }: Props) {
  const [caption, setCaption] = useState("");
  const [trackId, setTrackId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file) return setPreview(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!viewer) {
    return (
      <div className="fh-card fh-signin">
        <h2>Join the Ewura Abena family</h2>
        <p>Sign in to share photos and videos, pick your favourite songs, like, comment and follow other fans.</p>
        <div className="fh-row">
          <Link href="/auth/sign-in" className="btn-primary">Sign in</Link>
          <Link href="/auth/sign-up" className="btn-gold">Create account</Link>
        </div>
      </div>
    );
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!viewer) return;
    setError("");
    if (!caption.trim() && !file && !trackId) return setError("Add a caption, a photo or video, or pick a song.");

    setBusy(true);
    try {
      const media = file ? await uploadFanMedia(file, viewer.id) : null;
      const response = await fetch("/api/fan/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caption,
          track_id: trackId || null,
          media_url: media?.url ?? null,
          media_kind: media?.kind ?? null,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Could not publish your post.");

      setCaption("");
      setTrackId("");
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      onPosted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="fh-card fh-composer">
      <div className="fh-composer-top">
        <FanAvatar author={viewer} />
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          maxLength={500}
          rows={2}
          placeholder={`What are you listening to, ${viewer.display_name.split(" ")[0]}?`}
          aria-label="Post caption"
        />
      </div>

      {preview && file && (
        <div className="fh-preview">
          {file.type.startsWith("video/") ? (
            <video src={preview} controls playsInline />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Selected upload preview" />
          )}
          <button type="button" className="fh-link fh-danger" onClick={() => { setFile(null); if (inputRef.current) inputRef.current.value = ""; }}>
            Remove
          </button>
        </div>
      )}

      <div className="fh-composer-bar">
        <label className="fh-file">
          📷 Photo / video
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>

        <select value={trackId} onChange={(e) => setTrackId(e.target.value)} aria-label="Pick an Ewura Abena song">
          <option value="">♪ Add an Ewura Abena song</option>
          {songs.map((song) => (
            <option key={song.id} value={song.id}>{song.title}</option>
          ))}
        </select>

        <button type="submit" className="btn-primary" disabled={busy}>{busy ? "Posting…" : "Post"}</button>
      </div>
      {error && <p className="fh-error" role="alert">{error}</p>}
    </form>
  );
}
