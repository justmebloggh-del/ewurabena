import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[color:var(--border-soft)] bg-[color:var(--bg-deep)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-[color:var(--text-muted)] sm:px-6 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Ewura Abena. All rights reserved.</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/contact" className="hover:text-[color:var(--gold)]">
            Booking & Contact
          </Link>
          <Link href="/playlists" className="hover:text-[color:var(--gold)]">
            Music Platforms
          </Link>
        </div>
      </div>
    </footer>
  );
}
