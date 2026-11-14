import { z } from "zod";
import { generatedResource, type GeneratedResource } from "./generatedData";
import { buildDataset, type DatasetDefinition, type LoadedDataset } from "./rawDatasets";

/** One dataset of the data explorer: nothing happens until the reader asks for the table. */
export type DatasetState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; dataset: LoadedDataset };

export const DATASET_IDLE: DatasetState = { status: "idle" };
export const DATASET_LOADING: DatasetState = { status: "loading" };

// The explorer shows any JSON as it is; two datasets can come from one file, fetched once.
const files = new Map<string, GeneratedResource<unknown>>();

function fileResource(source: string) {
  let resource = files.get(source);
  if (!resource) {
    resource = generatedResource(source, z.unknown(), "low");
    files.set(source, resource);
  }
  return resource;
}

/** Fetches and builds a dataset; the result is always a state, never a rejection. */
export async function loadDataset(definition: DatasetDefinition): Promise<DatasetState> {
  try {
    const value = await fileResource(definition.source).load();
    return { status: "ready", dataset: buildDataset(definition, value) };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : String(error) };
  }
}
