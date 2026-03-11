import Link from "next/link";
import { cookies } from "next/headers";

import { FavoriteButton } from "@/components/favorite-button";
import { getPublicContent } from "@/lib/data/public";
import { createClient } from "@/utils/supabase/server";

const IN_APP_PLATFORMS = new Set(["spotify", "boomplay", "apple music", "audiomac", "audiomack"]);

export default async function HomePage() {
  const content = await getPublicContent();
  const cookieStore = await cookies();
  let todos: unknown[] = [];

  try {
    const supabase = createClient(cookieStore);
    const { data } = await supabase.from("todos").select();
    todos = data ?? [];
  } catch {
    todos = [];
  }

  return (
    <div className="space-y-10">
      <section className="grid gap-6 rounded-3xl border border-[color:var(--border-soft)] bg-[color:var(--bg-card)] p-6 md:grid-cols-[1.2fr_0.8fr] md:p-8 animate-fade-in">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.24em] text-[color:var(--gold)]">Global Gospel Minister</p>
          <h1 className="text-4xl leading-tight sm:text-5xl">{content.profile.stage_name}</h1>
          <p className="max-w-xl text-base text-[color:var(--text-muted)]">{content.profile.subtitle}</p>
          <p className="max-w-xl text-sm text-[color:var(--gold)]">
            Booking/Info: +447921 459335 || +233540993540
          </p>
          <p className="max-w-xl text-sm text-[color:var(--text-muted)]">Email: nustylerecordz@gmail.com</p>
          <p className="max-w-xl text-[color:var(--text-muted)]">
            Ewura Abena is a Global Gospel Minister whose soulful voice carries both power and healing. As a singer,
            composer, and songwriter, she creates music that inspires faith, restores hope, and connects hearts to God.
          
            <p>Beyond the stage, Ewura Abena serves as a DOVVSU Ambassador, using her influence to advocate for justice
            and protection for the vulnerable.</p>
            <p>Her passion for worship is matched by her commitment to purpose. Bold in
            spirit and graceful in strength, she is known as the Warrior Queen - a voice of light, love, and
            unwavering faith.</p>
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/albums" className="btn-primary">
              Explore Albums
            </Link>
            <Link href="/auth/sign-up" className="btn-secondary">
              Join Fan Hub
            </Link>
            <Link href="/contact" className="btn-secondary">
              Book Ministry Session
            </Link>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-[color:var(--border-soft)]">
          <img
            src={content.profile.hero_image_url || "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80"}
            alt="Ewura Abena ministry portrait"
            className="h-full min-h-56 w-full object-cover"
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="section-title">THEY THAT WORSHIP GOD MUST WORSHIP HIM IN SPIRIT AND IN TRUTH</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {content.announcements.slice(0, 2).map((announcement) => (
            <article key={announcement.id} className="card">
              <h3 className="text-xl">{announcement.title}</h3>
              <p className="mt-2 text-sm text-[color:var(--text-muted)]">{announcement.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="section-title">Upcoming Events</h2>
        <ul className="card list-disc space-y-1 pl-6 text-sm text-[color:var(--text-muted)]">
          {todos.length === 0 ? (
            <li>Loading......</li>
          ) : (
            todos.map((todo, index) => (
              <li key={`todo-${index}`}>
                {typeof todo === "string" ? todo : JSON.stringify(todo)}
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="section-title">Ewura Abena Music</h2>
          <p className="section-subtitle">Hybrid Streaming with Direct Playbacks</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {content.tracks.slice(0, 4).map((track) => (
            <article key={track.id} className="card space-y-3">
              <h3 className="text-xl">{track.title}</h3>
              <div className="flex flex-wrap gap-2 text-xs text-[color:var(--text-muted)]">
                {track.youtube_url ? (
                  <a href={track.youtube_url} target="_blank" rel="noreferrer" className="btn-secondary">
                    YouTube
                  </a>
                ) : null}
                {track.spotify_url ? (
                  <a href={track.spotify_url} className="btn-secondary">
                    Spotify
                  </a>
                ) : null}
                {track.apple_music_url ? (
                  <a href={track.apple_music_url} className="btn-secondary">
                    Apple Music
                  </a>
                ) : null}
                {track.audiomack_url ? (
                  <a href={track.audiomack_url} className="btn-secondary">
                    Audiomack
                  </a>
                ) : null}
              </div>
              {track.embed_url ? (
                <iframe
                  src={track.embed_url}
                  className="h-44 w-full rounded-xl border border-[color:var(--border-soft)]"
                  title={`${track.title} embedded player`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : null}
              {track.audio_url ? <audio controls src={track.audio_url} className="w-full" /> : null}
              <FavoriteButton trackId={track.id} />
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-3xl border border-[color:var(--border-soft)] bg-[color:var(--bg-card)] p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
        <div>
          <h2 className="section-title">Official Links</h2>
          <p className="section-subtitle">Spotify, Boomplay, Apple Music, Audiomack, Facebook, Instagram, and TikTok.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {content.socialLinks.map((link) => {
            const openInApp = IN_APP_PLATFORMS.has(link.platform.trim().toLowerCase());
            return (
              <a
                key={link.id}
                href={link.url}
                target={openInApp ? undefined : "_blank"}
                rel={openInApp ? undefined : "noreferrer"}
                className="btn-secondary"
              >
                {link.platform}
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}
