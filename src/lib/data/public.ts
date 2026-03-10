import { samplePublicContent } from "@/lib/sample-data";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { type PublicContent } from "@/lib/types";

export async function getPublicContent(): Promise<PublicContent> {
  if (!isSupabaseConfigured()) {
    return samplePublicContent;
  }

  try {
    const supabase = await createSupabaseServerClient();

    const [
      profileRes,
      albumsRes,
      tracksRes,
      playlistsRes,
      mediaRes,
      awardsRes,
      announcementsRes,
      donationRes,
      socialRes,
    ] = await Promise.all([
      supabase.from("artist_profiles").select("*").order("updated_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("albums").select("*").eq("is_published", true).order("release_date", { ascending: false }),
      supabase.from("tracks").select("*").eq("is_published", true).order("track_number", { ascending: true }),
      supabase.from("official_playlists").select("*").eq("is_published", true).order("created_at", { ascending: false }),
      supabase.from("media_items").select("*").eq("is_published", true).order("created_at", { ascending: false }),
      supabase.from("awards").select("*").order("awarded_on", { ascending: false }),
      supabase.from("announcements").select("*").eq("is_published", true).order("created_at", { ascending: false }),
      supabase.from("donation_links").select("*").eq("is_published", true).order("created_at", { ascending: false }),
      supabase.from("social_links").select("*").eq("is_published", true).order("created_at", { ascending: false }),
    ]);

    const profile = profileRes.data ?? samplePublicContent.profile;

    return {
      profile,
      albums: albumsRes.data ?? [],
      tracks: tracksRes.data ?? [],
      officialPlaylists: playlistsRes.data ?? [],
      mediaItems: mediaRes.data ?? [],
      awards: awardsRes.data ?? [],
      announcements: announcementsRes.data ?? [],
      donationLinks: donationRes.data ?? [],
      socialLinks: socialRes.data ?? [],
    };
  } catch {
    return samplePublicContent;
  }
}
