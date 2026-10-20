import type { Metadata } from "next";

import { ImageGallery } from "@/components/image-gallery";
import { getPublicContent } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Gallery | Ewura Abena",
  description: "Photo gallery of Ewura Abena — Ghanaian-UK gospel minister's ministry moments, worship sessions, events, and life behind the music.",
  alternates: { canonical: "/gallery" },
};

// Curated baseline photos shipped with the site. Images the admin adds via
// the dashboard (stored in media_items) are prepended to this list — these
// static files aren't admin-deletable since they're not database rows.
const GALLERY_IMAGES = [
  "/ea.jpg",
  "/ea2.jpg",
  "/ea3.jpg",
  "/ea5.jpg",
  "/eaa.jpg",
  "/earr.jpg",
  "/ewu.jpg",
  "/ewublu.jpg",
  "/ewusit.jpg",
  "/ebefam.jpg",
  "/ep.jpg",
  "/kam.jpg",
  "/rebirth.jpg",
  "/showthem.jpg",
  "/all1.jpg",
  "/alls.jpg",
  "/ambassadoralflyer.jpg",
];

export default async function GalleryPage() {
  const content = await getPublicContent();
  const adminImages = content.mediaItems.filter((item) => item.kind === "image").map((item) => item.url);
  const images = [...adminImages, ...GALLERY_IMAGES];

  return (
    <ImageGallery images={images} />
  );
}
