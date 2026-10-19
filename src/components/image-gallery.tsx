"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface Props {
  images: string[];
}

export function ImageGallery({ images }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const prev = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length]
  );
  const next = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length]
  );

  // Keyboard navigation + scroll-lock while the lightbox is open
  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [activeIndex, close, prev, next]);

  return (
    <div style={{ background: "var(--ivory)", minHeight: "100vh" }}>
      {/* ─── Title banner ─── */}
      <div
        style={{
          background: "linear-gradient(160deg, var(--kente-deep) 0%, var(--kente-green) 60%, var(--kente-deep) 100%)",
          padding: "7rem 0 3rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "0.68rem",
            letterSpacing: "0.36em",
            textTransform: "uppercase",
            color: "var(--champagne-gold)",
            fontWeight: 700,
            fontFamily: "var(--font-body)",
            margin: "0 0 0.75rem",
          }}
        >
          Visual Story
        </p>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
            fontWeight: 300,
            color: "var(--ivory)",
            margin: 0,
            letterSpacing: "0.02em",
          }}
        >
          Photo Gallery
        </h1>
      </div>
      <div className="brand-divider" aria-hidden="true" />

      {/* ─── Grid ─── */}
      <div className="container" style={{ padding: "3rem 1.5rem 5rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "1rem",
          }}
        >
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`Open photo ${i + 1} of ${images.length}`}
              className="gallery-thumb"
              style={{
                position: "relative",
                aspectRatio: "4 / 5",
                borderRadius: "1rem",
                overflow: "hidden",
                border: "1px solid rgba(157,23,77,0.22)",
                cursor: "pointer",
                padding: 0,
                background: "var(--kente-light)",
              }}
            >
              <Image
                src={src}
                alt={`Ewura Abena — ministry photo ${i + 1}`}
                fill
                sizes="(max-width: 700px) 50vw, (max-width: 1100px) 33vw, 25vw"
                style={{ objectFit: "cover" }}
                className="gallery-thumb-img"
                loading={i < 6 ? "eager" : "lazy"}
                // Next's image optimizer refuses any private-IP source
                // (e.g. a local `supabase start` instance on 127.0.0.1) as
                // an SSRF guard — only relevant in local dev, since a real
                // Supabase project is a public HTTPS domain.
                unoptimized={process.env.NODE_ENV !== "production"}
              />
              <span className="gallery-thumb-overlay" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>

      {/* ─── Lightbox ─── */}
      {activeIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={close}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 3000,
            background: "rgba(24,6,14,0.94)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
        >
          {/* Close */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            aria-label="Close photo viewer"
            style={{
              position: "absolute",
              top: "1.25rem",
              right: "1.25rem",
              zIndex: 10,
              width: "2.75rem",
              height: "2.75rem",
              borderRadius: "50%",
              background: "rgba(131,24,67,0.75)",
              border: "1px solid rgba(157,23,77,0.3)",
              color: "var(--gold)",
              fontSize: "1.1rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>

          {/* Prev */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous photo"
            style={{
              position: "absolute",
              left: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              width: "3rem",
              height: "3rem",
              borderRadius: "50%",
              background: "rgba(131,24,67,0.75)",
              border: "1px solid rgba(157,23,77,0.3)",
              color: "var(--gold)",
              fontSize: "1.1rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ❮
          </button>

          {/* Image */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "900px",
              height: "min(80vh, 900px)",
            }}
          >
            <Image
              src={images[activeIndex]}
              alt={`Ewura Abena — ministry photo ${activeIndex + 1}`}
              fill
              sizes="90vw"
              style={{ objectFit: "contain" }}
              priority
              unoptimized={process.env.NODE_ENV !== "production"}
            />
          </div>

          {/* Next */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next photo"
            style={{
              position: "absolute",
              right: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              width: "3rem",
              height: "3rem",
              borderRadius: "50%",
              background: "rgba(131,24,67,0.75)",
              border: "1px solid rgba(157,23,77,0.3)",
              color: "var(--gold)",
              fontSize: "1.1rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ❯
          </button>

          {/* Counter */}
          <p
            style={{
              position: "absolute",
              bottom: "1.25rem",
              left: 0,
              right: 0,
              textAlign: "center",
              color: "rgba(255,251,252,0.55)",
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
              fontFamily: "var(--font-body)",
            }}
          >
            {activeIndex + 1} / {images.length}
          </p>
        </div>
      )}
    </div>
  );
}
