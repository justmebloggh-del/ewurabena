import type { Metadata } from "next";

import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Booking & Contact | Ewura Abena",
  description: "Book Ewura Abena for ministry engagements, conferences, church events, and media appearances.",
};

const MINISTRY_SERVICES = [
  "Church services & revival meetings",
  "Gospel concerts & conferences",
  "Worship nights & prayer gatherings",
  "Crusades & evangelism outreaches",
  "Wedding & dedication services",
  "Media appearances & interviews",
  "Recording collaborations",
];

const CONTACT_ITEMS = [
  { href: "tel:+447921459335", icon: "📞", label: "UK", value: "+447921 459335" },
  { href: "tel:+233540993540", icon: "📞", label: "Ghana", value: "+233540993540" },
  { href: "mailto:nustylerecordz@gmail.com", icon: "✉", label: "Email", value: "nustylerecordz@gmail.com" },
  { href: "https://wa.me/447921459335", icon: "💬", label: "WhatsApp", value: "WhatsApp (UK Number)", external: true },
];

export default function ContactPage() {
  return (
    <>
      {/* ═══ HERO BANNER ═══ */}
      <section
        style={{
          position: "relative",
          background: "linear-gradient(160deg, var(--kente-deep) 0%, var(--kente-green) 60%, var(--kente-deep) 100%)",
          padding: "8rem 0 6rem",
          overflow: "hidden",
          textAlign: "center",
          borderBottom: "1px solid rgba(212,175,55,0.22)",
        }}
      >
        {/* Gold atmospheric glow */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 50% 60%, rgba(212,175,55,0.18) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <div className="container" style={{ position: "relative" }}>
          <p className="gold-label" style={{ marginBottom: "0.75rem", color: "var(--champagne-gold)" }}>
            Ministry Booking
          </p>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 300,
              color: "var(--ivory)",
              margin: "0 0 1rem",
              lineHeight: 1.1,
              textShadow: "0 4px 40px rgba(212,175,55,0.30)",
            }}
          >
            Book Ewura Abena
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: "rgba(255,253,248,0.78)",
              maxWidth: "560px",
              margin: "0 auto",
              lineHeight: 1.78,
              fontFamily: "var(--font-body)",
            }}
          >
            Submit an inquiry for ministry invitations, conferences, church events,
            partnerships, and media opportunities.
          </p>
        </div>
      </section>

      {/* ═══ MAIN CONTENT ═══ */}
      <section className="section-light" style={{ padding: "6rem 0" }}>
        <div className="container">
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "4rem", alignItems: "start" }}
            className="contact-grid"
          >

            {/* ── Contact Info Column ── */}
            <div>
              <p className="gold-label" style={{ marginBottom: "0.75rem" }}>Get In Touch</p>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                  fontWeight: 400,
                  color: "var(--kente-green)",
                  margin: "0 0 0.85rem",
                  lineHeight: 1.12,
                }}
              >
                Direct Contact
              </h2>
              <p
                style={{
                  fontSize: "0.97rem",
                  color: "var(--text-dark-body)",
                  lineHeight: 1.80,
                  marginBottom: "2rem",
                }}
              >
                For urgent enquiries, reach us directly. For all booking requests, please use the form on this page.
              </p>

              {/* Contact items card */}
              <div
                className="card"
                style={{ marginBottom: "1.5rem", padding: "1.75rem" }}
              >
                <p className="gold-label" style={{ marginBottom: "1.25rem" }}>Booking &amp; Enquiries</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {CONTACT_ITEMS.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noreferrer" : undefined}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.85rem",
                        color: "var(--text-dark-body)",
                        fontSize: "0.93rem",
                        textDecoration: "none",
                        padding: "0.75rem 1rem",
                        borderRadius: "0.85rem",
                        background: "var(--ivory)",
                        border: "1px solid rgba(212,175,55,0.20)",
                        transition: "all 0.22s ease",
                      }}
                      className="contact-item-link"
                    >
                      <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{item.icon}</span>
                      <div style={{ minWidth: 0 }}>
                        <span
                          style={{
                            display: "block",
                            fontSize: "0.62rem",
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                            color: "var(--royal-gold)",
                            marginBottom: "0.15rem",
                            fontWeight: 700,
                            fontFamily: "var(--font-body)",
                          }}
                        >
                          {item.label}
                        </span>
                        <span style={{ color: "var(--kente-green)", fontWeight: 500 }}>{item.value}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Ministry services card */}
              <div className="card" style={{ padding: "1.75rem" }}>
                <p className="gold-label" style={{ marginBottom: "1.1rem" }}>Ministry Services</p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {MINISTRY_SERVICES.map((service) => (
                    <li
                      key={service}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.65rem",
                        fontSize: "0.90rem",
                        color: "var(--text-dark-body)",
                        lineHeight: 1.5,
                      }}
                    >
                      <span
                        style={{
                          color: "var(--royal-gold)",
                          fontSize: "0.55rem",
                          flexShrink: 0,
                        }}
                      >
                        ◆
                      </span>
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ── Form Column ── */}
            <div>
              <p className="gold-label" style={{ marginBottom: "0.75rem" }}>Booking Inquiry</p>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                  fontWeight: 400,
                  color: "var(--kente-green)",
                  margin: "0 0 0.85rem",
                  lineHeight: 1.12,
                }}
              >
                Booking Inquiry Form
              </h2>
              <p
                style={{
                  fontSize: "0.97rem",
                  color: "var(--text-dark-body)",
                  lineHeight: 1.80,
                  marginBottom: "2rem",
                }}
              >
                Complete the form below and a member of the ministry team will respond within 48 hours.
              </p>
              <ContactForm />
            </div>

          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .contact-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          }
          .contact-item-link:hover {
            border-color: var(--royal-gold) !important;
            background: rgba(212,175,55,0.06) !important;
            transform: translateX(4px);
          }
        `}</style>
      </section>

      {/* ═══ KENTE DIVIDER ═══ */}
      <div className="kente-divider" aria-hidden="true" />

      {/* ═══ MINISTRY PROMISE STRIP ═══ */}
      <section
        style={{
          background: "linear-gradient(135deg, var(--deep-gold) 0%, var(--royal-gold) 40%, var(--champagne-gold) 60%, var(--royal-gold) 80%, var(--deep-gold) 100%)",
          backgroundSize: "200% 100%",
          padding: "4rem 0",
          textAlign: "center",
          animation: "gold-strip-anim 8s ease-in-out infinite",
        }}
      >
        <div className="container">
          <p
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              fontWeight: 300,
              fontStyle: "italic",
              color: "var(--kente-deep)",
              margin: "0 0 0.5rem",
              lineHeight: 1.4,
            }}
          >
            &ldquo;His glory will be seen.&rdquo;
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.70rem",
              letterSpacing: "0.30em",
              textTransform: "uppercase",
              color: "rgba(8,61,39,0.70)",
              fontWeight: 700,
            }}
          >
            — Ewura Abena · Warrior Queen
          </p>
        </div>
      </section>
    </>
  );
}
