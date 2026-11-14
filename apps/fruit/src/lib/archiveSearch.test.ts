import { describe, expect, it } from "vitest";
import {
  buildTitleIndex,
  searchTitles,
  searchUrlCodec,
  snippet,
  splitOnTerms,
} from "./archiveSearch";
import { searchWithState } from "./urlState";

const post = (id: string, title: string) => ({
  id,
  slug: `fruit-${id}`,
  title,
  date: "08-04-2020",
  isoDate: "2020-04-08T16:14:00",
  imageCount: 2,
  reactionCount: 0,
  topicIds: [],
});

describe("archive search", () => {
  const index = buildTitleIndex([post("1", "Sterappel in bloei"), post("2", "Bijen en compost")]);
  const everything = { category: null, postCategoryIds: null };

  it("finds posts by title and returns typed hits", () => {
    expect(searchTitles(index, "sterap", everything)).toEqual([
      {
        id: "1",
        postId: "1",
        url: "/posts/fruit-1/",
        title: "Sterappel in bloei",
        date: "08-04-2020",
        isoDate: "2020-04-08T16:14:00",
        imageCount: 2,
        terms: ["sterappel"],
        block: null,
      },
    ]);
    expect(searchTitles(index, "s", everything)).toEqual([]);
  });

  it("limits hits to a category, and finds nothing until the category ids are known", () => {
    const ids = { "1": ["fruit"], "2": ["natuur"] };
    const titles = (category: string, postCategoryIds: typeof ids | null) =>
      searchTitles(index, "bijen sterappel", { category, postCategoryIds }).map((hit) => hit.id);
    expect(titles("natuur", ids)).toEqual(["2"]);
    expect(titles("natuur", null)).toEqual([]);
  });

  it("keeps what the user typed in the URL and drops an empty query", () => {
    const state = { query: "ster appel ", category: "fruit" };
    const search = searchWithState(searchUrlCodec, state, "");
    expect(searchUrlCodec.parse(new URLSearchParams(search))).toEqual(state);
    expect(searchWithState(searchUrlCodec, { query: "  ", category: null }, search)).toBe("");
    expect(searchUrlCodec.parse(new URLSearchParams("?category=all")).category).toBeNull();
  });

  it("cuts a snippet around the first match and marks every match", () => {
    const block = `${"a ".repeat(200)}sterappel ${"b ".repeat(200)}`;
    expect(snippet(block, ["sterappel"])).toMatch(/^….*sterappel.*…$/);
    expect(snippet("kort", ["x"])).toBe("kort");
    expect(splitOnTerms("Een Sterappel en nog een sterappel.", ["sterappel", "x"])).toEqual([
      "Een ",
      "Sterappel",
      " en nog een ",
      "sterappel",
      ".",
    ]);
  });
});
