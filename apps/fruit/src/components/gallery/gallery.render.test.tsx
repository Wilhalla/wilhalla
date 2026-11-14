import { renderToString } from "react-dom/server";
import { expect, it } from "vitest";
import groups from "../../data/generated/gallery-groups.json";
import initialImages from "../../data/generated/image-index.initial.json";
import { defaultGalleryFilters } from "../../lib/galleryFilters";
import GalleryApp from "./GalleryApp";
import GalleryViewerApp from "./GalleryViewerApp";
import ViewerImagePage from "./ViewerImagePage";

const [image] = initialImages;

it("renders the archive grid on the server with the photos the page was built with", () => {
  const html = renderToString(<GalleryApp initialImages={initialImages} groups={groups} />);

  expect(html).toContain("Beeldarchief");
  expect(html).toContain(`${initialImages.length} foto&#x27;s`);
  expect(html).toContain("Beeldarchief filters");
});

it("renders the viewer for a photo: toolbar, stage and what the photo is about", () => {
  if (!image) throw new Error("image-index.initial.json is empty");
  const html = renderToString(
    <ViewerImagePage image={image} images={initialImages} filters={defaultGalleryFilters} />,
  );

  expect(html).toContain("Diashow");
  expect(html).toContain("Volgende afbeelding");
  expect(html).toContain("Lees het bericht");
  expect(html).toContain(`1 van ${initialImages.length}`);
});

it("renders nothing of a photo before the URL is known", () => {
  const html = renderToString(<GalleryViewerApp initialImages={initialImages} />);

  expect(html).toContain("aria-hidden");
  expect(html).not.toContain("<img");
});
