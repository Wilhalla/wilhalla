import { type CSSProperties, useEffect, useRef, useState } from "react";
import { interactiveMapRegistry } from "@/config/registries";
import { allHomepages } from "content-collections";
import {
  allMapHoverImages,
  getActiveMapDiscovery,
  getAdjustedExplanationPosition,
  getMapOverlayTransitionDurationMs,
  hasDarkInkCardLabel,
  introMapSequence,
  isTextOverlayImage,
  mapDiscoveryTimings,
  type ViewBoxRect,
} from "@/modules/interactive-map-discovery";
import { Link, useNavigate } from "@tanstack/react-router";
import { hotspots } from "./hotspots";
import { MapHotspotPath } from "./map-hotspot";
import { MapInteractionHint } from "./map-interaction-hint";
import { MapLinkSheet } from "./map-link-sheet";
import { MapSentinel } from "./map-sentinel";
import {
  getActiveSentinelId,
  getSentinelExplanation,
  getSentinelFallbackGlowBounds,
  getSentinelLink,
  linkedMapSentinels,
  type MapSentinelExplanation,
  mapSentinels,
} from "./map-sentinels";
import { PencilFilter } from "./pencil-filter";

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
const {
  desktopIntroOverlayTransitionMs: DESKTOP_INTRO_OVERLAY_TRANSITION_MS,
  desktopIntroStepMs: DESKTOP_INTRO_STEP_MS,
  introStartDelayMs: INTRO_START_DELAY_MS,
  mobileIntroOverlayTransitionMs: MOBILE_INTRO_OVERLAY_TRANSITION_MS,
  mobileIntroStepMs: MOBILE_INTRO_STEP_MS,
  onboardingStartDelayMs: ONBOARDING_START_DELAY_MS,
} = mapDiscoveryTimings;
let hasPlayedInitialMapSequence = false;

function SentinelExplanationCard({
  explanation,
  labelImages,
  visibleViewBoxRect,
}: {
  explanation: MapSentinelExplanation | null;
  labelImages: string[];
  visibleViewBoxRect: ViewBoxRect | null;
}) {
  const [displayedExplanation, setDisplayedExplanation] = useState<MapSentinelExplanation | null>(
    null,
  );
  const [displayedLabelImages, setDisplayedLabelImages] = useState<string[]>([]);
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
        setDisplayedLabelImages([]);
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
        setDisplayedLabelImages(labelImageKey ? labelImageKey.split("|") : []);
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
  const { linkLabel, text } = displayedExplanation;
  const hasLabelImages = displayedLabelImages.length > 0;
  const hasDarkInkLabel = displayedLabelImages.some(hasDarkInkCardLabel);
  const useDarkCard = hasLabelImages && !hasDarkInkLabel;
  const cardClassName = `flex min-h-full flex-col rounded-[34px] border px-[36px] py-[28px] shadow-[0_14px_34px_rgba(38,27,18,0.16)] backdrop-blur-[2px] transition-[opacity,transform] duration-300 ease-out ${
    hasLabelImages ? "items-start justify-center gap-[24px]" : "items-start justify-center"
  } ${
    useDarkCard
      ? "border-white/15 bg-[#2a2118]/88 text-[#fff8dc]"
      : "border-black/10 bg-[#fdf8e9]/90 text-[#261b12]"
  }`;

  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      className="pointer-events-none hidden overflow-visible lg:block"
    >
      <div
        className={cardClassName}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible
            ? "translate3d(0, 0, 0) scale(1)"
            : "translate3d(0, 10px, 0) scale(0.985)",
        }}
      >
        {hasLabelImages ? (
          <div className="flex max-w-full flex-wrap items-end gap-[14px]">
            {displayedLabelImages.map((labelImage) => {
              const isVakeTreeLabel = labelImage.endsWith("/vake-tree.webp");

              return (
                <img
                  key={labelImage}
                  src={labelImage}
                  alt=""
                  aria-hidden="true"
                  className={`block h-auto max-w-full object-contain drop-shadow-[0_2px_3px_rgba(0,0,0,0.22)] ${
                    isVakeTreeLabel ? "max-h-[164px] min-h-[92px]" : "max-h-[132px] min-h-[64px]"
                  }`}
                  loading="eager"
                  decoding="async"
                />
              );
            })}
          </div>
        ) : null}
        <p className="m-0 font-waldenburg text-[34px] leading-[1.28] tracking-ui">{text}</p>
        {linkLabel ? (
          <p className="m-0 mt-[18px] font-waldenburg text-[26px] leading-none tracking-[0.01em] underline decoration-1 underline-offset-[8px] opacity-75">
            {linkLabel} →
          </p>
        ) : null}
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
  isLinkHovered,
  overlayTransitionDurationMs,
  onHoverChange,
  onSentinelClick,
  sizes,
}: {
  activeExplanation: MapSentinelExplanation | null;
  activeHoverImages: string[];
  activeLabelImages: string[];
  activeSentinelId: string | null;
  fetchPriority?: "auto" | "high" | "low";
  isLinkHovered: boolean;
  overlayTransitionDurationMs: number;
  onHoverChange: (id: string | null) => void;
  onSentinelClick: (id: string | null) => void;
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
                !(activeExplanation && isTextOverlayImage(hoverImage))
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
        className={
          isLinkHovered
            ? "absolute inset-0 h-full w-full cursor-pointer"
            : "absolute inset-0 h-full w-full"
        }
        preserveAspectRatio="xMidYMid slice"
        onPointerMove={(event) => {
          updateHoveredSentinel(event.clientX, event.clientY);
        }}
        onPointerLeave={() => onHoverChange(null)}
        onClick={(event) => {
          // De house-hotspot navigeert zelf en roept preventDefault aan.
          if (event.defaultPrevented) return;

          const svg = svgRef.current;
          if (!svg) return;

          const point = clientPointToSvgPoint(svg, {
            x: event.clientX,
            y: event.clientY,
          });
          onSentinelClick(point ? getActiveSentinelId(point) : null);
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
          visibleViewBoxRect={visibleViewBoxRect}
        />
      </svg>
      <MapHeroOverlay />
    </>
  );
}

export function InteractiveMap() {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const ignoreNextScrollRef = useRef(false);
  const shouldPlayInitialSequenceRef = useRef(!hasPlayedInitialMapSequence);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [mobileHintDismissed, setMobileHintDismissed] = useState(false);
  const [desktopHintDismissed, setDesktopHintDismissed] = useState(false);
  const [hoveredSentinelId, setHoveredSentinelId] = useState<string | null>(null);
  const [introActiveSentinelId, setIntroActiveSentinelId] = useState<string | null>(null);
  const [selectedSentinelId, setSelectedSentinelId] = useState<string | null>(null);
  const [introDismissed, setIntroDismissed] = useState(false);
  const [onboardingVisible, setOnboardingVisible] = useState(false);

  // Touch heeft geen hover (en pointerleave wist die meteen na tikken), op mobiel blijft de aangetikte plaats daarom geselecteerd tot je elders tikt.
  const discoverySentinelId = hoveredSentinelId ?? (isMobileViewport ? selectedSentinelId : null);
  const { activeExplanation, activeHoverImages, activeLabelImages } = getActiveMapDiscovery({
    hoveredSentinelId: discoverySentinelId,
    introActiveSentinelId,
  });
  const isLinkHovered =
    !isMobileViewport && hoveredSentinelId !== null
      ? getSentinelLink(hoveredSentinelId) !== null
      : false;
  const selectedLink =
    isMobileViewport && selectedSentinelId ? getSentinelLink(selectedSentinelId) : null;
  const introStepMs = isMobileViewport ? MOBILE_INTRO_STEP_MS : DESKTOP_INTRO_STEP_MS;
  const introOverlayTransitionMs = isMobileViewport
    ? MOBILE_INTRO_OVERLAY_TRANSITION_MS
    : DESKTOP_INTRO_OVERLAY_TRANSITION_MS;
  const overlayTransitionDurationMs = getMapOverlayTransitionDurationMs({
    introDismissed,
    introOverlayTransitionMs,
    onboardingVisible,
  });

  const dismissIntro = () => {
    setIntroDismissed(true);
    setIntroActiveSentinelId(null);
  };

  const handleSentinelClick = (id: string | null) => {
    if (id && onboardingVisible) {
      setMobileHintDismissed(true);
      setDesktopHintDismissed(true);
      dismissIntro();
    }

    if (isMobileViewport) {
      setSelectedSentinelId(id);
      return;
    }

    const link = id ? getSentinelLink(id) : null;
    if (link) void navigate({ to: link.to });
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia(interactiveMapRegistry.mobileMediaQuery);
    const syncViewport = () => {
      setIsMobileViewport(mediaQuery.matches);
    };

    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);

    return () => {
      mediaQuery.removeEventListener("change", syncViewport);
    };
  }, []);

  useEffect(() => {
    if (!shouldPlayInitialSequenceRef.current) return;

    hasPlayedInitialMapSequence = true;

    const onboardingTimer = window.setTimeout(() => {
      setOnboardingVisible(true);
    }, ONBOARDING_START_DELAY_MS);

    return () => {
      window.clearTimeout(onboardingTimer);
    };
  }, []);

  useEffect(() => {
    if (!onboardingVisible || introDismissed) return;

    let cancelled = false;
    let timer: number | undefined;

    const schedule = (callback: () => void, delayMs: number) => {
      timer = window.setTimeout(() => {
        if (!cancelled) callback();
      }, delayMs);
    };

    const showNextSentinel = (index: number) => {
      if (index >= introMapSequence.length) {
        setIntroActiveSentinelId(null);
        schedule(() => setIntroDismissed(true), introOverlayTransitionMs);
        return;
      }

      setIntroActiveSentinelId(introMapSequence[index].id);
      schedule(() => showNextSentinel(index + 1), introStepMs);
    };

    schedule(() => showNextSentinel(0), INTRO_START_DELAY_MS);

    return () => {
      cancelled = true;
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [introDismissed, introOverlayTransitionMs, introStepMs, onboardingVisible]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    if (!isMobileViewport) {
      el.scrollLeft = 0;
      return;
    }

    ignoreNextScrollRef.current = true;
    el.scrollLeft =
      (el.scrollWidth - el.clientWidth) / interactiveMapRegistry.mobileInitialScrollDivisor;
  }, [isMobileViewport]);

  return (
    <>
      <div
        ref={scrollRef}
        className="relative h-dvh w-full overflow-x-auto overflow-y-hidden overscroll-x-none bg-black scrollbar-none lg:h-svh lg:overflow-hidden"
        onScroll={() => {
          if (ignoreNextScrollRef.current) {
            ignoreNextScrollRef.current = false;
            return;
          }
          if (!onboardingVisible) return;
          setMobileHintDismissed(true);
          dismissIntro();
        }}
      >
        <div
          className="relative h-full min-w-[100vw] w-[calc(100dvh*var(--map-aspect-ratio))] lg:absolute lg:inset-0 lg:min-w-0 lg:w-auto lg:origin-center lg:scale-[1.2]"
          style={{ "--map-aspect-ratio": ASPECT_RATIO } as CSSProperties}
        >
          <MapScene
            activeExplanation={activeExplanation}
            activeHoverImages={activeHoverImages}
            activeLabelImages={activeLabelImages}
            activeSentinelId={discoverySentinelId}
            fetchPriority="high"
            isLinkHovered={isLinkHovered}
            overlayTransitionDurationMs={overlayTransitionDurationMs}
            sizes={interactiveMapRegistry.sceneSizes}
            onSentinelClick={handleSentinelClick}
            onHoverChange={(id) => {
              if (id && onboardingVisible) {
                if (!isMobileViewport) setDesktopHintDismissed(true);
                dismissIntro();
              }
              setHoveredSentinelId(id);
            }}
          />
        </div>
        <MapInteractionHint
          mobileDismissed={!onboardingVisible || mobileHintDismissed}
          desktopDismissed={!onboardingVisible || desktopHintDismissed}
        />
      </div>
      {selectedLink && selectedSentinelId ? (
        <MapLinkSheet
          link={selectedLink}
          text={getSentinelExplanation(selectedSentinelId)?.text}
          onClose={() => setSelectedSentinelId(null)}
        />
      ) : null}
      {/* De kaart-SVG is aria-hidden: dit is de toetsenbord- en screenreader-route. */}
      <nav aria-label="Plekken op de kaart" className="sr-only">
        <ul>
          {linkedMapSentinels.map((sentinel) => (
            <li key={sentinel.id}>
              <Link
                to={sentinel.link.to}
                onFocus={() => setHoveredSentinelId(sentinel.id)}
                onBlur={() => setHoveredSentinelId(null)}
              >
                {sentinel.link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
