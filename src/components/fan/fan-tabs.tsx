"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/fan", label: "Feed" },
  { href: "/fan/people", label: "Fans" },
  { href: "/fan/official", label: "Ewura Abena" },
  { href: "/fan/music", label: "My Music" },
  { href: "/fan/updates", label: "Updates" },
  { href: "/fan/profile", label: "My Profile" },
];

export function FanTabs() {
  const pathname = usePathname();
  return (
    <nav className="fh-tabs" aria-label="Fan Hub sections">
      {TABS.map((tab) => {
        const active = tab.href === "/fan" ? pathname === "/fan" || pathname.startsWith("/fan/u/") : pathname.startsWith(tab.href);
        return (
          <Link key={tab.href} href={tab.href} className={active ? "is-on" : ""} aria-current={active ? "page" : undefined}>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
