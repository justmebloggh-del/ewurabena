import { FAN_PAGE_SIZE, type FanPost, type FanProfile, type Socials } from "@/lib/fan-hub";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

type PostRow = {
  id: string;
  created_at: string;
  caption: string | null;
  media_url: string | null;
  media_kind: "image" | "video" | null;
  author: { id: string; display_name: string; avatar_url: string | null; is_official: boolean } | null;
  track: { id: string; title: string; audio_url: string | null } | null;
  likes: { count: number }[] | null;
  comments: { count: number }[] | null;
};

const POST_SELECT = `
  id, created_at, caption, media_url, media_kind,
  author:fan_profiles!fan_posts_author_id_fkey(id, display_name, avatar_url, is_official),
  track:tracks(id, title, audio_url),
  likes:fan_post_likes(count),
  comments:fan_post_comments(count)
`;

export type FeedFilter = { authorIds?: string[]; before?: string; officialOnly?: boolean };

/** Newest-first page of posts, optionally limited to some authors and/or older than a timestamp. */
export async function getFanPosts(viewerId: string | null, filter: FeedFilter = {}): Promise<FanPost[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createSupabaseServerClient();

  let query = supabase.from("fan_posts").select(POST_SELECT).order("created_at", { ascending: false }).limit(FAN_PAGE_SIZE);
  if (filter.authorIds) query = query.in("author_id", filter.authorIds);
  if (filter.officialOnly) {
    const { data: official } = await supabase.from("fan_profiles").select("id").eq("is_official", true);
    query = query.in("author_id", (official ?? []).map((o) => o.id as string));
  }
  if (filter.before) query = query.lt("created_at", filter.before);

  const { data, error } = await query;
  if (error || !data) return [];
  const rows = data as unknown as PostRow[];

  let likedIds = new Set<string>();
  if (viewerId && rows.length > 0) {
    const { data: mine } = await supabase
      .from("fan_post_likes")
      .select("post_id")
      .eq("user_id", viewerId)
      .in("post_id", rows.map((r) => r.id));
    likedIds = new Set((mine ?? []).map((m) => m.post_id as string));
  }

  return rows
    .filter((r) => r.author)
    .map((r) => ({
      id: r.id,
      created_at: r.created_at,
      caption: r.caption,
      media_url: r.media_url,
      media_kind: r.media_kind,
      author: r.author!,
      track: r.track,
      like_count: r.likes?.[0]?.count ?? 0,
      comment_count: r.comments?.[0]?.count ?? 0,
      liked_by_me: likedIds.has(r.id),
    }));
}

export async function getFollowingIds(viewerId: string): Promise<string[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("fan_follows").select("following_id").eq("follower_id", viewerId);
  return (data ?? []).map((r) => r.following_id as string);
}

export async function getFanProfile(id: string): Promise<(FanProfile & { followers: number; following: number; posts: number }) | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createSupabaseServerClient();

  const { data: profile } = await supabase
    .from("fan_profiles")
    .select("id, display_name, avatar_url, is_official, bio, socials, created_at")
    .eq("id", id)
    .maybeSingle();
  if (!profile) return null;

  const [followers, following, posts] = await Promise.all([
    supabase.from("fan_follows").select("*", { count: "exact", head: true }).eq("following_id", id),
    supabase.from("fan_follows").select("*", { count: "exact", head: true }).eq("follower_id", id),
    supabase.from("fan_posts").select("*", { count: "exact", head: true }).eq("author_id", id),
  ]);

  return {
    ...(profile as Omit<FanProfile, "socials"> & { socials: Socials | null }),
    socials: (profile.socials as Socials | null) ?? {},
    followers: followers.count ?? 0,
    following: following.count ?? 0,
    posts: posts.count ?? 0,
  };
}

export async function isFollowing(viewerId: string, targetId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("fan_follows")
    .select("follower_id")
    .eq("follower_id", viewerId)
    .eq("following_id", targetId)
    .maybeSingle();
  return Boolean(data);
}

export type FanDirectoryEntry = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  is_official: boolean;
  bio: string | null;
  following: boolean;
};

/** Fans to discover and follow: official account first, then newest members. Optional name search. */
export async function getFanDirectory(viewerId: string | null, search = ""): Promise<FanDirectoryEntry[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from("fan_profiles")
    .select("id, display_name, avatar_url, is_official, bio")
    .order("is_official", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(60);

  const term = search.replace(/[%_,()]/g, " ").trim().slice(0, 40);
  if (term) query = query.ilike("display_name", `%${term}%`);
  if (viewerId) query = query.neq("id", viewerId);

  const { data } = await query;
  const followingIds = new Set(viewerId ? await getFollowingIds(viewerId) : []);

  return (data ?? []).map((row) => ({ ...(row as Omit<FanDirectoryEntry, "following">), following: followingIds.has(row.id as string) }));
}
