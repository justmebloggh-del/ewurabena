"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const supabaseConfigured = useMemo(
    () =>
      Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
          (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      ),
    [],
  );

  async function onSubmit(formData: FormData) {
    if (!supabaseConfigured) {
      setMessage("Sign in is temporarily unavailable. Please try again later.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const email = String(formData.get("email") || "");
      const password = String(formData.get("password") || "");
      const supabase = createSupabaseBrowserClient();

      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setMessage(error.message);
        return;
      }

      router.push("/fan");
      router.refresh();
    } catch (error) {
      console.error(error);
      setMessage("Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "420px", margin: "0 auto", padding: "3rem 1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
      <section className="card space-y-4">
        <h1 className="section-title-dark">Sign In</h1>
        <p style={{ fontSize: "0.9rem", color: "var(--text-dark-body)" }}>
          Access your fan account and personalized playlists.
        </p>

        <form action={onSubmit} className="space-y-3">
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input id="email" name="email" type="email" className="input" required />
          </div>
          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <input id="password" name="password" type="password" className="input" required />
          </div>

          <button className="btn-primary w-full" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {message ? <p className="text-sm text-rose-600">{message}</p> : null}
      </section>

      <p style={{ fontSize: "0.9rem", color: "var(--text-dark-body)" }}>
        New here?{" "}
        <Link href="/auth/sign-up" style={{ color: "var(--royal-gold)", fontWeight: 600 }}>
          Create account
        </Link>
      </p>
    </div>
  );
}
