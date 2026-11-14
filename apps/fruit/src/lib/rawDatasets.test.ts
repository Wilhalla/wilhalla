import { describe, expect, it } from "vitest";
import {
  buildDataset,
  datasetDefinitions,
  datasetDownload,
  isLongCell,
  summarizeCell,
} from "./rawDatasets";

const definition = (id: string) => {
  const found = datasetDefinitions.find((item) => item.id === id);
  if (!found) throw new Error(`no dataset ${id}`);
  return found;
};

describe("raw datasets", () => {
  it("turns an array file into rows with every cell as text", () => {
    const dataset = buildDataset(definition("topics"), [
      { id: "fruit", postCount: 3, textKeywords: ["appel"], extra: null },
      "los",
    ]);
    expect(dataset.columns.map((column) => column.id)).toEqual([
      "id",
      "label",
      "generatedLabel",
      "postCount",
      "visualKeywords",
      "textKeywords",
      "representativePostIds",
      "extra",
      "index",
      "value",
    ]);
    expect(dataset.rows[0]?.text).toMatchObject({
      id: "fruit",
      postCount: "3",
      textKeywords: '[\n  "appel"\n]',
      label: "",
      extra: "",
    });
    expect(dataset.rows[1]?.raw).toEqual({ index: 1, value: "los" });
    expect(dataset.columns.find((column) => column.id === "id")?.width).toBe("compact");
  });

  it("reads keyed objects and survives a file of the wrong shape", () => {
    expect(
      buildDataset(definition("related-posts"), { "1": ["2", "3"] }).rows.map((row) => row.raw),
    ).toEqual([{ postId: "1", relatedPostIds: ["2", "3"] }]);
    expect(
      buildDataset(definition("post-categories"), { "1": { unitId: "u" } }).rows[0]?.raw,
    ).toEqual({ postId: "1", unitId: "u" });
    expect(buildDataset(definition("post-categories"), null).rows).toEqual([]);
    expect(
      buildDataset(definition("topic-calendar-summary"), { a: 1, topics: [] }).rows,
    ).toHaveLength(1);
    expect(buildDataset(definition("categories"), { categories: [{ id: "x" }] }).rows).toHaveLength(
      1,
    );
  });

  it("measures columns by what they show, collapsing long cells", () => {
    const long = "woord ".repeat(60);
    const dataset = buildDataset(definition("entities"), [{ index: 0, value: long }]);
    expect(isLongCell(long)).toBe(true);
    expect(dataset.columns.find((column) => column.id === "value")?.chars).toBe(120);
    expect(summarizeCell(long)).toHaveLength(121);
    expect(summarizeCell("  ")).toBe("lege waarde");
  });

  it("downloads the raw rows, not their text", () => {
    const dataset = buildDataset(definition("manifest"), { postCount: 3 });
    expect(JSON.parse(datasetDownload(definition("manifest"), dataset))).toEqual({
      file: "manifest.json",
      title: "Pipeline manifest",
      columns: ["key", "value"],
      rows: [{ key: "postCount", value: 3 }],
    });
  });
});
