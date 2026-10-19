'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function ScrollRevealInit() {
  const pathname = usePathname();

  // Re-runs on every route change (pathname dependency), not just once on
  // first mount. This component lives in the root layout, which Next.js
  // does NOT remount on client-side navigation — only {children} swaps.
  // With an empty dependency array, this observer only ever saw whichever
  // .reveal elements existed on the very first page load of the session;
  // every page reached afterward via a <Link> (not a hard refresh) got
  // .reveal elements nothing was watching, permanently stuck at
  // opacity: 0 while still occupying their full layout height — exactly
  // the "empty space" bug reported on /about.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      // Positive bottom rootMargin (was -50px, which shrinks the detection
      // zone and makes reveals trigger LATE — only once an element is
      // already well into view) now extends detection 200px past the
      // actual viewport, so elements start fading in while still
      // approaching the fold. Combined with up to ~1.2s total animation
      // time (0.75s transition + up to 0.48s stagger delay on
      // .reveal-delay-4), the old late trigger meant a normally-scrolling
      // visitor could plausibly reach content while it was still
      // mid-fade-in — confirmed via headless measurement showing opacity
      // as low as 0.03 on sections reached via a real (not instant) scroll.
      { threshold: 0.08, rootMargin: '0px 0px 200px 0px' }
    );

    const elements = document.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-delay-1, .reveal-delay-2, .reveal-delay-3, .reveal-delay-4'
    );
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
