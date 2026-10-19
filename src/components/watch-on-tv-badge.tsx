import Link from "next/link";

import { tvLinkFor } from "@/lib/tv-channel";

type Props = {
  trackId: string;
  hasVideo: boolean;
};

// Replaces the per-track YouTube embed/badge — every YouTube video now
// plays through the one "Ewura Abena TV" channel on the homepage instead.
export function WatchOnTvBadge({ trackId, hasVideo }: Props) {
  if (!hasVideo) return null;

  return (
    <Link
      href={tvLinkFor(`track-${trackId}`)}
      className="platform-badge"
      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(157,23,77,0.35)" }}
    >
      ▶ Watch on Ewura Abena TV
    </Link>
  );
}
