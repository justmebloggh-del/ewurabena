import type { Metadata } from "next";

import { ImageGallery } from "@/components/image-gallery";
import { getPublicContent } from "@/lib/data/public";
import { getAllGalleryImages } from "@/lib/gallery-images";

export const metadata: Metadata = {
  title: "Gallery | Ewura Abena",
  description: "Photo gallery of Ewura Abena — Ghanaian-UK gospel minister's ministry moments, worship sessions, events, and life behind the music.",
  alternates: { canonical: "/gallery" },
};

export default async function GalleryPage() {
  const content = await getPublicContent();
  const images = getAllGalleryImages(content.mediaItems);

  return (
    <ImageGallery images={images} />
  );
}
