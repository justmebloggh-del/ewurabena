import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Poppins } from "next/font/google";
import { Suspense } from "react";

import { FloatingMusicPlayer } from "@/components/floating-music-player";
import { NavClient } from "@/components/nav-client";
import { ScrollRevealInit } from "@/components/scroll-reveal-init";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

// Self-hosted via next/font — no render-blocking Google Fonts request
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
  preload: true,
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0F5B3A",
};

export const metadata: Metadata = {
  title: "Ewura Abena | Global Gospel Minister & Warrior Queen",
  description:
    "Official website of Ewura Abena — Global Gospel Minister, Worship Leader, Singer, Composer, Songwriter, and DOVVSU Ambassador. A voice of light, love, healing, and unwavering faith.",
  keywords: [
    "Ewura Abena",
    "Gospel music",
    "Worship minister",
    "Worship leader",
    "Christian music artist",
    "Gospel singer Ghana",
    "Global gospel minister",
    "Warrior Queen",
    "DOVVSU Ambassador",
    "Inspirational gospel music",
  ],
  openGraph: {
    title: "Ewura Abena | Global Gospel Minister & Warrior Queen",
    description: "A voice of light, love, healing, and unwavering faith.",
    type: "website",
    locale: "en_GB",
    siteName: "Ewura Abena Official",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ewura Abena | Global Gospel Minister",
    description: "A voice of light, love, healing, and unwavering faith.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${poppins.variable}`}>
      <head>
        {/* Preconnect for embedded streaming players */}
        <link rel="preconnect" href="https://open.spotify.com" />
        <link rel="dns-prefetch" href="https://open.spotify.com" />
        <link rel="dns-prefetch" href="https://embed.music.apple.com" />
        <link rel="dns-prefetch" href="https://audiomack.com" />
        <link rel="dns-prefetch" href="https://www.youtube.com" />
        <link rel="dns-prefetch" href="https://www.boomplay.com" />
      </head>
      <body>
        <div className="app-shell">
          <Suspense fallback={<NavClient isAuthenticated={false} />}>
            <SiteHeader />
          </Suspense>
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        <FloatingMusicPlayer />
        <ScrollRevealInit />
      </body>
    </html>
  );
}
