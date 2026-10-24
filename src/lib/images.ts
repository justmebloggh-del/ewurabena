// Hosts next.config.ts lets next/image resize (images.remotePatterns). Anything
// else must be served as-is, or next/image throws for an unconfigured host.
const STORAGE_PATH = "/storage/v1/object/public/";

export function canOptimize(src: string): boolean {
  if (src.startsWith("/")) return true;
  try {
    const { protocol, hostname, pathname } = new URL(src);
    if (protocol !== "https:") return false;
    if (hostname === "images.unsplash.com") return true;
    return /\.supabase\.(co|com)$/.test(hostname) && pathname.startsWith(STORAGE_PATH);
  } catch {
    return false;
  }
}
