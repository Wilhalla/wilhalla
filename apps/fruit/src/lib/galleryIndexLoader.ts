import { z } from "zod";
import { fetchJsonValue, type FetchPriority } from "./clientFetch";
import { galleryImage, galleryIndexManifest, type GalleryImageRecord } from "./generatedTypes";
import { generatedDataUrl } from "./sitePaths";

const imageList = z.array(galleryImage);
const BATCH_SIZE = 4;

async function fetchGenerated<T>(file: string, schema: z.ZodType<T>, priority: FetchPriority) {
  return schema.parse(await fetchJsonValue(generatedDataUrl(file), { priority }));
}

/**
 * Loads the whole image index year by year, a few files at a time, and reports the growing
 * list after each batch (one render per batch instead of one per year). Resolves when every
 * year is in; rejects when the manifest or a year cannot be read.
 */
export async function loadGalleryIndexChunks({
  seed,
  onBatch,
  priority,
}: {
  /** The photos the page was built with; the index adds to and replaces them. */
  seed: readonly GalleryImageRecord[];
  onBatch: (images: GalleryImageRecord[]) => void;
  priority: FetchPriority;
}) {
  const manifest = await fetchGenerated("image-index-chunks.json", galleryIndexManifest, priority);
  const imagesById = new Map(seed.map((image) => [image.id, image]));

  for (let index = 0; index < manifest.chunks.length; index += BATCH_SIZE) {
    const batches = await Promise.all(
      manifest.chunks
        .slice(index, index + BATCH_SIZE)
        .map((chunk) => fetchGenerated(chunk.file, imageList, priority)),
    );
    for (const image of batches.flat()) imagesById.set(image.id, image);
    onBatch([...imagesById.values()]);
  }
}

/** The whole index in one file: the fallback when the year files fail. */
export function loadGalleryIndexFile(priority: FetchPriority) {
  return fetchGenerated("image-index.client.json", imageList, priority);
}
