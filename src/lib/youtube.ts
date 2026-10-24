// Shared YouTube URL helpers — used by the platform embed player and the
// "Ewura Abena TV" homepage channel so admin-pasted links (watch, youtu.be,
// shorts, playlists) all resolve the same way regardless of which format
// was pasted.

export function toYouTubeEmbed(url: string): string | null {
  if (!url) return null;
  if (url.includes("/results") || url.includes("results?")) return null;
  if (url.includes("youtube.com/embed")) return url;
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") {
      const id = u.pathname.slice(1).split("?")[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
      const list = u.searchParams.get("list");
      if (list) return `https://www.youtube.com/embed/videoseries?list=${list}`;
      if (u.pathname.startsWith("/shorts/")) {
        const id = u.pathname.split("/")[2];
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1).split("?")[0] || null;
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/embed/")) {
        const id = u.pathname.split("/")[2];
        // "videoseries" is YouTube's own placeholder path segment for a
        // playlist embed (?list=...), not a real video id — there's no
        // single thumbnail for a playlist, so don't treat it as one.
        return id && id !== "videoseries" ? id : null;
      }
      const v = u.searchParams.get("v");
      if (v) return v;
      if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/")[2] || null;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function youtubeThumbnail(url: string): string | null {
  const id = extractYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

/**
 * YouTube serves the same thumbnail at several sizes. Admin-pasted links are
 * usually the 1280px "hq720"/"maxres" one — far too big for a 160px list tile
 * on a phone. Swap to the 320x180 version (always exists for every video).
 */
export function smallYouTubeThumbnail(url: string): string {
  const match = url.match(/^(https:\/\/(?:i|img)\.ytimg\.com\/vi\/[\w-]+\/|https:\/\/img\.youtube\.com\/vi\/[\w-]+\/)(?:maxresdefault|sddefault|hqdefault|hq720)\.jpg/);
  return match ? `${match[1]}mqdefault.jpg` : url;
}
