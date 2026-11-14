import { useSyncExternalStore } from "react";

/**
 * The query string as one external store: the page's URL state has a single owner. Components
 * read it with `useUrlState` and change it with `writeUrlState`; nothing mirrors it into React
 * state. The store keeps its own copy of the query, so a refused history write (Safari limits
 * `replaceState` to 100 calls per 30 seconds) never loses what the user typed.
 */
export type HistoryMode = "push" | "replace";

export interface UrlCodec<T> {
  /** Reads the state from the query; unknown or invalid values fall back to defaults. */
  parse: (params: URLSearchParams) => T;
  /** Writes the state into `params`, deleting the keys that are at their default. */
  write: (state: T, params: URLSearchParams) => void;
}

const listeners = new Set<() => void>();
let search: string | null = null;

function readSearch() {
  search ??= window.location.search;
  return search;
}

function handlePopState() {
  search = window.location.search;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) window.addEventListener("popstate", handlePopState);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("popstate", handlePopState);
  };
}

const serverSearch = () => "";

/** The current query string; empty on the server and while hydrating. */
export function useUrlSearch() {
  return useSyncExternalStore(subscribe, readSearch, serverSearch);
}

export function useUrlState<T>(codec: UrlCodec<T>): T {
  return codec.parse(new URLSearchParams(useUrlSearch()));
}

/** The query string that holds `state`, starting from `currentSearch` so other keys survive. */
export function searchWithState<T>(codec: UrlCodec<T>, state: T, currentSearch: string) {
  const params = new URLSearchParams(currentSearch);
  codec.write(state, params);
  const next = params.toString();
  return next ? `?${next}` : "";
}

/** The current path; empty on the server and while hydrating. Changes with `writeUrlState`. */
export function useUrlPathname() {
  return useSyncExternalStore(
    subscribe,
    () => window.location.pathname,
    () => "",
  );
}

/** Writes the state into the URL; `pathname` moves to another page of the same island. */
export function writeUrlState<T>(
  codec: UrlCodec<T>,
  state: T,
  mode: HistoryMode = "replace",
  pathname = window.location.pathname,
) {
  const next = searchWithState(codec, state, readSearch());
  if (next === search && pathname === window.location.pathname) return;
  search = next;
  try {
    const url = `${pathname}${next}${window.location.hash}`;
    window.history[mode === "push" ? "pushState" : "replaceState"](window.history.state, "", url);
  } catch {
    // The browser refused the history entry; the store still holds the state.
  }
  for (const listener of listeners) listener();
}

/** Changes the state starting from what the URL holds now, so handlers never close over stale state. */
export function updateUrlState<T>(
  codec: UrlCodec<T>,
  update: (current: T) => T,
  mode: HistoryMode = "replace",
) {
  writeUrlState(codec, update(codec.parse(new URLSearchParams(readSearch()))), mode);
}

/** Sets or deletes one key: the building block of a codec's `write`. */
export function setParam(params: URLSearchParams, key: string, value: string | null) {
  if (value) params.set(key, value);
  else params.delete(key);
}
