import { FanPlaylistManager } from "@/components/fan-playlist-manager";
import { FavoriteTrackList } from "@/components/fan/favorite-track-list";
import { requireUser } from "@/lib/auth";
import { getFanDashboardData } from "@/lib/data/fan";
import { getPublicContent } from "@/lib/data/public";

export default async function MyMusicPage() {
  const user = await requireUser();
  const [fanData, content] = await Promise.all([getFanDashboardData(user.id), getPublicContent()]);

  const favoriteTracks = fanData.favorites
    .map((fav) => content.tracks.find((t) => t.id === fav.track_id))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  return (
    <div className="fh-stack">
      <section className="fh-card">
        <h2 className="fh-subhead">Favourite songs</h2>
        <FavoriteTrackList
          tracks={favoriteTracks.map((t) => ({ id: t.id, title: t.title, audio_url: t.audio_url }))}
          allTracks={content.tracks.map((t) => ({ id: t.id, title: t.title, audio_url: t.audio_url }))}
        />
      </section>

      <FanPlaylistManager
        playlists={fanData.playlists.map((p) => ({ id: p.id, title: p.title }))}
        tracks={content.tracks.map((t) => ({ id: t.id, title: t.title, audiomack_url: t.audiomack_url }))}
      />
    </div>
  );
}
