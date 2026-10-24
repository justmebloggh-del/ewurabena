import Image, { type ImageProps } from "next/image";

import { canOptimize } from "@/lib/images";

/**
 * next/image that never breaks on an admin-pasted URL: files we host (and the
 * configured remote hosts) are resized to the visitor's screen and served as
 * WebP/AVIF; any other host is passed through untouched. Always give `sizes`
 * so phones download a phone-sized file instead of the full original.
 */
export function AppImage({ src, ...props }: Omit<ImageProps, "src"> & { src: string }) {
  return <Image src={src} unoptimized={!canOptimize(src)} {...props} />;
}
