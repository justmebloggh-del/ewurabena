import { NextResponse } from "next/server";

import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function requireRouteUser() {
  if (!isSupabaseConfigured()) {
    return {
      error: NextResponse.json({ error: "Service temporarily unavailable." }, { status: 503 }),
    } as const;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: NextResponse.json({ error: "Authentication required." }, { status: 401 }),
    } as const;
  }

  return { user, supabase } as const;
}

export async function requireRouteAdmin() {
  const authResult = await requireRouteUser();
  if ("error" in authResult) {
    return authResult;
  }

  const { user, supabase } = authResult;
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || data?.role !== "admin") {
    return {
      error: NextResponse.json({ error: "Admin access required." }, { status: 403 }),
    } as const;
  }

  return { user, supabase } as const;
}
