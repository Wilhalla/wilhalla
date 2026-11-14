import { expect, it } from "vitest";
import { cachedResource } from "./generatedData";
import { loadableStore } from "./loadable";

it("loads on request, once, and tells its subscribers each state", async () => {
  let requests = 0;
  const store = loadableStore(cachedResource("tags.json", async () => (requests += 1)));
  const seen: string[] = [];
  store.subscribe(() => seen.push(store.get().status));

  expect(store.get()).toEqual({ status: "idle" });
  store.request();
  // Asking again while it loads does not start a second request (the bug this replaces
  // aborted its own request each time its loading flag changed).
  store.request();
  await Promise.resolve().then(() => undefined);
  await new Promise((resolve) => setTimeout(resolve, 0));

  expect(requests).toBe(1);
  expect(store.get()).toEqual({ status: "ready", value: 1 });
  expect(seen).toEqual(["loading", "ready"]);
});

it("ends in an error with its reason and tries again when asked", async () => {
  let fail = true;
  const store = loadableStore(
    cachedResource("tags.json", async () => {
      if (fail) throw new Error("503");
      return "tags";
    }),
  );

  store.request();
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(store.get()).toEqual({ status: "error", message: "503" });

  fail = false;
  store.request();
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(store.get()).toEqual({ status: "ready", value: "tags" });
});
