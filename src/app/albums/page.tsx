import { FavoriteButton } from "@/components/favorite-button";
import { getPublicContent } from "@/lib/data/public";

export default async function AlbumsPage() {
  const content = await getPublicContent();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">Albums & Tracks</h1>
        <p className="section-subtitle">
          Discover official releases with platform embeds and optional direct audio playback.
        </p>
      </div>

      <div className="grid gap-5">
        {content.albums.map((album) => {
          const albumTracks = content.tracks.filter((track) => track.album_id === album.id);

          return (
            <article key={album.id} className="card space-y-4">
              <div className="grid gap-4 md:grid-cols-[180px_1fr]">
                <img
                  src={
                    album.cover_image_url ||
                    "https://images.unsplash.com/photo-1485579149621-3123dd979885?auto=format&fit=crop&w=900&q=80"
                  }
                  alt={`${album.title} cover art`}
                  className="h-44 w-full rounded-xl object-cover"
                />
                <div className="space-y-2">
                  <h2 className="text-2xl">{album.title}</h2>
                  <p className="text-sm text-[color:var(--text-muted)]">{album.description || "No description yet."}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--gold)]">
                    Release: {album.release_date || "TBA"}
                  </p>
                  <FavoriteButton albumId={album.id} />
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {albumTracks.map((track) => (
                  <div key={track.id} className="rounded-xl border border-[color:var(--border-soft)] p-3">
                    <h3 className="font-semibold">{track.track_number ? `${track.track_number}. ` : ""}{track.title}</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {track.youtube_url ? (
                        <a href={track.youtube_url} target="_blank" rel="noreferrer" className="btn-secondary text-xs">
                          YouTube
                        </a>
                      ) : null}
                      {track.spotify_url ? (
                        <a href={track.spotify_url} className="btn-secondary text-xs">
                          Spotify
                        </a>
                      ) : null}
                      {track.apple_music_url ? (
                        <a href={track.apple_music_url} className="btn-secondary text-xs">
                          Apple Music
                        </a>
                      ) : null}
                      {track.audiomack_url ? (
                        <a href={track.audiomack_url} className="btn-secondary text-xs">
                          Audiomack
                        </a>
                      ) : null}
                    </div>
                    {track.audio_url ? <audio controls src={track.audio_url} className="mt-3 w-full" /> : null}
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
