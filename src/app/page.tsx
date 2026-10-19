import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { EwuraAbenaTV } from "@/components/ewura-abena-tv";
import { FavoriteButton } from "@/components/favorite-button";
import { PlatformEmbedPlayer } from "@/components/platform-embed-player";
import { PrayerRequestForm } from "@/components/prayer-request-form";
import { TrackAudio, TrackVideo } from "@/components/track-audio";
import { WatchOnTvBadge } from "@/components/watch-on-tv-badge";
import { getPublicContent } from "@/lib/data/public";
import { buildTVChannel, trackHasTvVideo } from "@/lib/tv-channel";

/* ── Streaming platforms opened in-app ── */
const IN_APP_PLATFORMS = new Set(["spotify", "boomplay", "apple music", "audiomac", "audiomack"]);

const PLATFORM_ICONS: Record<string, string> = {
  spotify: "♫",
  "apple music": "♪",
  boomplay: "▶",
  audiomack: "◈",
  facebook: "f",
  instagram: "◉",
  tiktok: "♪",
  youtube: "▷",
};

const TESTIMONIALS = [
  {
    quote: "Her voice carries such anointing. Every time she ministers, the atmosphere shifts and people are healed and set free.",
    author: "Apostle K. Mensah",
    location: "Ghana",
    stars: 5,
  },
  {
    quote: "Ewura Abena's worship is not performance — it is a genuine encounter with God. The Warrior Queen truly carries the fire.",
    author: "Pastor M. Osei",
    location: "United Kingdom",
    stars: 5,
  },
  {
    quote: "When she sang 'This Far,' I wept. The Holy Spirit moved so powerfully. This woman's songs carry real healing.",
    author: "Minister A. Johnson",
    location: "United States",
    stars: 5,
  },
];

const MINISTRY_PILLARS = [
  {
    icon: "🎵",
    title: "Soul Gospel Music",
    desc: "Original compositions that hit the soul from the first note — crafted to ignite faith, worship, and transformation.",
  },
  {
    icon: "🌍",
    title: "Global Ministry",
    desc: "Ministering across continents, carrying the gospel message of healing, hope, and restoration to every nation.",
  },
  {
    icon: "⚔️",
    title: "Warrior Queen",
    desc: "A bold, grace-filled anointing that breaks chains, restores hope, and draws hearts back to God's presence.",
  },
  {
    icon: "🕊️",
    title: "DOVVSU Ambassador",
    desc: "Using music and ministry as a platform to advocate for dignity, safety, and restoration for the vulnerable.",
  },
];

const FACTS = [
  { number: "2+", label: "Albums" },
  { number: "5+", label: "Awards" },
  { number: "15+", label: "Nations" },
  { number: "∞", label: "Lives Touched" },
];

export default async function HomePage() {
  const content = await getPublicContent();

  const tickerItems = [
    "Global Gospel Minister",
    "Soul Gospel Singer",
    "Composer & Songwriter",
    "Worship Leader",
    "DOVVSU Ambassador",
    "Warrior Queen",
    "Voice of Healing",
    "Voice of Light",
  ];

  const featuredTrack = content.tracks?.[0];
  const heroBio = content.profile.bio?.slice(0, 220) + "…" || "A vessel of God's glory — ministering healing, worship, and grace to the nations.";

  return (
    <>
      {/* ══════════════════════════════════════════════════════
          HERO — Cinematic Fullscreen, White & Gold
          ══════════════════════════════════════════════════════ */}
      <section className="hero" aria-label="Ewura Abena Hero">

        {/* Fullscreen background image */}
        <div className="hero-portrait-bg" aria-hidden="true">
          <Image
            src={content.profile.hero_image_url || "/ea3.jpg"}
            alt=""
            fill
            priority
            sizes="100vw"

            className="hero-portrait-bg-img"
            unoptimized={Boolean(content.profile.hero_image_url && !content.profile.hero_image_url.startsWith("/"))}
          />
          <div className="hero-portrait-overlay" />
        </div>

        {/* Atmospheric effects */}
        <div className="hero-light-rays" aria-hidden="true" />
        <div className="hero-particles" aria-hidden="true" />

        {/* Content grid */}
        <div className="hero-inner">

          {/* ── Left: Copy ── */}
          <div>
            <span className="hero-eyebrow">Voice of Healing · Warrior Queen · Global Ministry</span>

            <h1 className="hero-name text-hero-shimmer">
              {content.profile.stage_name || "Ewura Abena"}
            </h1>

            <p className="hero-role">
              Global Gospel Minister&nbsp;·&nbsp;Worship Leader&nbsp;·&nbsp;DOVVSU Ambassador
            </p>

            <blockquote className="hero-verse">
              &ldquo;Worship that heals — royal, graceful, and faithful.
              The nations are my pulpit, and every song a prayer.&rdquo;
            </blockquote>

            {/* CTAs */}
            <div className="hero-ctas">
              <Link href="/music" className="btn-primary btn-hero">
                ▶&nbsp; Listen Now
              </Link>
              <Link href="/gallery" className="btn-ghost btn-hero">
                ◈&nbsp; Watch Ministry
              </Link>
              <Link href="/contact" className="btn-hero btn-hero-solid">
                ✦&nbsp; Book Ministry
              </Link>
            </div>

            {/* Latest release preview */}
            {featuredTrack && (
              <div className="hero-streaming">
                <div className="hero-streaming-card">
                  <div className="hero-release">
                    <Image
                      src={(featuredTrack as { artwork_url?: string }).artwork_url || "/ea.jpg"}
                      alt={`${featuredTrack.title} artwork`}
                      width={72}
                      height={72}
                      className="hero-release-art"

                      unoptimized={Boolean((featuredTrack as { artwork_url?: string }).artwork_url)}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span className="hero-release-label">Latest Release</span>
                      <span className="hero-release-title">{featuredTrack.title}</span>
                      <div className="hero-release-actions">
                        <Link href="/music" className="btn-primary btn-stream-play">
                          ▶ Play
                        </Link>
                        <div className="hero-platform-row">
                          {["Spotify", "Apple Music", "Boomplay"].map((p) => (
                            <span key={p} className="hero-platform-pill">{p}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Portrait ── */}
          <div className="hero-portrait-figure">
            <Image
              src={content.profile.hero_image_url || "/ea3.jpg"}
              alt="Ewura Abena"
              width={600}
              height={680}
              priority
              sizes="(max-width: 900px) 100vw, 50vw"

              className="hero-portrait-img"
              unoptimized={Boolean(content.profile.hero_image_url && !content.profile.hero_image_url.startsWith("/"))}
            />
            <div className="hero-portrait-glow" aria-hidden="true" />
            <div className="hero-portrait-badge" aria-hidden="true">
              <span className="hero-badge-number">15+</span>
              <span className="hero-badge-label">Nations Reached</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll" aria-hidden="true">
          <div className="scroll-line" />
          <span>Scroll</span>
        </div>
      </section>


      <div className="brand-divider" aria-hidden="true" />

      {/* ══════════════════════════════════════════════════════
          TICKER — Ministry identity strip
          ══════════════════════════════════════════════════════ */}
      <div className="ticker-strip" aria-hidden="true">
        <div className="ticker-inner">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="ticker-item">
              {item}
              <span className="ticker-dot" />
            </span>
          ))}
        </div>
      </div>


      {/* ══════════════════════════════════════════════════════
          MINISTRY PILLARS
          ══════════════════════════════════════════════════════ */}
      <section className="section-cream" aria-label="Ministry pillars">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }} className="reveal" suppressHydrationWarning>
            <p className="gold-label" style={{ marginBottom: "0.75rem" }}>The Calling</p>
            <h2 className="section-title-dark" style={{ fontSize: "clamp(2rem,4vw,2.8rem)" }}>
              Ministry &amp; Purpose
            </h2>
            <p className="section-subtitle-dark" style={{ margin: "0.9rem auto 0", textAlign: "center" }}>
              Touching nations through worship, healing, and the power of the gospel.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {MINISTRY_PILLARS.map((pillar, i) => (
              <div
                key={pillar.title}
                className={`ministry-card reveal reveal-delay-${i + 1}`}
                suppressHydrationWarning
              >
                <span className="ministry-icon">{pillar.icon}</span>
                <h3
                  style={{
                    fontFamily: "var(--font-heading), serif",
                    fontSize: "1.45rem",
                    fontWeight: 400,
                    color: "var(--text-dark)",
                    marginBottom: "0.85rem",
                  }}
                >
                  {pillar.title}
                </h3>
                <p style={{ fontSize: "0.92rem", color: "#5E4050", lineHeight: 1.75 }}>
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          ABOUT / STORY SPLIT
          ══════════════════════════════════════════════════════ */}
      <section className="section-light" aria-label="About Ewura Abena">
        <div className="container">
          <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>

            {/* Portrait */}
            <div className="reveal-left" style={{ position: "relative" }} suppressHydrationWarning>
              <Image
                src={content.profile.hero_image_url || "/ea.jpg"}
                alt="Ewura Abena portrait"
                width={600}
                height={540}
                sizes="(max-width: 900px) 100vw, 50vw"
    
                style={{
                  width: "100%",
                  height: "540px",
                  objectFit: "cover",
                  objectPosition: "center top",
                  borderRadius: "2rem",
                  boxShadow: "0 40px 100px rgba(0,0,0,0.14)",
                  border: "1px solid rgba(157,23,77,0.22)",
                  display: "block",
                }}
                unoptimized={Boolean(content.profile.hero_image_url && !content.profile.hero_image_url.startsWith("/"))}
              />
              {/* Gold border accent */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: "1.5rem",
                  left: "-1.5rem",
                  right: "1.5rem",
                  bottom: "-1.5rem",
                  borderRadius: "2.25rem",
                  border: "1px solid rgba(157,23,77,0.28)",
                  zIndex: -1,
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* Copy */}
            <div className="reveal-right" suppressHydrationWarning>
              <p className="gold-label" style={{ marginBottom: "0.75rem" }}>The Story</p>
              <h2 className="section-title-dark" style={{ fontSize: "clamp(2rem,4vw,2.8rem)", marginBottom: "1.5rem" }}>
                The Warrior Queen
              </h2>
              <p style={{ fontSize: "1rem", color: "#5E4050", lineHeight: 1.85, marginBottom: "2.5rem" }}>
                {content.profile.bio || heroBio}
              </p>

              {/* Stat bar */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "0",
                  background: "linear-gradient(160deg, var(--kente-green) 0%, var(--kente-deep) 100%)",
                  borderRadius: "1.25rem",
                  overflow: "hidden",
                  marginBottom: "2.5rem",
                  border: "1px solid rgba(157,23,77,0.28)",
                  boxShadow: "0 12px 40px rgba(157,23,77,0.14)",
                }}
              >
                {FACTS.map((fact, i) => (
                  <div
                    key={fact.label}
                    style={{
                      textAlign: "center",
                      padding: "1.5rem 0.75rem",
                      borderRight: i < FACTS.length - 1 ? "1px solid rgba(157,23,77,0.14)" : "none",
                    }}
                  >
                    <span className="stat-number">{fact.number}</span>
                    <span className="stat-label">{fact.label}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <Link href="/about" className="btn-gold">
                  Read Her Story
                </Link>
                <Link href="/contact" className="btn-primary">
                  Book Ministry
                </Link>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .about-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
          }
        `}</style>
      </section>


      {/* ══════════════════════════════════════════════════════
          SCRIPTURE / QUOTE GOLD STRIP
          ══════════════════════════════════════════════════════ */}
      <section
        style={{
          background: "linear-gradient(135deg, var(--kente-deep) 0%, var(--kente-green) 40%, var(--kente-deep) 100%)",
          padding: "5rem 0",
          position: "relative",
          overflow: "hidden",
          borderTop: "1px solid rgba(157,23,77,0.22)",
          borderBottom: "1px solid rgba(157,23,77,0.22)",
        }}
        aria-label="Scripture"
      >
        {/* Gold glow orbs */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-40%",
            left: "25%",
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, rgba(157,23,77,0.30) 0%, rgba(244,114,182,0.12) 50%, transparent 70%)",
            filter: "blur(60px)",
            animation: "orb-drift 12s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />
        <div className="container" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <div className="reveal" suppressHydrationWarning>
            <p className="gold-label" style={{ marginBottom: "1.75rem", color: "var(--champagne-gold)" }}>
              Word of Faith
            </p>
            <blockquote
              style={{
                fontFamily: "var(--font-heading), serif",
                fontSize: "clamp(1.45rem, 3.5vw, 2.3rem)",
                fontWeight: 300,
                fontStyle: "italic",
                color: "var(--ivory)",
                maxWidth: "800px",
                margin: "0 auto 1.75rem",
                lineHeight: 1.55,
                letterSpacing: "0.01em",
              }}
            >
              &ldquo;My spirit is willing. My mind is receptive.
              My heart is prepared. God is in my story.
              His glory will be seen.&rdquo;
            </blockquote>
            <p
              style={{
                fontFamily: "var(--font-body), sans-serif",
                fontSize: "0.72rem",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "var(--royal-gold)",
                fontWeight: 700,
              }}
            >
              — {content.profile.stage_name || "Ewura Abena"}
            </p>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          FEATURED MUSIC
          ══════════════════════════════════════════════════════ */}
      <section className="section-pearl" aria-label="Featured music">
        <div className="container">
          <div style={{ marginBottom: "3.5rem" }} className="reveal" suppressHydrationWarning>
            <p className="gold-label" style={{ marginBottom: "0.75rem" }}>Discography</p>
            <h2 className="section-title-dark" style={{ fontSize: "clamp(2rem,4vw,2.8rem)" }}>
              Featured Music
            </h2>
            <p className="section-subtitle-dark">
              Soul gospel crafted to ignite faith — available on all major platforms.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gap: "1.5rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            }}
          >
            {content.tracks.slice(0, 4).map((track, idx) => (
              <article
                key={track.id}
                className={`track-card reveal reveal-delay-${Math.min(idx + 1, 4)}`}
                suppressHydrationWarning
              >
                {/* Track header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1rem",
                    marginBottom: "1.25rem",
                  }}
                >
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, var(--royal-gold), var(--deep-gold))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontSize: "1.4rem",
                      boxShadow: "0 8px 24px rgba(157,23,77,0.30)",
                    }}
                  >
                    🎵
                  </div>
                  <div>
                    <span
                      style={{
                        fontFamily: "var(--font-body), sans-serif",
                        fontSize: "0.62rem",
                        letterSpacing: "0.28em",
                        textTransform: "uppercase",
                        color: "var(--royal-gold)",
                        fontWeight: 700,
                        display: "block",
                        marginBottom: "0.3rem",
                      }}
                    >
                      Track {track.track_number || idx + 1}
                    </span>
                    <h3
                      style={{
                        fontFamily: "var(--font-heading), serif",
                        fontSize: "1.35rem",
                        fontWeight: 400,
                        color: "var(--text-dark)",
                        margin: 0,
                        lineHeight: 1.25,
                      }}
                    >
                      {track.title}
                    </h3>
                  </div>
                </div>

                {/* Embedded player */}
                {track.video_url ? (
                  <TrackVideo
                    trackId={track.id}
                    src={track.video_url}
                    style={{ height: "9rem", objectFit: "cover", marginBottom: "1rem", border: "1px solid rgba(157,23,77,0.22)" }}
                  />
                ) : track.audio_url ? (
                  <TrackAudio
                    trackId={track.id}
                    src={track.audio_url}
                    style={{
                      width: "100%",
                      marginBottom: "1rem",
                      accentColor: "var(--royal-gold)",
                    }}
                  />
                ) : null}

                {/* Platform links */}
                <div style={{ marginBottom: "1rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  <WatchOnTvBadge trackId={track.id} hasVideo={trackHasTvVideo(track)} />
                  <PlatformEmbedPlayer
                    trackTitle={track.title}
                    spotify_url={track.spotify_url}
                    apple_music_url={track.apple_music_url}
                    audiomack_url={track.audiomack_url}
                    boomplay_url={track.boomplay_url}
                    facebook_url={track.facebook_url}
                  />
                </div>

                <FavoriteButton trackId={track.id} theme="light" />
              </article>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "3.5rem" }} className="reveal" suppressHydrationWarning>
            <Link href="/music" className="btn-primary" style={{ marginRight: "1rem" }}>
              Full Discography
            </Link>
            <Link href="/playlists" className="btn-gold">
              Official Playlists
            </Link>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          VIDEO / LIVE MINISTRY
          ══════════════════════════════════════════════════════ */}
      <section className="section-cream" aria-label="Videos and live ministry">
          <div className="container">
            <div style={{ marginBottom: "3.5rem" }} className="reveal" suppressHydrationWarning>
              <p className="gold-label" style={{ marginBottom: "0.75rem" }}>Visual Ministry</p>
              <h2 className="section-title-dark" style={{ fontSize: "clamp(2rem,4vw,2.8rem)" }}>
                Live Ministrations &amp; Videos
              </h2>
              <p className="section-subtitle-dark">
                Watch Ewura Abena carry God&apos;s presence across nations.
              </p>
            </div>

            <div id="ewura-abena-tv" className="reveal" style={{ marginBottom: "3rem", scrollMarginTop: "6rem" }} suppressHydrationWarning>
              <Suspense fallback={null}>
                <EwuraAbenaTV videos={buildTVChannel(content)} />
              </Suspense>
            </div>

            <div style={{ textAlign: "center" }} className="reveal" suppressHydrationWarning>
              <a
                href="https://www.youtube.com/playlist?list=PLX0PJMHFz9wbcpUJ3UpjsZLqbcsdrQZuc"
                target="_blank"
                rel="noreferrer"
                className="btn-gold"
                style={{ marginRight: "1rem" }}
              >
                Full Video Library on YouTube ↗
              </a>
              <Link href="/gallery" className="btn-gold">View Photo Gallery</Link>
            </div>
          </div>
        </section>


      {/* ══════════════════════════════════════════════════════
          TESTIMONIALS
          ══════════════════════════════════════════════════════ */}
      <section
        style={{
          background: "var(--ivory)",
          padding: "6rem 0",
          position: "relative",
          overflow: "hidden",
        }}
        aria-label="Testimonials"
      >
        {/* Subtle gold background glow */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 50% 50%, rgba(157,23,77,0.10) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }} className="reveal" suppressHydrationWarning>
            <p className="gold-label" style={{ marginBottom: "0.75rem" }}>Testimonies</p>
            <h2 className="section-title-dark" style={{ fontSize: "clamp(2rem,4vw,2.8rem)" }}>
              Lives Transformed
            </h2>
            <p className="section-subtitle-dark" style={{ margin: "0.9rem auto 0", textAlign: "center" }}>
              Real encounters with God through her music and ministry.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.author}
                className={`testimonial-card reveal reveal-delay-${i + 1}`}
              >
                {/* Stars */}
                <div style={{ marginBottom: "1rem", display: "flex", gap: "3px" }}>
                  {Array.from({ length: t.stars }).map((_, si) => (
                    <span key={si} style={{ color: "var(--royal-gold)", fontSize: "0.9rem" }}>★</span>
                  ))}
                </div>
                {/* Quote mark */}
                <p
                  style={{
                    fontFamily: "var(--font-heading), serif",
                    fontSize: "3rem",
                    color: "var(--royal-gold)",
                    lineHeight: 0.8,
                    marginBottom: "1.1rem",
                    opacity: 0.7,
                  }}
                >
                  &ldquo;
                </p>
                <p className="testimonial-quote">{t.quote}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "1px",
                      background: "var(--royal-gold)",
                      opacity: 0.5,
                    }}
                  />
                  <div>
                    <p className="testimonial-author">{t.author}</p>
                    <p
                      style={{
                        fontFamily: "var(--font-body), sans-serif",
                        fontSize: "0.7rem",
                        color: "var(--text-dark-muted)", // was #A8809A — only 3.38:1 on white, fails WCAG AA
                        marginTop: "0.15rem",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {t.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          AWARDS — Deep dark cinematic section
          ══════════════════════════════════════════════════════ */}
      {content.awards.length > 0 && (
        <section className="section-deep" aria-label="Awards and recognition">
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }} className="reveal" suppressHydrationWarning>
              <p className="gold-label" style={{ marginBottom: "0.75rem", color: "var(--champagne-gold)" }}>
                Recognition
              </p>
              <h2 className="section-title" style={{ fontSize: "clamp(2rem,4vw,2.8rem)" }}>
                Awards &amp; Nominations
              </h2>
              <p className="section-subtitle" style={{ margin: "0.9rem auto 0", textAlign: "center" }}>
                Excellence recognized across nations.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gap: "1.25rem",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              }}
            >
              {content.awards.map((award, i) => (
                <div
                  key={award.id}
                  className={`card-dark reveal reveal-delay-${Math.min(i + 1, 4)}`}
                  suppressHydrationWarning
                  style={{ borderLeft: "3px solid var(--royal-gold)", paddingLeft: "1.75rem" }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--font-heading), serif",
                      fontSize: "1.35rem",
                      fontWeight: 400,
                      color: "var(--champagne-gold)",
                      margin: "0 0 0.75rem",
                    }}
                  >
                    {award.title}
                  </h3>
                  <p style={{ fontSize: "0.9rem", color: "rgba(255,251,252,0.62)", lineHeight: 1.72, margin: 0 }}>
                    {award.description}
                  </p>
                  {award.awarded_on && (
                    <p
                      style={{
                        fontFamily: "var(--font-body), sans-serif",
                        fontSize: "0.68rem",
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        color: "var(--deep-gold)",
                        marginTop: "0.85rem",
                      }}
                    >
                      {new Date(award.awarded_on).getFullYear()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* ══════════════════════════════════════════════════════
          STREAMING & SOCIAL PLATFORMS
          ══════════════════════════════════════════════════════ */}
      <section
        style={{
          background: "linear-gradient(160deg, var(--ivory-warm) 0%, var(--warm-beige) 100%)",
          padding: "6rem 0",
          borderTop: "1px solid rgba(157,23,77,0.18)",
          borderBottom: "1px solid rgba(157,23,77,0.18)",
        }}
        aria-label="Streaming and social platforms"
      >
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }} className="reveal" suppressHydrationWarning>
            <p className="gold-label" style={{ marginBottom: "0.75rem" }}>Stream Everywhere</p>
            <h2 className="section-title-dark" style={{ fontSize: "clamp(2rem,4vw,2.8rem)" }}>
              Find Ewura Abena
            </h2>
            <p className="section-subtitle-dark" style={{ margin: "0.9rem auto 0", textAlign: "center" }}>
              Listen on your favourite platform or follow for updates.
            </p>
          </div>

          <div
            className="reveal"
            suppressHydrationWarning
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.85rem",
              justifyContent: "center",
              marginBottom: "1.5rem",
            }}
          >
            {content.socialLinks.map((link) => {
              const openInApp = IN_APP_PLATFORMS.has(link.platform.trim().toLowerCase());
              const icon = PLATFORM_ICONS[link.platform.trim().toLowerCase()];
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target={openInApp ? undefined : "_blank"}
                  rel={openInApp ? undefined : "noreferrer"}
                  className="platform-badge"
                >
                  {icon && <span style={{ fontSize: "1rem" }}>{icon}</span>}
                  {link.platform}
                </a>
              );
            })}
          </div>

          {/* Donation Links */}
          {content.donationLinks.filter((d) => d.is_published).length > 0 && (
            <div style={{ textAlign: "center", marginTop: "4rem" }} className="reveal" suppressHydrationWarning>
              <hr className="gold-divider" style={{ marginBottom: "2.5rem" }} />
              <p className="gold-label" style={{ marginBottom: "1rem" }}>Partner with the Ministry</p>
              <p
                style={{
                  color: "#6B4055",
                  fontSize: "0.97rem",
                  maxWidth: "500px",
                  margin: "0 auto 1.75rem",
                  lineHeight: 1.75,
                }}
              >
                Support the spread of the gospel through giving.
                Every seed sown carries eternal value.
              </p>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                {content.donationLinks
                  .filter((d) => d.is_published)
                  .map((donation) => (
                    <a
                      key={donation.id}
                      href={donation.url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary"
                    >
                      ♡&nbsp; {donation.label}
                    </a>
                  ))}
              </div>
            </div>
          )}
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          PRAYER & BOOKING
          ══════════════════════════════════════════════════════ */}
      <section
        style={{
          background: "var(--ivory)",
          padding: "6rem 0",
        }}
        aria-label="Prayer and booking"
      >
        <div className="container">
          <div
            className="community-grid"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4.5rem", alignItems: "start" }}
          >

            {/* Prayer Form */}
            <div className="reveal-left" suppressHydrationWarning>
              <p className="gold-label" style={{ marginBottom: "0.75rem" }}>Prayer Requests</p>
              <h2
                style={{
                  fontFamily: "var(--font-heading), serif",
                  fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                  fontWeight: 400,
                  color: "var(--text-dark)",
                  marginBottom: "0.85rem",
                }}
              >
                Send Your Prayer Request
              </h2>
              <p style={{ color: "#6B4055", fontSize: "0.97rem", lineHeight: 1.78, marginBottom: "2.25rem" }}>
                Ewura Abena and her team are committed to interceding for you.
                Share your request and receive prayer.
              </p>
              <PrayerRequestForm />
            </div>

            {/* Booking */}
            <div className="reveal-right" suppressHydrationWarning>
              <p className="gold-label" style={{ marginBottom: "0.75rem" }}>Book Ministry</p>
              <h2
                style={{
                  fontFamily: "var(--font-heading), serif",
                  fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                  fontWeight: 400,
                  color: "var(--text-dark)",
                  marginBottom: "0.85rem",
                }}
              >
                Invite Ewura Abena
              </h2>
              <p style={{ color: "#6B4055", fontSize: "0.97rem", lineHeight: 1.78, marginBottom: "2.25rem" }}>
                For ministry invitations, conferences, events, and media appearances,
                reach out to us directly.
              </p>

              {/* Contact card */}
              <div
                style={{
                  background: "linear-gradient(160deg, var(--kente-green) 0%, var(--kente-deep) 100%)",
                  border: "1px solid rgba(157,23,77,0.28)",
                  borderRadius: "1.25rem",
                  padding: "1.75rem",
                  marginBottom: "1.5rem",
                  boxShadow: "0 12px 40px rgba(157,23,77,0.18)",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-body), sans-serif",
                    fontSize: "0.68rem",
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: "var(--champagne-gold)",
                    marginBottom: "1.25rem",
                    fontWeight: 700,
                  }}
                >
                  Contact Information
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  {[
                    { href: "tel:+447921459335", label: "📞 +447921 459335 (UK)" },
                    { href: "tel:+233540993540", label: "📞 +233540993540 (GH)" },
                    { href: "mailto:nustylerecordz@gmail.com", label: "✉ nustylerecordz@gmail.com" },
                    { href: "https://wa.me/447921459335", label: "💬 WhatsApp (UK)" },
                  ].map((c) => (
                    <a
                      key={c.href}
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel={c.href.startsWith("http") ? "noreferrer" : undefined}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                        color: "rgba(255,251,252,0.62)",
                        fontSize: "0.9rem",
                        transition: "color 0.2s",
                        textDecoration: "none",
                      }}
                      className="booking-contact-link"
                    >
                      {c.label}
                    </a>
                  ))}
                </div>
              </div>

              <Link
                href="/contact"
                className="btn-primary"
                style={{ width: "100%", justifyContent: "center", display: "flex" }}
              >
                Submit Booking Inquiry
              </Link>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 800px) {
            .community-grid { grid-template-columns: 1fr !important; gap: 3.5rem !important; }
          }
          .booking-contact-link:hover { color: var(--champagne-gold) !important; }
        `}</style>
      </section>
    </>
  );
}
