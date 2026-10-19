import type { Metadata } from "next";
import Link from "next/link";

import { getPublicContent } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "About | Ewura Abena — Warrior Queen",
  description:
    "The story of Ewura Abena — Global Gospel Minister, Warrior Queen, DOVVSU Ambassador. A voice of light, love, healing, and unwavering faith.",
};

const JOURNEY_MILESTONES = [
  { year: "Early Life", title: "A Voice Ordained", desc: "Born with a gift that transcended ordinary music, Ewura Abena's journey with God began long before the spotlight. She discovered early that her voice was not just her own — it was a vessel for God's message." },
  { year: "Rising", title: "Soul Gospel Identity", desc: "Developing her unique 'Soul Gospel' sound — a genre that merges the raw depth of the soul with the power of the gospel, crafted to hit the heart from the very first note." },
  { year: "International", title: "Global Breakthrough", desc: "Her music crossed borders and continents. Albums like 'Grace Overflow' and 'Rebirth' earned her recognition at major awards including the Ghana Music Awards UK and Vodafone Ghana Music Awards." },
  { year: "Present", title: "The Warrior Queen", desc: "Bold in spirit and graceful in strength. Today, Ewura Abena ministers globally as a worshipper, advocate, and voice of healing — carrying the fire of God wherever she is called." },
];

const MINISTRY_HIGHLIGHTS = [
  { icon: "🌍", title: "Global Influence", desc: "Her present and previous albums have earned her a top position in Ghanaian gospel and on the international scene — UK, USA, Europe, and beyond." },
  { icon: "🎵", title: "Soul Gospel Sound", desc: "As a composer and songwriter, she creates Christ-centred songs that support worship and spiritual growth. Her sound is uniquely hers — and uniquely anointed." },
  { icon: "⚔️", title: "Warrior Queen", desc: "Bold in spirit and graceful in strength. Ewura Abena stands as a warrior intercessor, a voice that fights in the spirit realm through worship." },
  { icon: "🕊️", title: "DOVVSU Ambassador", desc: "DOVVSU — the Domestic Violence and Victim Support Unit of the Ghana Police Service — named Ewura Abena an ambassador. She uses music and ministry to advocate for dignity, safety, and restoration for the vulnerable in society." },
  { icon: "✨", title: "Healing Ministry", desc: "Wherever she goes, testimonies of healing and breakthrough follow. Her voice carries an anointing that touches the soul and transforms lives." },
  { icon: "🙏", title: "Worship Leadership", desc: "As a worship leader, she creates atmospheres where people encounter God — not through performance, but through genuine, spirit-filled adoration." },
];

export default async function AboutPage() {
  const { profile, awards } = await getPublicContent();

  return (
    <>
      {/* ═══ HERO BANNER ═══ */}
      <section
        style={{
          position: "relative",
          background: "linear-gradient(160deg, var(--kente-deep) 0%, var(--kente-green) 60%, var(--kente-deep) 100%)",
          padding: "8rem 0 6rem",
          overflow: "hidden",
          borderBottom: "1px solid rgba(157,23,77,0.22)",
        }}
      >
        {/* Gold atmospheric glows */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 70% 50%, rgba(157,23,77,0.14) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(157,23,77,0.20) 0%, transparent 50%)",
            pointerEvents: "none",
          }}
        />
        <div className="container" style={{ position: "relative", textAlign: "center" }}>
          <p className="gold-label" style={{ marginBottom: "1rem", color: "var(--champagne-gold)" }}>
            The Ministry Journey
          </p>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(3rem, 7vw, 5.5rem)",
              fontWeight: 300,
              color: "var(--ivory)",
              margin: "0 0 1rem",
              lineHeight: 1.1,
              textShadow: "0 4px 40px rgba(157,23,77,0.30)",
            }}
          >
            {profile.stage_name}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(0.85rem, 2vw, 1rem)",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "var(--champagne-gold)",
              margin: "0 0 2rem",
            }}
          >
            Warrior Queen · Global Gospel Minister · DOVVSU Ambassador
          </p>
          <blockquote
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
              fontStyle: "italic",
              color: "rgba(255,251,252,0.80)",
              maxWidth: "650px",
              margin: "0 auto",
              lineHeight: 1.6,
              borderLeft: "2px solid var(--royal-gold)",
              paddingLeft: "1.5rem",
              textAlign: "left",
            }}
          >
            &ldquo;A voice of light, love, healing, and unwavering faith.&rdquo;
          </blockquote>
        </div>
      </section>

      <div className="brand-divider" aria-hidden="true" />

      {/* ═══ PORTRAIT + BIO ═══ */}
      <section className="section-light" style={{ padding: "6rem 0" }}>
        <div className="container">
          <div
            style={{ display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: "5rem", alignItems: "center" }}
            className="bio-grid"
          >
            {/* Portrait */}
            <div style={{ position: "relative" }}>
              <img
                src={profile.hero_image_url || "/ea3.jpg"}
                alt="Ewura Abena portrait"
                style={{
                  width: "100%",
                  height: "600px",
                  objectFit: "cover",
                  objectPosition: "center top",
                  borderRadius: "2rem",
                  display: "block",
                  boxShadow: "0 40px 100px rgba(157,23,77,0.18)",
                  border: "1px solid rgba(157,23,77,0.22)",
                }}
              />
              {/* Gold + kente border accent */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: "1.5rem",
                  left: "-1.5rem",
                  right: "1.5rem",
                  bottom: "-1.5rem",
                  borderRadius: "2.25rem",
                  border: "1px solid rgba(157,23,77,0.30)",
                  zIndex: -1,
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* Bio copy */}
            <div>
              <p className="gold-label" style={{ marginBottom: "1rem" }}>Who She Is</p>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 400,
                  color: "var(--kente-green)",
                  margin: "0 0 1.5rem",
                  lineHeight: 1.12,
                }}
              >
                Born to Carry the Fire
              </h2>
              <p
                style={{
                  fontSize: "1rem",
                  color: "var(--text-dark-body)",
                  lineHeight: 1.88,
                  marginBottom: "1.25rem",
                }}
              >
                {profile.bio}
              </p>
              <p
                style={{
                  fontSize: "1rem",
                  color: "var(--text-dark-body)",
                  lineHeight: 1.88,
                  marginBottom: "2rem",
                }}
              >
                The WARRIOR QUEEN welcomes you to her official platform — a space dedicated to sharing her music, ministry, and mission. With a heart for worship and a passion for spreading the gospel, {profile.stage_name} has become a beacon of hope and inspiration in the Ghanaian gospel music scene and far beyond.
              </p>

              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <Link href="/music" className="btn-primary">Listen to Music</Link>
                <Link href="/contact" className="btn-gold">Book Ministry</Link>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .bio-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          }
        `}</style>
      </section>

      {/* ═══ MINISTRY HIGHLIGHTS ═══ */}
      <section className="section-cream" style={{ padding: "6rem 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }} className="reveal" suppressHydrationWarning>
            <p className="gold-label" style={{ marginBottom: "0.75rem" }}>Ministry Impact</p>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 400,
                color: "var(--kente-green)",
                margin: 0,
                lineHeight: 1.12,
              }}
            >
              What She Carries
            </h2>
            <p
              style={{
                marginTop: "0.9rem",
                color: "var(--text-dark-muted)",
                maxWidth: "55ch",
                fontSize: "1rem",
                lineHeight: 1.8,
                margin: "0.9rem auto 0",
                fontFamily: "var(--font-body)",
              }}
            >
              A ministry that transcends borders — healing, worship, and unwavering faith.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: "1.5rem" }}>
            {MINISTRY_HIGHLIGHTS.map((item, i) => (
              <div
                key={item.title}
                className={`ministry-card reveal reveal-delay-${Math.min(i + 1, 4)}`}
                suppressHydrationWarning
              >
                <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "1.1rem" }}>{item.icon}</span>
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.45rem",
                    fontWeight: 400,
                    color: "var(--kente-green)",
                    margin: "0 0 0.8rem",
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ fontSize: "0.92rem", color: "var(--text-dark-body)", lineHeight: 1.78, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ JOURNEY TIMELINE ═══ */}
      <section className="section-deep" style={{ padding: "6rem 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }} className="reveal" suppressHydrationWarning>
            <p className="gold-label" style={{ marginBottom: "0.75rem", color: "var(--champagne-gold)" }}>
              Timeline
            </p>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 400,
                color: "var(--ivory)",
                margin: 0,
                lineHeight: 1.12,
              }}
            >
              The Journey
            </h2>
          </div>

          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            {JOURNEY_MILESTONES.map((milestone, idx) => (
              <div
                key={milestone.year}
                style={{
                  display: "grid",
                  gridTemplateColumns: "120px 1fr",
                  gap: "2rem",
                  marginBottom: "3rem",
                  position: "relative",
                }}
                className={`timeline-item reveal reveal-delay-${Math.min(idx + 1, 4)}`}
                suppressHydrationWarning
              >
                <div style={{ textAlign: "right", paddingTop: "0.25rem" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "0.85rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "var(--champagne-gold)",
                      fontWeight: 500,
                    }}
                  >
                    {milestone.year}
                  </span>
                </div>
                <div
                  style={{
                    borderLeft: "2px solid rgba(157,23,77,0.35)",
                    paddingLeft: "2rem",
                    paddingBottom: idx < JOURNEY_MILESTONES.length - 1 ? "0.5rem" : "0",
                    position: "relative",
                  }}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      left: "-5px",
                      top: "0.4rem",
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "var(--royal-gold)",
                    }}
                  />
                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.4rem",
                      fontWeight: 400,
                      color: "var(--ivory)",
                      margin: "0 0 0.75rem",
                    }}
                  >
                    {milestone.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.95rem",
                      color: "rgba(255,251,252,0.72)",
                      lineHeight: 1.78,
                      margin: 0,
                    }}
                  >
                    {milestone.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @media (max-width: 640px) {
            .timeline-item { grid-template-columns: 1fr !important; gap: 0.5rem !important; }
            .timeline-item > div:first-child { text-align: left !important; }
          }
        `}</style>
      </section>

      {/* ═══ AWARDS ═══ */}
      {awards.length > 0 && (
        <section className="section-light" style={{ padding: "6rem 0" }}>
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: "3rem" }} className="reveal" suppressHydrationWarning>
              <p className="gold-label" style={{ marginBottom: "0.75rem" }}>Recognition</p>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 400,
                  color: "var(--kente-green)",
                  margin: 0,
                  lineHeight: 1.12,
                }}
              >
                Awards &amp; Nominations
              </h2>
              <p
                style={{
                  marginTop: "0.9rem",
                  color: "var(--text-dark-muted)",
                  textAlign: "center",
                  fontSize: "1rem",
                  lineHeight: 1.8,
                }}
              >
                Her excellence before God has been acknowledged before men.
              </p>
            </div>

            <div style={{ display: "grid", gap: "1.25rem", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
              {awards.map((award, i) => (
                <div
                  key={award.id}
                  className={`track-card reveal reveal-delay-${Math.min(i + 1, 4)}`}
                  suppressHydrationWarning
                  style={{
                    borderLeft: "3px solid var(--royal-gold)",
                    paddingLeft: "1.75rem",
                    background: "rgba(157,23,77,0.04)",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.35rem",
                      fontWeight: 400,
                      color: "var(--kente-green)",
                      margin: "0 0 0.75rem",
                    }}
                  >
                    {award.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--text-dark-body)",
                      lineHeight: 1.72,
                      margin: 0,
                    }}
                  >
                    {award.description}
                  </p>
                  {award.awarded_on && (
                    <p
                      style={{
                        fontSize: "0.72rem",
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        color: "var(--deep-gold)",
                        marginTop: "0.75rem",
                        fontFamily: "var(--font-body)",
                        fontWeight: 600,
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

      {/* ═══ CTA STRIP ═══ */}
      <section
        style={{
          // Dark-to-dark only — see matching comment in contact/page.tsx's
          // Ministry Promise Strip for why champagne-gold was removed here.
          background: "linear-gradient(135deg, var(--deep-gold) 0%, var(--royal-gold) 40%, var(--kente-mid) 60%, var(--royal-gold) 80%, var(--deep-gold) 100%)",
          backgroundSize: "200% 100%",
          padding: "5rem 0",
          textAlign: "center",
          animation: "gold-strip-anim 8s ease-in-out infinite",
        }}
      >
        <div className="container">
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 300,
              color: "#FFFBFC",
              margin: "0 0 1rem",
              lineHeight: 1.15,
            }}
          >
            Ready to Experience the Ministry?
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "rgba(255,251,252,0.80)",
              maxWidth: "500px",
              margin: "0 auto 2.5rem",
              lineHeight: 1.78,
              fontFamily: "var(--font-body)",
            }}
          >
            Invite Ewura Abena to minister at your event, church, or conference.
            Let God use her voice to transform your gathering.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "0.85rem 2rem",
                background: "var(--kente-green)",
                color: "var(--ivory)",
                borderRadius: "9999px",
                fontWeight: 700,
                fontSize: "0.82rem",
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                textDecoration: "none",
                fontFamily: "var(--font-body)",
                boxShadow: "0 8px 28px rgba(157,23,77,0.40)",
                transition: "all 0.25s ease",
              }}
            >
              Book Ministry Session
            </Link>
            <Link
              href="/music"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "0.85rem 2rem",
                background: "transparent",
                color: "#FFFBFC",
                border: "2px solid #FFFBFC",
                borderRadius: "9999px",
                fontWeight: 700,
                fontSize: "0.82rem",
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                textDecoration: "none",
                fontFamily: "var(--font-body)",
                transition: "all 0.25s ease",
              }}
            >
              Listen to Music
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
