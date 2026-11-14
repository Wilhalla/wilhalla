import { useReducer, useRef, type MouseEvent, type PointerEvent } from "react";
import {
  IMAGE_ZOOM,
  canPan,
  clampView,
  initialZoomState,
  isZoomChanged,
  stepZoom,
  unzoomed,
  wheelZooms,
  zoomAround,
  zoomReducer,
  zoomStateFor,
  type ImageScaleMode,
  type Point,
  type ZoomView,
} from "../../lib/imageZoom";

/** A drag or pinch in progress: where it started, and the view it has reached. */
type Gesture =
  | { kind: "drag"; pointerId: number; start: Point; from: ZoomView; view: ZoomView }
  | { kind: "pinch"; distance: number; from: ZoomView; view: ZoomView };

const LENS_SIZE = 220;

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Layout of the photo without its zoom transform: its size, the stage's, and its centre on screen. */
function measure(image: HTMLImageElement) {
  const stage = image.parentElement ?? image;
  const stageRect = stage.getBoundingClientRect();
  return {
    bounds: {
      imageWidth: image.offsetWidth,
      imageHeight: image.offsetHeight,
      stageWidth: stage.clientWidth,
      stageHeight: stage.clientHeight,
    },
    centre: {
      x: stageRect.left + image.offsetLeft - stage.scrollLeft + image.offsetWidth / 2,
      y: stageRect.top + image.offsetTop - stage.scrollTop + image.offsetHeight / 2,
    },
  };
}

function paint(image: HTMLImageElement, { zoom, pan }: ZoomView) {
  image.style.setProperty("--zoom", String(zoom));
  image.style.setProperty("--pan-x", `${pan.x}px`);
  image.style.setProperty("--pan-y", `${pan.y}px`);
}

/**
 * Zoom, pan and magnifier of the viewer's photo. The committed view is React state; while a
 * finger or the mouse moves the photo, the view is written straight to CSS variables (one paint
 * per frame, no render) and committed when the gesture ends.
 *
 * `subject` names the photo and scale mode: the view starts over when it changes.
 */
export function useImageZoom(subject: string, scaleMode: ImageScaleMode) {
  const [stored, dispatch] = useReducer(zoomReducer, subject, initialZoomState);
  const state = zoomStateFor(stored, subject);
  const imageRef = useRef<HTMLImageElement>(null);
  const lensElementRef = useRef<HTMLDivElement>(null);
  const gestureRef = useRef<Gesture | null>(null);
  const touchesRef = useRef(new Map<number, Point>());
  const frameRef = useRef(0);

  const commit = (view: ZoomView) => dispatch({ type: "view", subject, view });

  const zoomTo = (zoom: number, at?: Point) => {
    const image = imageRef.current;
    if (!image) return;
    const { bounds, centre } = measure(image);
    const focal = at ? { x: at.x - centre.x, y: at.y - centre.y } : null;
    commit(zoomAround(state, zoom, focal, bounds, scaleMode));
  };

  const hideLens = () => {
    cancelAnimationFrame(frameRef.current);
    lensElementRef.current?.style.setProperty("opacity", "0");
  };

  const moveLens = (image: HTMLImageElement, pointer: Point) => {
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const lens = lensElementRef.current;
      const stage = lens?.parentElement;
      if (!lens || !stage) return;
      const rect = image.getBoundingClientRect();
      const stageRect = stage.getBoundingClientRect();
      const x = Math.min(rect.width, Math.max(0, pointer.x - rect.left)) * state.lensStrength;
      const y = Math.min(rect.height, Math.max(0, pointer.y - rect.top)) * state.lensStrength;
      lens.style.opacity = "1";
      lens.style.translate = `${pointer.x - stageRect.left - LENS_SIZE / 2}px ${pointer.y - stageRect.top - LENS_SIZE / 2}px`;
      lens.style.backgroundSize = `${rect.width * state.lensStrength}px ${rect.height * state.lensStrength}px`;
      lens.style.backgroundPosition = `${LENS_SIZE / 2 - x}px ${LENS_SIZE / 2 - y}px`;
    });
  };

  const moveGesture = (image: HTMLImageElement, gesture: Gesture, view: ZoomView) => {
    gesture.view = clampView(view, measure(image).bounds, scaleMode);
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => paint(image, gesture.view));
  };

  const endGesture = (image: HTMLImageElement) => {
    const gesture = gestureRef.current;
    if (!gesture) return;
    gestureRef.current = null;
    delete image.dataset.gesture;
    commit(gesture.view);
  };

  const onWheel = (event: WheelEvent) => {
    if (!wheelZooms(scaleMode, state.zoom, event.ctrlKey)) return;
    event.preventDefault();
    zoomTo(stepZoom(state.zoom, event.deltaY < 0 ? 1 : -1), {
      x: event.clientX,
      y: event.clientY,
    });
  };

  /** Attaches the photo. React's own wheel listener is passive and cannot cancel the scroll. */
  const attach = (image: HTMLImageElement) => {
    imageRef.current = image;
    image.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      image.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(frameRef.current);
      imageRef.current = null;
    };
  };

  const onPointerDown = (event: PointerEvent<HTMLImageElement>) => {
    const image = event.currentTarget;
    const point = { x: event.clientX, y: event.clientY };
    if (event.pointerType !== "mouse") {
      image.setPointerCapture(event.pointerId);
      touchesRef.current.set(event.pointerId, point);
      const [first, second] = [...touchesRef.current.values()];
      if (first && second) {
        const from = gestureRef.current?.view ?? state;
        gestureRef.current = { kind: "pinch", distance: distance(first, second), from, view: from };
        image.dataset.gesture = "pinch";
        return;
      }
    }
    if (state.lens || !canPan(scaleMode, state.zoom)) return;
    event.preventDefault();
    image.setPointerCapture(event.pointerId);
    gestureRef.current = {
      kind: "drag",
      pointerId: event.pointerId,
      start: point,
      from: state,
      view: state,
    };
    image.dataset.gesture = "drag";
  };

  const onPointerMove = (event: PointerEvent<HTMLImageElement>) => {
    const image = event.currentTarget;
    const point = { x: event.clientX, y: event.clientY };
    const gesture = gestureRef.current;
    if (touchesRef.current.has(event.pointerId)) touchesRef.current.set(event.pointerId, point);

    if (gesture?.kind === "pinch") {
      const [first, second] = [...touchesRef.current.values()];
      if (!first || !second) return;
      const zoom = gesture.from.zoom * (distance(first, second) / Math.max(1, gesture.distance));
      moveGesture(image, gesture, { zoom, pan: gesture.from.pan });
    } else if (gesture?.kind === "drag" && gesture.pointerId === event.pointerId) {
      moveGesture(image, gesture, {
        zoom: gesture.from.zoom,
        pan: {
          x: gesture.from.pan.x + point.x - gesture.start.x,
          y: gesture.from.pan.y + point.y - gesture.start.y,
        },
      });
    } else if (state.lens && event.pointerType === "mouse") {
      moveLens(image, point);
    }
  };

  const onPointerEnd = (event: PointerEvent<HTMLImageElement>) => {
    touchesRef.current.delete(event.pointerId);
    const gesture = gestureRef.current;
    const ended =
      gesture?.kind === "pinch"
        ? touchesRef.current.size < 2
        : gesture?.pointerId === event.pointerId;
    if (ended) endGesture(event.currentTarget);
    if (event.type !== "pointerup") hideLens();
  };

  const onDoubleClick = (event: MouseEvent<HTMLImageElement>) => {
    event.preventDefault();
    if (state.zoom > IMAGE_ZOOM.min) commit(unzoomed);
    else
      zoomTo(Math.max(IMAGE_ZOOM.doubleClick, state.lensStrength), {
        x: event.clientX,
        y: event.clientY,
      });
  };

  return {
    state,
    changed: isZoomChanged(state),
    /** Ref callback of the magnifier's element. */
    attachLens: (lens: HTMLDivElement) => {
      lensElementRef.current = lens;
      return () => {
        lensElementRef.current = null;
      };
    },
    /** Ref callback of the photo's `<img>`. */
    attach,
    /** Spread onto the photo's `<img>`; its style comes from `state`. */
    imageProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp: onPointerEnd,
      onPointerCancel: onPointerEnd,
      onPointerLeave: onPointerEnd,
      onDoubleClick,
      "data-pannable": canPan(scaleMode, state.zoom) && !state.lens ? "" : undefined,
      "data-lens": state.lens ? "" : undefined,
    },
    zoomBy: (direction: 1 | -1) => zoomTo(stepZoom(state.zoom, direction)),
    reset: () => dispatch({ type: "reset", subject }),
    setLens: (on: boolean) => dispatch({ type: "lens", subject, on }),
    setLensStrength: (value: number) => dispatch({ type: "lensStrength", subject, value }),
  };
}

export type ImageZoom = ReturnType<typeof useImageZoom>;
