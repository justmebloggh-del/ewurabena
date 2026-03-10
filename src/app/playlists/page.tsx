import Link from "next/link";

import { getPublicContent } from "@/lib/data/public";

export default async function PlaylistsPage() {
  const content = await getPublicContent();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">Official & Fan Playlists</h1>
        <p className="section-subtitle">
          Listen to curated worship selections and create your own playlists in the fan hub.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {content.officialPlaylists.map((playlist) => (
          <article key={playlist.id} className="card space-y-3">
            <h2 className="text-2xl">{playlist.title}</h2>
            <p className="text-sm text-[color:var(--text-muted)]">{playlist.description}</p>
            {playlist.embed_url ? (
              <iframe
                src={playlist.embed_url}
                className="h-44 w-full rounded-xl border border-[color:var(--border-soft)]"
                title={`${playlist.title} player`}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen"
              />
            ) : null}
          </article>
        ))}
      </div>

      <section className="card flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl">Create Personal Playlists</h2>
          <p className="text-sm text-[color:var(--text-muted)]">
            Fan accounts can save favorites and build private custom playlists.
          </p>
        </div>
        <Link href="/fan" className="btn-primary">
          Open Fan Hub
        </Link>
      </section>
    </div>
  );
}
