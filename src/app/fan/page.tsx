import { FanPlaylistManager } from "@/components/fan-playlist-manager";
import { requireUser } from "@/lib/auth";
import { getFanDashboardData } from "@/lib/data/fan";
import { getPublicContent } from "@/lib/data/public";

export default async function FanPage() {
  const user = await requireUser();
  const [fanData, publicContent] = await Promise.all([
    getFanDashboardData(user.id),
    getPublicContent(),
  ]);

  return (
    <div className="page-container" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <section className="card space-y-3">
        <h1 className="section-title-dark">Fan Hub</h1>
        <p style={{ fontSize: "0.97rem", color: "var(--text-dark-body)", lineHeight: 1.78 }}>
          Save favorites, build custom playlists, and track ministry updates.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="card">
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", color: "var(--kente-green)", margin: 0 }}>Favorites</h2>
          <p className="mt-2 text-4xl font-semibold text-[color:var(--gold)]">{fanData.favorites.length}</p>
        </article>
        <article className="card">
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", color: "var(--kente-green)", margin: 0 }}>Your Playlists</h2>
          <p className="mt-2 text-4xl font-semibold text-[color:var(--gold)]">{fanData.playlists.length}</p>
        </article>
        <article className="card">
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", color: "var(--kente-green)", margin: 0 }}>Notifications</h2>
          <p className="mt-2 text-4xl font-semibold text-[color:var(--gold)]">{fanData.notifications.length}</p>
        </article>
      </div>

      <FanPlaylistManager
        playlists={fanData.playlists.map((playlist) => ({ id: playlist.id, title: playlist.title }))}
        tracks={publicContent.tracks.map((track) => ({
          id: track.id,
          title: track.title,
          audiomack_url: track.audiomack_url
        }))}
      />

      <section className="card space-y-3">
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", color: "var(--kente-green)", margin: 0 }}>
          In-app Notifications
        </h2>
        <div className="space-y-2">
          {fanData.notifications.length === 0 ? (
            <p style={{ fontSize: "0.9rem", color: "var(--text-dark-muted)" }}>No notifications yet.</p>
          ) : (
            fanData.notifications.map((note) => (
              <article key={note.id} style={{ borderRadius: "0.75rem", border: "1px solid rgba(212,175,55,0.22)", padding: "0.75rem" }}>
                <h3 style={{ fontWeight: 600, color: "var(--kente-green)", margin: 0 }}>{note.title}</h3>
                <p style={{ marginTop: "0.25rem", fontSize: "0.875rem", color: "var(--text-dark-body)" }}>{note.body}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
