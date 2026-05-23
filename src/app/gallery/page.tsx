import type { Metadata } from "next";

import { ImageGallery } from "@/components/image-gallery";

export const metadata: Metadata = {
  title: "Gallery | Ewura Abena",
  description: "Photo gallery of Ewura Abena — ministry moments, worship sessions, events, and life behind the music.",
};

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

export default function GalleryPage() {
  return (
    <ImageGallery images={GALLERY_IMAGES} />
  );
}
