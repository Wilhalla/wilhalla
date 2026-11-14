import type MiniSearch from "minisearch";
import { useSyncExternalStore } from "react";
import { loadSearchChunk } from "./archiveSearch";
import { fetchText } from "./clientFetch";
import type { SearchChunkManifestEntry, SearchDoc } from "./generatedTypes";
import { generatedDataUrl } from "./sitePaths";

type Indexes = readonly MiniSearch<SearchDoc>[];

/**
 * The full-text index loads one year at a time, on request. `indexes` are the years loaded so
 * far, newest first; results already use them while the rest arrives.
 */
export type FullTextState =
  | { status: "off" }
  | { status: "loading"; indexes: Indexes; total: number }
  | { status: "ready"; indexes: Indexes }
  | { status: "error"; indexes: Indexes; message: string };

export type FullTextEvent =
  | { type: "requested"; total: number }
  | { type: "chunkLoaded"; index: MiniSearch<SearchDoc> }
  | { type: "failed"; message: string };

const OFF: FullTextState = { status: "off" };

export function loadedIndexes(state: FullTextState): Indexes {
  return state.status === "off" ? [] : state.indexes;
}

export function fullTextReducer(state: FullTextState, event: FullTextEvent): FullTextState {
  switch (event.type) {
    case "requested":
      // A request while loading or ready changes nothing; after an error it resumes.
      if (state.status === "loading" || state.status === "ready" || event.total === 0) return state;
      return { status: "loading", indexes: loadedIndexes(state), total: event.total };
    case "chunkLoaded": {
      if (state.status !== "loading") return state;
      const indexes = [...state.indexes, event.index];
      return indexes.length >= state.total
        ? { status: "ready", indexes }
        : { status: "loading", indexes, total: state.total };
    }
    case "failed":
      if (state.status !== "loading") return state;
      return { status: "error", indexes: state.indexes, message: event.message };
  }
}

let state: FullTextState = OFF;
const listeners = new Set<() => void>();

function dispatch(event: FullTextEvent) {
  const next = fullTextReducer(state, event);
  if (next === state) return;
  state = next;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useFullTextSearch() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => OFF,
  );
}

async function loadChunks(chunks: readonly SearchChunkManifestEntry[]) {
  try {
    for (const chunk of chunks) {
      const json = await fetchText(generatedDataUrl(chunk.file), { priority: "low" });
      dispatch({ type: "chunkLoaded", index: loadSearchChunk(json) });
      // Let the page paint and handle input between two years.
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  } catch (error) {
    dispatch({ type: "failed", message: error instanceof Error ? error.message : String(error) });
  }
}

/** Starts (or, after an error, resumes) loading the full-text index. Call it from an event handler. */
export function requestFullText(chunks: readonly SearchChunkManifestEntry[]) {
  const before = state;
  dispatch({ type: "requested", total: chunks.length });
  if (state !== before) void loadChunks(chunks.slice(loadedIndexes(state).length));
}
