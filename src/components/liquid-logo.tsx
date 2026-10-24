'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const FILTER_ID = 'ea-liquid-filter';

// How far (in px) the artwork is pushed around by the "liquid". Gentle at
// rest, a proper splash while the logo is hovered or touched.
const REST_SCALE = 3.5;
const ACTIVE_SCALE = 10;
const FRAME_MS = 1000 / 30; // 30fps is plenty for a slow ripple and kinder to phone batteries

/**
 * The Ewura Abena badge as a living liquid: an SVG turbulence map slowly
 * drifts and ripples the artwork, a pink highlight swims across it, and
 * hovering/touching it makes it splash. Falls back to the plain static logo
 * when the visitor prefers reduced motion or the browser can't run the filter.
 */
export function LiquidLogo() {
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);
  const displacementRef = useRef<SVGFEDisplacementMapElement>(null);
  const activeRef = useRef(false);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const turbulence = turbulenceRef.current;
    const displacement = displacementRef.current;
    if (reduce.matches || !turbulence || !displacement) return;

    setLive(true);
    let raf = 0;
    let last = 0;
    let scale = REST_SCALE;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (document.hidden || now - last < FRAME_MS) return;
      last = now;

      const t = now / 1000;
      const target = activeRef.current ? ACTIVE_SCALE : REST_SCALE + 1.2 * Math.sin(t * 0.9);
      scale += (target - scale) * 0.12;

      turbulence.setAttribute(
        'baseFrequency',
        `${(0.016 + 0.006 * Math.sin(t * 0.45)).toFixed(4)} ${(0.03 + 0.008 * Math.cos(t * 0.37)).toFixed(4)}`
      );
      displacement.setAttribute('scale', scale.toFixed(2));
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="logo-wrap liquid-logo"
      onPointerEnter={() => { activeRef.current = true; }}
      onPointerLeave={() => { activeRef.current = false; }}
      onPointerDown={() => { activeRef.current = true; }}
      onPointerUp={() => { activeRef.current = false; }}
      onPointerCancel={() => { activeRef.current = false; }}
    >
      <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
        <defs>
          <filter id={FILTER_ID} x="-8%" y="-8%" width="116%" height="116%" colorInterpolationFilters="sRGB">
            <feTurbulence ref={turbulenceRef} type="fractalNoise" baseFrequency="0.016 0.03" numOctaves="2" seed="7" result="noise" />
            <feDisplacementMap ref={displacementRef} in="SourceGraphic" in2="noise" scale={REST_SCALE} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <Image
        src="/ewuraabenalogo.png"
        alt="Ewura Abena"
        width={124}
        height={68}
        className="logo-badge-img"
        style={live ? { filter: `url(#${FILTER_ID})` } : undefined}
        priority
      />
      <span className="logo-liquid-glow" aria-hidden="true" />
      <span className="logo-shine" aria-hidden="true" />
      <span className="logo-glow-halo" aria-hidden="true" />
    </div>
  );
}
