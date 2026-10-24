import type { Metadata } from "next";

import { FanTabs } from "@/components/fan/fan-tabs";

export const metadata: Metadata = {
  title: "Fan Hub | Ewura Abena",
  description:
    "The Ewura Abena community — share photos and videos, post what you're listening to, follow other fans, save favourites, build playlists and catch ministry updates.",
  alternates: { canonical: "/fan" },
};

export default function FanLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fh-wrap">
      <header className="fh-hero">
        <p className="gold-label">Ewura Abena Community</p>
        <h1>Fan Hub</h1>
        <p>Share how her music moves you. Post photos and videos, pick your favourite songs, follow fellow fans and stay close to the ministry.</p>
      </header>
      <FanTabs />
      {children}
    </div>
  );
}
