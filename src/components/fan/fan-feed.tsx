"use client";

import { useCallback, useState } from "react";

import { PostCard, type Viewer } from "@/components/fan/post-card";
import { PostComposer, type SongOption } from "@/components/fan/post-composer";
import { FAN_PAGE_SIZE, type FanPost } from "@/lib/fan-hub";

type FeedKind = "all" | "following" | "official";

type Props = {
  initialPosts: FanPost[];
  viewer: Viewer | null;
  songs: SongOption[];
  /** Show the composer and the All / Following switch (main feed), or just a profile's posts. */
  authorId?: string;
};

export function FanFeed({ initialPosts, viewer, songs, authorId }: Props) {
  const [posts, setPosts] = useState(initialPosts);
  const [feed, setFeed] = useState<FeedKind>("all");
  const [hasMore, setHasMore] = useState(initialPosts.length >= FAN_PAGE_SIZE);
  const [loading, setLoading] = useState(false);

  const query = useCallback(
    (extra: Record<string, string> = {}, feedKind: FeedKind = feed) => {
      const params = new URLSearchParams(extra);
      if (authorId) params.set("author", authorId);
      else if (feedKind !== "all") params.set("feed", feedKind);
      return `/api/fan/posts?${params.toString()}`;
    },
    [authorId, feed],
  );

  const reload = useCallback(
    async (feedKind: FeedKind = feed) => {
      setLoading(true);
      const response = await fetch(query({}, feedKind));
      const data = await response.json().catch(() => ({ posts: [] }));
      setPosts(data.posts ?? []);
      setHasMore((data.posts ?? []).length >= FAN_PAGE_SIZE);
      setLoading(false);
    },
    [feed, query],
  );

  async function loadMore() {
    const last = posts[posts.length - 1];
    if (!last) return;
    setLoading(true);
    const response = await fetch(query({ before: last.created_at }));
    const data = await response.json().catch(() => ({ posts: [] }));
    const more: FanPost[] = data.posts ?? [];
    setPosts((current) => [...current, ...more.filter((p) => !current.some((c) => c.id === p.id))]);
    setHasMore(more.length >= FAN_PAGE_SIZE);
    setLoading(false);
  }

  function switchFeed(next: FeedKind) {
    setFeed(next);
    reload(next);
  }

  return (
    <div className="fh-stack">
      {!authorId && <PostComposer viewer={viewer} songs={songs} onPosted={() => reload()} />}

      {!authorId && (
        <div className="fh-switch" role="tablist" aria-label="Feed">
          <button type="button" role="tab" aria-selected={feed === "all"} className={feed === "all" ? "is-on" : ""} onClick={() => switchFeed("all")}>
            Everyone
          </button>
          <button type="button" role="tab" aria-selected={feed === "official"} className={feed === "official" ? "is-on" : ""} onClick={() => switchFeed("official")}>
            ✦ Ewura Abena
          </button>
          {viewer && (
            <button type="button" role="tab" aria-selected={feed === "following"} className={feed === "following" ? "is-on" : ""} onClick={() => switchFeed("following")}>
              Following
            </button>
          )}
        </div>
      )}

      {posts.length === 0 && !loading && (
        <div className="fh-card fh-empty">
          <p>
            {feed === "following"
              ? "Follow other fans to see their posts here."
              : feed === "official"
                ? "Ewura Abena hasn't posted here yet. Check back soon."
              : authorId
                ? "No posts yet."
                : "No posts yet — be the first to share how Ewura Abena's music moves you."}
          </p>
        </div>
      )}

      {posts.map((post) => (
        <PostCard key={post.id} post={post} viewer={viewer} onDeleted={(id) => setPosts((list) => list.filter((p) => p.id !== id))} />
      ))}

      {hasMore && (
        <button type="button" className="btn-gold fh-more" onClick={loadMore} disabled={loading}>
          {loading ? "Loading…" : "Load more"}
        </button>
      )}
    </div>
  );
}
