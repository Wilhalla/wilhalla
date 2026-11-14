import { siteConfig } from "@/config";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { MapLink } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import { useReducer } from "react";
import { FallbackSentinelGlow } from "./fallback-sentinel-glow";
import { MapHeroOverlay } from "./map-hero-overlay";
import { MapInteractionHint } from "./map-interaction-hint";
import { MapLinkSheet } from "./map-link-sheet";
import { MapMobileNavigator } from "./map-mobile-navigator";
import { MapOverlayImages } from "./map-overlay-images";
import { MapPlaceList } from "./map-place-list";
import { MapScene } from "./map-scene";
import {
  type SentinelId,
  fallbackGlowRect,
  getSentinel,
  overlayImageSources,
  sentinelAt,
} from "./map-sentinels";
import { type MapEvent, initialMapState, mapReducer } from "./map-state";
import { MapTapNavigator } from "./map-tap-navigator";
import { SentinelExplanationCard } from "./sentinel-explanation-card";

const map = siteConfig.map;
const aspectRatio = map.dimensions.width / map.dimensions.height;
const overview = { x: 0.5, y: 0.5, zoom: 1 };

/** The intro plays on the first visit of a page load, until the visitor points at a place. */
let introSeen = false;

/** Where the small-screen map pans to for a stop; a place without its own focus is centred. */
function focusOf(id: SentinelId) {
  const sentinel = getSentinel(id);

  return (
    sentinel.stop?.focus ?? {
      x: (sentinel.x1 + sentinel.x2) / 2 / map.dimensions.width,
      y: (sentinel.y1 + sentinel.y2) / 2 / map.dimensions.height,
      zoom: 1.4,
    }
  );
}

export function InteractiveMap() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery(map.mobileMediaQuery);
  const [state, dispatch] = useReducer(mapReducer, !introSeen, initialMapState);

  // Touch has no hover (and pointerleave clears it right after a tap), so on small screens the
  // stop stays the active place.
  const stop = isMobile ? state.stop : null;
  const activeId = state.hovered ?? stop?.id ?? null;
  const active = activeId && getSentinel(activeId);
  const glow = activeId && fallbackGlowRect(activeId);
  const sheetLink = stop?.sheet ? getSentinel(stop.id).link : undefined;
  const focus = stop ? focusOf(stop.id) : overview;

  const send = (event: MapEvent) => {
    if ((event.type === "hover" || event.type === "tap") && event.id !== null) {
      introSeen = true;
    }

    dispatch(event);
  };

  const follow = (link: MapLink) => {
    if ("to" in link) {
      void navigate({ to: link.to });
    } else if (link.newTab) {
      window.open(link.href, "_blank", "noopener,noreferrer");
    } else {
      window.location.assign(link.href);
    }
  };

  return (
    <>
      <div className="relative h-dvh w-full touch-none overflow-hidden overscroll-none bg-eggshell lg:h-svh">
        <div
          className="relative h-full w-(--map-width) min-w-screen origin-top-left translate-x-(--map-offset-x) translate-y-(--map-offset-y) scale-(--map-zoom) transition-transform duration-move ease-move motion-reduce:transition-none lg:absolute lg:inset-0 lg:w-auto lg:min-w-0 lg:origin-top lg:translate-x-0 lg:translate-y-0 lg:scale-(--map-desktop-zoom)"
          style={{
            "--map-width": `calc(100dvh * ${aspectRatio})`,
            "--map-zoom": focus.zoom,
            "--map-desktop-zoom": map.desktopZoom,
            "--map-offset-x": `clamp(calc(100vw - ${aspectRatio * focus.zoom} * 100dvh), calc(50vw - ${focus.x * aspectRatio * focus.zoom} * 100dvh), 0px)`,
            "--map-offset-y": `clamp(calc(100dvh - ${focus.zoom} * 100dvh), calc(44dvh - ${focus.y * focus.zoom} * 100dvh), 0px)`,
          }}
        >
          <MapScene
            clickable={!isMobile && Boolean(active && active.link)}
            onPointAt={(point) => send({ type: "hover", id: point && sentinelAt(point) })}
            onPress={(point) => {
              const id = sentinelAt(point);
              const link = id && getSentinel(id).link;

              if (isMobile) {
                send({ type: "tap", id });
              } else if (link) {
                follow(link);
              }
            }}
            overlays={
              <MapOverlayImages
                active={activeId ? overlayImageSources(activeId) : []}
                showCaptions={isMobile || !(active && active.explanation)}
                introducing={state.introducing}
              />
            }
          >
            {glow && <FallbackSentinelGlow rect={glow} />}
            {state.card && (
              <SentinelExplanationCard
                key={state.card}
                id={state.card}
                visible={activeId === state.card}
              />
            )}
          </MapScene>
          <MapHeroOverlay />
        </div>
        <MapTapNavigator onStep={(direction) => send({ type: "step", direction })} />
        <MapInteractionHint visible={state.introducing} />
      </div>
      <MapMobileNavigator
        activeStopId={state.stop?.id ?? null}
        onSelect={(id) => send({ type: "choose", id })}
        onStep={(direction) => send({ type: "step", direction })}
      />
      {stop && sheetLink && (
        <MapLinkSheet
          link={sheetLink}
          text={getSentinel(stop.id).explanation?.text}
          onClose={() => send({ type: "closeSheet" })}
        />
      )}
      <MapPlaceList onFocusPlace={(id) => send({ type: "hover", id })} />
    </>
  );
}
