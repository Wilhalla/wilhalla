import { describe, expect, it } from "vitest";
import { archivePostPartHtml, archivePostPartLabel, type Post } from "./archivePostReading";
import { archivePostSidebarImages } from "./archivePostRendering";
import { postGalleryImageEntries } from "./galleryImageLinks";

function post(overrides: Partial<Post>): Post {
  return {
    id: "1",
    blog: "fruit",
    slug: "one",
    title: "Titel",
    date: "01-01-2008",
    isoDate: "2008-01-01T00:00:00",
    time: "00:00",
    author: "Daniel",
    excerpt: "",
    html: "<h1>Titel</h1><p>Body</p>",
    images: [],
    imageCount: 0,
    reactionCount: 0,
    sourcePath: "",
    reactions: [],
    ...overrides,
  };
}

describe("archive post rendering module", () => {
  it("labels post series parts and strips duplicate legacy titles", () => {
    expect(archivePostPartLabel(1, 3)).toBe("Deel 2 van 3");
    expect(archivePostPartLabel(0, 1)).toBe("Bericht");
    expect(archivePostPartHtml(post({}))).toBe("<p>Body</p>");
  });

  it("lists the sidebar images of every part of a series, in order", async () => {
    const first = post({ id: "1", slug: "one", images: ["/archive-images/a.jpg"], imageCount: 1 });
    const second = post({
      id: "2",
      slug: "two",
      title: "Twee",
      images: ["/archive-images/b.jpg"],
      imageCount: 1,
    });

    const images = await archivePostSidebarImages({
      imageEntries: postGalleryImageEntries([first, second]),
    });
    expect(images.map((image) => image.src)).toEqual([
      "/archive-images/a.jpg",
      "/archive-images/b.jpg",
    ]);
  });
});
