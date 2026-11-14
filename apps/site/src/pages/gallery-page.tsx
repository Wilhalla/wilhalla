import { MarkdownContent } from "@/components/markdown-content";
import { siteConfig } from "@/config";
import { getPage } from "@/content/pages";
import { PageBody } from "@wilhalla/ui/components/page-body";
import { PageHeader } from "@wilhalla/ui/components/page-header";
import { allGalleries } from "content-collections";

const page = getPage("galerij");
const images = allGalleries.flatMap((gallery) => gallery.images);

export function GalleryPage() {
  return (
    <>
      <PageHeader title={page.title} intro={page.intro} />
      <PageBody>
        <MarkdownContent html={page.html} />
        <ul className="mt-12 columns-1 gap-4 p-0 sm:columns-2 lg:columns-3">
          {images.map((image, index) => {
            const alt =
              image.alt?.trim() ||
              `${siteConfig.gallery.fallbackAltPrefix} ${index + 1} van ${siteConfig.site.name}`;

            return (
              <li key={image.image} className="mb-4 list-none break-inside-avoid">
                <a
                  href={image.image}
                  className="group block overflow-hidden rounded-image no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-obsidian"
                  aria-label={`Open foto ${index + 1} groot: ${alt}`}
                >
                  <img
                    src={image.thumbnail || image.image}
                    width={image.width}
                    height={image.height}
                    alt={alt}
                    loading={index < 4 ? "eager" : "lazy"}
                    decoding="async"
                    className="h-auto w-full rounded-image bg-powder object-cover outline outline-1 -outline-offset-1 outline-obsidian/10 transition-transform duration-reveal ease-out motion-safe:group-hover:scale-101"
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </PageBody>
    </>
  );
}
