"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { type TVVideo } from "@/lib/tv-channel";
import { smallYouTubeThumbnail, toYouTubeEmbed, youtubeThumbnail } from "@/lib/youtube";

type Props = {
  videos: TVVideo[];
};

export function EwuraAbenaTV({ videos }: Props) {
  // Only videos we can actually embed play "through the TV" — anything
  // unembeddable (a bad link, a non-YouTube URL) is silently excluded
  // rather than shown as a broken screen.
  const channel = videos
    .map((video) => ({ video, embedUrl: toYouTubeEmbed(video.url) }))
    .filter((entry): entry is { video: TVVideo; embedUrl: string } => Boolean(entry.embedUrl));

  // "Watch on Ewura Abena TV" links elsewhere on the site deep-link here
  // via ?tv=<id> so the right video is already selected on arrival.
  const searchParams = useSearchParams();
  const requestedId = searchParams.get("tv");
  const [activeId, setActiveId] = useState<string | undefined>(
    requestedId && channel.some((entry) => entry.video.id === requestedId) ? requestedId : channel[0]?.video.id,
  );

  useEffect(() => {
    if (requestedId && channel.some((entry) => entry.video.id === requestedId)) {
      setActiveId(requestedId);
    }
    // Only re-run when the requested id actually changes (e.g. clicking
    // another "Watch on Ewura Abena TV" link while already on this page).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestedId]);

  if (channel.length === 0) return null;

  const active = channel.find((entry) => entry.video.id === activeId) ?? channel[0];

  return (
    <div
      style={{
        background: "linear-gradient(160deg, var(--kente-deep) 0%, var(--kente-green) 100%)",
        borderRadius: "1.75rem",
        padding: "2rem",
        border: "1px solid rgba(157,23,77,0.3)",
        boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
      }}
    >
      {/* Channel header */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <span
          aria-hidden="true"
          style={{
            width: "0.6rem",
            height: "0.6rem",
            borderRadius: "50%",
            background: "#EF4444",
            boxShadow: "0 0 0 4px rgba(239,68,68,0.25)",
            animation: "ea-tv-pulse 1.8s ease-in-out infinite",
            flexShrink: 0,
          }}
        />
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "var(--champagne-gold)",
            margin: 0,
          }}
        >
          Ewura Abena TV
        </p>
      </div>

      {/* Now playing screen */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16/9",
          borderRadius: "1.1rem",
          overflow: "hidden",
          border: "6px solid rgba(0,0,0,0.35)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08), 0 20px 50px rgba(0,0,0,0.4)",
          background: "#0A0208",
          marginBottom: "1.5rem",
        }}
      >
        <iframe
          key={active.video.id}
          src={active.embedUrl}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
          title={active.video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; compute-pressure"
          allowFullScreen
          loading="lazy"
        />
      </div>

      <h3
        style={{
          fontFamily: "var(--font-heading), serif",
          fontSize: "1.4rem",
          fontWeight: 400,
          color: "var(--ivory)",
          margin: "0 0 0.4rem",
        }}
      >
        {active.video.title}
      </h3>
      {active.video.caption && (
        <p
          style={{
            fontSize: "0.88rem",
            color: "rgba(255,251,252,0.68)",
            lineHeight: 1.7,
            margin: "0 0 1.75rem",
            maxWidth: "640px",
          }}
        >
          {active.video.caption}
        </p>
      )}

      {/* Channel guide */}
      {channel.length > 1 && (
        <div
          style={{
            display: "flex",
            gap: "1rem",
            overflowX: "auto",
            paddingTop: channel.length > 1 && !active.video.caption ? "0" : "0.25rem",
            paddingBottom: "0.25rem",
          }}
        >
          {channel.map(({ video, embedUrl }) => {
            const isActive = video.id === active.video.id;
            const thumb = video.thumbnail_url || youtubeThumbnail(embedUrl);
            return (
              <button
                key={video.id}
                type="button"
                onClick={() => setActiveId(video.id)}
                aria-label={`Play ${video.title} on Ewura Abena TV`}
                style={{
                  flexShrink: 0,
                  width: "180px",
                  textAlign: "left",
                  background: isActive ? "rgba(157,23,77,0.25)" : "rgba(255,255,255,0.04)",
                  border: isActive ? "1.5px solid var(--gold)" : "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "0.85rem",
                  padding: "0.5rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "16/9",
                    borderRadius: "0.5rem",
                    overflow: "hidden",
                    background: "rgba(0,0,0,0.3)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {thumb ? (
                    <img
                      src={smallYouTubeThumbnail(thumb)}
                      alt=""
                      width={320}
                      height={180}
                      loading="lazy"
                      decoding="async"
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  ) : null}
                </div>
                <p
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    color: isActive ? "var(--champagne-gold)" : "rgba(255,251,252,0.85)",
                    margin: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {video.title}
                </p>
              </button>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes ea-tv-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
      `}</style>
    </div>
  );
}
