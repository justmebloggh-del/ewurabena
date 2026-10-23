// Curated baseline photos shipped with the site. Images the admin adds via
// the dashboard (stored in media_items) are prepended to this list — these
// static files aren't admin-deletable since they're not database rows.
export const GALLERY_IMAGES = [
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
  "/E3.jpg",
  "/E4.jpg",
  "/E5.jpg",
  "/E6.jpg",
  "/E7.jpg",
  "/E77.jpeg",
  "/RED.jpeg",
  "/e1.jpeg",
  "/e2.jpg",
  "/obuasi.jpeg",
];

// Single source for every page that shows the gallery (Gallery page, home hero
// slideshow), so a photo added here or in the admin dashboard appears in both.
export function getAllGalleryImages(mediaItems: { kind: string; url: string }[]) {
  const adminImages = mediaItems.filter((item) => item.kind === "image").map((item) => item.url);
  return Array.from(new Set([...adminImages, ...GALLERY_IMAGES]));
}
