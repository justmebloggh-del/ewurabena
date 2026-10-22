import type { Metadata } from "next";

import { ImageGallery } from "@/components/image-gallery";
import { getPublicContent } from "@/lib/data/public";
import { GALLERY_IMAGES } from "@/lib/gallery-images";

export const metadata: Metadata = {
  title: "Gallery | Ewura Abena",
  description: "Photo gallery of Ewura Abena — Ghanaian-UK gospel minister's ministry moments, worship sessions, events, and life behind the music.",
  alternates: { canonical: "/gallery" },
};

export default async function GalleryPage() {
  const content = await getPublicContent();
  const adminImages = content.mediaItems.filter((item) => item.kind === "image").map((item) => item.url);
  const images = [...adminImages, ...GALLERY_IMAGES];

  return (
    <ImageGallery images={images} />
  );
}
