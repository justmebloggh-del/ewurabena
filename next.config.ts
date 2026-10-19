import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      // Supabase storage
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // Unsplash (used in album fallbacks)
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Common CDN patterns
      {
        protocol: "https",
        hostname: "*.supabase.com",
        pathname: "/storage/v1/object/public/**",
      },
      // Local Supabase (via `supabase start`) during development only —
      // never matches in a production build, so this adds no attack
      // surface there.
      ...(process.env.NODE_ENV !== "production"
        ? [
            {
              protocol: "http" as const,
              hostname: "127.0.0.1",
              port: "54521",
              pathname: "/storage/v1/object/public/**",
            },
            {
              protocol: "http" as const,
              hostname: "localhost",
              port: "54521",
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
    ],
  },

  async headers() {
    // Long-lived "immutable" caching is only safe in a real production
    // build, where Next.js guarantees a static asset's filename changes
    // whenever its content changes. In `next dev` (especially Turbopack),
    // that guarantee doesn't reliably hold across restarts/HMR, so a
    // 1-year cache here can silently serve stale JS/CSS to the browser
    // after a code change — exactly the kind of stale-bundle hydration
    // mismatch this caused during development. Dev gets short/no caching
    // instead so every reload actually reflects current code.
    const isProd = process.env.NODE_ENV === "production";
    const longCache = isProd
      ? "public, max-age=31536000, immutable"
      : "no-cache, must-revalidate";
    const dayCache = isProd
      ? "public, max-age=86400, stale-while-revalidate=604800"
      : "no-cache, must-revalidate";

    return [
      {
        // Static assets (hashed filenames from Next.js)
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: longCache }],
      },
      {
        // Optimized images from Next.js image CDN
        source: "/_next/image",
        headers: [{ key: "Cache-Control", value: dayCache }],
      },
      {
        // Logo
        source: "/ewuraabenalogo.png",
        headers: [{ key: "Cache-Control", value: longCache }],
      },
      {
        // Public image assets
        source: "/:path*.jpg",
        headers: [{ key: "Cache-Control", value: dayCache }],
      },
      {
        // Security headers on all routes
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Permissions-Policy", value: "compute-pressure=*, camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
