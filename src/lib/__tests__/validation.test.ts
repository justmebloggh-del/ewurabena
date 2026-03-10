import {
  contactSubmissionSchema,
  favoriteSchema,
  fanPlaylistSchema,
  nullableString,
} from "@/lib/validation";

describe("validation", () => {
  it("accepts valid contact payload", () => {
    const result = contactSubmissionSchema.safeParse({
      name: "Ada Mensah",
      email: "ada@example.com",
      message: "We would like to invite Ewura Abena to minister.",
      organization: "Revival Chapel",
      event_date: "2026-10-21",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid favorite payload when both ids are provided", () => {
    const result = favoriteSchema.safeParse({
      track_id: crypto.randomUUID(),
      album_id: crypto.randomUUID(),
    });

    expect(result.success).toBe(false);
  });

  it("defaults fan playlists to private", () => {
    const result = fanPlaylistSchema.parse({ title: "Prayer Set" });
    expect(result.is_private).toBe(true);
  });

  it("normalizes blank strings to null", () => {
    expect(nullableString("  ")).toBeNull();
    expect(nullableString("https://example.com")).toBe("https://example.com");
  });
});
