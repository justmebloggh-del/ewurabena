import type { Metadata } from "next";

import { ArtistBanner } from "@/components/artist-banner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

export const metadata: Metadata = {
  title: "Ewura Abena | Gospel Music & Ministry",
  description:
    "Official portfolio and music platform for Ewura Abena, Soul Gospel Singer, Composer & Songwriter, DOVVSU Ambassador, and Warrior Queen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <SiteHeader />
          <ArtistBanner />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-10">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
