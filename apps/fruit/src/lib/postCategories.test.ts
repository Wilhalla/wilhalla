import { describe, expect, it } from "vitest";
import { pointsByPostId } from "./postCategories";

describe("post categories", () => {
  it("maps every post of a story to that story, and a single post to itself", () => {
    const series = { id: "post-1", postIds: ["1", "2"] };
    const single = { id: "3", postIds: [] };
    const byPostId = pointsByPostId([series, single, { id: "4" }]);
    expect(byPostId.get("1")).toBe(series);
    expect(byPostId.get("2")).toBe(series);
    expect(byPostId.get("3")).toBe(single);
    expect([...byPostId.keys()]).toEqual(["1", "2", "3", "4"]);
  });
});
