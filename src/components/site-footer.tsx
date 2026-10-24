import Link from "next/link";

import { getPublicContent } from "@/lib/data/public";

// Fallback used only if Supabase has no published social_links rows yet.
const SOCIAL_LINKS = [
  { label: "Spotify", href: "https://open.spotify.com/artist/66omcxaARiacfGoXuXiHXQ?si=pIX56tJYRWOAl2F6_6wt-Q" },
  { label: "Apple Music", href: "https://music.apple.com/gb/artist/ewura-abena/994868905" },
  { label: "Audiomack", href: "https://audiomack.com/ewuraabenamusiq" },
  { label: "Boomplay", href: "https://www.boomplay.com/share/artist/2829036" },
  { label: "YouTube", href: "https://www.youtube.com/playlist?list=PLX0PJMHFz9wbcpUJ3UpjsZLqbcsdrQZuc" },
  { label: "Instagram", href: "https://www.instagram.com/ewuraabenamusiq" },
  { label: "Facebook", href: "https://www.facebook.com/EwuraAbenaOfficial" },
  { label: "TikTok", href: "https://www.tiktok.com/@ewuraabenamusiq" },
];

const NAV_COLUMNS = [
  {
    title: "Ministry",
    links: [
      { label: "About", href: "/about" },
      { label: "Music", href: "/music" },
      { label: "Photo Gallery", href: "/gallery" },
      { label: "Playlists", href: "/playlists" },
      { label: "Events", href: "/events" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Book Ministry", href: "/contact" },
      { label: "Fan Hub", href: "/fan" },
      { label: "Music Player", href: "/player" },
      { label: "Join Fan Hub", href: "/auth/sign-up" },
    ],
  },
];

const YEAR = new Date().getFullYear();

export async function SiteFooter() {
  const year = YEAR;
  const { socialLinks: dbSocialLinks } = await getPublicContent();
  const socialLinks =
    dbSocialLinks.length > 0
      ? dbSocialLinks.map((link) => ({ label: link.platform, href: link.url }))
      : SOCIAL_LINKS;

  return (
    <footer className="site-footer">
      {/* Kente strip — ties the footer to the heritage identity rather
          than a flat gold line */}
      <div className="brand-divider" aria-hidden="true" />

      {/* ── CTA Banner ── */}
      <div
        style={{
          borderBottom: "1px solid rgba(157,23,77,0.18)",
          padding: "4rem 0",
          background: "rgba(157,23,77,0.04)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle pink glow */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 50% 100%, rgba(157,23,77,0.18) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <p
            style={{
              fontFamily: "var(--font-body), sans-serif",
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.36em",
              textTransform: "uppercase",
              color: "var(--champagne-gold)",
              marginBottom: "1.25rem",
            }}
          >
            Book Ministry
          </p>
          <h3
            style={{
              fontFamily: "var(--font-heading), serif",
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              fontWeight: 300,
              color: "var(--ivory)",
              margin: "0 auto 1.25rem",
              maxWidth: "640px",
              lineHeight: 1.2,
              letterSpacing: "0.01em",
            }}
          >
            Invite Ewura Abena to Minister at Your Event
          </h3>
          <p
            style={{
              fontFamily: "var(--font-body), sans-serif",
              fontSize: "0.97rem",
              color: "rgba(255,251,252,0.85)",
              maxWidth: "480px",
              margin: "0 auto 2rem",
              lineHeight: 1.75,
            }}
          >
            For conferences, crusades, worship concerts, and media appearances.
          </p>
          <Link href="/contact" className="btn-primary">
            Submit Booking Inquiry
          </Link>
        </div>
      </div>

      {/* ── Main Footer Grid ── */}
      <div className="container footer-grid" style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>

        {/* Brand column */}
        <div>
          <Link href="/" style={{ display: "block", marginBottom: "1.25rem", textDecoration: "none" }}>
            <span
              style={{
                fontFamily: "var(--font-heading), serif",
                fontSize: "2.1rem",
                fontWeight: 300,
                color: "var(--ivory)",
                letterSpacing: "0.03em",
                lineHeight: 1.05,
                display: "block",
              }}
            >
              Ewura Abena
            </span>
            <span
              style={{
                fontFamily: "var(--font-body), sans-serif",
                fontSize: "0.58rem",
                letterSpacing: "0.38em",
                textTransform: "uppercase",
                color: "var(--champagne-gold)",
                fontWeight: 700,
                marginTop: "0.25rem",
                display: "block",
              }}
            >
              Warrior Queen
            </span>
          </Link>

          <p
            style={{
              fontFamily: "var(--font-body), sans-serif",
              fontSize: "0.9rem",
              color: "rgba(255,251,252,0.82)",
              lineHeight: 1.8,
              maxWidth: "300px",
              marginBottom: "2rem",
            }}
          >
            Global Gospel Minister · Singer · Composer · Songwriter · DOVVSU Ambassador.
            <br /><br />
            A voice of light, love, healing, and unwavering faith.
          </p>

          {/* Contact info */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.6rem",
              marginBottom: "2rem",
              fontSize: "0.87rem",
            }}
          >
            {[
              { href: "tel:+447921459335", label: "📞 +447921 459335 (UK)" },
              { href: "tel:+233540993540", label: "📞 +233540993540 (GH)" },
              { href: "mailto:nustylerecordz@gmail.com", label: "✉ nustylerecordz@gmail.com" },
            ].map((c) => (
              <a
                key={c.href}
                href={c.href}
                style={{ color: "rgba(255,251,252,0.85)", textDecoration: "none", transition: "color 0.2s" }}
                className="footer-contact-link"
              >
                {c.label}
              </a>
            ))}
          </div>

          {/* Social links */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="footer-social-pill"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Nav columns */}
        {NAV_COLUMNS.map((col) => (
          <div key={col.title}>
            <h4
              style={{
                fontFamily: "var(--font-body), sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "var(--champagne-gold)",
                fontWeight: 700,
                margin: "0 0 1.5rem",
              }}
            >
              {col.title}
            </h4>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
              {col.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="footer-nav-link"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        ))}
      </div>

      {/* ── Bottom Bar ── */}
      <div style={{ borderTop: "1px solid rgba(157,23,77,0.15)" }}>
        <div
          className="container"
          style={{
            paddingTop: "1.75rem",
            paddingBottom: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <p
              suppressHydrationWarning
              style={{
                fontFamily: "var(--font-body), sans-serif",
                fontSize: "0.78rem",
                color: "rgba(255,251,252,0.78)",
                margin: 0,
              }}
            >
              © {year} Ewura Abena. All rights reserved.
            </p>
            <Link
              href="/admin"
              style={{
                fontFamily: "var(--font-body), sans-serif",
                fontSize: "0.7rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,251,252,0.75)",
                textDecoration: "none",
                borderLeft: "1px solid rgba(255,251,252,0.2)",
                paddingLeft: "1.25rem",
              }}
              className="footer-contact-link"
            >
              Admin
            </Link>
          </div>
          <p
            style={{
              fontFamily: "var(--font-heading), serif",
              fontSize: "0.8rem",
              fontStyle: "italic",
              color: "#FBCFE8",
              margin: 0,
              letterSpacing: "0.04em",
            }}
          >
            His glory will be seen.
          </p>
        </div>
      </div>

    </footer>
  );
}
