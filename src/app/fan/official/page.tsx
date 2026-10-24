import Link from "next/link";

import { PlayTrackButton } from "@/components/play-track-button";
import { getViewer } from "@/lib/data/fan-viewer";
import { getPublicContent } from "@/lib/data/public";
import { getDownloadUrl } from "@/lib/fan-hub";

function DownloadLink({ href, signedIn, label }: { href: string | null; signedIn: boolean; label: string }) {
  if (!href) return null;
  return signedIn ? (
    <a className="fh-action" href={href} download>⬇ {label}</a>
  ) : (
    <Link className="fh-action" href="/auth/sign-in">⬇ Sign in to download</Link>
  );
}

export default async function OfficialPage() {
  const [viewer, content] = await Promise.all([getViewer(), getPublicContent()]);
  const signedIn = Boolean(viewer);

  const songs = content.tracks.filter((t) => t.audio_url);
  const videos = content.mediaItems.filter((m) => m.kind === "video");
  const photos = content.mediaItems.filter((m) => m.kind === "image");

  return (
    <div className="fh-stack">
      <section className="fh-card">
        <h2 className="fh-subhead">Songs</h2>
        {songs.length === 0 ? (
          <p className="fh-muted">No songs available to download yet.</p>
        ) : (
          <ul className="fh-tracklist">
            {songs.map((track) => (
              <li key={track.id}>
                <span>♪ {track.title}</span>
                <span className="fh-row">
                  <PlayTrackButton track={{ id: track.id, title: track.title, audio_url: track.audio_url ?? undefined }} />
                  <DownloadLink href={getDownloadUrl(track.audio_url, track.title)} signedIn={signedIn} label="Download" />
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="fh-card">
        <h2 className="fh-subhead">Videos</h2>
        {videos.length === 0 ? (
          <p className="fh-muted">No videos yet.</p>
        ) : (
          <div className="fh-stack">
            {videos.map((video) => (
              <div key={video.id} className="fh-stack-sm">
                <strong className="fh-vtitle">{video.title}</strong>
                {getDownloadUrl(video.url, video.title) ? (
                  <video src={video.url} className="fh-media" controls playsInline preload="metadata" poster={video.thumbnail_url ?? undefined} />
                ) : (
                  <a href={video.url} target="_blank" rel="noopener noreferrer" className="btn-gold">▶ Watch</a>
                )}
                <div className="fh-row">
                  <DownloadLink href={getDownloadUrl(video.url, video.title)} signedIn={signedIn} label="Download video" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {photos.length > 0 && (
        <section className="fh-card">
          <h2 className="fh-subhead">Photos</h2>
          <div className="fh-photos">
            {photos.map((photo) => (
              <figure key={photo.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt={photo.title} loading="lazy" />
                <DownloadLink href={getDownloadUrl(photo.url, photo.title)} signedIn={signedIn} label="Download" />
              </figure>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
