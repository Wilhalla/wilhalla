// PROTOTYPE (site/prototype/homepage-map), variant D "Huidige kaart, verfijnd": the current map
// (components/map/interactive-map.tsx, copied) with three changes:
//   - no autoplaying tour on load; the map just appears, with the existing hint on desktop,
//   - a quieter location card on desktop, and clicking a place opens its page,
//   - on mobile, a small "‹ place ›" switcher at the bottom that glides the map to each place
//     and shows its painted highlight and lettering; tapping a place on the map selects it.
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { places, type Place } from "./places";
import { interactiveMapRegistry } from "@/config/registries";
import { allHomepages } from "content-collections";
import {
  allMapHoverImages,
  getActiveMapDiscovery,
  getAdjustedExplanationPosition,
  isTextOverlayImage,
  type ViewBoxRect,
} from "@/modules/interactive-map-discovery";
import { Link } from "@tanstack/react-router";
import { hotspots } from "@/components/map/hotspots";
import { MapHotspotPath } from "@/components/map/map-hotspot";
import { MapInteractionHint } from "@/components/map/map-interaction-hint";
import { MapSentinel } from "@/components/map/map-sentinel";
import {
  getActiveSentinelId,
  getSentinelFallbackGlowBounds,
  type MapSentinelExplanation,
  mapSentinels,
} from "@/components/map/map-sentinels";
import { PencilFilter } from "@/components/map/pencil-filter";

const { height: MAP_HEIGHT, width: MAP_WIDTH } = interactiveMapRegistry.dimensions;
const ASPECT_RATIO = MAP_WIDTH / MAP_HEIGHT;
const MAP_WEBP_SRC_SET = interactiveMapRegistry.assets.webpSrcSet.join(", ");

function clientPointToSvgPoint(svg: SVGSVGElement, point: { x: number; y: number }) {
  const svgPoint = svg.createSVGPoint();
  svgPoint.x = point.x;
  svgPoint.y = point.y;

  const screenMatrix = svg.getScreenCTM();
  if (!screenMatrix) return null;

  return svgPoint.matrixTransform(screenMatrix.inverse());
}

function getVisibleViewBoxRect(svg: SVGSVGElement): ViewBoxRect | null {
  const svgRect = svg.getBoundingClientRect();
  const visibleClientRect = {
    bottom: Math.min(svgRect.bottom, window.innerHeight),
    left: Math.max(svgRect.left, 0),
    right: Math.min(svgRect.right, window.innerWidth),
    top: Math.max(svgRect.top, 0),
  };

  if (
    visibleClientRect.right <= visibleClientRect.left ||
    visibleClientRect.bottom <= visibleClientRect.top
  ) {
    return null;
  }

  const corners = [
    { x: visibleClientRect.left, y: visibleClientRect.top },
    { x: visibleClientRect.right, y: visibleClientRect.top },
    { x: visibleClientRect.right, y: visibleClientRect.bottom },
    { x: visibleClientRect.left, y: visibleClientRect.bottom },
  ]
    .map((corner) => clientPointToSvgPoint(svg, corner))
    .filter((corner): corner is DOMPoint => Boolean(corner));

  if (corners.length === 0) return null;

  return {
    minX: Math.min(...corners.map((corner) => corner.x)),
    minY: Math.min(...corners.map((corner) => corner.y)),
    maxX: Math.max(...corners.map((corner) => corner.x)),
    maxY: Math.max(...corners.map((corner) => corner.y)),
  };
}

const placeById = new Map(places.map((place) => [place.id, place]));

function SentinelExplanationCard({
  explanation,
  labelImages,
  placeId,
  visibleViewBoxRect,
}: {
  explanation: MapSentinelExplanation | null;
  labelImages: string[];
  placeId: string | null;
  visibleViewBoxRect: ViewBoxRect | null;
}) {
  const [displayedExplanation, setDisplayedExplanation] = useState<MapSentinelExplanation | null>(
    null,
  );
  const [visible, setVisible] = useState(false);
  const hasDisplayedExplanationRef = useRef(false);
  const labelImageKey = labelImages.join("|");

  useEffect(() => {
    let fadeTimer: number | undefined;
    let revealFrame: number | undefined;

    if (!explanation) {
      setVisible(false);
      fadeTimer = window.setTimeout(() => {
        setDisplayedExplanation(null);
        hasDisplayedExplanationRef.current = false;
      }, 180);
      return () => {
        if (fadeTimer !== undefined) window.clearTimeout(fadeTimer);
      };
    }

    setVisible(false);
    fadeTimer = window.setTimeout(
      () => {
        setDisplayedExplanation(explanation);
        hasDisplayedExplanationRef.current = true;
        revealFrame = window.requestAnimationFrame(() => setVisible(true));
      },
      hasDisplayedExplanationRef.current ? 90 : 0,
    );

    return () => {
      if (fadeTimer !== undefined) window.clearTimeout(fadeTimer);
      if (revealFrame !== undefined) window.cancelAnimationFrame(revealFrame);
    };
  }, [explanation, labelImageKey]);

  if (!displayedExplanation) return null;

  const { height, width, x, y } = getAdjustedExplanationPosition({
    explanation: displayedExplanation,
    visibleViewBoxRect,
  });
  const { text } = displayedExplanation;
  const place = placeById.get(placeId ?? "");

  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      className="pointer-events-none hidden overflow-visible lg:block"
    >
      <div
        className="flex h-full flex-col items-start justify-center gap-5 rounded-[40px] bg-eggshell/92 px-12 py-10 text-obsidian shadow-subtle-4 backdrop-blur-sm transition-[opacity,transform] duration-300 ease-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translate3d(0, 0, 0)" : "translate3d(0, 12px, 0)",
        }}
      >
        <p className="m-0 font-sans text-[34px] leading-[1.45] text-cinder">{text}</p>
        {place && (
          <p className="m-0 flex items-center gap-3 font-sans text-[28px] font-medium text-obsidian">
            {place.linkLabel} <ArrowRight className="size-8" strokeWidth={1.5} />
          </p>
        )}
      </div>
    </foreignObject>
  );
}

const homepage = allHomepages[0];

if (!homepage) {
  throw new Error("Missing homepage content");
}

function MapHeroOverlay() {
  return (
    <section
      className="pointer-events-none absolute left-[20%] top-[20%] z-20 hidden w-[min(34vw,500px)] text-left lg:block"
      aria-labelledby="map-hero-title"
    >
      <h1
        id="map-hero-title"
        className="m-0 font-waldenburg text-[clamp(34px,2.6vw,54px)] leading-[0.95] tracking-[-0.025em] text-[#21180f]"
      >
        Wilhalla
      </h1>
      <p className="m-0 mt-3 max-w-[380px] text-balance font-waldenburg text-[clamp(18px,1.15vw,23px)] leading-[1.22] tracking-ui text-[#3f3225]">
        {homepage.tagline}
      </p>
      <Link
        to="/over-ons"
        className="pointer-events-auto mt-4 inline-flex min-h-[34px] items-center justify-center rounded-full border border-chalk bg-obsidian px-4 font-waldenburg text-body-lg leading-none tracking-ui text-eggshell no-underline shadow-subtle-2 transition-transform duration-200 hover:-translate-y-px"
      >
        Ontdek Wilhalla
      </Link>
    </section>
  );
}

function FallbackSentinelGlow({ activeSentinelId }: { activeSentinelId: string | null }) {
  const bounds = activeSentinelId ? getSentinelFallbackGlowBounds(activeSentinelId) : null;
  if (!bounds) return null;

  const width = bounds.maxX - bounds.minX;
  const height = bounds.maxY - bounds.minY;
  const cx = bounds.minX + width / 2;
  const cy = bounds.minY + height / 2;

  return (
    <g pointerEvents="none">
      <defs>
        <filter id="map-fallback-sentinel-glow" x="-70%" y="-70%" width="240%" height="240%">
          <feGaussianBlur stdDeviation="24" />
        </filter>
      </defs>
      <ellipse
        cx={cx}
        cy={cy}
        rx={Math.max(90, width * 0.62)}
        ry={Math.max(70, height * 0.58)}
        // oxlint-disable-next-line shadcn/no-raw-colors -- warm sunlight glow of the hand-drawn map illustration; not a UI colour.
        fill="#fff1a8"
        opacity={0.34}
        filter="url(#map-fallback-sentinel-glow)"
        style={{ mixBlendMode: "screen" }}
      />
    </g>
  );
}

function MapScene({
  activeExplanation,
  activeHoverImages,
  activeLabelImages,
  activeSentinelId,
  fetchPriority,
  overlayTransitionDurationMs,
  onHoverChange,
  onSelect,
  showLettering,
  sizes,
}: {
  activeExplanation: MapSentinelExplanation | null;
  activeHoverImages: string[];
  activeLabelImages: string[];
  activeSentinelId: string | null;
  fetchPriority?: "auto" | "high" | "low";
  overlayTransitionDurationMs: number;
  onHoverChange: (id: string | null) => void;
  onSelect: (id: string) => void;
  /** Keep the painted lettering visible while a card is shown (mobile has no card). */
  showLettering: boolean;
  sizes: string;
}) {
  const [hiResMapLoaded, setHiResMapLoaded] = useState(false);
  const [visibleViewBoxRect, setVisibleViewBoxRect] = useState<ViewBoxRect | null>(null);
  const hiResMapRef = useRef<HTMLImageElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const hiResMap = hiResMapRef.current;
    if (hiResMap?.complete && hiResMap.naturalWidth > 0) {
      setHiResMapLoaded(true);
    }
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    let animationFrame: number | undefined;
    const syncVisibleViewBoxRect = () => {
      if (animationFrame !== undefined) {
        window.cancelAnimationFrame(animationFrame);
      }
      animationFrame = window.requestAnimationFrame(() => {
        setVisibleViewBoxRect(getVisibleViewBoxRect(svg));
      });
    };

    syncVisibleViewBoxRect();

    const resizeObserver = new ResizeObserver(syncVisibleViewBoxRect);
    resizeObserver.observe(svg);
    window.addEventListener("resize", syncVisibleViewBoxRect);
    window.visualViewport?.addEventListener("resize", syncVisibleViewBoxRect);
    window.visualViewport?.addEventListener("scroll", syncVisibleViewBoxRect);

    return () => {
      if (animationFrame !== undefined) {
        window.cancelAnimationFrame(animationFrame);
      }
      resizeObserver.disconnect();
      window.removeEventListener("resize", syncVisibleViewBoxRect);
      window.visualViewport?.removeEventListener("resize", syncVisibleViewBoxRect);
      window.visualViewport?.removeEventListener("scroll", syncVisibleViewBoxRect);
    };
  }, []);

  const updateHoveredSentinel = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return;

    const cursor = clientPointToSvgPoint(svg, { x: clientX, y: clientY });
    if (!cursor) return;
    onHoverChange(getActiveSentinelId(cursor));
  };

  return (
    <>
      <img
        src={interactiveMapRegistry.assets.placeholderSrc}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
        decoding="async"
      />
      <picture>
        <source
          media={interactiveMapRegistry.desktopMediaQuery}
          type="image/webp"
          srcSet={interactiveMapRegistry.assets.desktopWebpSrc}
        />
        <source type="image/webp" srcSet={MAP_WEBP_SRC_SET} sizes={sizes} />
        <img
          ref={hiResMapRef}
          src={interactiveMapRegistry.assets.fallbackSrc}
          srcSet={interactiveMapRegistry.assets.fallbackSrcSet}
          sizes={interactiveMapRegistry.desktopImgSizes}
          alt={interactiveMapRegistry.imageAlt}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out"
          style={{ opacity: hiResMapLoaded ? 1 : 0 }}
          loading="eager"
          decoding="async"
          fetchPriority={fetchPriority}
          onLoad={() => setHiResMapLoaded(true)}
        />
      </picture>
      <div className="pointer-events-none absolute inset-0">
        {allMapHoverImages.map((hoverImage) => (
          <img
            key={hoverImage}
            src={hoverImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ease-out"
            style={{
              opacity:
                activeHoverImages.includes(hoverImage) &&
                (showLettering || !(activeExplanation && isTextOverlayImage(hoverImage)))
                  ? 1
                  : 0,
              transitionDuration: `${overlayTransitionDurationMs}ms`,
            }}
            loading="eager"
            decoding="async"
          />
        ))}
      </div>
      <svg
        ref={svgRef}
        aria-hidden="true"
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        className="absolute inset-0 h-full w-full data-[clickable=true]:cursor-pointer"
        data-clickable={Boolean(activeSentinelId && placeById.has(activeSentinelId))}
        preserveAspectRatio="xMidYMid slice"
        onPointerMove={(event) => {
          if (event.pointerType === "mouse") updateHoveredSentinel(event.clientX, event.clientY);
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") onHoverChange(null);
        }}
        onClick={(event) => {
          const svg = svgRef.current;
          const point = svg && clientPointToSvgPoint(svg, { x: event.clientX, y: event.clientY });
          const id = point && getActiveSentinelId(point);
          if (id) onSelect(id);
        }}
      >
        <PencilFilter />
        <FallbackSentinelGlow activeSentinelId={activeSentinelId} />
        {hotspots.map((hotspot) => (
          <MapHotspotPath key={hotspot.id} hotspot={hotspot} />
        ))}
        {mapSentinels.map((sentinel) => (
          <MapSentinel
            key={sentinel.id}
            x1={sentinel.x1}
            y1={sentinel.y1}
            x2={sentinel.x2}
            y2={sentinel.y2}
            padding={sentinel.padding ?? interactiveMapRegistry.defaultSentinelPadding}
          />
        ))}
        <SentinelExplanationCard
          explanation={activeExplanation}
          labelImages={activeLabelImages}
          placeId={activeSentinelId}
          visibleViewBoxRect={visibleViewBoxRect}
        />
      </svg>
      <MapHeroOverlay />
    </>
  );
}

// Left to right, so the arrows walk across the map.
const tour = [...places].sort(
  (left, right) => left.box.x1 + left.box.x2 - (right.box.x1 + right.box.x2),
);

/** A pencil-like arrow, drawn to sit with the map's lettering rather than a UI chevron. */
function SketchArrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 32 24"
      aria-hidden="true"
      className="h-6 w-8 data-[direction=left]:-scale-x-100"
      data-direction={direction}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12.6c5.2-.6 11.4-.9 16.6-.5 2.6.2 5 .2 8.2-.3" strokeWidth="1.6" />
      <path d="M20.5 5.2c2.3 2.4 4.6 4.6 7.4 6.6-2.9 1.8-5.1 4-7.1 6.8" strokeWidth="1.6" />
    </svg>
  );
}

function PlaceSwitcher({
  active,
  onStep,
}: {
  active: Place | null;
  onStep: (step: number) => void;
}) {
  const arrow =
    "grid size-12 shrink-0 place-items-center rounded-full text-cinder transition-colors active:text-obsidian";
  return (
    <nav
      aria-label="Plekken op de kaart"
      className="fixed inset-x-0 bottom-0 z-30 bg-linear-to-t from-eggshell/90 via-eggshell/55 to-transparent px-2 pt-14 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
    >
      {/* Arrows stay at the edges; only the name in the middle changes. */}
      <div className="grid grid-cols-[3rem_1fr_3rem] items-center">
        <button type="button" aria-label="Vorige plek" onClick={() => onStep(-1)} className={arrow}>
          <SketchArrow direction="left" />
        </button>
        <div className="min-w-0 text-center" aria-live="polite">
          {active ? (
            <a
              href={active.href}
              className="inline-block max-w-full truncate font-heading text-[1.6rem] leading-tight text-obsidian underline decoration-fog decoration-1 underline-offset-[6px]"
            >
              {active.title}
            </a>
          ) : (
            <span className="font-heading text-[1.35rem] leading-tight text-cinder italic">
              Wandel over het domein
            </span>
          )}
        </div>
        <button
          type="button"
          aria-label="Volgende plek"
          onClick={() => onStep(1)}
          className={arrow}
        >
          <SketchArrow direction="right" />
        </button>
      </div>
    </nav>
  );
}

export function RefinedMap() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [desktopHintDismissed, setDesktopHintDismissed] = useState(false);
  const [hoveredSentinelId, setHoveredSentinelId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const activeId = isMobileViewport ? selectedId : hoveredSentinelId;
  const { activeExplanation, activeHoverImages, activeLabelImages } = getActiveMapDiscovery({
    hoveredSentinelId: activeId,
    introActiveSentinelId: null,
  });
  const active = tour.find((place) => place.id === selectedId) ?? null;

  useEffect(() => {
    const mediaQuery = window.matchMedia(interactiveMapRegistry.mobileMediaQuery);
    const syncViewport = () => setIsMobileViewport(mediaQuery.matches);
    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);
    return () => mediaQuery.removeEventListener("change", syncViewport);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollLeft = isMobileViewport
      ? (el.scrollWidth - el.clientWidth) / interactiveMapRegistry.mobileInitialScrollDivisor
      : 0;
  }, [isMobileViewport]);

  /** Mobile: centre a place in the scrollable map. */
  const glideTo = (place: Place) => {
    const el = scrollRef.current;
    if (!el) return;
    const centre = ((place.box.x1 + place.box.x2) / 2 / MAP_WIDTH) * el.scrollWidth;
    el.scrollTo({ left: centre - el.clientWidth / 2, behavior: "smooth" });
  };

  const select = (id: string) => {
    const place = tour.find((candidate) => candidate.id === id);
    if (!place) return;
    if (isMobileViewport) {
      setSelectedId(id);
      glideTo(place);
    } else {
      void navigate({ to: place.href });
    }
  };

  const step = (delta: number) => {
    const index = tour.findIndex((place) => place.id === selectedId);
    const next =
      index === -1
        ? tour[delta > 0 ? 0 : tour.length - 1]
        : tour[(index + delta + tour.length) % tour.length];
    select(next.id);
  };

  return (
    <div
      ref={scrollRef}
      className="relative h-dvh w-full overflow-x-auto overflow-y-hidden overscroll-x-none bg-black scrollbar-none lg:h-svh lg:overflow-hidden"
    >
      <div
        className="relative h-full min-w-[100vw] w-[calc(100dvh*var(--map-aspect-ratio))] lg:absolute lg:inset-0 lg:min-w-0 lg:w-auto lg:origin-center lg:scale-[1.2]"
        style={{ "--map-aspect-ratio": ASPECT_RATIO } as CSSProperties}
      >
        <MapScene
          activeExplanation={isMobileViewport ? null : activeExplanation}
          activeHoverImages={activeHoverImages}
          activeLabelImages={activeLabelImages}
          activeSentinelId={activeId}
          fetchPriority="high"
          overlayTransitionDurationMs={isMobileViewport ? 500 : 900}
          sizes={interactiveMapRegistry.sceneSizes}
          showLettering={isMobileViewport}
          onSelect={select}
          onHoverChange={(id) => {
            if (id) setDesktopHintDismissed(true);
            setHoveredSentinelId(id);
          }}
        />
      </div>
      <MapInteractionHint mobileDismissed desktopDismissed={desktopHintDismissed} />
      <PlaceSwitcher active={active} onStep={step} />
    </div>
  );
}
