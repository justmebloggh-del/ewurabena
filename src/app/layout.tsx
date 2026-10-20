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
  themeColor: "#9D174D",
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ewuraabena.com";

// Interim share image reusing an existing brand photo — replace with a
// dedicated 1200x630 branded graphic when one is available.
const SHARE_IMAGE = "/ea3.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
    images: [{ url: SHARE_IMAGE, width: 1200, height: 1500, alt: "Ewura Abena" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ewura Abena | Global Gospel Minister",
    description: "A voice of light, love, healing, and unwavering faith.",
    images: [SHARE_IMAGE],
  },
  // Set once a property is added in Google Search Console (Settings >
  // Ownership verification > HTML tag) — paste just the content value,
  // not the whole <meta> tag.
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
};

const PERSON_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ewura Abena",
  alternateName: "Warrior Queen",
  description:
    "Global Gospel Minister, Worship Leader, Singer, Composer, Songwriter, and DOVVSU Ambassador — a voice of light, love, healing, and unwavering faith.",
  jobTitle: ["Gospel Minister", "Worship Leader", "Singer", "Songwriter"],
  nationality: "Ghanaian",
  url: SITE_URL,
  image: `${SITE_URL}${SHARE_IMAGE}`,
  sameAs: [
    "https://open.spotify.com/artist/66omcxaARiacfGoXuXiHXQ",
    "https://music.apple.com/gb/artist/ewura-abena/994868905",
    "https://audiomack.com/ewuraabenamusiq",
    "https://www.boomplay.com/share/artist/2829036",
    "https://www.youtube.com/playlist?list=PLX0PJMHFz9wbcpUJ3UpjsZLqbcsdrQZuc",
    "https://www.instagram.com/ewuraabenamusiq",
    "https://www.facebook.com/EwuraAbenaOfficial",
    "https://www.tiktok.com/@ewuraabenamusiq",
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_JSON_LD) }}
        />
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
