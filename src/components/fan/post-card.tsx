"use client";

import Link from "next/link";
import { useState } from "react";

import { FanAvatar } from "@/components/fan/fan-avatar";
import { playTrackInline } from "@/components/play-track-button";
import { getDownloadUrl, type FanComment, type FanPost } from "@/lib/fan-hub";

export type Viewer = { id: string; display_name: string; avatar_url: string | null; isAdmin: boolean };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

type Props = {
  post: FanPost;
  viewer: Viewer | null;
  onDeleted: (id: string) => void;
};

export function PostCard({ post, viewer, onDeleted }: Props) {
  const [liked, setLiked] = useState(post.liked_by_me);
  const [likeCount, setLikeCount] = useState(post.like_count);
  const [commentCount, setCommentCount] = useState(post.comment_count);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<FanComment[] | null>(null);
  const [draft, setDraft] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  // Ewura Abena's own posts can be saved by fans.
  const mediaDownload = post.author.is_official ? getDownloadUrl(post.media_url, post.caption || post.track?.title || "ewura-abena") : null;
  const audioDownload = post.author.is_official && post.track ? getDownloadUrl(post.track.audio_url, post.track.title) : null;

  const canDelete = viewer && (viewer.id === post.author.id || viewer.isAdmin);

  function requireSignIn() {
    window.location.href = "/auth/sign-in";
  }

  async function toggleLike() {
    if (!viewer) return requireSignIn();
    const next = !liked;
    setLiked(next);
    setLikeCount((c) => c + (next ? 1 : -1));
    const response = await fetch(`/api/fan/posts/${post.id}/like`, { method: "POST" });
    if (!response.ok) {
      setLiked(!next);
      setLikeCount((c) => c + (next ? -1 : 1));
    }
  }

  async function openComments() {
    const next = !showComments;
    setShowComments(next);
    if (next && comments === null) {
      const response = await fetch(`/api/fan/posts/${post.id}/comments`);
      const data = await response.json().catch(() => null);
      setComments(response.ok ? data.comments : []);
    }
  }

  async function addComment(event: React.FormEvent) {
    event.preventDefault();
    if (!viewer) return requireSignIn();
    if (!draft.trim()) return;
    setBusy(true);
    setNote("");
    const response = await fetch(`/api/fan/posts/${post.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: draft }),
    });
    const data = await response.json().catch(() => ({}));
    setBusy(false);
    if (!response.ok) return setNote(data.error || "Could not post your comment.");
    setComments((list) => [...(list ?? []), data.comment]);
    setCommentCount((c) => c + 1);
    setDraft("");
  }

  async function removeComment(id: string) {
    const response = await fetch(`/api/fan/comments/${id}`, { method: "DELETE" });
    if (response.ok) {
      setComments((list) => (list ?? []).filter((c) => c.id !== id));
      setCommentCount((c) => Math.max(0, c - 1));
    }
  }

  async function deletePost() {
    if (!window.confirm("Delete this post?")) return;
    const response = await fetch(`/api/fan/posts?id=${post.id}`, { method: "DELETE" });
    if (response.ok) onDeleted(post.id);
    else setNote("Could not delete this post.");
  }

  async function report() {
    if (!viewer) return requireSignIn();
    const reason = window.prompt("What's wrong with this post? (optional)") ?? null;
    if (reason === null) return;
    const response = await fetch(`/api/fan/posts/${post.id}/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    setNote(response.ok ? "Thanks — we'll review this post." : "Could not send your report.");
  }

  return (
    <article className="fh-card fh-post">
      <header className="fh-post-head">
        <Link href={`/fan/u/${post.author.id}`} className="fh-author">
          <FanAvatar author={post.author} />
          <span>
            <strong>
              {post.author.display_name}
              {post.author.is_official && <span className="fh-badge" title="Official account">✦ Official</span>}
            </strong>
            <small>{formatDate(post.created_at)}</small>
          </span>
        </Link>
        <span className="fh-post-actions-top">
          {viewer && viewer.id !== post.author.id && (
            <button type="button" className="fh-link" onClick={report}>Report</button>
          )}
          {canDelete && (
            <button type="button" className="fh-link fh-danger" onClick={deletePost}>Delete</button>
          )}
        </span>
      </header>

      {post.caption && <p className="fh-caption">{post.caption}</p>}

      {post.media_url && post.media_kind === "image" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.media_url} alt={post.caption || `Photo by ${post.author.display_name}`} className="fh-media" loading="lazy" />
      )}
      {post.media_url && post.media_kind === "video" && (
        <video src={post.media_url} className="fh-media" controls playsInline preload="metadata" />
      )}

      {post.track && (
        <div className="fh-song">
          <span className="fh-song-icon" aria-hidden="true">♪</span>
          <span className="fh-song-text">
            <small>Listening to</small>
            <strong>{post.track.title}</strong>
            <small>Ewura Abena</small>
          </span>
          {post.track.audio_url && (
            <button type="button" className="btn-primary fh-song-play" onClick={() => playTrackInline({ id: post.track!.id, title: post.track!.title, audio_url: post.track!.audio_url ?? undefined })}>
              ▶ Play
            </button>
          )}
        </div>
      )}

      <footer className="fh-post-foot">
        <button type="button" className={`fh-action${liked ? " is-on" : ""}`} onClick={toggleLike} aria-pressed={liked}>
          {liked ? "♥" : "♡"} {likeCount}
        </button>
        <button type="button" className="fh-action" onClick={openComments} aria-expanded={showComments}>
          💬 {commentCount}
        </button>
        {mediaDownload && (
          viewer ? (
            <a className="fh-action" href={mediaDownload} download>⬇ Download {post.media_kind}</a>
          ) : (
            <a className="fh-action" href="/auth/sign-in">⬇ Sign in to download</a>
          )
        )}
        {audioDownload && (
          viewer ? (
            <a className="fh-action" href={audioDownload} download>⬇ Download song</a>
          ) : (
            <a className="fh-action" href="/auth/sign-in">⬇ Sign in to download</a>
          )
        )}
        {note && <span className="fh-note">{note}</span>}
      </footer>

      {showComments && (
        <div className="fh-comments">
          {comments === null && <p className="fh-muted">Loading…</p>}
          {comments?.map((comment) => (
            <div key={comment.id} className="fh-comment">
              <Link href={`/fan/u/${comment.author.id}`}><FanAvatar author={comment.author} size={28} /></Link>
              <div>
                <Link href={`/fan/u/${comment.author.id}`}><strong>{comment.author.display_name}</strong></Link>
                <p>{comment.body}</p>
              </div>
              {viewer && (viewer.id === comment.author.id || viewer.isAdmin) && (
                <button type="button" className="fh-link fh-danger" onClick={() => removeComment(comment.id)}>Delete</button>
              )}
            </div>
          ))}
          {viewer ? (
            <form onSubmit={addComment} className="fh-comment-form">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                maxLength={300}
                placeholder="Write a comment…"
                aria-label="Write a comment"
              />
              <button type="submit" className="btn-primary" disabled={busy || !draft.trim()}>Post</button>
            </form>
          ) : (
            <p className="fh-muted"><Link href="/auth/sign-in">Sign in</Link> to join the conversation.</p>
          )}
        </div>
      )}
    </article>
  );
}
