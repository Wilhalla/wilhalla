import { cachedResource, generatedResource } from "./generatedData";
import { relatedImageIds, speciesImageTags } from "./generatedTypes";
import { loadableStore } from "./loadable";

const speciesTags = generatedResource("species-tags.json", speciesImageTags, "low");

/** Data that refines the gallery after it is on screen; each file is requested once per page. */
export const speciesByImageStore = loadableStore(
  cachedResource(
    speciesTags.file,
    async () => new Map((await speciesTags.load()).map((item) => [item.imageId, item.tags])),
  ),
);
export const relatedImagesStore = loadableStore(
  generatedResource("image-related.json", relatedImageIds, "low"),
);
