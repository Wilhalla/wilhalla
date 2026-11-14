import { pageHead } from "@/pages/editorial-route";
import { GalleryPage } from "@/pages/gallery-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/gallery")({
  head: () => pageHead("galerij"),
  component: GalleryPage,
});
