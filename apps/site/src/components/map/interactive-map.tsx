import { useEffect, useRef, useState } from "react";
import { hotspots } from "./hotspots";
import { MapHotspotPath } from "./map-hotspot";
import { MapInteractionHint } from "./map-interaction-hint";
import { MapSentinel } from "./map-sentinel";
import { mapSentinels } from "./map-sentinels";
import { PencilFilter } from "./pencil-filter";

const MAP_WIDTH = 4000;
const MAP_HEIGHT = 2337;
const ASPECT_RATIO = MAP_WIDTH / MAP_HEIGHT;
const MAP_WEBP_SRC_SET = [
  "/wilhalla_map-640.webp 640w",
  "/wilhalla_map-1024.webp 1024w",
  "/wilhalla_map-1920.webp 1920w",
  "/wilhalla_map-2560.webp 2560w",
  "/wilhalla_map-3840.webp 3840w",
  "/wilhalla_map-4000.webp 4000w",
].join(", ");
const INTRO_SEQUENCE = mapSentinels
  .filter((sentinel) => sentinel.includeInIntro !== false)
  .sort((left, right) => {
    const leftOrder = left.x1 + left.y1;
    const rightOrder = right.x1 + right.y1;

    return leftOrder - rightOrder;
  });
const INTRO_START_DELAY_MS = 450;
const INTRO_STEP_MS = 420;
const INTRO_OVERLAY_VISIBLE_MS = 1800;
const OPENING_FADE_DURATION_MS = 1800;
const OPENING_FADE_START_DELAY_MS = 100;
const ONBOARDING_START_DELAY_MS = 160;
let hasPlayedInitialMapSequence = false;

function MapScene({
  activeSentinelIds,
  fetchPriority,
  onHoverChange,
  sizes,
}: {
  activeSentinelIds: string[];
  fetchPriority?: "auto" | "high" | "low";
  onHoverChange: (ids: string[]) => void;
  sizes: string;
}) {
  const [hiResMapLoaded, setHiResMapLoaded] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const updateHoveredSentinels = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return;

    const point = svg.createSVGPoint();
    point.x = clientX;
    point.y = clientY;

    const screenMatrix = svg.getScreenCTM();
    if (!screenMatrix) return;

    const cursor = point.matrixTransform(screenMatrix.inverse());
    const hoveredIds = mapSentinels
      .filter((sentinel) => {
        const padding = sentinel.padding ?? 0;
        const minX = Math.min(sentinel.x1, sentinel.x2) - padding;
        const maxX = Math.max(sentinel.x1, sentinel.x2) + padding;
        const minY = Math.min(sentinel.y1, sentinel.y2) - padding;
        const maxY = Math.max(sentinel.y1, sentinel.y2) + padding;

        return (
          cursor.x >= minX &&
          cursor.x <= maxX &&
          cursor.y >= minY &&
          cursor.y <= maxY
        );
      })
      .map((sentinel) => sentinel.id);

    onHoverChange(hoveredIds);
  };

  return (
    <>
      <img
        src="/wilhalla_map-640.webp"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
        decoding="async"
      />
      <picture>
        <source type="image/webp" srcSet={MAP_WEBP_SRC_SET} sizes={sizes} />
        <img
          src="/wilhalla_map.jpg"
          srcSet="/wilhalla_map.jpg 4000w"
          sizes={sizes}
          alt="Kaart van Wilhalla"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out"
          style={{ opacity: hiResMapLoaded ? 1 : 0 }}
          loading="eager"
          decoding="async"
          fetchPriority={fetchPriority}
          onLoad={() => setHiResMapLoaded(true)}
        />
      </picture>
      <div className="pointer-events-none absolute inset-0">
        {mapSentinels.map((sentinel) => (
          sentinel.hoverImages.map((hoverImage, index) => (
            <img
              key={`${sentinel.id}-${index}`}
              src={hoverImage}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ease-out"
              style={{
                opacity: activeSentinelIds.includes(sentinel.id) ? 1 : 0,
              }}
              loading="eager"
              decoding="async"
            />
          ))
        ))}
      </div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        onPointerMove={(event) => {
          updateHoveredSentinels(event.clientX, event.clientY);
        }}
        onPointerLeave={() => onHoverChange([])}
      >
        <PencilFilter />
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
            padding={sentinel.padding ?? 0}
          />
        ))}
      </svg>
    </>
  );
}

export function InteractiveMap() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const ignoreNextScrollRef = useRef(false);
  const shouldPlayInitialSequenceRef = useRef(!hasPlayedInitialMapSequence);
  const [mobileHintDismissed, setMobileHintDismissed] = useState(false);
  const [desktopHintDismissed, setDesktopHintDismissed] = useState(false);
  const [hoveredSentinelIds, setHoveredSentinelIds] = useState<string[]>([]);
  const [introActiveSentinelIds, setIntroActiveSentinelIds] = useState<
    string[]
  >([]);
  const [introDismissed, setIntroDismissed] = useState(false);
  const [onboardingVisible, setOnboardingVisible] = useState(false);
  const [openingVisible, setOpeningVisible] = useState(
    shouldPlayInitialSequenceRef.current,
  );

  const activeSentinelIds = hoveredSentinelIds.length
    ? Array.from(
        new Set([...introActiveSentinelIds, ...hoveredSentinelIds]),
      )
    : introActiveSentinelIds;

  const dismissIntro = () => {
    setIntroDismissed(true);
    setIntroActiveSentinelIds([]);
  };

  useEffect(() => {
    if (!shouldPlayInitialSequenceRef.current) return;

    hasPlayedInitialMapSequence = true;

    const fadeTimer = window.setTimeout(() => {
      setOpeningVisible(false);
    }, OPENING_FADE_START_DELAY_MS);

    const onboardingTimer = window.setTimeout(
      () => {
        setOnboardingVisible(true);
      },
      OPENING_FADE_START_DELAY_MS +
        OPENING_FADE_DURATION_MS +
        ONBOARDING_START_DELAY_MS,
    );

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(onboardingTimer);
    };
  }, []);

  useEffect(() => {
    if (!onboardingVisible || introDismissed) return;

    const timers: number[] = [];

    timers.push(
      window.setTimeout(() => {
        INTRO_SEQUENCE.forEach((sentinel, index) => {
          const startOffset = index * INTRO_STEP_MS;

          timers.push(
            window.setTimeout(() => {
              setIntroActiveSentinelIds((current) =>
                current.includes(sentinel.id)
                  ? current
                  : [...current, sentinel.id],
              );
            }, startOffset),
          );

          timers.push(
            window.setTimeout(() => {
              setIntroActiveSentinelIds((current) =>
                current.filter((id) => id !== sentinel.id),
              );
            }, startOffset + INTRO_OVERLAY_VISIBLE_MS),
          );
        });

        timers.push(
          window.setTimeout(
            () => {
              setIntroDismissed(true);
            },
            (INTRO_SEQUENCE.length - 1) * INTRO_STEP_MS +
              INTRO_OVERLAY_VISIBLE_MS,
          ),
        );
      }, INTRO_START_DELAY_MS),
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [introDismissed, onboardingVisible]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    ignoreNextScrollRef.current = true;
    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 1.65;
  }, []);

  return (
    <>
      {/* Mobile: aspect-ratio width, horizontal scroll to explore */}
      <div
        ref={scrollRef}
        className="relative lg:hidden w-full h-dvh overflow-x-auto overflow-y-hidden scrollbar-none overscroll-x-none bg-black"
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
          className="relative h-full"
          style={{ width: `calc(100dvh * ${ASPECT_RATIO})`, minWidth: "100vw" }}
        >
          <MapScene
            activeSentinelIds={activeSentinelIds}
            sizes="171vh"
            onHoverChange={(ids) => {
              if (ids.length && onboardingVisible) dismissIntro();
              setHoveredSentinelIds(ids);
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 transition-opacity ease-out"
            style={{
              opacity: openingVisible ? 1 : 0,
              transitionDuration: `${OPENING_FADE_DURATION_MS}ms`,
              transitionTimingFunction: "cubic-bezier(0.55, 0.08, 0.68, 0.53)",
              background:
                "radial-gradient(circle at 50% 28%, rgba(63,52,40,0.28) 0%, rgba(28,24,20,0.62) 34%, rgba(12,11,10,0.9) 70%, rgba(7,7,7,0.96) 100%)",
            }}
          />
        </div>
        <MapInteractionHint
          mobileDismissed={!onboardingVisible || mobileHintDismissed}
          desktopDismissed={desktopHintDismissed}
        />
      </div>

      {/* Desktop: full-screen cover, scaled in 1.2× from center */}
      <div className="hidden lg:block relative w-full h-svh overflow-hidden bg-black">
        <div className="absolute inset-0 scale-[1.2] origin-center">
          <MapScene
            activeSentinelIds={activeSentinelIds}
            fetchPriority="high"
            sizes="120vw"
            onHoverChange={(ids) => {
              if (ids.length && onboardingVisible) {
                setDesktopHintDismissed(true);
                dismissIntro();
              }
              setHoveredSentinelIds(ids);
            }}
          />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 transition-opacity ease-out"
          style={{
            opacity: openingVisible ? 1 : 0,
            transitionDuration: `${OPENING_FADE_DURATION_MS}ms`,
            transitionTimingFunction: "cubic-bezier(0.55, 0.08, 0.68, 0.53)",
            background:
              "radial-gradient(circle at 50% 20%, rgba(63,52,40,0.24) 0%, rgba(27,23,19,0.58) 28%, rgba(12,11,10,0.88) 64%, rgba(7,7,7,0.96) 100%)",
          }}
        />
        <MapInteractionHint
          mobileDismissed={mobileHintDismissed}
          desktopDismissed={!onboardingVisible || desktopHintDismissed}
        />
      </div>
    </>
  );
}
