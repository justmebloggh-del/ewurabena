import Link from "next/link";

import { ProfileEditor } from "@/components/fan/profile-editor";
import { requireUser } from "@/lib/auth";
import { getFanProfile } from "@/lib/data/fan-hub";

export default async function MyProfilePage() {
  const user = await requireUser();
  const profile = await getFanProfile(user.id);

  return (
    <div className="fh-stack">
      <ProfileEditor
        userId={user.id}
        initial={{
          display_name: profile?.display_name ?? "Fan",
          bio: profile?.bio ?? "",
          avatar_url: profile?.avatar_url ?? null,
          socials: profile?.socials ?? {},
        }}
      />
      <p className="fh-muted">
        <Link href={`/fan/u/${user.id}`}>View your public profile →</Link>
      </p>
    </div>
  );
}
