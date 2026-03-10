import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { type FanNotification, type FanPlaylist, type Favorite } from "@/lib/types";

export async function getFanDashboardData(userId: string): Promise<{
  favorites: Favorite[];
  playlists: FanPlaylist[];
  notifications: FanNotification[];
}> {
  if (!isSupabaseConfigured()) {
    return {
      favorites: [],
      playlists: [],
      notifications: [
        {
          id: "sample-note",
          user_id: userId,
          title: "Welcome to your fan dashboard",
          body: "Create your first personal playlist and keep up with new releases.",
          read_at: null,
          created_at: new Date().toISOString(),
        },
      ],
    };
  }

  const supabase = await createSupabaseServerClient();

  const [favoritesRes, playlistsRes, notificationsRes] = await Promise.all([
    supabase.from("favorites").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    supabase.from("fan_playlists").select("*").eq("owner_id", userId).order("created_at", { ascending: false }),
    supabase.from("fan_notifications").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
  ]);

  return {
    favorites: favoritesRes.data ?? [],
    playlists: playlistsRes.data ?? [],
    notifications: notificationsRes.data ?? [],
  };
}
