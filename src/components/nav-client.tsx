'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/music', label: 'Music' },
  { href: '/albums', label: 'Albums' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Booking' },
];

interface NavClientProps {
  isAuthenticated: boolean;
}

export function NavClient({ isAuthenticated }: NavClientProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 72);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
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
      <header className={`premium-nav ${scrolled ? 'nav-scrolled' : ''}`} role="banner">
        <div className="nav-inner container">

          {/* ── Logo: white on hero → gold on scroll ── */}
          <Link href="/" className="nav-logo-link" aria-label="Ewura Abena — Home" onClick={() => setMenuOpen(false)}>
            <div className="logo-wrap">
              <Image src="/ewuraabenalogo.png" alt="Ewura Abena" width={1536} height={1024} style={{ width: "130px", height: "auto" }} className="logo-white" priority />
              <Image src="/ewuraabenalogo.png" alt="" aria-hidden="true" width={1536} height={1024} style={{ width: "130px", height: "auto" }} className="logo-gold" priority />
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
