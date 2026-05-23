import type { Metadata } from "next";

import { FavoriteButton } from "@/components/favorite-button";
import { PlayTrackButton } from "@/components/play-track-button";
import { PlatformEmbedPlayer } from "@/components/platform-embed-player";
import { getPublicContent } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Music & Albums | Ewura Abena",
  description: "Discover Ewura Abena's complete discography — soul gospel albums and tracks available on Spotify, Apple Music, Audiomack, and more.",
};

export default async function AlbumsPage() {
  const content = await getPublicContent();

  return (
    <>
      {/* Hero Banner */}
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
          <p className="gold-label" style={{ marginBottom: "0.75rem" }}>Discography</p>
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
            Albums & Music
          </h1>
          <p style={{ fontSize: "1rem", color: "rgba(255,253,248,0.78)", maxWidth: "520px", margin: "0 auto", lineHeight: 1.75 }}>
            Soul gospel crafted to ignite faith — available on all major streaming platforms.
          </p>
        </div>
      </section>

      {/* Albums */}
      <section className="section-dark">
        <div className="container">
          <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
            {content.albums.map((album) => {
              const albumTracks = content.tracks.filter((track) => track.album_id === album.id);

              return (
                <article key={album.id} className="animate-fade-in">
                  {/* Album Header */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "220px 1fr",
                      gap: "2.5rem",
                      alignItems: "start",
                      marginBottom: "2.5rem",
                    }}
                    className="album-header"
                  >
                    <div style={{ position: "relative" }}>
                      <img
                        src={album.cover_image_url || "https://images.unsplash.com/photo-1485579149621-3123dd979885?auto=format&fit=crop&w=900&q=80"}
                        alt={`${album.title} cover art`}
                        style={{
                          width: "100%",
                          height: "220px",
                          objectFit: "cover",
                          borderRadius: "1rem",
                          display: "block",
                          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: "-1px",
                          borderRadius: "1rem",
                          background: "linear-gradient(135deg, rgba(212,175,55,0.4), transparent 60%)",
                          pointerEvents: "none",
                        }}
                      />
                    </div>

                    <div style={{ paddingTop: "0.5rem" }}>
                      <p style={{ fontSize: "0.68rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--champagne-gold)", marginBottom: "0.5rem", fontWeight: 600 }}>
                        Album
                      </p>
                      <h2
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontSize: "clamp(2rem, 4vw, 3rem)",
                          fontWeight: 300,
                          color: "var(--ivory)",
                          margin: "0 0 0.75rem",
                        }}
                      >
                        {album.title}
                      </h2>
                      {album.description && (
                        <p style={{ fontSize: "0.95rem", color: "rgba(255,253,248,0.72)", lineHeight: 1.75, maxWidth: "500px", marginBottom: "1.25rem" }}>
                          {album.description}
                        </p>
                      )}
                      {album.release_date && (
                        <p style={{ fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--champagne-gold)", marginBottom: "1.25rem" }}>
                          Released: {album.release_date}
                        </p>
                      )}
                      <FavoriteButton albumId={album.id} />
                    </div>
                  </div>

                  {/* Tracks */}
                  <div style={{ borderTop: "1px solid rgba(212,175,55,0.22)", paddingTop: "2rem" }}>
                    <p className="gold-label" style={{ marginBottom: "1.5rem" }}>Tracks</p>
                    <div style={{ display: "grid", gap: "1.25rem", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
                      {albumTracks.map((track) => (
                        <div key={track.id} className="track-card">
                          <div style={{ marginBottom: "1rem" }}>
                            <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--champagne-gold)", marginBottom: "0.3rem" }}>
                              {track.track_number ? `Track ${track.track_number}` : ""}
                            </p>
                            <h3
                              style={{
                                fontFamily: "var(--font-heading)",
                                fontSize: "1.35rem",
                                fontWeight: 400,
                                color: "var(--kente-green)",
                                margin: 0,
                              }}
                            >
                              {track.title}
                            </h3>
                          </div>

                          {track.embed_url ? (
                            <iframe
                              src={track.embed_url}
                              style={{ width: "100%", height: "10rem", borderRadius: "0.75rem", border: "1px solid rgba(212,175,55,0.22)", marginBottom: "1rem", display: "block" }}
                              title={`${track.title} embedded player`}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : track.audio_url ? (
                            <audio controls src={track.audio_url} style={{ width: "100%", marginBottom: "1rem", accentColor: "var(--gold)" }} />
                          ) : null}

                          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                            {track.audio_url && (
                              <PlayTrackButton
                                track={{
                                  title: track.title,
                                  album: album.title,
                                  audio_url: track.audio_url,
                                  cover_url: album.cover_image_url ?? undefined,
                                  spotify_url: track.spotify_url ?? undefined,
                                  apple_music_url: track.apple_music_url ?? undefined,
                                  audiomack_url: track.audiomack_url ?? undefined,
                                }}
                                label="Play"
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
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <style>{`
          @media (max-width: 640px) {
            .album-header { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* Streaming CTA */}
      <section
        className="section-light"
        style={{
          borderTop: "1px solid rgba(212,175,55,0.22)",
          padding: "4rem 0",
          textAlign: "center",
        }}
      >
        <div className="container">
          <p className="gold-label" style={{ marginBottom: "0.75rem" }}>Stream Everywhere</p>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 300, color: "var(--kente-green)", margin: "0 0 1rem" }}>
            Available on All Platforms
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center", marginTop: "2rem" }}>
            <a href="https://open.spotify.com/artist/66omcxaARiacfGoXuXiHXQ" target="_blank" rel="noreferrer" className="btn-primary">♫ Spotify</a>
            <a href="https://music.apple.com/gb/artist/ewura-abena/994868905" target="_blank" rel="noreferrer" className="btn-gold">♪ Apple Music</a>
            <a href="https://audiomack.com/ewuraabenamusiq" target="_blank" rel="noreferrer" className="btn-secondary">◈ Audiomack</a>
            <a href="https://www.boomplay.com/share/artist/2829036" target="_blank" rel="noreferrer" className="btn-secondary">▶ Boomplay</a>
          </div>
        </div>
      </section>
    </>
  );
}
