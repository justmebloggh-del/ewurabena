import { toEmbeddableVideoUrl } from "@/lib/media";

describe("toEmbeddableVideoUrl", () => {
  it("converts youtu.be links to embed urls", () => {
    const value = toEmbeddableVideoUrl("https://youtu.be/jyp91bsLUkw?si=youCaK3JozSiJPZP");
    expect(value).toBe("https://www.youtube.com/embed/jyp91bsLUkw");
  });

  it("converts youtube watch links to embed urls", () => {
    const value = toEmbeddableVideoUrl("https://www.youtube.com/watch?v=jyp91bsLUkw");
    expect(value).toBe("https://www.youtube.com/embed/jyp91bsLUkw");
  });
});
