import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { type ContactSubmission } from "@/lib/types";

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
