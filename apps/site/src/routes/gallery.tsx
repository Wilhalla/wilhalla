import { MarkdownContent } from "@/components/markdown-content";
import { PageHeader } from "@/components/page-header";
import {
  editorialPages,
  galleryRegistry,
  siteIdentity,
} from "@/config/registries";
import { galleryImages } from "@/content/gallery-images.generated";
import galerijContent from "@/content/pages/galerij.md?raw";
import { editorialRouteHead } from "@/modules/editorial-page-publishing";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/gallery")({
  head: () => editorialRouteHead(editorialPages.gallery, "/gallery"),
  component: GalleryPage,
});

function GalleryPage() {
  return (
    <div>
      <PageHeader
        title={editorialPages.gallery.title}
        intro={editorialPages.gallery.intro}
      />

      <section className="site-container py-10 md:py-16">
        <div className="space-y-12">
          <div className="max-w-[820px]">
            <MarkdownContent markdown={galerijContent} />
          </div>

          <ul className="columns-1 gap-4 p-0 sm:columns-2 lg:columns-3 [&>li]:mb-4">
            {galleryImages.map((image, index) => {
              const alt =
                galleryRegistry.altTextByOriginalName[image.originalName] ??
                `${galleryRegistry.fallbackAltPrefix} ${index + 1} van ${siteIdentity.name}`;

              return (
                <li key={image.src} className="break-inside-avoid list-none">
                  <a
                    href={image.fullSrc}
                    className="group block overflow-hidden rounded-[18px] no-underline transition duration-300 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-obsidian"
                    aria-label={`Open foto ${index + 1} groot: ${alt}`}
                  >
                    <img
                      src={image.src}
                      width={image.width}
                      height={image.height}
                      alt={alt}
                      loading={index < 4 ? "eager" : "lazy"}
                      decoding="async"
                      className="h-auto w-full rounded-[18px] bg-powder object-cover transition duration-500 group-hover:scale-[1.015]"
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
