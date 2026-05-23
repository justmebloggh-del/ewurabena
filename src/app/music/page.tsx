import type { Metadata } from "next";

import { PlayTrackButton } from "@/components/play-track-button";
import { PlatformEmbedPlayer } from "@/components/platform-embed-player";
import { getPublicContent } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Music | Ewura Abena",
  description:
    "Stream Ewura Abena's soul gospel music on Spotify, Apple Music, Audiomack, Boomplay and more. Listen to all tracks, albums and playlists.",
};

export default async function MusicPage() {
  const content = await getPublicContent();

  return (
    <>
      {/* ── Hero ── */}
      <section
        style={{
          background: "linear-gradient(160deg, var(--kente-deep) 0%, var(--kente-green) 60%, var(--kente-deep) 100%)",
          padding: "7rem 0 5rem",
          borderBottom: "1px solid rgba(212,175,55,0.22)",
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
            background: "radial-gradient(ellipse at 50% 60%, rgba(212,175,55,0.18) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <div className="container" style={{ position: "relative" }}>
          <p className="gold-label" style={{ marginBottom: "0.75rem" }}>
            Streaming
          </p>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 300,
              color: "var(--ivory)",
              margin: "0 0 1rem",
              textShadow: "0 4px 40px rgba(212,175,55,0.30)",
            }}
          >
            Music
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: "rgba(255,253,248,0.78)",
              maxWidth: "500px",
              margin: "0 auto 2.5rem",
              lineHeight: 1.75,
            }}
          >
            Soul gospel crafted to ignite faith — stream live right here or on
            your favourite platform.
          </p>
          {/* Platform quick-jump pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem", justifyContent: "center" }}>
            {[
              { label: "♫ Spotify", href: "#spotify" },
              { label: "♪ Apple Music", href: "#apple" },
              { label: "◈ Audiomack", href: "#audiomack" },
              { label: "▶ Boomplay", href: "#boomplay" },
              { label: "⊙ All Tracks", href: "#tracks" },
            ].map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="platform-badge"
                style={{
                  background: "rgba(212,175,55,0.12)",
                  border: "1px solid rgba(212,175,55,0.45)",
                  fontSize: "0.75rem",
                }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Spotify embed ── */}
      <section id="spotify" className="section-dark" style={{ paddingBottom: "3rem" }}>
        <div className="container">
          <p className="gold-label" style={{ marginBottom: "1rem" }}>Spotify</p>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              fontWeight: 300,
              color: "var(--ivory)",
              margin: "0 0 1.5rem",
            }}
          >
            Listen on Spotify
          </h2>
          <div
            style={{
              borderRadius: "1.25rem",
              overflow: "hidden",
              border: "1px solid rgba(30,215,96,0.2)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
            }}
          >
            <iframe
              src="https://open.spotify.com/embed/artist/66omcxaARiacfGoXuXiHXQ?utm_source=generator&theme=0"
              width="100%"
              height="352"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Ewura Abena on Spotify"
              style={{ display: "block", border: "none" }}
            />
          </div>
          <div style={{ marginTop: "1rem", textAlign: "right" }}>
            <a
              href="https://open.spotify.com/artist/66omcxaARiacfGoXuXiHXQ"
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
              style={{ fontSize: "0.8rem" }}
            >
              ♫ Open in Spotify ↗
            </a>
          </div>
        </div>
      </section>

      {/* ── Apple Music embed ── */}
      <section
        id="apple"
        style={{
          background: "linear-gradient(160deg, var(--kente-deep) 0%, var(--kente-green) 100%)",
          padding: "4rem 0",
        }}
      >
        <div className="container">
          <p className="gold-label" style={{ marginBottom: "1rem" }}>Apple Music</p>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              fontWeight: 300,
              color: "var(--ivory)",
              margin: "0 0 1.5rem",
            }}
          >
            Listen on Apple Music
          </h2>
          <div
            style={{
              borderRadius: "1.25rem",
              overflow: "hidden",
              border: "1px solid rgba(252,60,68,0.2)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
            }}
          >
            <iframe
              src="https://embed.music.apple.com/gb/artist/ewura-abena/994868905"
              width="100%"
              height="450"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Ewura Abena on Apple Music"
              style={{ display: "block", border: "none" }}
            />
          </div>
          <div style={{ marginTop: "1rem", textAlign: "right" }}>
            <a
              href="https://music.apple.com/gb/artist/ewura-abena/994868905"
              target="_blank"
              rel="noreferrer"
              className="btn-gold"
              style={{ fontSize: "0.8rem" }}
            >
              ♪ Open in Apple Music ↗
            </a>
          </div>
        </div>
      </section>

      {/* ── Audiomack ── */}
      <section id="audiomack" className="section-dark" style={{ paddingBottom: "3rem" }}>
        <div className="container">
          <p className="gold-label" style={{ marginBottom: "1rem" }}>Audiomack</p>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              fontWeight: 300,
              color: "var(--ivory)",
              margin: "0 0 1.5rem",
            }}
          >
            Listen on Audiomack
          </h2>
          <div
            style={{
              background: "rgba(255,165,0,0.05)",
              border: "1px solid rgba(255,165,0,0.2)",
              borderRadius: "1.5rem",
              padding: "2.5rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1.25rem",
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: "3rem" }}>◈</span>
            <div>
              <p
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.5rem",
                  fontWeight: 400,
                  color: "var(--ivory)",
                  margin: "0 0 0.5rem",
                }}
              >
                Ewura Abena on Audiomack
              </p>
              <p style={{ color: "rgba(255,253,248,0.68)", fontSize: "0.9rem", margin: 0 }}>
                Stream all songs, albums, and playlists on Audiomack
              </p>
            </div>
            <a
              href="https://audiomack.com/ewuraabenamusiq"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
            >
              ◈ Open Audiomack ↗
            </a>
          </div>
        </div>
      </section>

      {/* ── Boomplay custom card ── */}
      <section
        id="boomplay"
        style={{
          background: "linear-gradient(160deg, var(--kente-deep) 0%, var(--kente-green) 100%)",
          padding: "4rem 0",
        }}
      >
        <div className="container">
          <p className="gold-label" style={{ marginBottom: "1rem" }}>Boomplay</p>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              fontWeight: 300,
              color: "var(--ivory)",
              margin: "0 0 1.5rem",
            }}
          >
            Listen on Boomplay
          </h2>
          <div className="boomplay-card">
            <div className="boomplay-card-inner">
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", alignItems: "center", textAlign: "center" }}>
                {/* Icon + brand */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
                  <div
                    style={{
                      width: "72px",
                      height: "72px",
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.1)",
                      border: "2px solid rgba(255,255,255,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "2rem",
                    }}
                  >
                    ▶
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "1.75rem",
                        fontWeight: 400,
                        color: "#fff",
                        margin: "0 0 0.25rem",
                      }}
                    >
                      Ewura Abena
                    </p>
                    <p style={{ fontSize: "0.78rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", margin: 0, fontFamily: "var(--font-body)" }}>
                      Artist · Boomplay
                    </p>
                  </div>
                </div>

                {/* Decorative waveform bars */}
                <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "36px" }}>
                  {[12, 28, 20, 36, 18, 30, 14, 26, 22, 32, 16, 28].map((h, i) => (
                    <div
                      key={i}
                      style={{
                        width: "4px",
                        height: `${h}px`,
                        borderRadius: "2px",
                        background: `rgba(255,255,255,${0.25 + (i % 3) * 0.15})`,
                        animation: `boomplay-bar 1.2s ease-in-out ${i * 0.1}s infinite alternate`,
                      }}
                    />
                  ))}
                </div>

                <a
                  href="https://www.boomplay.com/share/artist/2829036"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-block",
                    padding: "0.75rem 2rem",
                    borderRadius: "9999px",
                    background: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.35)",
                    color: "#fff",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textDecoration: "none",
                    backdropFilter: "blur(8px)",
                    transition: "all 0.2s",
                  }}
                >
                  ▶ Open on Boomplay ↗
                </a>
              </div>
            </div>
          </div>

          <style>{`
            @keyframes boomplay-bar {
              from { transform: scaleY(0.6); }
              to   { transform: scaleY(1); }
            }
          `}</style>
        </div>
      </section>

      {/* ── All Tracks ── */}
      <section id="tracks" className="section-dark">
        <div className="container">
          <p className="gold-label" style={{ marginBottom: "0.75rem" }}>Discography</p>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)",
              fontWeight: 300,
              color: "var(--ivory)",
              margin: "0 0 2.5rem",
            }}
          >
            All Tracks
          </h2>

          <div style={{ display: "grid", gap: "1.25rem", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
            {content.tracks.map((track) => {
              const album = content.albums.find((a) => a.id === track.album_id);
              return (
                <div key={track.id} className="track-card">
                  <div style={{ marginBottom: "0.85rem" }}>
                    <p
                      style={{
                        fontSize: "0.62rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "var(--champagne-gold)",
                        margin: "0 0 0.25rem",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {album?.title ?? "Single"}
                      {track.track_number ? ` · Track ${track.track_number}` : ""}
                    </p>
                    <h3
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "1.3rem",
                        fontWeight: 400,
                        color: "var(--kente-green)",
                        margin: 0,
                      }}
                    >
                      {track.title}
                    </h3>
                  </div>

                  {/* Direct audio preview */}
                  {track.audio_url && (
                    <audio
                      controls
                      src={track.audio_url}
                      style={{ width: "100%", marginBottom: "0.85rem", accentColor: "var(--gold)" }}
                      preload="none"
                    />
                  )}

                  {/* Platform badges + inline play */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {track.audio_url && (
                      <PlayTrackButton
                        track={{
                          title: track.title,
                          album: album?.title,
                          audio_url: track.audio_url,
                          cover_url: album?.cover_image_url ?? undefined,
                          spotify_url: track.spotify_url ?? undefined,
                          apple_music_url: track.apple_music_url ?? undefined,
                          audiomack_url: track.audiomack_url ?? undefined,
                        }}
                        label="Play in Player"
                      />
                    )}
                    <PlatformEmbedPlayer
                      trackTitle={track.title}
                      youtube_url={track.youtube_url}
                      youtube_embed_url={track.embed_url}
                      spotify_url={track.spotify_url}
                      apple_music_url={track.apple_music_url}
                      audiomack_url={track.audiomack_url}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── All Platforms CTA ── */}
      <section
        className="section-light"
        style={{
          borderTop: "1px solid rgba(212,175,55,0.22)",
          padding: "4.5rem 0",
          textAlign: "center",
        }}
      >
        <div className="container">
          <p className="gold-label" style={{ marginBottom: "0.75rem" }}>Stream Everywhere</p>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
              fontWeight: 300,
              color: "var(--kente-green)",
              margin: "0 0 0.75rem",
            }}
          >
            Available on All Platforms
          </h2>
          <p style={{ color: "var(--text-dark-body)", fontSize: "0.9rem", marginBottom: "2rem" }}>
            Choose your favourite streaming service and let the worship begin.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center" }}>
            <a href="https://open.spotify.com/artist/66omcxaARiacfGoXuXiHXQ" target="_blank" rel="noreferrer" className="btn-primary">
              ♫ Spotify
            </a>
            <a href="https://music.apple.com/gb/artist/ewura-abena/994868905" target="_blank" rel="noreferrer" className="btn-gold">
              ♪ Apple Music
            </a>
            <a href="https://audiomack.com/ewuraabenamusiq" target="_blank" rel="noreferrer" className="btn-secondary">
              ◈ Audiomack
            </a>
            <a href="https://www.boomplay.com/share/artist/2829036" target="_blank" rel="noreferrer" className="btn-secondary">
              ▶ Boomplay
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
