import type { Metadata } from "next";

const EVENTBRITE_ORGANIZER_URL = "https://www.eventbrite.co.uk/o/113643407031";

export const metadata: Metadata = {
  title: "Events | Ewura Abena",
  description: "Upcoming crusades, worship concerts, and ministry events with Ewura Abena — tickets via Eventbrite.",
};

export default function EventsPage() {
  return (
    <>
      {/* Hero Banner */}
      <section
        style={{
          background: "linear-gradient(160deg, var(--kente-deep) 0%, var(--kente-green) 60%, var(--kente-deep) 100%)",
          padding: "7rem 0 5rem",
          borderBottom: "1px solid rgba(157,23,77,0.22)",
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 50% 60%, rgba(157,23,77,0.18) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <div className="container" style={{ position: "relative" }}>
          <p className="gold-label" style={{ marginBottom: "0.75rem" }}>Crusades &amp; Worship Concerts</p>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 300,
              color: "var(--ivory)",
              margin: "0 0 1rem",
              textShadow: "0 4px 40px rgba(157,23,77,0.30)",
            }}
          >
            Events
          </h1>
          <p style={{ fontSize: "1rem", color: "rgba(255,251,252,0.78)", maxWidth: "520px", margin: "0 auto 1.5rem", lineHeight: 1.75 }}>
            Join Ewura Abena live — crusades, worship concerts, and ministry gatherings near you.
          </p>
          <a
            href={EVENTBRITE_ORGANIZER_URL}
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
            style={{ display: "inline-flex" }}
          >
            Follow on Eventbrite ↗
          </a>
        </div>
      </section>

      {/* Live Eventbrite listing */}
      <section className="section-light">
        <div className="container">
          <div
            style={{
              borderRadius: "1.25rem",
              overflow: "hidden",
              border: "1px solid rgba(157,23,77,0.22)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.12)",
              background: "#FFFFFF",
            }}
          >
            {/* Eventbrite doesn't offer a JS widget for an organizer's full
                event list (only single-event checkout widgets), so the
                organizer page itself is embedded directly — it carries no
                X-Frame-Options/CSP restriction, confirmed via response
                headers before building this. This always reflects
                whatever is live on Eventbrite with zero manual upkeep. */}
            <iframe
              src={EVENTBRITE_ORGANIZER_URL}
              title="Ewura Abena — Events on Eventbrite"
              style={{ width: "100%", height: "1100px", border: "none", display: "block" }}
              loading="lazy"
            />
          </div>

          <p
            style={{
              textAlign: "center",
              marginTop: "2rem",
              fontSize: "0.9rem",
              color: "var(--text-dark-body)",
            }}
          >
            Having trouble viewing events above?{" "}
            <a href={EVENTBRITE_ORGANIZER_URL} target="_blank" rel="noreferrer" style={{ color: "var(--royal-gold)", fontWeight: 600 }}>
              Open the full listing on Eventbrite ↗
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
