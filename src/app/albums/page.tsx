import { redirect } from "next/navigation";

// "Albums" was merged into "/music" (one combined Music nav item instead of
// two overlapping ones). Redirect rather than delete the route outright, so
// any existing bookmarks/external links to /albums still land somewhere
// useful instead of 404ing.
export default function AlbumsPage() {
  redirect("/music");
}
