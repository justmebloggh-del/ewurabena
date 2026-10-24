'use client';

import { useEffect } from 'react';

// Surfaces that get the moving "specular" highlight of the liquid-glass look.
const GLASS_SELECTOR =
  '.card, .track-card, .ministry-card, .testimonial-card, .fh-card, .card-dark, .card-green, .hero-streaming-card, .fh-song, .btn-gold, .btn-ghost, .platform-badge, .fh-tabs, .fh-switch';

/**
 * Makes glass panels catch the light: while a mouse hovers a panel, its
 * highlight follows the pointer (via --gx/--gy, read by the CSS). Touch
 * devices have no hover, so they get the resting highlight and this stays idle.
 */
export function GlassInit() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    let lastTarget: HTMLElement | null = null;

    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const target = (event.target as Element | null)?.closest<HTMLElement>(GLASS_SELECTOR) ?? null;
        if (lastTarget && lastTarget !== target) {
          lastTarget.style.removeProperty('--gx');
          lastTarget.style.removeProperty('--gy');
        }
        lastTarget = target;
        if (!target) return;
        const rect = target.getBoundingClientRect();
        target.style.setProperty('--gx', `${(((event.clientX - rect.left) / rect.width) * 100).toFixed(1)}%`);
        target.style.setProperty('--gy', `${(((event.clientY - rect.top) / rect.height) * 100).toFixed(1)}%`);
      });
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('pointermove', onMove);
    };
  }, []);

  return null;
}
