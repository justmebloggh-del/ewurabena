"use client";

import { useMemo, useState } from "react";

import { SignOutButton } from "@/components/auth-actions";
import { type ContactSubmission, type PublicContent } from "@/lib/types";

type AdminDashboardProps = {
  content: PublicContent;
  contacts: ContactSubmission[];
};

type Status = { kind: "ok" | "error"; text: string } | null;

export function AdminDashboard({ content, contacts }: AdminDashboardProps) {
  const [status, setStatus] = useState<Status>(null);
  const [contactRows, setContactRows] = useState(contacts);

  const albumOptions = useMemo(() => content.albums.map((album) => ({ id: album.id, title: album.title })), [content]);

  async function postJson(url: string, payload: Record<string, unknown>) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      setStatus({ kind: "error", text: data.error || "Request failed." });
      return null;
    }

    setStatus({ kind: "ok", text: "Saved successfully." });
    return data;
  }

  async function updateContactStatus(id: string, nextStatus: ContactSubmission["status"]) {
    const response = await fetch(`/api/admin/contact-submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });

    if (!response.ok) {
      setStatus({ kind: "error", text: "Failed to update contact status." });
      return;
    }

    setContactRows((rows) => rows.map((row) => (row.id === id ? { ...row, status: nextStatus } : row)));
    setStatus({ kind: "ok", text: "Contact status updated." });
  }

  return (
    <div className="space-y-6">
      <section className="card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="section-title">Admin Dashboard</h1>
          <p className="text-sm text-[color:var(--text-muted)]">
            Manage profile, music catalog, portfolio content, links, announcements, and inbox.
          </p>
        </div>
        <SignOutButton />
      </section>

      {status ? (
        <p className={status.kind === "ok" ? "text-sm text-emerald-300" : "text-sm text-rose-300"}>{status.text}</p>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2">
        <form
          className="card space-y-3"
          action={async (formData) => {
            await postJson("/api/admin/profile", {
              stage_name: String(formData.get("stage_name") || ""),
              subtitle: String(formData.get("subtitle") || ""),
              bio: String(formData.get("bio") || ""),
              dovvsu_ambassador_note: String(formData.get("dovvsu_ambassador_note") || ""),
              hero_image_url: String(formData.get("hero_image_url") || ""),
            });
          }}
        >
          <h2 className="text-2xl">Artist Profile</h2>
          <input name="stage_name" className="input" placeholder="Stage name" defaultValue={content.profile.stage_name} required />
          <input name="subtitle" className="input" placeholder="Subtitle" defaultValue={content.profile.subtitle} required />
          <textarea name="bio" className="input" rows={4} placeholder="Biography" defaultValue={content.profile.bio} required />
          <textarea
            name="dovvsu_ambassador_note"
            className="input"
            rows={3}
            placeholder="DOVVSU ambassador note"
            defaultValue={content.profile.dovvsu_ambassador_note}
            required
          />
          <input
            name="hero_image_url"
            className="input"
            placeholder="Hero image URL"
            defaultValue={content.profile.hero_image_url || ""}
          />
          <button type="submit" className="btn-primary">
            Save Profile
          </button>
        </form>

        <form
          className="card space-y-3"
          action={async (formData) => {
            await postJson("/api/admin/albums", {
              title: String(formData.get("title") || ""),
              description: String(formData.get("description") || ""),
              cover_image_url: String(formData.get("cover_image_url") || ""),
              release_date: String(formData.get("release_date") || ""),
              is_published: true,
            });
          }}
        >
          <h2 className="text-2xl">Add Album</h2>
          <input name="title" className="input" placeholder="Album title" required />
          <textarea name="description" className="input" rows={3} placeholder="Description" />
          <input name="cover_image_url" className="input" placeholder="Cover image URL" />
          <input name="release_date" type="date" className="input" />
          <button type="submit" className="btn-primary">
            Create Album
          </button>
        </form>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <form
          className="card space-y-3"
          action={async (formData) => {
            await postJson("/api/admin/tracks", {
              album_id: String(formData.get("album_id") || ""),
              title: String(formData.get("title") || ""),
              track_number: Number(formData.get("track_number") || 0) || undefined,
              duration_seconds: Number(formData.get("duration_seconds") || 0) || undefined,
              audio_url: String(formData.get("audio_url") || ""),
              embed_url: String(formData.get("embed_url") || ""),
              youtube_url: String(formData.get("youtube_url") || ""),
              spotify_url: String(formData.get("spotify_url") || ""),
              apple_music_url: String(formData.get("apple_music_url") || ""),
              audiomack_url: String(formData.get("audiomack_url") || ""),
              is_published: true,
            });
          }}
        >
          <h2 className="text-2xl">Add Track</h2>
          <select name="album_id" className="input" defaultValue="">
            <option value="">No album</option>
            {albumOptions.map((album) => (
              <option key={album.id} value={album.id}>
                {album.title}
              </option>
            ))}
          </select>
          <input name="title" className="input" placeholder="Track title" required />
          <div className="grid gap-3 sm:grid-cols-2">
            <input name="track_number" type="number" min={1} className="input" placeholder="Track #" />
            <input name="duration_seconds" type="number" min={1} className="input" placeholder="Duration (sec)" />
          </div>
          <input name="audio_url" className="input" placeholder="Direct audio URL" />
          <input name="embed_url" className="input" placeholder="Embed URL" />
          <input name="youtube_url" className="input" placeholder="YouTube URL" />
          <input name="spotify_url" className="input" placeholder="Spotify URL" />
          <input name="apple_music_url" className="input" placeholder="Apple Music URL" />
          <input name="audiomack_url" className="input" placeholder="Audiomack URL" />
          <button type="submit" className="btn-primary">
            Create Track
          </button>
        </form>

        <form
          className="card space-y-3"
          action={async (formData) => {
            await postJson("/api/admin/official-playlists", {
              title: String(formData.get("title") || ""),
              description: String(formData.get("description") || ""),
              embed_url: String(formData.get("embed_url") || ""),
              cover_image_url: String(formData.get("cover_image_url") || ""),
              is_published: true,
            });
          }}
        >
          <h2 className="text-2xl">Add Official Playlist</h2>
          <input name="title" className="input" placeholder="Playlist title" required />
          <textarea name="description" className="input" rows={3} placeholder="Description" />
          <input name="embed_url" className="input" placeholder="Embed URL" />
          <input name="cover_image_url" className="input" placeholder="Cover image URL" />
          <button type="submit" className="btn-primary">
            Create Playlist
          </button>
        </form>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <form
          className="card space-y-3"
          action={async (formData) => {
            await postJson("/api/admin/media-items", {
              title: String(formData.get("title") || ""),
              kind: String(formData.get("kind") || "image"),
              url: String(formData.get("url") || ""),
              thumbnail_url: String(formData.get("thumbnail_url") || ""),
              caption: String(formData.get("caption") || ""),
              is_published: true,
            });
          }}
        >
          <h2 className="text-2xl">Add Media Item</h2>
          <input name="title" className="input" placeholder="Title" required />
          <select name="kind" className="input" defaultValue="image">
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
          <input name="url" className="input" placeholder="Media URL" required />
          <input name="thumbnail_url" className="input" placeholder="Thumbnail URL" />
          <textarea name="caption" className="input" rows={3} placeholder="Caption" />
          <button type="submit" className="btn-primary">
            Create Media
          </button>
        </form>

        <form
          className="card space-y-3"
          action={async (formData) => {
            await postJson("/api/admin/awards", {
              title: String(formData.get("title") || ""),
              description: String(formData.get("description") || ""),
              awarded_on: String(formData.get("awarded_on") || ""),
            });
          }}
        >
          <h2 className="text-2xl">Add Award</h2>
          <input name="title" className="input" placeholder="Award title" required />
          <textarea name="description" className="input" rows={3} placeholder="Description" />
          <input name="awarded_on" type="date" className="input" />
          <button type="submit" className="btn-primary">
            Create Award
          </button>
        </form>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <form
          className="card space-y-3"
          action={async (formData) => {
            await postJson("/api/admin/announcements", {
              title: String(formData.get("title") || ""),
              body: String(formData.get("body") || ""),
              is_published: true,
            });
          }}
        >
          <h2 className="text-2xl">Add Announcement</h2>
          <input name="title" className="input" placeholder="Announcement title" required />
          <textarea name="body" className="input" rows={4} placeholder="Body" required />
          <button type="submit" className="btn-primary">
            Publish Announcement
          </button>
        </form>

        <div className="space-y-4">
          <form
            className="card space-y-3"
            action={async (formData) => {
              await postJson("/api/admin/social-links", {
                platform: String(formData.get("platform") || ""),
                url: String(formData.get("url") || ""),
                is_published: true,
              });
            }}
          >
            <h2 className="text-2xl">Add Social Link</h2>
            <input name="platform" className="input" placeholder="Platform" required />
            <input name="url" className="input" placeholder="URL" required />
            <button type="submit" className="btn-primary">
              Save Social Link
            </button>
          </form>

          <form
            className="card space-y-3"
            action={async (formData) => {
              await postJson("/api/admin/donation-links", {
                label: String(formData.get("label") || ""),
                url: String(formData.get("url") || ""),
                is_published: true,
              });
            }}
          >
            <h2 className="text-2xl">Add Donation Link</h2>
            <input name="label" className="input" placeholder="Label" required />
            <input name="url" className="input" placeholder="URL" required />
            <button type="submit" className="btn-primary">
              Save Donation Link
            </button>
          </form>
        </div>
      </section>

      <section className="card space-y-4">
        <h2 className="text-2xl">Contact Inbox</h2>
        <div className="space-y-3">
          {contactRows.length === 0 ? (
            <p className="text-sm text-[color:var(--text-muted)]">No contact requests yet.</p>
          ) : (
            contactRows.map((entry) => (
              <article key={entry.id} className="rounded-xl border border-[color:var(--border-soft)] p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold">{entry.name}</h3>
                    <p className="text-sm text-[color:var(--text-muted)]">{entry.email}</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--gold)]">
                      {entry.organization || "Independent"}
                    </p>
                  </div>
                  <select
                    className="input max-w-40"
                    value={entry.status}
                    onChange={(event) =>
                      updateContactStatus(entry.id, event.target.value as ContactSubmission["status"])
                    }
                  >
                    <option value="new">new</option>
                    <option value="in_review">in_review</option>
                    <option value="resolved">resolved</option>
                  </select>
                </div>
                <p className="mt-3 text-sm text-[color:var(--text-muted)]">{entry.message}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
