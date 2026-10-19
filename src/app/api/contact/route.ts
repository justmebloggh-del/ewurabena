import { NextResponse } from "next/server";

import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { contactSubmissionSchema, nullableString } from "@/lib/validation";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = contactSubmissionSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid contact request payload." }, { status: 400 });
  }

  const values = parsed.data;

  // Honeypot: silently accept bots to reduce spam without signaling detection.
  if (values.website.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  // Was reading process.env.xaqpqggq (a literal variable named after the
  // form ID value, which was never actually set) instead of the real
  // FORMSPREE_ENDPOINT variable — this form never worked before.
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
      organization: values.organization,
      event_date: values.event_date,
      message: values.message,
      source: "Ewura Abena Website Contact Form",
    }),
  });

  if (!formspreeResponse.ok) {
    const data = await formspreeResponse.json().catch(() => null);
    const errorMessage = data?.errors?.[0]?.message || "Unable to send your message right now.";
    return NextResponse.json({ error: errorMessage }, { status: 502 });
  }

  // Optional internal backup log for admin inbox.
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      await supabase.from("contact_submissions").insert({
        name: values.name,
        email: values.email,
        message: values.message,
        organization: nullableString(values.organization),
        event_date: nullableString(values.event_date),
        status: "new",
      });
    } catch {
      // Do not fail user-facing submission after Formspree success.
    }
  }

  return NextResponse.json({ ok: true });
}
