import { getPublicContent } from "@/lib/data/public";

describe("public content", () => {
  it("returns sample fallback content when Supabase env is missing", async () => {
    const previousUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const previousKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const previousPublishable = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    const content = await getPublicContent();

    expect(content.profile.stage_name).toBe("Ewura Abena");
    expect(content.albums.length).toBeGreaterThan(0);

    if (previousUrl) process.env.NEXT_PUBLIC_SUPABASE_URL = previousUrl;
    if (previousKey) process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = previousKey;
    if (previousPublishable) process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = previousPublishable;
  });
});
