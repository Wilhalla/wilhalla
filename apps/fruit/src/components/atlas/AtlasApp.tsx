import { Button, buttonVariants } from "@wilhalla/ui/components/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@wilhalla/ui/components/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wilhalla/ui/components/select";
import { Separator } from "@wilhalla/ui/components/separator";
import { PageHeader } from "@wilhalla/ui/components/page-header";
import { Switch } from "@wilhalla/ui/components/switch";
import { ToggleGroup, ToggleGroupItem } from "@wilhalla/ui/components/toggle-group";
import { layout, typography } from "@wilhalla/ui/lib/typography";
import { cn } from "@wilhalla/ui/lib/utils";
import { ArrowLeft, ArrowRight, Maximize2, Minus, Plus, Scan, Search, X } from "lucide-react";
import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  atlasCategories,
  atlasCategoryColors,
  buildAtlasBrowse,
  colorMix,
  formatDate,
  smallThumbImage,
  themeValue,
  type AtlasFilters,
  type MapPoint,
  type ScreenPoint,
} from "../../lib/archiveAtlas";
import { layoutDistricts } from "../../lib/atlasLayout";
import { currentBrowserPath, writeBrowserPath } from "../../lib/browserHistory";
import { useDismissHydrationLoader } from "../gallery/useGracefulLoader";
import { useAtlasData } from "./useAtlasData";
import { useAtlasUrlState } from "./useAtlasUrlState";
import { useAtlasViewport } from "./useAtlasViewport";

/** Margin around the projection, as a share of the plot, so edge points are not clipped. */
const INSET = 0.05;
const HIT_RADIUS = 9;
const SEASONS = ["lente", "zomer", "herfst", "winter"] as const;
const ALL_FILTERS: AtlasFilters = {
  topic: "all",
  year: "all",
  season: "all",
  imagesOnly: false,
  search: "",
};
const numberFormat = new Intl.NumberFormat("nl-BE");

const categoryById = new Map(atlasCategories.map((category) => [category.id, category]));
const colorFor = (categoryId: string) =>
  atlasCategoryColors[categoryId] ?? atlasCategoryColors.overig;

/** Width/height of the plot, rounded so small resizes do not re-run the layout. */
const aspectOf = (size: { width: number; height: number }) =>
  size.width && size.height ? Math.round((size.width / size.height) * 10) / 10 : 1;

/** CSS pixels per layout unit (the layout is `aspect` wide and 1 high). */
const unitOf = (size: { width: number; height: number }) =>
  Math.min(size.width / aspectOf(size), size.height) * (1 - 2 * INSET);

/** Plot position (CSS pixels, before pan and zoom) of a point in the layout rectangle. */
function plotPosition(point: { x: number; y: number }, size: { width: number; height: number }) {
  const unit = unitOf(size);
  return {
    x: (size.width - aspectOf(size) * unit) / 2 + point.x * unit,
    y: (size.height - unit) / 2 + point.y * unit,
  };
}

type Arrangement = "subject" | "meaning";

/**
 * 1 when stories sit in their subject's district, 0 when they sit where the text projection puts
 * them; glides between the two (on-screen movement: ease-in-out) unless motion is reduced.
 */
function useArrangementBlend(arrangement: Arrangement) {
  const target = arrangement === "subject" ? 1 : 0;
  const [blend, setBlend] = useState(target);
  const blendRef = useRef(target);
  useEffect(() => {
    const from = blendRef.current;
    if (from === target) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      blendRef.current = target;
      setBlend(target);
      return;
    }
    const start = performance.now();
    const duration = 700;
    let frame = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
      blendRef.current = from + (target - from) * eased;
      setBlend(blendRef.current);
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target]);
  return blend;
}

/**
 * Where to write a subject's name on the map by meaning: the centre of its densest neighbourhood,
 * not its mean (a subject spreads over the map, and its mean often lands in another's area).
 */
function meaningAnchors(points: MapPoint[]) {
  const grid = 12;
  const cells = new Map<string, Map<string, { count: number; x: number; y: number }>>();
  for (const point of points) {
    const key = `${Math.floor(point.x * grid)}:${Math.floor(point.y * grid)}`;
    const byCell = cells.get(point.topicId) ?? new Map();
    const cell = byCell.get(key) ?? { count: 0, x: 0, y: 0 };
    cell.count += 1;
    cell.x += point.x;
    cell.y += point.y;
    byCell.set(key, cell);
    cells.set(point.topicId, byCell);
  }
  return new Map(
    [...cells.entries()].map(([categoryId, byCell]) => {
      const densest = [...byCell.values()].sort((a, b) => b.count - a.count)[0];
      return [categoryId, { x: densest.x / densest.count, y: densest.y / densest.count }];
    }),
  );
}

export default function AtlasApp() {
  const { dataError, loadingData, points, topics } = useAtlasData();
  useDismissHydrationLoader("atlas-hydration-loader", loadingData);
  const { canvasRef, canvasSize, pan, setPan, scale, setScale, zoomAtCanvasPoint } =
    useAtlasViewport();
  const plotRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{
    x: number;
    y: number;
    panX: number;
    panY: number;
    moved: boolean;
  } | null>(null);

  const [filters, setFilters] = useState<AtlasFilters>(ALL_FILTERS);
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [, setSelectedClusterId] = useState<string | null>(null);
  const [hover, setHover] = useState<{ point: MapPoint; at: ScreenPoint } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [arrangement, setArrangement] = useState<Arrangement>(() =>
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("view") === "meaning"
      ? "meaning"
      : "subject",
  );
  const blend = useArrangementBlend(arrangement);

  const browse = useMemo(
    () =>
      buildAtlasBrowse({
        points,
        topics,
        filters,
        selectedPoint,
        selectedClusterId: filters.topic === "all" ? null : filters.topic,
      }),
    [points, topics, filters, selectedPoint],
  );
  const aspect = aspectOf(canvasSize);
  const districtLayout = useMemo(() => layoutDistricts(points, aspect), [points, aspect]);
  const anchors = useMemo(() => meaningAnchors(points), [points]);
  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const point of points)
      for (const id of point.categoryIds ?? [point.topicId])
        counts.set(id, (counts.get(id) ?? 0) + 1);
    return counts;
  }, [points]);
  const primaryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const point of points) counts.set(point.topicId, (counts.get(point.topicId) ?? 0) + 1);
    return counts;
  }, [points]);
  const pointsById = useMemo(() => new Map(points.map((point) => [point.id, point])), [points]);

  useAtlasUrlState({
    points,
    topicsById: browse.topicsById,
    setFilters,
    setSelectedClusterId,
    setSelectedPoint,
  });

  function writeUrl(nextFilters: AtlasFilters, point: MapPoint | null) {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const set = (key: string, value: string | null) =>
      value ? url.searchParams.set(key, value) : url.searchParams.delete(key);
    for (const key of ["topic", "cluster"]) url.searchParams.delete(key);
    set("category", nextFilters.topic === "all" ? null : nextFilters.topic);
    set("year", nextFilters.year === "all" ? null : nextFilters.year);
    set("season", nextFilters.season === "all" ? null : nextFilters.season);
    set("images", nextFilters.imagesOnly ? "1" : null);
    set("q", nextFilters.search.trim() || null);
    set("point", point ? point.slug || point.id : null);
    const next = `${url.pathname}${url.search}${url.hash}`;
    if (next !== currentBrowserPath()) writeBrowserPath(next, "replace");
  }

  const updateFilters = (patch: Partial<AtlasFilters>) => {
    const next = { ...filters, ...patch };
    setFilters(next);
    writeUrl(next, selectedPoint);
  };
  const selectPoint = (point: MapPoint | null) => {
    setSelectedPoint(point);
    writeUrl(filters, point);
  };

  /** Screen position of a position in the layout rectangle. */
  const toScreen = (position: { x: number; y: number }) => {
    const plot = plotPosition(position, canvasSize);
    return { x: plot.x * scale + pan.x, y: plot.y * scale + pan.y };
  };
  /** Where the projection puts a story, in the same rectangle as the districts. */
  const meaningPosition = (point: { x: number; y: number }) => ({
    x: point.x * aspect,
    y: point.y,
  });
  /** Screen position of a story, between its place by meaning and in its district. */
  const screenOf = (point: MapPoint) => {
    const byMeaning = meaningPosition(point);
    const bySubject = districtLayout.positions.get(point.id) ?? byMeaning;
    return toScreen({
      x: byMeaning.x + (bySubject.x - byMeaning.x) * blend,
      y: byMeaning.y + (bySubject.y - byMeaning.y) * blend,
    });
  };

  // Draw.
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context || !canvasSize.width) return;
    const { width, height } = canvasSize;
    context.clearRect(0, 0, width, height);

    const focus = filters.topic === "all" ? null : filters.topic;
    const radius = Math.min(6, 1.6 + Math.sqrt(scale) * 0.9);
    const muted = themeValue("--color-chalk");
    const unit = unitOf(canvasSize) * scale;

    // By subject: a soft disc per subject, so the regions read before the dots do.
    for (const district of blend > 0.02 ? districtLayout.districts : []) {
      const { x, y } = toScreen(district);
      context.fillStyle = colorMix(
        colorFor(district.id),
        (!focus ? 0.07 : district.id === focus ? 0.12 : 0.03) * blend,
      );
      context.beginPath();
      context.arc(x, y, district.r * unit + radius * 2, 0, Math.PI * 2);
      context.fill();
    }

    // By meaning: a coloured haze where the selected subject's stories gather.
    if (focus && blend < 0.98) {
      context.save();
      context.filter = "blur(18px)";
      context.globalAlpha = 0.12 * (1 - blend);
      context.fillStyle = colorFor(focus);
      for (const point of browse.visible) {
        const { x, y } = screenOf(point);
        context.beginPath();
        context.arc(x, y, 14 * Math.sqrt(scale), 0, Math.PI * 2);
        context.fill();
      }
      context.restore();
    }

    // Points outside the filters stay as a faint backdrop, so the map keeps its shape.
    context.fillStyle = muted;
    for (const point of points) {
      if (browse.visibleIds.has(point.id)) continue;
      const { x, y } = screenOf(point);
      if (x < -8 || y < -8 || x > width + 8 || y > height + 8) continue;
      context.beginPath();
      context.arc(x, y, radius * 0.8, 0, Math.PI * 2);
      context.fill();
    }

    // Stories in their own subject's district are filled. With a subject selected, stories that
    // only touch on it (it is a secondary subject) stay in their own district as open rings.
    context.globalAlpha = selectedPoint ? 0.45 : 0.85;
    context.lineWidth = 1.2;
    for (const point of browse.visible) {
      const { x, y } = screenOf(point);
      if (x < -8 || y < -8 || x > width + 8 || y > height + 8) continue;
      const color = colorFor(focus ?? point.topicId);
      context.beginPath();
      if (focus && point.topicId !== focus && blend > 0.5) {
        context.strokeStyle = color;
        context.arc(x, y, radius - 0.6, 0, Math.PI * 2);
        context.stroke();
      } else {
        context.fillStyle = color;
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
      }
    }
    context.globalAlpha = 1;

    // The selected story and its nearest neighbours.
    if (selectedPoint) {
      const obsidian = themeValue("--color-obsidian");
      for (const id of browse.relatedPointIds) {
        const related = pointsById.get(id);
        if (!related) continue;
        const { x, y } = screenOf(related);
        context.strokeStyle = obsidian;
        context.lineWidth = 1;
        context.beginPath();
        context.arc(x, y, radius + 2.5, 0, Math.PI * 2);
        context.stroke();
      }
      const { x, y } = screenOf(selectedPoint);
      context.fillStyle = colorFor(selectedPoint.topicId);
      context.strokeStyle = themeValue("--color-pure-surface");
      context.lineWidth = 2.5;
      context.beginPath();
      context.arc(x, y, radius + 3.5, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      context.strokeStyle = obsidian;
      context.lineWidth = 1.25;
      context.beginPath();
      context.arc(x, y, radius + 6, 0, Math.PI * 2);
      context.stroke();
    }

    // Subject names, while zoomed out: above their district, or on their densest area by meaning.
    if (scale < 2.6 && !selectedPoint && blend < 0.5) {
      context.font = `400 17px ${themeValue("--font-heading")}`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.lineJoin = "round";
      for (const [categoryId, anchor] of anchors) {
        if (categoryId === "overig" || (focus && categoryId !== focus)) continue;
        const label = categoryById.get(categoryId)?.label;
        if (!label) continue;
        const { x, y } = toScreen(meaningPosition(anchor));
        context.lineWidth = 5;
        context.strokeStyle = themeValue("--color-pure-surface");
        context.strokeText(label, x, y);
        context.fillStyle = themeValue("--color-obsidian");
        context.fillText(label, x, y);
      }
    }
    if (scale < 2.6 && !selectedPoint && blend >= 0.5) {
      context.font = `400 17px ${themeValue("--font-heading")}`;
      context.textAlign = "center";
      context.textBaseline = "bottom";
      context.lineJoin = "round";
      for (const district of districtLayout.districts) {
        if (focus && district.id !== focus) continue;
        const label = categoryById.get(district.id)?.label;
        if (!label) continue;
        // Too small to carry a name without colliding with its neighbours (phones): zoom in.
        if (district.r * unit < 34) continue;
        const { x, y } = toScreen(district);
        const top = y - district.r * unit - radius * 2 - 4;
        context.lineWidth = 5;
        context.strokeStyle = themeValue("--color-pure-surface");
        context.strokeText(label, x, top);
        context.fillStyle = themeValue("--color-obsidian");
        context.fillText(label, x, top);
      }
    }
  });

  function pointAt(clientX: number, clientY: number) {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const cursor = { x: clientX - rect.left, y: clientY - rect.top };
    let best: MapPoint | null = null;
    let bestDistance = HIT_RADIUS ** 2;
    for (const point of browse.visible) {
      const { x, y } = screenOf(point);
      const distance = (x - cursor.x) ** 2 + (y - cursor.y) ** 2;
      if (distance < bestDistance) {
        best = point;
        bestDistance = distance;
      }
    }
    return best ? { point: best, at: screenOf(best) } : null;
  }

  const onPointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      x: event.clientX,
      y: event.clientY,
      panX: pan.x,
      panY: pan.y,
      moved: false,
    };
  };
  const onPointerMove = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const drag = dragRef.current;
    if (drag) {
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      if (!drag.moved && dx * dx + dy * dy > 16) {
        drag.moved = true;
        setDragging(true);
        setHover(null);
      }
      if (drag.moved) setPan({ x: drag.panX + dx, y: drag.panY + dy });
      return;
    }
    if (event.pointerType === "mouse") setHover(pointAt(event.clientX, event.clientY));
  };
  const onPointerUp = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const drag = dragRef.current;
    dragRef.current = null;
    setDragging(false);
    if (drag?.moved) return;
    const hit = pointAt(event.clientX, event.clientY);
    selectPoint(hit?.point ?? null);
  };

  const zoomBy = (factor: number) =>
    zoomAtCanvasPoint({ x: canvasSize.width / 2, y: canvasSize.height / 2 }, factor);
  const resetView = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };
  const toggleFullscreen = () => {
    const plot = plotRef.current;
    if (!plot) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void plot.requestFullscreen?.();
  };

  const hasFilters =
    filters.year !== "all" || filters.season !== "all" || filters.imagesOnly || filters.search;
  const focusCategory = filters.topic === "all" ? null : categoryById.get(filters.topic);

  return (
    <>
      <PageHeader
        size="page"
        title="Atlas"
        intro={
          arrangement === "subject"
            ? "Elk punt is een verhaal, gegroepeerd per hoofdonderwerp. Binnen een groep liggen verwante verhalen dicht bij elkaar."
            : "Elk punt is een verhaal, geplaatst naar wat er staat: verhalen die op elkaar lijken, liggen dicht bij elkaar, ook over onderwerpen heen."
        }
        actions={
          <ToggleGroup
            type="single"
            value={arrangement}
            aria-label="Schikking"
            onValueChange={(value) => {
              if (value !== "subject" && value !== "meaning") return;
              setArrangement(value);
              const url = new URL(window.location.href);
              if (value === "meaning") url.searchParams.set("view", "meaning");
              else url.searchParams.delete("view");
              writeBrowserPath(`${url.pathname}${url.search}${url.hash}`, "replace");
            }}
          >
            <ToggleGroupItem value="subject">Per onderwerp</ToggleGroupItem>
            <ToggleGroupItem value="meaning">Op betekenis</ToggleGroupItem>
          </ToggleGroup>
        }
      />
      <div className={cn(layout.container, "pt-6 pb-16")}>
        <div className="flex flex-wrap items-center gap-3 border-b border-chalk pb-4">
          <InputGroup className="w-full sm:w-72">
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Zoek een verhaal"
              value={filters.search}
              onChange={(event) => updateFilters({ search: event.target.value })}
            />
            {filters.search && (
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  size="icon-xs"
                  aria-label="Zoekterm wissen"
                  onClick={() => updateFilters({ search: "" })}
                >
                  <X />
                </InputGroupButton>
              </InputGroupAddon>
            )}
          </InputGroup>
          <Select value={filters.year} onValueChange={(year) => updateFilters({ year })}>
            <SelectTrigger className="w-36" aria-label="Jaar">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle jaren</SelectItem>
              {browse.years.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filters.season} onValueChange={(season) => updateFilters({ season })}>
            <SelectTrigger className="w-40" aria-label="Seizoen">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle seizoenen</SelectItem>
              {SEASONS.map((season) => (
                <SelectItem key={season} value={season}>
                  {season.charAt(0).toUpperCase() + season.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <label className="flex items-center gap-2 font-sans text-body text-cinder">
            <Switch
              checked={filters.imagesOnly}
              onCheckedChange={(imagesOnly) => updateFilters({ imagesOnly })}
            />
            Met beelden
          </label>
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateFilters({ ...ALL_FILTERS, topic: filters.topic })}
            >
              Wis filters
            </Button>
          )}
          <p className={cn(typography.small, "m-0 ml-auto text-gravel")}>
            {numberFormat.format(browse.visible.length)} van {numberFormat.format(points.length)}{" "}
            verhalen
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div
            ref={plotRef}
            className="relative h-[min(70svh,44rem)] min-h-96 overflow-hidden rounded-2xl bg-pure-surface shadow-subtle-2"
          >
            <canvas
              ref={canvasRef}
              aria-label="Kaart van alle verhalen, gegroepeerd per onderwerp"
              className="block size-full touch-none data-[dragging=true]:cursor-grabbing data-[hover=true]:cursor-pointer"
              data-dragging={dragging}
              data-hover={Boolean(hover)}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={() => setHover(null)}
            />
            {(loadingData || dataError) && (
              <p
                className={cn(
                  typography.small,
                  "absolute inset-0 m-0 grid place-items-center text-gravel",
                )}
              >
                {dataError ?? "Atlas laden…"}
              </p>
            )}
            {hover && !dragging && (
              <div
                className="pointer-events-none absolute top-(--y) left-(--x) z-10 w-64 -translate-x-1/2 -translate-y-[calc(100%+14px)] rounded-xl bg-pure-surface px-3 py-2 shadow-subtle-4"
                style={{ "--x": `${hover.at.x}px`, "--y": `${hover.at.y}px` } as CSSProperties}
              >
                <p className="m-0 font-sans text-body leading-body font-medium text-obsidian">
                  {hover.point.title}
                </p>
                <p className={cn(typography.caption, "m-0 mt-0.5")}>
                  {formatDate(hover.point.date)} · {categoryById.get(hover.point.topicId)?.label}
                </p>
              </div>
            )}
            <div className="absolute right-3 bottom-3 flex flex-col gap-1">
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Inzoomen"
                onClick={() => zoomBy(1.4)}
              >
                <Plus />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Uitzoomen"
                onClick={() => zoomBy(1 / 1.4)}
              >
                <Minus />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Hele kaart tonen"
                onClick={resetView}
              >
                <Scan />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Volledig scherm"
                onClick={toggleFullscreen}
              >
                <Maximize2 />
              </Button>
            </div>
          </div>

          <aside className="min-w-0">
            {selectedPoint ? (
              <StoryPanel
                point={selectedPoint}
                related={[...browse.relatedPointIds]
                  .map((id) => pointsById.get(id))
                  .filter((point): point is MapPoint => Boolean(point))
                  .slice(0, 5)}
                onSelect={selectPoint}
                onClose={() => selectPoint(null)}
              />
            ) : (
              <div className="grid gap-4">
                <h2 className={cn(typography.eyebrow)}>Onderwerpen</h2>
                <ul className="m-0 grid list-none gap-0.5 p-0">
                  {atlasCategories.map((category) => {
                    const active = filters.topic === category.id;
                    return (
                      <li key={category.id}>
                        <button
                          type="button"
                          aria-pressed={active}
                          onClick={() => updateFilters({ topic: active ? "all" : category.id })}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left font-sans text-body text-cinder transition-colors hover:bg-powder aria-pressed:bg-powder aria-pressed:text-obsidian"
                        >
                          <span
                            aria-hidden="true"
                            className="size-2.5 shrink-0 rounded-full bg-(--dot)"
                            style={{ "--dot": colorFor(category.id) } as CSSProperties}
                          />
                          <span className="flex-1">{category.label}</span>
                          <span className="text-gravel tabular-nums">
                            {numberFormat.format(categoryCounts.get(category.id) ?? 0)}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
                {focusCategory && (
                  <>
                    <Separator />
                    <p className={cn(typography.small, "m-0 text-cinder")}>
                      {focusCategory.description}
                    </p>
                    {arrangement === "meaning" ? (
                      <p className={cn(typography.small, "m-0 text-cinder")}>
                        De gekleurde waas toont waar de verhalen hierover samenkomen; ze liggen
                        verspreid, omdat ze ook over andere onderwerpen gaan.
                      </p>
                    ) : (
                      <p className={cn(typography.small, "m-0 text-cinder")}>
                        {numberFormat.format(primaryCounts.get(focusCategory.id) ?? 0)} verhalen
                        gaan vooral hierover (gevulde punten). Nog{" "}
                        {numberFormat.format(
                          (categoryCounts.get(focusCategory.id) ?? 0) -
                            (primaryCounts.get(focusCategory.id) ?? 0),
                        )}{" "}
                        raken het aan; zij staan bij hun eigen onderwerp (open rondjes).
                      </p>
                    )}
                    <a
                      href={`/archive/?category=${encodeURIComponent(focusCategory.id)}`}
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-fit")}
                    >
                      Alle verhalen over {focusCategory.label.toLowerCase()} <ArrowRight />
                    </a>
                  </>
                )}
                <p className={cn(typography.caption, "m-0")}>
                  Sleep om te verschuiven, scrol of gebruik + en − om te zoomen. Klik op een punt om
                  het verhaal te openen.
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}

function StoryPanel({
  point,
  related,
  onSelect,
  onClose,
}: {
  point: MapPoint;
  related: MapPoint[];
  onSelect: (point: MapPoint) => void;
  onClose: () => void;
}) {
  const category = categoryById.get(point.topicId);
  return (
    <article className="grid gap-4">
      <Button variant="ghost" size="sm" className="w-fit" onClick={onClose}>
        <ArrowLeft /> Alle onderwerpen
      </Button>
      {point.image && (
        <img
          src={smallThumbImage(point.image)}
          alt=""
          className="aspect-4/3 w-full rounded-xl bg-powder object-cover"
          loading="lazy"
        />
      )}
      <div className="grid gap-2">
        <p className={typography.eyebrow}>
          {formatDate(point.date)}
          {category && <> · {category.label}</>}
        </p>
        <h2 className={typography.heading}>{point.title}</h2>
        <p className={cn(typography.small, "m-0 line-clamp-5 text-cinder")}>{point.excerpt}</p>
      </div>
      <a
        href={`/posts/${encodeURIComponent(point.slug)}/`}
        className={cn(buttonVariants(), "w-fit")}
      >
        Lees het verhaal <ArrowRight />
      </a>
      {related.length > 0 && (
        <>
          <Separator />
          <h3 className={typography.eyebrow}>Verwante verhalen</h3>
          <ul className="m-0 grid list-none gap-0.5 p-0">
            {related.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onSelect(item)}
                  className="grid w-full gap-0.5 rounded-lg px-3 py-2 text-left transition-colors hover:bg-powder"
                >
                  <span className="font-sans text-body leading-body text-obsidian">
                    {item.title}
                  </span>
                  <span className={typography.caption}>{formatDate(item.date)}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </article>
  );
}
