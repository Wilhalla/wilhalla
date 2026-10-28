import { MarkdownContent } from "@/components/markdown-content";
import { PageHeader } from "@/components/page-header";
import { galleryRegistry, siteIdentity } from "@/config/registries";
import galleryContent from "@/content/gallery.json";
import { getEditorialPage } from "@/content/editorial-pages";
import { editorialRouteHead } from "@/modules/editorial-page-publishing";
import { createFileRoute } from "@tanstack/react-router";

const galleryPage = getEditorialPage("galerij");

export const Route = createFileRoute("/gallery")({
  head: () => editorialRouteHead(galleryPage, "/gallery"),
  component: GalleryPage,
});

type GalleryImage = {
  image: string;
  thumbnail?: string;
  alt?: string;
  originalName?: string;
  width?: number;
  height?: number;
};

const galleryImages = galleryContent.images as readonly GalleryImage[];
const galleryAltTextByOriginalName: Readonly<Record<string, string>> =
  galleryRegistry.altTextByOriginalName;

function GalleryPage() {
  return (
    <div>
      <PageHeader title={galleryPage.title} intro={galleryPage.intro} />

      <section className="site-container py-10 md:py-16">
        <div className="space-y-12">
          <div className="max-w-[820px]">
            <MarkdownContent html={galleryPage.html} />
          </div>

          <ul className="columns-1 gap-4 p-0 sm:columns-2 lg:columns-3 [&>li]:mb-4">
            {galleryImages.map((image, index) => {
              const imageSrc = image.thumbnail || image.image;
              const alt =
                image.alt?.trim() ||
                (image.originalName
                  ? galleryAltTextByOriginalName[image.originalName]
                  : undefined) ||
                `${galleryRegistry.fallbackAltPrefix} ${index + 1} van ${siteIdentity.name}`;

              return (
                <li
                  key={`${image.image}-${image.alt ?? image.originalName ?? ""}`}
                  className="break-inside-avoid list-none"
                >
                  <a
                    href={image.image}
                    className="group block overflow-hidden rounded-[18px] no-underline transition duration-300 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-obsidian"
                    aria-label={`Open foto ${index + 1} groot: ${alt}`}
                  >
                    <img
                      src={imageSrc}
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
