import { FanFeed } from "@/components/fan/fan-feed";
import { getFanPosts } from "@/lib/data/fan-hub";
import { getViewer } from "@/lib/data/fan-viewer";
import { getPublicContent } from "@/lib/data/public";

export default async function FanFeedPage() {
  const viewer = await getViewer();
  const [posts, content] = await Promise.all([getFanPosts(viewer?.id ?? null), getPublicContent()]);

  const songs = content.tracks.map((t) => ({ id: t.id, title: t.title, audio_url: t.audio_url }));

  return <FanFeed initialPosts={posts} viewer={viewer} songs={songs} />;
}
