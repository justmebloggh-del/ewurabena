import type { Metadata } from "next";
import Link from "next/link";

import { getPublicContent } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Playlists | Ewura Abena",
  description: "Official worship playlists and curated selections from Ghanaian-UK gospel minister Ewura Abena. Create your own playlists in the fan hub.",
  alternates: { canonical: "/playlists" },
};

export default async function PlaylistsPage() {
  const content = await getPublicContent();

  return (
    <>
      {/* Hero Banner */}
      <section
        style={{
          background: "linear-gradient(160deg, var(--kente-deep) 0%, var(--kente-green) 60%, var(--kente-deep) 100%)",
          padding: "7rem 0 5rem",
          borderBottom: "1px solid rgba(157,23,77,0.22)",
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 50% 60%, rgba(157,23,77,0.18) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <div className="container" style={{ position: "relative" }}>
          <p className="gold-label" style={{ marginBottom: "0.75rem" }}>Worship Selections</p>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 300,
              color: "var(--ivory)",
              margin: "0 0 1rem",
              textShadow: "0 4px 40px rgba(157,23,77,0.30)",
            }}
          >
            Official Playlists
          </h1>
          <p style={{ fontSize: "1rem", color: "rgba(255,251,252,0.78)", maxWidth: "520px", margin: "0 auto", lineHeight: 1.75 }}>
            Curated worship selections for quiet time, devotion, and encounter with God.
          </p>
        </div>
      </section>

      {/* Official Playlists */}
      <section className="section-dark">
        <div className="container">
          {content.officialPlaylists.length > 0 ? (
            <div style={{ display: "grid", gap: "2rem", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
              {content.officialPlaylists.map((playlist) => (
                <article key={playlist.id} className="card">
                  {playlist.cover_image_url && (
                    <img
                      src={playlist.cover_image_url}
                      alt={playlist.title}
                      style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "0.75rem", marginBottom: "1.25rem", display: "block" }}
                    />
                  )}
                  <p className="gold-label" style={{ marginBottom: "0.5rem" }}>Official Playlist</p>
                  <h2
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.8rem",
                      fontWeight: 400,
                      color: "var(--kente-green)",
                      margin: "0 0 0.75rem",
                    }}
                  >
                    {playlist.title}
                  </h2>
                  {playlist.description && (
                    <p style={{ fontSize: "0.9rem", color: "var(--text-dark-body)", lineHeight: 1.7, marginBottom: "1.25rem" }}>
                      {playlist.description}
                    </p>
                  )}
                  {playlist.embed_url ? (
                    <iframe
                      src={playlist.embed_url}
                      style={{ width: "100%", height: "11rem", borderRadius: "0.75rem", border: "1px solid rgba(157,23,77,0.22)", display: "block" }}
                      title={`${playlist.title} player`}
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen"
                    />
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "4rem 0" }}>
              <p style={{ color: "rgba(255,251,252,0.68)", fontSize: "1rem" }}>Playlists coming soon. Check back shortly.</p>
            </div>
          )}
        </div>
      </section>

      {/* Fan Hub CTA */}
      <section
        className="section-light"
        style={{
          borderTop: "1px solid rgba(157,23,77,0.22)",
          padding: "5rem 0",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: "3rem",
              alignItems: "center",
            }}
            className="playlist-cta"
          >
            <div>
              <p className="gold-label" style={{ marginBottom: "0.75rem" }}>Fan Community</p>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
                  fontWeight: 300,
                  color: "var(--kente-green)",
                  margin: "0 0 0.75rem",
                }}
              >
                Create Your Own Playlists
              </h2>
              <p style={{ fontSize: "0.95rem", color: "var(--text-dark-body)", lineHeight: 1.75, maxWidth: "500px" }}>
                Join the fan hub to save your favourite tracks, build personal playlists, and connect with the community.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", minWidth: "180px" }}>
              <Link href="/fan" className="btn-primary">Open Fan Hub</Link>
              <Link href="/player" className="btn-gold">Launch Player</Link>
              {/* was btn-ghost — that variant is near-white text designed
                  for dark backgrounds; this card sits on a light section,
                  which made it nearly invisible. btn-secondary (solid rose
                  fill, white text) is the light-background-appropriate
                  choice already used correctly elsewhere on the site. */}
              <Link href="/auth/sign-up" className="btn-secondary" style={{ textAlign: "center" }}>Sign Up Free</Link>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 640px) {
            .playlist-cta { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>
    </>
  );
}
