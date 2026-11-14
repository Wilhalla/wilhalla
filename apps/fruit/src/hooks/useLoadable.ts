import { useSyncExternalStore } from "react";
import type { Loadable, LoadableStore } from "../lib/loadable";

const idle = { status: "idle" } as const;

export function useLoadable<T>(store: LoadableStore<T>): Loadable<T> {
  return useSyncExternalStore(store.subscribe, store.get, () => idle);
}
