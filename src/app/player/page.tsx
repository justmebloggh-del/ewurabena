import type { Metadata } from "next";
import Link from "next/link";

import { MusicPlayer } from "@/components/music-player";
import { getPublicContent } from "@/lib/data/public";
import type { Track } from "@/lib/types";

export const metadata: Metadata = {
  title: "Music Player | Ewura Abena",
  description: "Listen to Ewura Abena's soul gospel music — play, queue, and favourite tracks from Grace Overflow & Rebirth.",
};

export default async function PlayerPage() {
  const content = await getPublicContent();
  const tracks: Track[] = content.tracks;

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
        <p className="gold-label" style={{ marginBottom: "0.75rem" }}>Music Player</p>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontWeight: 300,
            color: "var(--kente-green)",
            margin: "0 0 1rem",
          }}
        >
          Ewura Abena Music Player
        </h1>
        <p style={{ fontSize: "1rem", color: "var(--text-dark-body)", maxWidth: "520px", margin: "0 auto 1.5rem", lineHeight: 1.75 }}>
          Dive into soulful gospel worship. Play, queue, and favourite tracks from Grace Overflow &amp; Rebirth.
        </p>
        <Link href="/" className="btn-ghost" style={{ display: "inline-flex" }}>
          ← Back to Home
        </Link>
      </div>

      {/* Player */}
      <div style={{ maxWidth: "900px", margin: "0 auto 4rem" }}>
        <MusicPlayer tracks={tracks} />
      </div>

      {/* Album Showcase */}
      <div>
        <p className="gold-label" style={{ marginBottom: "1.5rem", textAlign: "center" }}>Albums</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {content.albums.map((album) => (
            <Link key={album.id} href="/albums" style={{ textDecoration: "none", display: "block" }}>
              <article
                className="card"
                style={{ overflow: "hidden", padding: 0, transition: "all 0.3s ease" }}
              >
                <img
                  src={album.cover_image_url || "/ep.jpg"}
                  alt={album.title}
                  style={{ width: "100%", height: "240px", objectFit: "cover", display: "block" }}
                />
                <div style={{ padding: "1.25rem" }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.5rem",
                      fontWeight: 400,
                      color: "var(--kente-green)",
                      margin: "0 0 0.35rem",
                    }}
                  >
                    {album.title}
                  </h3>
                  {album.description && (
                    <p style={{ fontSize: "0.87rem", color: "var(--text-dark-body)", lineHeight: 1.65, margin: 0 }}>
                      {album.description}
                    </p>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
