import { describe, expect, it } from "vitest";
import {
  archiveTopicFilterLabel,
  archiveUrlCodec,
  filterArchivePostsByTopic,
} from "./archiveTopicFilter";
import { searchWithState } from "./urlState";

const topicOf = (search: string) => archiveUrlCodec.parse(new URLSearchParams(search)).topic;

describe("archive topic filtering", () => {
  it("reads the atlas topic query parameter from archive URLs", () => {
    expect(topicOf("?category=familie")).toBe("familie");
    expect(topicOf("?topic=reizen&category=familie")).toBe("familie");
    expect(topicOf("?topic=topic-03")).toBe("topic-03");
    expect(topicOf("?year=2008")).toBeNull();
    expect(searchWithState(archiveUrlCodec, { topic: "eten" }, "?topic=reizen")).toBe(
      "?category=eten",
    );
    expect(searchWithState(archiveUrlCodec, { topic: null }, "?category=eten")).toBe("");
  });

  it("filters archive posts to posts tagged with the active topic", () => {
    const posts = [
      { id: "one", topicIds: ["topic-01"] },
      { id: "series", topicIds: ["topic-02", "topic-03"] },
      { id: "untagged" },
    ];

    expect(filterArchivePostsByTopic(posts, "topic-03").map((post) => post.id)).toEqual(["series"]);
    expect(filterArchivePostsByTopic(posts, "").map((post) => post.id)).toEqual([
      "one",
      "series",
      "untagged",
    ]);
  });

  it("uses human topic labels when a topic filter is active", () => {
    expect(
      archiveTopicFilterLabel(
        { id: "topic-03", label: "Enten en snoeien", generatedLabel: "appel, peren" },
        "topic-03",
      ),
    ).toBe("Enten en snoeien");
    expect(
      archiveTopicFilterLabel(
        { id: "topic-04", label: "Nog te benoemen", generatedLabel: "kwee, fruit" },
        "topic-04",
      ),
    ).toBe("kwee, fruit");
    expect(archiveTopicFilterLabel(undefined, "topic-99")).toBe("topic-99");
  });
});
