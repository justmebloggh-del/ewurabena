import { isCurrentUserAdmin, getCurrentUser } from "@/lib/auth";
import type { Viewer } from "@/components/fan/post-card";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

/** The signed-in fan (public profile fields + admin flag), or null for visitors. */
export async function getViewer(): Promise<Viewer | null> {
  const user = await getCurrentUser();
  if (!user || !isSupabaseConfigured()) return null;

  const supabase = await createSupabaseServerClient();
  const [{ data: profile }, isAdmin] = await Promise.all([
    supabase.from("fan_profiles").select("display_name, avatar_url").eq("id", user.id).maybeSingle(),
    isCurrentUserAdmin(),
  ]);

  return {
    id: user.id,
    display_name: profile?.display_name ?? "Fan",
    avatar_url: profile?.avatar_url ?? null,
    isAdmin,
  };
}
