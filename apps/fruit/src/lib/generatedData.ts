import { fetchJsonValue, fetchText, type FetchPriority } from "./clientFetch";
import { archiveClientPayload, mapPoint, postCategoryIds } from "./generatedTypes";
import { generatedDataUrl } from "./sitePaths";
import { z } from "zod";

export interface GeneratedResource<T> {
  file: string;
  /** The decoded file; one request per page load, shared by every caller. Read it with `use()`. */
  load: () => Promise<T>;
}

/** A value built once per page load from other resources; `file` names it in errors. */
export function cachedResource<T>(file: string, request: () => Promise<T>): GeneratedResource<T> {
  let promise: Promise<T> | undefined;
  return {
    file,
    load: () => {
      promise ??= request().catch((error: unknown) => {
        // A failed load is not cached, so a retry asks again.
        promise = undefined;
        throw error;
      });
      return promise;
    },
  };
}

/** A JSON file under `/generated/`, checked against `schema` when it arrives. */
export function generatedResource<T>(
  file: string,
  schema: z.ZodType<T>,
  priority?: FetchPriority,
): GeneratedResource<T> {
  return cachedResource(file, async () => {
    const result = schema.safeParse(await fetchJsonValue(generatedDataUrl(file), { priority }));

    if (!result.success) {
      throw new Error(`${file} heeft niet de verwachte vorm: ${z.prettifyError(result.error)}`);
    }

    return result.data;
  });
}

/** A file under `/generated/` as text, turned into a value by `build` (a serialized index). */
export function generatedTextResource<T>(
  file: string,
  build: (text: string) => T,
  priority?: FetchPriority,
): GeneratedResource<T> {
  return cachedResource(file, async () =>
    build(await fetchText(generatedDataUrl(file), { priority })),
  );
}

export const mapPointsResource = generatedResource("map-points.json", z.array(mapPoint));
export const archivePostsResource = generatedResource(
  "archive-posts.client.json",
  archiveClientPayload,
);
export const postCategoryIdsResource = generatedResource("post-category-ids.json", postCategoryIds);
