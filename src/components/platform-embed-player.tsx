"use client";

import { useEffect, useState } from "react";

import { type TrackInfo, playTrackInline } from "@/components/play-track-button";
import { toAppleMusicEmbed, toAudiomackEmbed, toFacebookVideoEmbed, toSpotifyEmbed } from "@/lib/catalog-embeds";

interface Props {
  trackTitle: string;
  spotify_url?: string | null;
  apple_music_url?: string | null;
  audiomack_url?: string | null;
  boomplay_url?: string | null;
  facebook_url?: string | null;
  /**
   * Boomplay has no public embed/widget at all (confirmed: no official
   * developer docs, no unofficial embed format in use anywhere), and
   * Audiomack only embeds for a specific song/album/playlist link, not an
   * artist profile. For those cases there is no way to actually stream
   * that platform in-site — so instead of ever linking out to a new tab,
   * the badge plays this exact track through the site's own player.
   * Undefined (no audio_url on the track) → that badge isn't rendered at
   * all, since showing something that can neither embed nor play would
   * just be a dead end. (A function prop can't be passed here — the
   * callers are Server Components — so this carries plain track data and
   * the component calls playTrackInline itself.)
   */
  fallbackTrack?: TrackInfo;
}

interface Platform {
  label: string;
  icon: string;
  /** Null → this platform can't embed its own player for this URL. */
  embedUrl: string | null;
  height: number;
}

interface ActivePlayer extends Platform {
  embedUrl: string; // narrowed: cannot be null when active
}

/* ─── Component ─── */

export function PlatformEmbedPlayer({
  trackTitle,
  spotify_url,
  apple_music_url,
  audiomack_url,
  boomplay_url,
  facebook_url,
  fallbackTrack,
}: Props) {
  const [active, setActive] = useState<ActivePlayer | null>(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  const platforms: Platform[] = (
    [
      spotify_url
        ? {
            label: "Spotify",
            icon: "♫",
            embedUrl: toSpotifyEmbed(spotify_url),
            height: 380,
          }
        : null,
      apple_music_url
        ? {
            label: "Apple Music",
            icon: "♪",
            embedUrl: toAppleMusicEmbed(apple_music_url),
            height: 450,
          }
        : null,
      audiomack_url
        ? {
            label: "Audiomack",
            icon: "◈",
            embedUrl: toAudiomackEmbed(audiomack_url),
            height: 165,
          }
        : null,
      boomplay_url
        ? {
            label: "Boomplay",
            icon: "▶",
            embedUrl: null,
            height: 0,
          }
        : null,
      facebook_url
        ? {
            label: "Facebook",
            icon: "f",
            embedUrl: toFacebookVideoEmbed(facebook_url),
            height: 400,
          }
        : null,
    ] as (Platform | null)[]
  ).filter((p): p is Platform => p !== null);

  if (platforms.length === 0) return null;

  // Platforms that can open in the modal
  const embeddable = platforms.filter((p): p is ActivePlayer => p.embedUrl !== null);
  // Badges actually worth showing: either embeddable, or — when not — still
  // playable in-site via the site's own audio (never a dead/external link).
  const visible = platforms.filter((p) => p.embedUrl !== null || fallbackTrack);

  if (visible.length === 0) return null;

  return (
    <>
      {/* Badge row */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {visible.map((p) => (
          <button
            key={p.label}
            onClick={() => (p.embedUrl ? setActive(p as ActivePlayer) : fallbackTrack && playTrackInline(fallbackTrack))}
            className="platform-badge"
            style={{
              cursor: "pointer",
              background: "rgba(255,255,255,0.05)",
              fontFamily: "var(--font-body)",
              border: "1px solid rgba(157,23,77,0.35)",
            }}
            type="button"
            aria-label={`Play ${trackTitle} on ${p.label}`}
          >
            {p.icon} {p.label}
          </button>
        ))}
      </div>

      {/* Modal */}
      {active && (
        <div
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Playing ${trackTitle}`}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            background: "rgba(4, 10, 20, 0.92)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.25rem",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            animation: "fade-in 0.2s ease both",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "720px",
              background: "linear-gradient(160deg, var(--kente-deep) 0%, var(--kente-green) 100%)",
              border: "1px solid rgba(157,23,77,0.25)",
              borderRadius: "1.5rem",
              overflow: "hidden",
              boxShadow:
                "0 60px 140px rgba(0,0,0,0.75), 0 0 0 1px rgba(157,23,77,0.08)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem 1.5rem",
                borderBottom: "1px solid rgba(157,23,77,0.15)",
                background: "rgba(42,8,20,0.6)",
                gap: "1rem",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <p
                  style={{
                    fontSize: "0.62rem",
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: "var(--gold)",
                    margin: "0 0 0.25rem",
                    fontWeight: 600,
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {active.icon} Now Playing on {active.label}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.15rem",
                    color: "var(--ivory)",
                    margin: 0,
                    fontWeight: 400,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {trackTitle}
                </p>
              </div>

              <button
                onClick={() => setActive(null)}
                aria-label="Close player"
                style={{
                  flexShrink: 0,
                  width: "2.25rem",
                  height: "2.25rem",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  fontSize: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>

            {/* Platform switcher tabs */}
            {embeddable.length > 1 && (
              <div
                style={{
                  display: "flex",
                  gap: "0.4rem",
                  padding: "0.65rem 1.5rem",
                  borderBottom: "1px solid rgba(157,23,77,0.1)",
                  background: "rgba(42,8,20,0.4)",
                  flexWrap: "wrap",
                }}
              >
                {embeddable.map((p) => {
                  const isActive = active.label === p.label;
                  return (
                    <button
                      key={p.label}
                      onClick={() => setActive(p)}
                      type="button"
                      style={{
                        padding: "0.28rem 0.75rem",
                        borderRadius: "9999px",
                        border: `1px solid ${isActive ? "var(--gold)" : "rgba(157,23,77,0.2)"}`,
                        background: isActive ? "rgba(157,23,77,0.14)" : "transparent",
                        color: isActive ? "var(--gold)" : "var(--text-muted)",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        letterSpacing: "0.06em",
                        transition: "all 0.15s ease",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {p.icon} {p.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Embedded iframe. Apple Music's widget needs its own
                documented allow (with wildcard origins) and an explicit
                sandbox attribute to actually render content — without
                them it loads (200 OK, JS runs) but silently shows an
                empty placeholder with no track data, which is exactly
                what was happening before this was platform-specific. */}
            <iframe
              key={active.embedUrl}
              src={active.embedUrl}
              width="100%"
              height={active.height}
              allow={
                active.label === "Apple Music"
                  ? "autoplay *; encrypted-media *;"
                  : "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture; compute-pressure"
              }
              sandbox={
                active.label === "Apple Music"
                  ? "allow-same-origin allow-scripts allow-top-navigation-by-user-activation allow-popups"
                  : undefined
              }
              loading="lazy"
              title={`${trackTitle} on ${active.label}`}
              style={{ display: "block", border: "none" }}
            />

            {/* Footer */}
            <p
              style={{
                textAlign: "center",
                fontSize: "0.65rem",
                color: "rgba(157,23,77,0.35)",
                padding: "0.6rem 1rem",
                margin: 0,
                fontStyle: "italic",
                fontFamily: "var(--font-heading)",
                letterSpacing: "0.05em",
                borderTop: "1px solid rgba(157,23,77,0.08)",
              }}
            >
              Press Escape or click outside to close
            </p>
          </div>
        </div>
      )}
    </>
  );
}
