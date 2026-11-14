import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { generatedResource } from "./generatedData";

function respond(body: unknown, ok = true) {
  return { ok, status: ok ? 200 : 500, json: async () => body, text: async () => "" };
}

type Fetch = (url: string, init?: RequestInit) => Promise<ReturnType<typeof respond>>;

describe("generated data", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("fetches a file once and shares the decoded value", async () => {
    const fetchMock = vi.fn<Fetch>(async () => respond({ count: 3 }));
    vi.stubGlobal("fetch", fetchMock);
    const resource = generatedResource("counts.json", z.object({ count: z.number() }));

    expect(resource.load()).toBe(resource.load());
    await expect(resource.load()).resolves.toEqual({ count: 3 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith("/generated/counts.json", {});
  });

  it("rejects a file of the wrong shape and asks again on the next load", async () => {
    const fetchMock = vi
      .fn<Fetch>()
      .mockResolvedValueOnce(respond({ count: "3" }))
      .mockResolvedValueOnce(respond({ count: 3 }));
    vi.stubGlobal("fetch", fetchMock);
    const resource = generatedResource("counts.json", z.object({ count: z.number() }));

    await expect(resource.load()).rejects.toThrow(/counts\.json.*count/s);
    await expect(resource.load()).resolves.toEqual({ count: 3 });
  });

  it("reports a failed request", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn<Fetch>(async () => respond(null, false)),
    );
    await expect(generatedResource("x.json", z.number()).load()).rejects.toThrow("500");
  });
});
