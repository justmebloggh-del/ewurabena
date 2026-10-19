'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/music', label: 'Music' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/events', label: 'Events' },
  { href: '/contact', label: 'Booking' },
];

interface NavClientProps {
  isAuthenticated: boolean;
}

export function NavClient({ isAuthenticated }: NavClientProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 72);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Logo flashes gold for as long as the page is actively being scrolled
  // (either direction), reverting once scrolling pauses. Debounced on a
  // timer reset per scroll event, since there's no native "scroll end"
  // event with broad-enough browser support to rely on here.
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      setIsScrolling(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setIsScrolling(false), 220);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <header className={`premium-nav ${scrolled ? 'nav-scrolled' : ''} ${isScrolling ? 'is-scroll-active' : ''}`} role="banner">
        <div className="nav-inner container">

          {/* ── Logo v2: user-supplied full-color badge artwork (treble
                 clef + "Ewura Abena" wordmark on its own dark backdrop).
                 Shown as a single image — no color-cycling/cross-fade
                 needed since it carries its own fixed colors and
                 background. Shine sweep + gold-pulse glow on scroll are
                 layered on top as overlays, not recolors. */}
          <Link href="/" className="nav-logo-link" aria-label="Ewura Abena — Home" onClick={() => setMenuOpen(false)}>
            <div className="logo-wrap">
              <Image src="/ewuraabenalogo.png" alt="Ewura Abena" width={124} height={68} className="logo-badge-img" priority />
              <span className="logo-shine" aria-hidden="true" />
              <span className="logo-glow-halo" aria-hidden="true" />
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="nav-desktop" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className="nav-item">{item.label}</Link>
            ))}
          </nav>

          {/* ── Desktop Auth ── */}
          <div className="nav-auth-desktop">
            {isAuthenticated ? (
              <>
                <Link href="/fan" className="nav-btn-ghost">Fan Hub</Link>
                <Link href="/admin" className="nav-btn-gold">Admin</Link>
              </>
            ) : (
              <>
                <Link href="/auth/sign-in" className="nav-btn-ghost">Sign In</Link>
                <Link href="/contact" className="nav-btn-gold">Book Ministry</Link>
              </>
            )}
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            className={`hamburger ${menuOpen ? 'is-open' : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* ── Mobile Full-Screen Overlay ── */}
      <div ref={menuRef} className={`mobile-overlay ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <div className="mobile-overlay-inner">
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {NAV_ITEMS.map((item, i) => (
              <Link
                key={item.href} href={item.href}
                className="mobile-nav-item"
                style={{ animationDelay: menuOpen ? `${i * 0.07 + 0.1}s` : '0s' }}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mobile-ctas">
            {isAuthenticated ? (
              <>
                <Link href="/fan" className="mobile-cta-btn" onClick={() => setMenuOpen(false)}>Fan Hub</Link>
                <Link href="/admin" className="mobile-cta-btn mobile-cta-gold" onClick={() => setMenuOpen(false)}>Admin</Link>
              </>
            ) : (
              <>
                <Link href="/auth/sign-in" className="mobile-cta-btn" onClick={() => setMenuOpen(false)}>Sign In</Link>
                <Link href="/contact" className="mobile-cta-btn mobile-cta-gold" onClick={() => setMenuOpen(false)}>Book Ministry</Link>
              </>
            )}
          </div>

          <div className="mobile-ministry-tag">
            <span>Global Gospel Minister</span>
            <span className="mobile-dot">✦</span>
            <span>Warrior Queen</span>
          </div>
        </div>
      </div>

    </>
  );
}
