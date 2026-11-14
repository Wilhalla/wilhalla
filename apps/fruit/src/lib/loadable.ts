import type { GeneratedResource } from "./generatedData";

/** Data that is fetched on request: every state is explicit, an error keeps its reason. */
export type Loadable<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; value: T }
  | { status: "error"; message: string };

export interface LoadableStore<T> {
  get: () => Loadable<T>;
  subscribe: (listener: () => void) => () => void;
  /** Starts the load unless it is running or done; call it from an event handler or on mount. */
  request: () => void;
}

/**
 * A resource as an external store, for data that refines what is already on screen: the page
 * keeps showing what it has while this loads, instead of suspending.
 */
export function loadableStore<T>(resource: GeneratedResource<T>): LoadableStore<T> {
  const listeners = new Set<() => void>();
  let state: Loadable<T> = { status: "idle" };

  const set = (next: Loadable<T>) => {
    state = next;
    for (const listener of listeners) listener();
  };

  return {
    get: () => state,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    request: () => {
      if (state.status === "loading" || state.status === "ready") return;
      set({ status: "loading" });
      resource.load().then(
        (value) => set({ status: "ready", value }),
        (error: unknown) =>
          set({ status: "error", message: error instanceof Error ? error.message : String(error) }),
      );
    },
  };
}
