import Link from "next/link";

import { FanAvatar } from "@/components/fan/fan-avatar";
import { FollowButton } from "@/components/fan/follow-button";
import type { FanDirectoryEntry } from "@/lib/data/fan-hub";

export function FanCard({ fan, signedIn }: { fan: FanDirectoryEntry; signedIn: boolean }) {
  return (
    <article className="fh-card fh-fancard">
      <Link href={`/fan/u/${fan.id}`} className="fh-author">
        <FanAvatar author={fan} size={52} />
        <span>
          <strong>
            {fan.display_name}
            {fan.is_official && <span className="fh-badge">✦ Official</span>}
          </strong>
          {fan.bio && <small>{fan.bio.slice(0, 80)}</small>}
        </span>
      </Link>
      {signedIn ? (
        <FollowButton userId={fan.id} initialFollowing={fan.following} />
      ) : (
        <Link href="/auth/sign-in" className="btn-gold">Sign in to follow</Link>
      )}
    </article>
  );
}
