import { describe, expect, it } from "vitest";
import { searchWithState, setParam, type UrlCodec } from "./urlState";

const codec: UrlCodec<{ q: string; page: number }> = {
  parse: (params) => ({ q: params.get("q") ?? "", page: Number(params.get("page") ?? 1) || 1 }),
  write: (state, params) => {
    setParam(params, "q", state.q);
    setParam(params, "page", state.page > 1 ? String(state.page) : null);
  },
};

describe("url state", () => {
  it("round-trips state and drops defaults from the query", () => {
    const search = searchWithState(codec, { q: "sterappel", page: 2 }, "");
    expect(search).toBe("?q=sterappel&page=2");
    expect(codec.parse(new URLSearchParams(search))).toEqual({ q: "sterappel", page: 2 });
    expect(searchWithState(codec, { q: "", page: 1 }, search)).toBe("");
  });

  it("keeps the keys that belong to someone else", () => {
    expect(searchWithState(codec, { q: "peer", page: 1 }, "?utm=x&q=old")).toBe("?utm=x&q=peer");
  });
});
