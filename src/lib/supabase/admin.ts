import { createClient } from "@supabase/supabase-js";

import { getSupabaseSecretKey, getSupabaseUrl } from "@/lib/supabase/env";

// Service-role client for server-only privileged operations (listing auth
// users by email, writing to storage past bucket RLS). Never import this
// from a client component — the service key must never reach the browser.
export function createSupabaseAdminClient() {
  const url = getSupabaseUrl();
  const key = getSupabaseSecretKey();

  if (!url || !key) {
    throw new Error("Admin service is unavailable.");
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export function isSupabaseAdminConfigured() {
  return Boolean(getSupabaseUrl() && getSupabaseSecretKey());
}

// Best-effort cleanup for files uploaded to our own "media" bucket. Silently
// no-ops for external links (YouTube, Spotify, etc.) or if anything fails —
// a leftover storage file is a nuisance, not worth failing the delete over.
export async function deleteStorageFileIfOwned(url: string | null | undefined) {
  if (!url || !isSupabaseAdminConfigured()) return;

  const marker = "/storage/v1/object/public/media/";
  const index = url.indexOf(marker);
  if (index === -1) return;

  const path = url.slice(index + marker.length);
  if (!path) return;

  try {
    const supabase = createSupabaseAdminClient();
    await supabase.storage.from("media").remove([path]);
  } catch {
    // ignore
  }
}
