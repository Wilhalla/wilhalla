import { use } from "react";
import {
  atlasUrlCodec,
  atlasYears,
  filterAtlasPoints,
  findAtlasPoint,
  relatedAtlasPointIds,
  type AtlasFilters,
  type AtlasUrlState,
  type MapPoint,
} from "../../lib/archiveAtlas";
import { mapPointsResource } from "../../lib/generatedData";
import { updateUrlState } from "../../lib/urlState";
import AtlasCategoryList from "./AtlasCategoryList";
import AtlasFilterBar from "./AtlasFilterBar";
import AtlasPlot from "./AtlasPlot";
import AtlasStoryPanel from "./AtlasStoryPanel";

const RELATED_SHOWN = 5;

// The URL owns filters and selection; these read it at the moment of the event.
function changeFilters(patch: Partial<AtlasFilters>) {
  updateUrlState(atlasUrlCodec, (current) => ({
    ...current,
    filters: { ...current.filters, ...patch },
  }));
}

function selectPoint(point: MapPoint | null) {
  updateUrlState(atlasUrlCodec, (current) => ({
    ...current,
    point: point ? point.slug || point.id : null,
  }));
}

interface AtlasBrowserProps {
  state: AtlasUrlState;
}

export default function AtlasBrowser({ state }: AtlasBrowserProps) {
  const points = use(mapPointsResource.load());
  const { filters, arrangement } = state;
  const visible = filterAtlasPoints(points, filters);
  const selected = findAtlasPoint(points, state.point);
  const relatedIds = selected ? relatedAtlasPointIds(points, selected) : [];
  const pointsById = new Map(points.map((point) => [point.id, point]));

  return (
    <>
      <AtlasFilterBar
        filters={filters}
        years={atlasYears(points)}
        visibleCount={visible.length}
        totalCount={points.length}
        onChange={changeFilters}
      />
      <div className="mt-6 grid gap-6 lg:grid-cols-aside">
        <AtlasPlot
          scene={{ points, visible, focus: filters.category, selected, relatedIds, arrangement }}
          onSelect={selectPoint}
        />
        <aside className="min-w-0">
          {selected ? (
            <AtlasStoryPanel
              point={selected}
              related={relatedIds.flatMap((id) => pointsById.get(id) ?? []).slice(0, RELATED_SHOWN)}
              onSelect={selectPoint}
            />
          ) : (
            <AtlasCategoryList
              points={points}
              activeCategory={filters.category}
              arrangement={arrangement}
              onSelect={(category) => changeFilters({ category })}
            />
          )}
        </aside>
      </div>
    </>
  );
}
