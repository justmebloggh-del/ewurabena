import type { FanAuthor } from "@/lib/fan-hub";

export function FanAvatar({ author, size = 40 }: { author: Pick<FanAuthor, "display_name" | "avatar_url">; size?: number }) {
  const initials = author.display_name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return author.avatar_url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={author.avatar_url} alt="" width={size} height={size} className="fh-avatar" style={{ width: size, height: size }} />
  ) : (
    <span className="fh-avatar fh-avatar-fallback" style={{ width: size, height: size, fontSize: size * 0.38 }} aria-hidden="true">
      {initials || "F"}
    </span>
  );
}
