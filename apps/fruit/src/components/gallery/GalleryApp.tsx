import { layout } from "@wilhalla/ui/lib/typography";
import { cn } from "@wilhalla/ui/lib/utils";
import { useCallback } from "react";
import { useGalleryIndex } from "../../hooks/useGalleryIndex";
import { useLoadable } from "../../hooks/useLoadable";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { speciesByImageStore } from "../../lib/galleryData";
import {
  galleryUrlCodec,
  hasActiveGalleryFilters,
  type GalleryFilters,
} from "../../lib/galleryFilters";
import { startGalleryGrid } from "../../lib/galleryGrid";
import { requestGalleryIndex } from "../../lib/galleryIndex";
import {
  buildGalleryRows,
  filterGalleryImages,
  needsSpeciesTags,
  type GalleryGroups,
  type GalleryImageRecord,
  type SpeciesByImage,
} from "../../lib/imageGallerySession";
import { updateUrlState, useUrlState } from "../../lib/urlState";
import LoadError from "../LoadError";
import YearVirtualList from "../YearVirtualList";
import GalleryFilterControls from "./GalleryFilterControls";
import GalleryHeader from "./GalleryHeader";
import GalleryImageRow from "./GalleryImageRow";
import GalleryMonthHeading from "./GalleryMonthHeading";
import GalleryYearHeading from "./GalleryYearHeading";

interface GalleryAppProps {
  /** The newest photos, built into the page; the rest of the index loads after it. */
  initialImages: GalleryImageRecord[];
  groups: GalleryGroups;
}

const noSpecies: SpeciesByImage = new Map();
/** Row heights in pixels, as the row components set them (`h-26`, `h-18.5`, `h-37.5` up to `lg:h-55`). */
const ROW_HEIGHT = { year: 104, month: 74, images: { 2: 150, 4: 190, 5: 220 } } as const;

/** The image archive: every photo by year and month, filtered through the URL. */
export default function GalleryApp({ initialImages, groups }: GalleryAppProps) {
  const filters = useUrlState(galleryUrlCodec);
  const index = useGalleryIndex(initialImages);
  const species = useLoadable(speciesByImageStore);
  const wide = useMediaQuery("(min-width: 64rem)");
  const medium = useMediaQuery("(min-width: 48rem)");
  const columns = wide ? 5 : medium ? 4 : 2;

  const filtered = filterGalleryImages(
    index.images,
    filters,
    species.status === "ready" ? species.value : noSpecies,
  );
  const rows = buildGalleryRows(filtered, columns);

  // A ref callback runs again whenever its identity changes, so this one must not change.
  const start = useCallback(() => startGalleryGrid(initialImages), [initialImages]);

  const setFilters = (change: Partial<GalleryFilters>) => {
    if (needsSpeciesTags({ ...filters, ...change })) speciesByImageStore.request();
    updateUrlState(galleryUrlCodec, (current) => ({ ...current, ...change }));
  };

  return (
    <section ref={start} className="relative z-10 bg-eggshell pb-20 text-obsidian">
      <GalleryHeader
        images={filtered}
        loading={index.status === "loading" || species.status === "loading"}
        sortNewest={filters.sortNewest}
        onSortNewestChange={(sortNewest) => setFilters({ sortNewest })}
      />
      <YearVirtualList
        className={cn(layout.container, "grid-cols-rail gap-4 pt-8 md:grid-cols-sidebar md:gap-8")}
        items={rows}
        years={groups.years.map((group) => ({
          year: group.id,
          label: group.label,
          count: group.count,
          firstIndex: rows.findIndex((row) => row.year === group.id),
        }))}
        itemKey={(row) => row.key}
        yearOf={(row) => row.year}
        estimateSize={(rowIndex) => {
          const type = rows[rowIndex]?.type ?? "images";
          return type === "images" ? ROW_HEIGHT.images[columns] : ROW_HEIGHT[type];
        }}
        overscan={8}
        label="Foto's"
        yearsLabel="Galerie jaren"
        selector={{
          currentLabel: "Actief",
          clearLabel: "Alle",
          onClear: () => setFilters({ year: null }),
        }}
        onSelectMissingYear={(year) => setFilters({ year })}
        header={
          <>
            <GalleryFilterControls
              filters={filters}
              themes={groups.themes}
              hasActiveFilters={hasActiveGalleryFilters(filters)}
              onChange={setFilters}
            />
            {index.status === "error" && (
              <LoadError
                className="py-5"
                title="Niet alle foto's zijn geladen."
                error={index.message}
                onRetry={() => requestGalleryIndex(initialImages, "low")}
              />
            )}
          </>
        }
      >
        {(row) =>
          row.type === "year" ? (
            <GalleryYearHeading
              year={row.year}
              count={groups.years.find((group) => group.id === row.year)?.count}
            />
          ) : row.type === "month" ? (
            <GalleryMonthHeading label={row.label} count={row.count} />
          ) : (
            <GalleryImageRow images={row.images} offset={row.offset} filters={filters} />
          )
        }
      </YearVirtualList>
    </section>
  );
}
