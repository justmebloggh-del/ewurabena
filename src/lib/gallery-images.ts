// Curated baseline photos shipped with the site. Images the admin adds via
// the dashboard (stored in media_items) are prepended to this list — these
// static files aren't admin-deletable since they're not database rows.
// Keep this list newest-first: add new photos at the TOP.
export const GALLERY_IMAGES = [
  "/slide-window-bw.jpg",
  "/slide-laugh-coat.jpg",
  "/slide-vest-full.jpg",
  "/slide-vest-smile.jpg",
  "/slide-white-hood-bw.jpg",
  "/slide-white-hood.jpg",
  "/slide-plaid-dance.jpg",
  "/slide-brick-hood.jpg",
  "/slide-brick-smile.jpg",
  "/E77.jpeg",
  "/RED.jpeg",
  "/E7.jpg",
  "/E6.jpg",
  "/E5.jpg",
  "/E4.jpg",
  "/E3.jpg",
  "/e2.jpg",
  "/e1.jpeg",
  "/obuasi.jpeg",
  "/showthem.jpg",
  "/ewusit.jpg",
  "/ewublu.jpg",
  "/ewu.jpg",
  "/ebefam.jpg",
  "/eaa.jpg",
  "/ambassadoralflyer.jpg",
  "/kam.jpg",
  "/rebirth.jpg",
  "/alls.jpg",
  "/earr.jpg",
  "/ep.jpg",
  "/ea.jpg",
  "/all1.jpg",
  "/ea5.jpg",
  "/ea3.jpg",
  "/ea2.jpg",
];

// Single source for every page that shows the gallery (Gallery page, home hero
// slideshow), so a photo added here or in the admin dashboard appears in both.
export function getAllGalleryImages(mediaItems: { kind: string; url: string }[]) {
  const adminImages = mediaItems.filter((item) => item.kind === "image").map((item) => item.url);
  return Array.from(new Set([...adminImages, ...GALLERY_IMAGES]));
}
