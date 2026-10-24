import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FanAvatar } from "@/components/fan/fan-avatar";
import { FanFeed } from "@/components/fan/fan-feed";
import { FollowButton } from "@/components/fan/follow-button";
import { getFanPosts, getFanProfile, isFollowing } from "@/lib/data/fan-hub";
import { getViewer } from "@/lib/data/fan-viewer";
import { SOCIAL_PLATFORMS } from "@/lib/fan-hub";
import Link from "next/link";

type Props = { params: Promise<{ id: string }> };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const profile = UUID.test(id) ? await getFanProfile(id) : null;
  return { title: profile ? `${profile.display_name} | Fan Hub` : "Fan Hub", robots: { index: false } };
}

export default async function FanProfilePage({ params }: Props) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const profile = await getFanProfile(id);
  if (!profile) notFound();

  const viewer = await getViewer();
  const [posts, following] = await Promise.all([
    getFanPosts(viewer?.id ?? null, { authorIds: [id] }),
    viewer && viewer.id !== id ? isFollowing(viewer.id, id) : Promise.resolve(false),
  ]);

  const links = SOCIAL_PLATFORMS.filter((p) => profile.socials[p.key]);

  return (
    <div className="fh-stack">
      <section className="fh-card fh-profile-head">
        <FanAvatar author={profile} size={96} />
        <div className="fh-profile-info">
          <h2>{profile.display_name}</h2>
          {profile.bio && <p>{profile.bio}</p>}
          <p className="fh-counts">
            <span><strong>{profile.posts}</strong> posts</span>
            <span><strong>{profile.followers}</strong> followers</span>
            <span><strong>{profile.following}</strong> following</span>
          </p>
          {links.length > 0 && (
            <p className="fh-socials">
              {links.map((p) => (
                <a key={p.key} href={profile.socials[p.key]} target="_blank" rel="noopener noreferrer nofollow ugc" className="fh-chip">
                  {p.label}
                </a>
              ))}
            </p>
          )}
        </div>
        <div className="fh-profile-cta">
          {viewer?.id === id ? (
            <Link href="/fan/profile" className="btn-gold">Edit profile</Link>
          ) : viewer ? (
            <FollowButton userId={id} initialFollowing={following} />
          ) : (
            <Link href="/auth/sign-in" className="btn-primary">Sign in to follow</Link>
          )}
        </div>
      </section>

      <FanFeed initialPosts={posts} viewer={viewer} songs={[]} authorId={id} />
    </div>
  );
}
