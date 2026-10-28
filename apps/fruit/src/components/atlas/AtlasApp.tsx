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
import { Switch } from "@wilhalla/ui/components/switch";
import { typography } from "@wilhalla/ui/lib/typography";
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
  formatDate,
  smallThumbImage,
  themeValue,
  type AtlasFilters,
  type MapPoint,
  type ScreenPoint,
} from "../../lib/archiveAtlas";
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

/** Plot position (CSS pixels, before pan and zoom) of a point in the unit projection. */
function plotPosition(point: { x: number; y: number }, size: { width: number; height: number }) {
  return {
    x: (INSET + point.x * (1 - 2 * INSET)) * size.width,
    y: (INSET + point.y * (1 - 2 * INSET)) * size.height,
  };
}

/**
 * Where to write each category's name: the centre of its densest neighbourhood, not its mean
 * (categories spread across the map, and their mean often lands in someone else's region).
 */
function categoryAnchors(points: MapPoint[]) {
  const grid = 14;
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
  const anchors = useMemo(() => categoryAnchors(points), [points]);
  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const point of points)
      for (const id of point.categoryIds ?? [point.topicId])
        counts.set(id, (counts.get(id) ?? 0) + 1);
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

  const screenOf = (point: { x: number; y: number }) => {
    const plot = plotPosition(point, canvasSize);
    return { x: plot.x * scale + pan.x, y: plot.y * scale + pan.y };
  };

  // Draw.
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context || !canvasSize.width) return;
    const { width, height } = canvasSize;
    context.clearRect(0, 0, width, height);

    const focus = filters.topic === "all" ? null : filters.topic;
    const radius = Math.min(6, 1.8 + Math.sqrt(scale) * 0.9);
    const muted = themeValue("--color-chalk");

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

    context.globalAlpha = selectedPoint ? 0.45 : 0.82;
    for (const point of browse.visible) {
      const { x, y } = screenOf(point);
      if (x < -8 || y < -8 || x > width + 8 || y > height + 8) continue;
      context.fillStyle = colorFor(focus && point.topicId !== focus ? focus : point.topicId);
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
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

    // Category names, written on the map while zoomed out.
    if (scale < 2.6 && !selectedPoint) {
      const fontSize = 17;
      context.font = `400 ${fontSize}px ${themeValue("--font-heading")}`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.lineJoin = "round";
      for (const [categoryId, anchor] of anchors) {
        if (categoryId === "overig" || (focus && categoryId !== focus)) continue;
        const label = categoryById.get(categoryId)?.label;
        if (!label) continue;
        const { x, y } = screenOf(anchor);
        context.lineWidth = 5;
        context.strokeStyle = themeValue("--color-pure-surface");
        context.strokeText(label, x, y);
        context.fillStyle = themeValue("--color-obsidian");
        context.fillText(label, x, y);
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
    <div className="mx-auto w-[calc(100%-2rem)] max-w-page py-10 md:py-14">
      <header className="grid gap-3 md:grid-cols-[1fr_minmax(0,28rem)] md:items-end">
        <h1 className={typography.display}>Atlas</h1>
        <p className={cn(typography.intro, "m-0")}>
          Elk punt is een verhaal uit het archief. Verhalen over hetzelfde onderwerp liggen dicht
          bij elkaar.
        </p>
      </header>

      <div className="mt-8 flex flex-wrap items-center gap-3 border-b border-chalk pb-4">
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
