import type { ArchivePostReading } from "./archivePostReading";
import { imageMetadata } from "./imageAssets";

/** The images beside a post, each with its metadata when the file is in the repository. */
export async function archivePostSidebarImages(reading: Pick<ArchivePostReading, "imageEntries">) {
  return Promise.all(
    reading.imageEntries.map(async (image) => ({
      ...image,
      metadata: await imageMetadata(image.src),
    })),
  );
}
