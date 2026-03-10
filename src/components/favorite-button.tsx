"use client";

import { useState } from "react";

type FavoriteButtonProps =
  | {
      trackId: string;
      albumId?: never;
    }
  | {
      albumId: string;
      trackId?: never;
    };

export function FavoriteButton(props: FavoriteButtonProps) {
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "removed" | "error">("idle");

  async function saveFavorite() {
    setSaving(true);
    setStatus("idle");
    const response = await fetch("/api/fan/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ track_id: props.trackId, album_id: props.albumId }),
    });

    setSaving(false);
    setStatus(response.ok ? "saved" : "error");
  }

  async function removeFavorite() {
    setSaving(true);
    setStatus("idle");
    const response = await fetch("/api/fan/favorites", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ track_id: props.trackId, album_id: props.albumId }),
    });

    setSaving(false);
    setStatus(response.ok ? "removed" : "error");
  }

  return (
    <div className="flex gap-2">
      <button onClick={saveFavorite} disabled={saving} className="btn-secondary text-xs" type="button">
        Save
      </button>
      <button onClick={removeFavorite} disabled={saving} className="btn-secondary text-xs" type="button">
        Remove
      </button>
      <span className="text-xs text-[color:var(--text-muted)]">
        {status === "saved" ? "Saved" : status === "removed" ? "Removed" : status === "error" ? "Error" : ""}
      </span>
    </div>
  );
}
