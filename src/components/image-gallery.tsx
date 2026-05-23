"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface Props {
  images: string[];
}

export function ImageGallery({ images }: Props) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const prev = useCallback(() => setCurrent((c) => (c - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % images.length), [images.length]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 4500);
    return () => clearInterval(id);
  }, [paused, next]);

  // keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        background: "var(--kente-deep)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      {images.map((src, i) => (
        <div
          key={src}
          style={{
            position: "absolute",
            inset: 0,
            opacity: i === current ? 1 : 0,
            transition: "opacity 0.9s ease",
            pointerEvents: i === current ? "auto" : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            src={src}
            alt={`Gallery image ${i + 1}`}
            fill
            sizes="100vw"
            style={{ objectFit: "contain" }}
            priority={i < 2}
          />
        </div>
      ))}

      {/* Title overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 5,
          padding: "2rem 2rem 3rem",
          background: "linear-gradient(to bottom, rgba(8,61,39,0.80) 0%, transparent 100%)",
          pointerEvents: "none",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "0.62rem",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "var(--gold)",
            fontWeight: 600,
            fontFamily: "var(--font-body)",
            margin: "0 0 0.4rem",
          }}
        >
          Visual Story
        </p>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 300,
            color: "var(--ivory)",
            margin: 0,
            letterSpacing: "0.04em",
          }}
        >
          Photo Gallery
        </h1>
      </div>

      {/* Subtle dark vignette on left/right edges */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to right, rgba(8,61,39,0.4) 0%, transparent 15%, transparent 85%, rgba(8,61,39,0.4) 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Prev button */}
      <button
        type="button"
        onClick={prev}
        aria-label="Previous image"
        style={{
          position: "absolute",
          left: "1.25rem",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          width: "3rem",
          height: "3rem",
          borderRadius: "50%",
          background: "rgba(8,61,39,0.75)",
          border: "1px solid rgba(201,168,76,0.3)",
          color: "var(--gold)",
          fontSize: "1.1rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(8px)",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,168,76,0.15)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(8,61,39,0.75)"; }}
      >
        ❮
      </button>

      {/* Next button */}
      <button
        type="button"
        onClick={next}
        aria-label="Next image"
        style={{
          position: "absolute",
          right: "1.25rem",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          width: "3rem",
          height: "3rem",
          borderRadius: "50%",
          background: "rgba(8,61,39,0.75)",
          border: "1px solid rgba(201,168,76,0.3)",
          color: "var(--gold)",
          fontSize: "1.1rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(8px)",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,168,76,0.15)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(8,61,39,0.75)"; }}
      >
        ❯
      </button>

      {/* Bottom bar: counter + dots + pause */}
      <div
        style={{
          position: "absolute",
          bottom: "2rem",
          left: 0,
          right: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
          flexWrap: "wrap",
          padding: "0 1rem",
        }}
      >
        {/* Counter */}
        <span
          style={{
            fontSize: "0.68rem",
            letterSpacing: "0.2em",
            color: "rgba(201,168,76,0.7)",
            fontFamily: "var(--font-body)",
            background: "rgba(8,61,39,0.75)",
            padding: "0.3rem 0.75rem",
            borderRadius: "9999px",
            backdropFilter: "blur(8px)",
          }}
        >
          {current + 1} / {images.length}
        </span>

        {/* Dots */}
        <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`Go to image ${i + 1}`}
              style={{
                width: i === current ? "1.75rem" : "0.5rem",
                height: "0.5rem",
                borderRadius: "9999px",
                background: i === current ? "var(--gold)" : "rgba(255,255,255,0.3)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>

        {/* Pause/play */}
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? "Resume slideshow" : "Pause slideshow"}
          style={{
            fontSize: "0.68rem",
            letterSpacing: "0.12em",
            color: "rgba(201,168,76,0.7)",
            fontFamily: "var(--font-body)",
            background: "rgba(8,61,39,0.75)",
            padding: "0.3rem 0.75rem",
            borderRadius: "9999px",
            border: "1px solid rgba(201,168,76,0.2)",
            cursor: "pointer",
            backdropFilter: "blur(8px)",
          }}
        >
          {paused ? "▶ Play" : "⏸ Pause"}
        </button>
      </div>
    </div>
  );
}
