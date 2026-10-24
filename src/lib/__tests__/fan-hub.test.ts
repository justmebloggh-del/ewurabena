import { describe, expect, it } from "vitest";

import { fanPostSchema, getDownloadUrl, normalizeSocial } from "@/lib/fan-hub";

describe("normalizeSocial", () => {
  it("turns a handle into a profile URL", () => {
    expect(normalizeSocial("tiktok", "@ewura.fan")).toBe("https://www.tiktok.com/@ewura.fan");
    expect(normalizeSocial("instagram", "ewurafan")).toBe("https://www.instagram.com/ewurafan");
  });

  it("accepts links on the platform's own domain", () => {
    expect(normalizeSocial("facebook", "https://www.facebook.com/EwuraAbenaOfficial")).toBe("https://www.facebook.com/EwuraAbenaOfficial");
    expect(normalizeSocial("x", "https://twitter.com/someone")).toBe("https://twitter.com/someone");
  });

  it("rejects other domains, bad protocols and junk handles", () => {
    expect(normalizeSocial("tiktok", "https://evil.example/@x")).toBeNull();
    expect(normalizeSocial("tiktok", "https://nottiktok.com/@x")).toBeNull();
    expect(normalizeSocial("facebook", "javascript:alert(1)")).toBeNull();
    expect(normalizeSocial("instagram", "has spaces")).toBeNull();
  });

  it("treats empty input as 'not set'", () => {
    expect(normalizeSocial("youtube", "   ")).toBe("");
  });
});

describe("fanPostSchema", () => {
  it("needs a caption, media or a song", () => {
    expect(fanPostSchema.safeParse({ caption: "" }).success).toBe(false);
    expect(fanPostSchema.safeParse({ caption: "Blessed" }).success).toBe(true);
  });

  it("needs media_kind whenever media_url is set", () => {
    expect(fanPostSchema.safeParse({ media_url: "https://x.supabase.co/a.jpg" }).success).toBe(false);
    expect(fanPostSchema.safeParse({ media_url: "https://x.supabase.co/a.jpg", media_kind: "image" }).success).toBe(true);
  });
});

describe("getDownloadUrl", () => {
  it("adds a download name to Supabase storage URLs", () => {
    const url = getDownloadUrl("https://abc.supabase.co/storage/v1/object/public/media/songs/a.mp3", "Grace Overflow!");
    expect(new URL(url!).searchParams.get("download")).toBe("Grace-Overflow.mp3");
  });

  it("returns null for anything that can't be downloaded directly", () => {
    expect(getDownloadUrl("https://www.youtube.com/watch?v=x", "Song")).toBeNull();
    expect(getDownloadUrl("https://evil.example/storage/v1/object/public/a.mp3", "Song")).toBeNull();
    expect(getDownloadUrl(null, "Song")).toBeNull();
  });
});
