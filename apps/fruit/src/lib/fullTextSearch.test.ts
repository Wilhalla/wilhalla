import { describe, expect, it } from "vitest";
import { loadSearchChunk } from "./archiveSearch";
import { fullTextReducer, type FullTextEvent, type FullTextState } from "./fullTextSearch";

const index = loadSearchChunk(
  JSON.stringify({
    documentCount: 0,
    nextId: 0,
    documentIds: {},
    fieldIds: { title: 0, excerpt: 1, block: 2 },
    fieldLength: {},
    averageFieldLength: [],
    storedFields: {},
    dirtCount: 0,
    index: [],
    serializationVersion: 2,
  }),
);
const run = (events: FullTextEvent[], from: FullTextState = { status: "off" }) =>
  events.reduce(fullTextReducer, from);
const loaded: FullTextEvent = { type: "chunkLoaded", index };

describe("full-text search state", () => {
  it("goes from off through loading to ready as the years arrive", () => {
    expect(run([{ type: "requested", total: 2 }])).toEqual({
      status: "loading",
      indexes: [],
      total: 2,
    });
    expect(run([{ type: "requested", total: 2 }, loaded]).status).toBe("loading");
    expect(run([{ type: "requested", total: 2 }, loaded, loaded])).toEqual({
      status: "ready",
      indexes: [index, index],
    });
  });

  it("never reports loading when nothing is in flight", () => {
    const failed = run([
      { type: "requested", total: 3 },
      loaded,
      { type: "failed", message: "500" },
    ]);
    expect(failed).toEqual({ status: "error", indexes: [index], message: "500" });
    // A retry keeps the years that did load.
    expect(run([{ type: "requested", total: 3 }], failed)).toEqual({
      status: "loading",
      indexes: [index],
      total: 3,
    });
    expect(run([loaded, { type: "failed", message: "x" }])).toEqual({ status: "off" });
  });

  it("ignores a second request while loading or ready", () => {
    const loading = run([{ type: "requested", total: 2 }]);
    expect(fullTextReducer(loading, { type: "requested", total: 2 })).toBe(loading);
    const ready = run([loaded, loaded], loading);
    expect(fullTextReducer(ready, { type: "requested", total: 2 })).toBe(ready);
    expect(run([{ type: "requested", total: 0 }])).toEqual({ status: "off" });
  });
});
