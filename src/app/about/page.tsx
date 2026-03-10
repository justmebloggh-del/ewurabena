import { getPublicContent } from "@/lib/data/public";

export default async function AboutPage() {
  const { profile } = await getPublicContent();

  return (
    <div className="space-y-6">
      <section className="card space-y-4">
        <p className="text-sm uppercase tracking-[0.24em] text-[color:var(--gold)]">About</p>
        <h1 className="section-title">The Ministry Journey of {profile.stage_name}</h1>
        <p className="section-subtitle">{profile.bio}</p>
        <p className="text-sm text-[color:var(--gold)]">
          The WARRIOR QUEEN welcomes you to her official website, a platform dedicated to sharing her music, ministry, and mission. With a heart for worship and a passion for spreading the gospel, {profile.stage_name} has become a beacon of hope and inspiration in the Ghanaian gospel music scene and beyond.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="card">
          <h2 className="text-2xl">Global Influence</h2>
          <p className="mt-2 text-sm text-[color:var(--text-muted)]">
            Her present and previous albums have earned her a top spot in Ghanaian gospel and on the international scene.
          </p>
        </article>
        <article className="card">
          <h2 className="text-2xl">Songwriting</h2>
          <p className="mt-2 text-sm text-[color:var(--text-muted)]">
            As a composer and songwriter, she creates Christ-centered songs that support worship and spiritual growth.
          </p>
        </article>
        <article className="card">
          <h2 className="text-2xl">DOVVSU Ambassador & Warrior Queen</h2>
          <p className="mt-2 text-sm text-[color:var(--text-muted)]">{profile.dovvsu_ambassador_note}</p>
        </article>
      </section>

      <section className="card">
        <h2 className="text-2xl">Awards Spotlight</h2>
        <p className="mt-2 text-sm text-[color:var(--text-muted)]">
          The success of her single &quot;This Far&quot; earned nominations and recognition including Songwriter of the Year,
          Female Vocal Performance, and Gospel Song of the Year at major 2023 Ghana music awards platforms.
        </p>
      </section>
    </div>
  );
}
