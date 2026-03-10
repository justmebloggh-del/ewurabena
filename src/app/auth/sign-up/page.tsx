"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Notice = {
  kind: "success" | "error";
  text: string;
};

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

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
      setNotice({ kind: "error", text: "Sign up is temporarily unavailable. Please try again later." });
      return;
    }

    setLoading(true);
    setNotice(null);

    try {
      const full_name = String(formData.get("full_name") || "");
      const email = String(formData.get("email") || "");
      const password = String(formData.get("password") || "");
      const confirmPassword = String(formData.get("confirm_password") || "");

      if (password !== confirmPassword) {
        setNotice({ kind: "error", text: "Passwords do not match." });
        return;
      }

      const supabase = createSupabaseBrowserClient();

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name },
        },
      });

      if (error) {
        setNotice({ kind: "error", text: error.message });
        return;
      }

      if (data.session) {
        router.push("/fan");
        router.refresh();
        return;
      }

      setNotice({
        kind: "success",
        text: "Account created. Please check your email to confirm your account, then sign in.",
      });
    } catch (error) {
      console.error(error);
      setNotice({ kind: "error", text: "Sign up failed. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      <section className="card space-y-4">
        <h1 className="section-title">Create Fan Account</h1>
        <p className="text-sm text-[color:var(--text-muted)]">
          Save favorites, build playlists, and receive ministry notifications.
        </p>

        <form action={onSubmit} className="space-y-3">
          <div>
            <label className="label" htmlFor="full_name">
              Full Name
            </label>
            <input id="full_name" name="full_name" className="input" required />
          </div>
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
            <input id="password" name="password" type="password" className="input" minLength={8} required />
          </div>
          <div>
            <label className="label" htmlFor="confirm_password">
              Confirm Password
            </label>
            <input
              id="confirm_password"
              name="confirm_password"
              type="password"
              className="input"
              minLength={8}
              required
            />
          </div>

          <button className="btn-primary w-full" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        {notice ? (
          <p className={notice.kind === "success" ? "text-sm text-emerald-300" : "text-sm text-rose-300"}>
            {notice.text}
          </p>
        ) : null}
      </section>

      <p className="text-sm text-[color:var(--text-muted)]">
        Already registered?{" "}
        <Link href="/auth/sign-in" className="text-[color:var(--gold)] hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
