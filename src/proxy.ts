import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";
import { getSupabasePublicKey, getSupabaseUrl } from "@/lib/supabase/env";

export async function proxy(request: NextRequest) {
  const response = await updateSession(request);

  const url = getSupabaseUrl();
  const key = getSupabasePublicKey();

  if (!url || !key) {
    return response;
  }

  // The Fan Hub feed, ministry updates and public fan profiles are open to
  // read; only the admin area and the fan's private pages need a session.
  const path = request.nextUrl.pathname;
  const needsSession =
    path.startsWith("/admin") || path.startsWith("/fan/music") || path.startsWith("/fan/profile");
  if (!needsSession) {
    return response;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/auth/sign-in";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ["/fan/:path*", "/admin/:path*"],
};
