import { getPublicContent } from "@/lib/data/public";
import { DEFAULT_ARTIST_IMAGE_URL } from "@/lib/constants";

export async function ArtistBanner() {
  const content = await getPublicContent();
  const src = content.profile.hero_image_url || DEFAULT_ARTIST_IMAGE_URL;

  return (
    <div className="border-b border-[color:var(--border-soft)] bg-[color:var(--bg-deep)]">
      <div className="mx-auto grid w-full max-w-6xl gap-3 px-4 py-3 sm:grid-cols-[72px_1fr] sm:items-center sm:px-6">
        <img
          src={src}
          alt="Ewura Abena portrait"
          className="h-[4.5rem] w-[4.5rem] rounded-xl object-cover"
        />
        <p className="text-sm text-[color:var(--text-muted)]">
          Soul Gospel Singer || Composer & Songwriter || DOVVSU Ambassador || Warrior Queen
        </p>
      </div>
    </div>
  );
}
