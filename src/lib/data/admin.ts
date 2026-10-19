import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { createSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { type ContactSubmission, type FanSummary } from "@/lib/types";

export async function getAdminContactSubmissions(): Promise<ContactSubmission[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return data ?? [];
}

export async function getAdminFans(): Promise<FanSummary[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const { data: fanProfiles } = await supabase
    .from("profiles")
    .select("id, full_name, created_at")
    .eq("role", "fan")
    .order("created_at", { ascending: false });

  if (!fanProfiles || fanProfiles.length === 0) {
    return [];
  }

  // profiles doesn't store email (Supabase keeps that in auth.users), so
  // fetch it via the admin API and join by id — paginate until every
  // registered user is collected.
  const emailById = new Map<string, string>();
  if (isSupabaseAdminConfigured()) {
    try {
      const admin = createSupabaseAdminClient();
      let page = 1;
      const perPage = 200;
      while (true) {
        const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
        if (error || !data) break;
        for (const u of data.users) {
          if (u.email) emailById.set(u.id, u.email);
        }
        if (data.users.length < perPage) break;
        page += 1;
      }
    } catch {
      // fall through — fans still list without email below
    }
  }

  return fanProfiles.map((p) => ({
    id: p.id,
    email: emailById.get(p.id) || "—",
    full_name: p.full_name,
    created_at: p.created_at,
  }));
}
