import Link from "next/link";

import { getCurrentUser } from "@/lib/auth";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/albums", label: "Albums" },
  { href: "/playlists", label: "Playlists" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
];

export async function SiteHeader() {
  const user = await getCurrentUser();
  const isAuthenticated = Boolean(user);

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--border-soft)] bg-[color:var(--bg-card)]/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="text-lg font-semibold tracking-wide text-[color:var(--gold)]">
          Ewura Abena
        </Link>

        <nav className="hidden items-center gap-4 text-sm text-[color:var(--text-muted)] md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-[color:var(--text-main)]">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 text-sm md:flex">
          {isAuthenticated ? (
            <>
              <Link href="/fan" className="btn-secondary">
                Fan Hub
              </Link>
              <Link href="/admin" className="btn-primary">
                Admin
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/sign-in" className="btn-secondary">
                Sign In
              </Link>
              <Link href="/auth/sign-up" className="btn-primary">
                Join Fan Hub
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {isAuthenticated ? (
            <Link href="/fan" className="btn-secondary text-xs">
              Fan Hub
            </Link>
          ) : (
            <Link href="/auth/sign-up" className="btn-primary text-xs">
              Join
            </Link>
          )}

          <details className="relative">
            <summary className="btn-secondary list-none px-3 py-2 text-xs">Menu</summary>
            <div className="absolute right-0 top-12 w-56 rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--bg-card)] p-3 shadow-xl">
              <nav className="flex flex-col gap-1 text-sm text-[color:var(--text-muted)]">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-2 py-2 transition hover:bg-[color:var(--bg-deep)] hover:text-[color:var(--text-main)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-3 flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    <Link href="/fan" className="btn-secondary w-full text-xs">
                      Open Fan Hub
                    </Link>
                    <Link href="/admin" className="btn-primary w-full text-xs">
                      Admin
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/auth/sign-in" className="btn-secondary w-full text-xs">
                      Sign In
                    </Link>
                    <Link href="/auth/sign-up" className="btn-primary w-full text-xs">
                      Join Fan Hub
                    </Link>
                  </>
                )}
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
