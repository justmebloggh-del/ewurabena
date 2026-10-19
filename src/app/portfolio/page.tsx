import Link from "next/link";

import { getPublicContent } from "@/lib/data/public";
import { tvLinkFor } from "@/lib/tv-channel";
import { youtubeThumbnail } from "@/lib/youtube";

export default async function PortfolioPage() {
  const content = await getPublicContent();

  return (
    <div className="page-container" style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
      <section className="card space-y-3">
        <h1 className="section-title">Portfolio</h1>
        <p className="section-subtitle">
          Ministry impact, media highlights, and recognitions that reflect Ewura Abena&apos;s mission.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl">Ministry Impact</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <article className="card">
            <h3 className="text-xl">Worship Outreach</h3>
            <p className="mt-2 text-sm text-[color:var(--text-dark-muted)]">
              Leading worship and spiritual gatherings in churches, community events, and international faith programs.
            </p>
          </article>
          <article className="card">
            <h3 className="text-xl">Mentorship</h3>
            <p className="mt-2 text-sm text-[color:var(--text-dark-muted)]">
              Supporting the next generation of gospel musicians through discipleship and songwriting mentorship.
            </p>
          </article>
          <article className="card">
            <h3 className="text-xl">Advocacy</h3>
            <p className="mt-2 text-sm text-[color:var(--text-dark-muted)]">
              Public ministry and advocacy as DOVVSU ambassador focused on dignity and community protection.
            </p>
          </article>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl">Media Gallery</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {content.mediaItems.map((item) => (
            <article key={item.id} className="card space-y-2">
              <h3 className="text-xl">{item.title}</h3>
              {item.kind === "image" ? (
                <img src={item.url} alt={item.title} className="h-64 w-full rounded-xl object-cover" />
              ) : (
                <Link
                  href={tvLinkFor(item.id)}
                  className="group relative block h-64 w-full overflow-hidden rounded-xl border border-[color:var(--border-soft)]"
                >
                  {item.thumbnail_url || youtubeThumbnail(item.url) ? (
                    <img
                      src={item.thumbnail_url || youtubeThumbnail(item.url) || undefined}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-[color:var(--kente-deep)]" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="platform-badge" style={{ background: "rgba(255,255,255,0.95)" }}>
                      ▶ Watch on Ewura Abena TV
                    </span>
                  </div>
                </Link>
              )}
              {item.caption ? <p className="text-sm text-[color:var(--text-dark-muted)]">{item.caption}</p> : null}
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl">Awards & Recognition</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {content.awards.map((award) => (
            <article key={award.id} className="card">
              <h3 className="text-xl">{award.title}</h3>
              <p className="mt-2 text-sm text-[color:var(--text-dark-muted)]">{award.description}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.22em] text-[color:var(--gold)]">
                {award.awarded_on || "Date pending"}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
