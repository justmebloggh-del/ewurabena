import { NextResponse } from "next/server";

import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { nullableString, prayerRequestSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = prayerRequestSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid prayer request payload." }, { status: 400 });
  }

  const values = parsed.data;

  // Honeypot: silently accept bots to reduce spam without signaling detection.
  if (values.website.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const formspreeFormId = process.env.FORMSPREE_ENDPOINT;
  const formspreeEndpoint = formspreeFormId ? `https://formspree.io/f/${formspreeFormId}` : null;
  if (!formspreeEndpoint) {
    return NextResponse.json(
      { error: "Thank You" },
      { status: 503 },
    );
  }

  const formspreeResponse = await fetch(formspreeEndpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: values.name,
      email: values.email,
      message: values.message,
      source: "Ewura Abena Website — Prayer Request",
    }),
  });

  if (!formspreeResponse.ok) {
    const data = await formspreeResponse.json().catch(() => null);
    const errorMessage = data?.errors?.[0]?.message || "Unable to send your prayer request right now.";
    return NextResponse.json({ error: errorMessage }, { status: 502 });
  }

  // Optional internal backup log, reusing contact_submissions so no new
  // table/migration is needed for this single additional form.
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      await supabase.from("contact_submissions").insert({
        name: values.name,
        email: values.email,
        message: `[Prayer Request] ${values.message}`,
        organization: nullableString("Prayer Request"),
        event_date: null,
        status: "new",
      });
    } catch {
      // Do not fail user-facing submission after Formspree success.
    }
  }

  return NextResponse.json({ ok: true });
}
