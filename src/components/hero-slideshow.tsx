"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const INTERVAL_MS = 5000;

// Local files and Supabase storage are allowed by next.config remotePatterns,
// so Next can resize them; anything else is served as-is.
function canOptimize(src: string) {
  return src.startsWith("/") || /^https:\/\/[^/]+\.supabase\.(co|com)\/storage\/v1\/object\/public\//.test(src);
}

export function HeroSlideshow({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || images.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), INTERVAL_MS);
    return () => clearInterval(id);
  }, [paused, images.length]);

  return (
    <div
      className="hero-slideshow"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Ewura Abena photo slideshow"
    >
      {images.map((src, i) => {
        const active = i === index;
        // Only mount the current and neighbouring slides to avoid loading every photo up front.
        const near = i === index || i === (index + 1) % images.length;
        return (
          <div key={src} className={`hero-slide${active ? " is-active" : ""}`} aria-hidden={!active}>
            {near && (
              <Image
                src={src}
                alt={active ? "Ewura Abena" : ""}
                fill
                priority={i === 0}
                sizes="(max-width: 900px) 100vw, 50vw"
                className="hero-slide-img"
                unoptimized={!canOptimize(src)}
              />
            )}
          </div>
        );
      })}
      <div className="hero-slide-dots" role="tablist">
        {images.slice(0, 8).map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === index % 8}
            aria-label={`Show photo ${i + 1}`}
            className={`hero-slide-dot${i === index % 8 ? " is-active" : ""}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
