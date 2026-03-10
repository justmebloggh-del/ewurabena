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
    <div className="space-y-6">
      <section className="card space-y-3">
        <h1 className="section-title">Fan Hub</h1>
        <p className="section-subtitle">Save favorites, build custom playlists, and track ministry updates.</p>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="card">
          <h2 className="text-2xl">Favorites</h2>
          <p className="mt-2 text-4xl font-semibold text-[color:var(--gold)]">{fanData.favorites.length}</p>
        </article>
        <article className="card">
          <h2 className="text-2xl">Your Playlists</h2>
          <p className="mt-2 text-4xl font-semibold text-[color:var(--gold)]">{fanData.playlists.length}</p>
        </article>
        <article className="card">
          <h2 className="text-2xl">Notifications</h2>
          <p className="mt-2 text-4xl font-semibold text-[color:var(--gold)]">{fanData.notifications.length}</p>
        </article>
      </div>

      <FanPlaylistManager
        playlists={fanData.playlists.map((playlist) => ({ id: playlist.id, title: playlist.title }))}
        tracks={publicContent.tracks.map((track) => ({ id: track.id, title: track.title }))}
      />

      <section className="card space-y-3">
        <h2 className="text-2xl">In-app Notifications</h2>
        <div className="space-y-2">
          {fanData.notifications.length === 0 ? (
            <p className="text-sm text-[color:var(--text-muted)]">No notifications yet.</p>
          ) : (
            fanData.notifications.map((note) => (
              <article key={note.id} className="rounded-xl border border-[color:var(--border-soft)] p-3">
                <h3 className="font-semibold">{note.title}</h3>
                <p className="mt-1 text-sm text-[color:var(--text-muted)]">{note.body}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
