"use client";

import { useMemo, useState } from "react";

import { SignOutButton } from "@/components/auth-actions";
import { FileUploadField } from "@/components/admin/file-upload-field";
import { ManageList } from "@/components/admin/manage-list";
import {
  type Album,
  type Announcement,
  type Award,
  type ContactSubmission,
  type DonationLink,
  type FanSummary,
  type MediaItem,
  type OfficialPlaylist,
  type PublicContent,
  type SocialLink,
  type Track,
} from "@/lib/types";

type AdminDashboardProps = {
  content: PublicContent;
  contacts: ContactSubmission[];
  fans: FanSummary[];
};

type Status = { kind: "ok" | "error"; text: string } | null;

const TABS = ["Overview", "Music & Media", "Fan Hub", "Site Content"] as const;
type Tab = (typeof TABS)[number];

function platformSummary(track: Track) {
  const platforms = [
    track.video_url && "Uploaded video",
    track.audio_url && "Direct audio",
    track.spotify_url && "Spotify",
    track.youtube_url && "YouTube",
    track.facebook_url && "Facebook",
    track.apple_music_url && "Apple Music",
    track.audiomack_url && "Audiomack",
    track.boomplay_url && "Boomplay",
  ].filter(Boolean);
  return platforms.length > 0 ? platforms.join(", ") : "No platform links yet";
}

export function AdminDashboard({ content, contacts, fans }: AdminDashboardProps) {
  const [tab, setTab] = useState<Tab>("Overview");
  const [status, setStatus] = useState<Status>(null);
  const [contactRows, setContactRows] = useState(contacts);
  const [albumRows, setAlbumRows] = useState<Album[]>(content.albums);
  const [trackRows, setTrackRows] = useState<Track[]>(content.tracks);
  const [mediaRows, setMediaRows] = useState<MediaItem[]>(content.mediaItems);
  const [playlistRows, setPlaylistRows] = useState<OfficialPlaylist[]>(content.officialPlaylists);
  const [awardRows, setAwardRows] = useState<Award[]>(content.awards);
  const [announcementRows, setAnnouncementRows] = useState<Announcement[]>(content.announcements);
  const [socialRows, setSocialRows] = useState<SocialLink[]>(content.socialLinks);
  const [donationRows, setDonationRows] = useState<DonationLink[]>(content.donationLinks);
  const [notifyTarget, setNotifyTarget] = useState("all");

  const albumOptions = useMemo(() => albumRows.map((album) => ({ id: album.id, title: album.title })), [albumRows]);

  const topTracks = useMemo(
    () => [...trackRows].sort((a, b) => (b.play_count ?? 0) - (a.play_count ?? 0)).slice(0, 5),
    [trackRows],
  );

  const pendingContacts = contactRows.filter((c) => c.status === "new").length;

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
          <p className="text-sm text-[color:var(--text-dark-muted)]">
            Manage profile, music, video, gallery, fans, and site content.
          </p>
        </div>
        <SignOutButton />
      </section>

      <nav className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={tab === t ? "btn-primary" : "btn-secondary"}
          >
            {t}
          </button>
        ))}
      </nav>

      {status ? (
        <p className={status.kind === "ok" ? "text-sm text-emerald-600" : "text-sm text-rose-600"}>{status.text}</p>
      ) : null}

      {tab === "Overview" && (
        <div className="space-y-6">
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <article className="card">
              <p className="text-xs uppercase tracking-wide text-[color:var(--text-dark-muted)]">Registered Fans</p>
              <p className="mt-2 text-4xl font-semibold text-[color:var(--royal-gold)]">{fans.length}</p>
            </article>
            <article className="card">
              <p className="text-xs uppercase tracking-wide text-[color:var(--text-dark-muted)]">New Messages</p>
              <p className="mt-2 text-4xl font-semibold text-[color:var(--royal-gold)]">{pendingContacts}</p>
            </article>
            <article className="card">
              <p className="text-xs uppercase tracking-wide text-[color:var(--text-dark-muted)]">Tracks</p>
              <p className="mt-2 text-4xl font-semibold text-[color:var(--royal-gold)]">{trackRows.length}</p>
            </article>
            <article className="card">
              <p className="text-xs uppercase tracking-wide text-[color:var(--text-dark-muted)]">Albums</p>
              <p className="mt-2 text-4xl font-semibold text-[color:var(--royal-gold)]">{albumRows.length}</p>
            </article>
          </section>

          <section className="card space-y-3">
            <h2 className="text-2xl">Most Played Tracks</h2>
            {topTracks.length === 0 || topTracks.every((t) => !t.play_count) ? (
              <p className="text-sm text-[color:var(--text-dark-muted)]">No plays recorded yet.</p>
            ) : (
              <ol className="space-y-2">
                {topTracks.map((track, i) => (
                  <li key={track.id} className="flex items-center justify-between rounded-xl border border-[color:var(--border-soft)] p-3">
                    <span className="font-medium text-[color:var(--text-dark)]">
                      {i + 1}. {track.title}
                    </span>
                    <span className="text-sm text-[color:var(--text-dark-muted)]">{track.play_count ?? 0} plays</span>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
      )}

      {tab === "Music & Media" && (
        <div className="space-y-6">
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
              <FileUploadField
                name="hero_image_url"
                placeholder="Hero image URL"
                accept="image/*"
                defaultValue={content.profile.hero_image_url || ""}
              />
              <button type="submit" className="btn-primary">
                Save Profile
              </button>
            </form>

            <form
              className="card space-y-3"
              action={async (formData) => {
                const result = await postJson("/api/admin/albums", {
                  title: String(formData.get("title") || ""),
                  description: String(formData.get("description") || ""),
                  cover_image_url: String(formData.get("cover_image_url") || ""),
                  release_date: String(formData.get("release_date") || ""),
                  is_published: true,
                });
                if (result?.album) {
                  setAlbumRows((rows) => [result.album, ...rows]);
                }
              }}
            >
              <h2 className="text-2xl">Add Album</h2>
              <input name="title" className="input" placeholder="Album title" required />
              <textarea name="description" className="input" rows={3} placeholder="Description" />
              <FileUploadField name="cover_image_url" placeholder="Cover image URL" accept="image/*" />
              <input name="release_date" type="date" className="input" />
              <button type="submit" className="btn-primary">
                Create Album
              </button>
            </form>
          </section>

          <ManageList
            title="Manage Albums"
            items={albumRows}
            endpoint="/api/admin/albums"
            responseKey="album"
            fields={[
              { name: "title", label: "Title", type: "text" },
              { name: "description", label: "Description", type: "textarea" },
              { name: "cover_image_url", label: "Cover image", type: "file", accept: "image/*" },
              { name: "release_date", label: "Release date", type: "date" },
            ]}
            renderSummary={(album) => ({
              primary: album.title,
              secondary: [album.is_published ? "Published" : "Draft", album.release_date].filter(Boolean).join(" · "),
            })}
            onItemsChange={setAlbumRows}
            onStatus={setStatus}
          />

          <section className="grid gap-4 md:grid-cols-2">
            <form
              className="card space-y-3"
              action={async (formData) => {
                const result = await postJson("/api/admin/tracks", {
                  album_id: String(formData.get("album_id") || ""),
                  title: String(formData.get("title") || ""),
                  track_number: Number(formData.get("track_number") || 0) || undefined,
                  duration_seconds: Number(formData.get("duration_seconds") || 0) || undefined,
                  audio_url: String(formData.get("audio_url") || ""),
                  video_url: String(formData.get("video_url") || ""),
                  embed_url: String(formData.get("embed_url") || ""),
                  youtube_url: String(formData.get("youtube_url") || ""),
                  facebook_url: String(formData.get("facebook_url") || ""),
                  spotify_url: String(formData.get("spotify_url") || ""),
                  apple_music_url: String(formData.get("apple_music_url") || ""),
                  audiomack_url: String(formData.get("audiomack_url") || ""),
                  boomplay_url: String(formData.get("boomplay_url") || ""),
                  is_published: true,
                });
                if (result?.track) {
                  setTrackRows((rows) => [result.track, ...rows]);
                }
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
              <FileUploadField name="audio_url" placeholder="Upload or paste direct audio URL" accept="audio/*" />
              <FileUploadField name="video_url" placeholder="Upload or paste a music video file URL" accept="video/*" />
              <input name="embed_url" className="input" placeholder="Embed URL (e.g. YouTube iframe src)" />
              <input name="youtube_url" className="input" placeholder="YouTube URL" />
              <input name="facebook_url" className="input" placeholder="Facebook video URL" />
              <input name="spotify_url" className="input" placeholder="Spotify URL" />
              <input name="apple_music_url" className="input" placeholder="Apple Music URL" />
              <input name="audiomack_url" className="input" placeholder="Audiomack URL" />
              <input name="boomplay_url" className="input" placeholder="Boomplay URL" />
              <button type="submit" className="btn-primary">
                Create Track
              </button>
            </form>

            <form
              className="card space-y-3"
              action={async (formData) => {
                const result = await postJson("/api/admin/official-playlists", {
                  title: String(formData.get("title") || ""),
                  description: String(formData.get("description") || ""),
                  embed_url: String(formData.get("embed_url") || ""),
                  cover_image_url: String(formData.get("cover_image_url") || ""),
                  is_published: true,
                });
                if (result?.officialPlaylist) {
                  setPlaylistRows((rows) => [result.officialPlaylist, ...rows]);
                }
              }}
            >
              <h2 className="text-2xl">Add Official Playlist</h2>
              <input name="title" className="input" placeholder="Playlist title" required />
              <textarea name="description" className="input" rows={3} placeholder="Description" />
              <input name="embed_url" className="input" placeholder="Embed URL" />
              <FileUploadField name="cover_image_url" placeholder="Cover image URL" accept="image/*" />
              <button type="submit" className="btn-primary">
                Create Playlist
              </button>
            </form>
          </section>

          <ManageList
            title="Manage Tracks (Audio & Video)"
            items={trackRows}
            endpoint="/api/admin/tracks"
            responseKey="track"
            fields={[
              {
                name: "album_id",
                label: "Album",
                type: "select",
                options: [{ value: "", label: "No album" }, ...albumOptions.map((a) => ({ value: a.id, label: a.title }))],
              },
              { name: "title", label: "Title", type: "text" },
              { name: "track_number", label: "Track #", type: "number" },
              { name: "duration_seconds", label: "Duration (sec)", type: "number" },
              { name: "audio_url", label: "Audio file", type: "file", accept: "audio/*" },
              { name: "video_url", label: "Video file", type: "file", accept: "video/*" },
              { name: "embed_url", label: "Embed URL", type: "text" },
              { name: "youtube_url", label: "YouTube URL", type: "text" },
              { name: "facebook_url", label: "Facebook video URL", type: "text" },
              { name: "spotify_url", label: "Spotify URL", type: "text" },
              { name: "apple_music_url", label: "Apple Music URL", type: "text" },
              { name: "audiomack_url", label: "Audiomack URL", type: "text" },
              { name: "boomplay_url", label: "Boomplay URL", type: "text" },
            ]}
            renderSummary={(track) => ({
              primary: `${track.title} (${track.play_count ?? 0} plays)`,
              secondary: `${track.is_published ? "Published" : "Draft"} · ${platformSummary(track)}`,
            })}
            onItemsChange={setTrackRows}
            onStatus={setStatus}
          />

          <ManageList
            title="Manage Official Playlists"
            items={playlistRows}
            endpoint="/api/admin/official-playlists"
            responseKey="officialPlaylist"
            fields={[
              { name: "title", label: "Title", type: "text" },
              { name: "description", label: "Description", type: "textarea" },
              { name: "embed_url", label: "Embed URL", type: "text" },
              { name: "cover_image_url", label: "Cover image", type: "file", accept: "image/*" },
            ]}
            renderSummary={(playlist) => ({
              primary: playlist.title,
              secondary: playlist.is_published ? "Published" : "Draft",
            })}
            onItemsChange={setPlaylistRows}
            onStatus={setStatus}
          />

          <section className="card space-y-3">
            <form
              action={async (formData) => {
                const result = await postJson("/api/admin/media-items", {
                  title: String(formData.get("title") || ""),
                  kind: String(formData.get("kind") || "image"),
                  url: String(formData.get("url") || ""),
                  thumbnail_url: String(formData.get("thumbnail_url") || ""),
                  caption: String(formData.get("caption") || ""),
                  facebook_url: String(formData.get("facebook_url") || ""),
                  is_published: true,
                });
                if (result?.mediaItem) {
                  setMediaRows((rows) => [result.mediaItem, ...rows]);
                }
              }}
              className="space-y-3"
            >
              <h2 className="text-2xl">Add Gallery Image / Video</h2>
              <input name="title" className="input" placeholder="Title" required />
              <select name="kind" className="input" defaultValue="image">
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
              <FileUploadField name="url" placeholder="Upload or paste a media URL (image or video file)" accept="image/*,video/*" />
              <input name="thumbnail_url" className="input" placeholder="Thumbnail URL (optional, for videos)" />
              <input name="facebook_url" className="input" placeholder="Facebook video URL (optional, shown instead of the uploaded file)" />
              <textarea name="caption" className="input" rows={3} placeholder="Caption" />
              <button type="submit" className="btn-primary">
                Add to Gallery
              </button>
            </form>
          </section>

          <ManageList
            title="Manage Gallery (Images & Videos)"
            items={mediaRows}
            endpoint="/api/admin/media-items"
            responseKey="mediaItem"
            fields={[
              { name: "title", label: "Title", type: "text" },
              {
                name: "kind",
                label: "Kind",
                type: "select",
                options: [
                  { value: "image", label: "Image" },
                  { value: "video", label: "Video" },
                ],
              },
              { name: "url", label: "Media file", type: "file", accept: "image/*,video/*" },
              { name: "thumbnail_url", label: "Thumbnail URL", type: "text" },
              { name: "facebook_url", label: "Facebook video URL", type: "text" },
              { name: "caption", label: "Caption", type: "textarea" },
            ]}
            renderSummary={(item) => ({
              primary: item.title,
              secondary: `${item.kind} · ${item.is_published ? "Published" : "Draft"}`,
            })}
            onItemsChange={setMediaRows}
            onStatus={setStatus}
          />
        </div>
      )}

      {tab === "Fan Hub" && (
        <div className="space-y-6">
          <section className="card space-y-4">
            <h2 className="text-2xl">Registered Fans</h2>
            {fans.length === 0 ? (
              <p className="text-sm text-[color:var(--text-dark-muted)]">No fans have signed up yet.</p>
            ) : (
              <div className="space-y-2">
                {fans.map((fan) => (
                  <div
                    key={fan.id}
                    className="flex flex-col gap-1 rounded-xl border border-[color:var(--border-soft)] p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-[color:var(--text-dark)]">{fan.full_name || "Unnamed fan"}</p>
                      <p className="text-sm text-[color:var(--text-dark-muted)]">{fan.email}</p>
                    </div>
                    <p className="text-xs text-[color:var(--text-dark-muted)]">
                      Joined {new Date(fan.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <form
            className="card space-y-3"
            action={async (formData) => {
              const result = await postJson("/api/admin/notifications", {
                title: String(formData.get("title") || ""),
                body: String(formData.get("body") || ""),
                target: String(formData.get("target") || "all"),
              });
              if (result?.ok) {
                setStatus({ kind: "ok", text: `Notification sent to ${result.sent} fan(s).` });
              }
            }}
          >
            <h2 className="text-2xl">Send Notification</h2>
            <select
              name="target"
              className="input"
              value={notifyTarget}
              onChange={(event) => setNotifyTarget(event.target.value)}
            >
              <option value="all">All fans</option>
              {fans.map((fan) => (
                <option key={fan.id} value={fan.id}>
                  {fan.full_name || fan.email}
                </option>
              ))}
            </select>
            <input name="title" className="input" placeholder="Notification title" required />
            <textarea name="body" className="input" rows={3} placeholder="Message" required />
            <button type="submit" className="btn-primary">
              Send
            </button>
          </form>

          <section className="card space-y-4">
            <h2 className="text-2xl">Contact Inbox</h2>
            <div className="space-y-3">
              {contactRows.length === 0 ? (
                <p className="text-sm text-[color:var(--text-dark-muted)]">No contact requests yet.</p>
              ) : (
                contactRows.map((entry) => (
                  <article key={entry.id} className="rounded-xl border border-[color:var(--border-soft)] p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="font-semibold">{entry.name}</h3>
                        <p className="text-sm text-[color:var(--text-dark-muted)]">{entry.email}</p>
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
                    <p className="mt-3 text-sm text-[color:var(--text-dark-muted)]">{entry.message}</p>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      )}

      {tab === "Site Content" && (
        <div className="space-y-6">
          <section className="grid gap-4 md:grid-cols-2">
            <form
              className="card space-y-3"
              action={async (formData) => {
                const result = await postJson("/api/admin/awards", {
                  title: String(formData.get("title") || ""),
                  description: String(formData.get("description") || ""),
                  awarded_on: String(formData.get("awarded_on") || ""),
                });
                if (result?.award) {
                  setAwardRows((rows) => [result.award, ...rows]);
                }
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

            <form
              className="card space-y-3"
              action={async (formData) => {
                const result = await postJson("/api/admin/announcements", {
                  title: String(formData.get("title") || ""),
                  body: String(formData.get("body") || ""),
                  is_published: true,
                });
                if (result?.announcement) {
                  setAnnouncementRows((rows) => [result.announcement, ...rows]);
                }
              }}
            >
              <h2 className="text-2xl">Add Announcement</h2>
              <input name="title" className="input" placeholder="Announcement title" required />
              <textarea name="body" className="input" rows={4} placeholder="Body" required />
              <button type="submit" className="btn-primary">
                Publish Announcement
              </button>
            </form>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <ManageList
              title="Manage Awards"
              items={awardRows}
              endpoint="/api/admin/awards"
              responseKey="award"
              fields={[
                { name: "title", label: "Title", type: "text" },
                { name: "description", label: "Description", type: "textarea" },
                { name: "awarded_on", label: "Awarded on", type: "date" },
              ]}
              renderSummary={(award) => ({ primary: award.title, secondary: award.awarded_on ?? undefined })}
              onItemsChange={setAwardRows}
              onStatus={setStatus}
            />

            <ManageList
              title="Manage Announcements"
              items={announcementRows}
              endpoint="/api/admin/announcements"
              responseKey="announcement"
              fields={[
                { name: "title", label: "Title", type: "text" },
                { name: "body", label: "Body", type: "textarea" },
              ]}
              renderSummary={(a) => ({ primary: a.title, secondary: a.is_published ? "Published" : "Draft" })}
              onItemsChange={setAnnouncementRows}
              onStatus={setStatus}
            />
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <form
              className="card space-y-3"
              action={async (formData) => {
                const result = await postJson("/api/admin/social-links", {
                  platform: String(formData.get("platform") || ""),
                  url: String(formData.get("url") || ""),
                  is_published: true,
                });
                if (result?.socialLink) {
                  setSocialRows((rows) => [result.socialLink, ...rows]);
                }
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
                const result = await postJson("/api/admin/donation-links", {
                  label: String(formData.get("label") || ""),
                  url: String(formData.get("url") || ""),
                  is_published: true,
                });
                if (result?.donationLink) {
                  setDonationRows((rows) => [result.donationLink, ...rows]);
                }
              }}
            >
              <h2 className="text-2xl">Add Donation Link</h2>
              <input name="label" className="input" placeholder="Label" required />
              <input name="url" className="input" placeholder="URL" required />
              <button type="submit" className="btn-primary">
                Save Donation Link
              </button>
            </form>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <ManageList
              title="Manage Social Links"
              items={socialRows}
              endpoint="/api/admin/social-links"
              responseKey="socialLink"
              fields={[
                { name: "platform", label: "Platform", type: "text" },
                { name: "url", label: "URL", type: "text" },
              ]}
              renderSummary={(s) => ({ primary: s.platform, secondary: s.url })}
              onItemsChange={setSocialRows}
              onStatus={setStatus}
            />

            <ManageList
              title="Manage Donation Links"
              items={donationRows}
              endpoint="/api/admin/donation-links"
              responseKey="donationLink"
              fields={[
                { name: "label", label: "Label", type: "text" },
                { name: "url", label: "URL", type: "text" },
              ]}
              renderSummary={(d) => ({ primary: d.label, secondary: d.url })}
              onItemsChange={setDonationRows}
              onStatus={setStatus}
            />
          </section>
        </div>
      )}
    </div>
  );
}
