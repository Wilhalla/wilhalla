import {
  OTHER_CATEGORY_ID,
  atlasCategory,
  categoryColor,
  colorMix,
  type AtlasArrangement,
  type MapPoint,
  type ScreenPoint,
} from "./archiveAtlas";
import { layoutDistricts, type AtlasLayout } from "./atlasLayout";
import {
  IDLE_POINTER,
  INITIAL_ATLAS_VIEW,
  atlasPointerReducer,
  draggedPan,
  zoomAtlasView,
  type AtlasPointer,
  type AtlasView,
} from "./atlasView";

/** What the atlas shows. React owns it; the renderer draws it. */
export interface AtlasScene {
  points: readonly MapPoint[];
  /** The stories that pass the filters; the rest is a faint backdrop. */
  visible: readonly MapPoint[];
  /** The selected category, which colours the visible stories. */
  focus: string | null;
  selected: MapPoint | null;
  relatedIds: readonly string[];
  arrangement: AtlasArrangement;
}

export interface AtlasHover {
  point: MapPoint;
  /** Position of the story on the canvas, in CSS pixels. */
  at: ScreenPoint;
}

export interface AtlasRendererEvents {
  /** The story under the mouse changed, or moved with the view. */
  onHover: (hover: AtlasHover | null) => void;
  /** A click: on a story, or on empty map (null). */
  onSelect: (point: MapPoint | null) => void;
}

export interface AtlasRenderer {
  setScene: (scene: AtlasScene) => void;
  /** Zooms around the centre of the map. */
  zoomBy: (factor: number) => void;
  resetView: () => void;
  destroy: () => void;
}

interface Size {
  width: number;
  height: number;
}

/** Margin around the projection, as a share of the plot, so edge points are not clipped. */
const INSET = 0.05;
const HIT_RADIUS = 9;
const BLEND_MS = 700;
const WHEEL_IN = 1.14;
const WHEEL_OUT = 0.88;
/** Subject names are drawn while zoomed out further than this. */
const LABEL_MAX_SCALE = 2.6;

/** Width/height of the plot, rounded so small resizes do not re-run the layout. */
const aspectOf = (size: Size) =>
  size.width && size.height ? Math.round((size.width / size.height) * 10) / 10 : 1;

/** CSS pixels per layout unit (the layout is `aspect` wide and 1 high). */
const unitOf = (size: Size) => Math.min(size.width / aspectOf(size), size.height) * (1 - 2 * INSET);

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * Where to write a subject's name on the map by meaning: the centre of its densest neighbourhood,
 * not its mean (a subject spreads over the map, and its mean often lands in another's area).
 */
function meaningAnchors(points: readonly MapPoint[]) {
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
  const anchors = new Map<string, ScreenPoint>();
  for (const [categoryId, byCell] of cells) {
    let densest = { count: 0, x: 0, y: 0 };
    for (const cell of byCell.values()) if (cell.count > densest.count) densest = cell;
    anchors.set(categoryId, { x: densest.x / densest.count, y: densest.y / densest.count });
  }
  return anchors;
}

/**
 * Draws the atlas on `canvas` and owns everything that changes many times per second: pan, zoom,
 * the pointer, the glide between the two arrangements and the canvas size. None of it is React
 * state; React hands over a scene and hears about hovers and clicks.
 */
export function createAtlasRenderer(
  canvas: HTMLCanvasElement,
  events: AtlasRendererEvents,
): AtlasRenderer {
  const context = canvas.getContext("2d");
  const theme = getComputedStyle(document.documentElement);
  const token = (name: string) => theme.getPropertyValue(name).trim() || "currentColor";
  const colors = {
    muted: token("--color-chalk"),
    ink: token("--color-obsidian"),
    surface: token("--color-pure-surface"),
  };
  // The subjects' colours are theme tokens too (`--color-topic-*`), resolved once per subject.
  const topicColors = new Map<string, string>();
  const topicColor = (id: string) => {
    let color = topicColors.get(id);
    if (color === undefined) {
      color = token(categoryColor(id));
      topicColors.set(id, color);
    }
    return color;
  };
  const labelFont = `400 17px ${token("--font-heading")}`;

  let size: Size = { width: 0, height: 0 };
  let view: AtlasView = INITIAL_ATLAS_VIEW;
  let pointer: AtlasPointer = IDLE_POINTER;
  let scene: AtlasScene | null = null;
  let visibleIds = new Set<string>();
  let pointsById = new Map<string, MapPoint>();
  let anchors = new Map<string, ScreenPoint>();
  let layout: AtlasLayout = { positions: new Map(), districts: [] };
  let layoutAspect = 0;
  /** 1 when stories sit in their subject's district, 0 where the text projection puts them. */
  let blend = 1;
  let blendFrame = 0;
  let drawFrame = 0;
  let hoverId: string | null = null;
  let cursor: ScreenPoint | null = null;

  function plotPosition(position: ScreenPoint): ScreenPoint {
    const unit = unitOf(size);
    return {
      x: (size.width - aspectOf(size) * unit) / 2 + position.x * unit,
      y: (size.height - unit) / 2 + position.y * unit,
    };
  }

  /** Screen position of a position in the layout rectangle. */
  function toScreen(position: ScreenPoint): ScreenPoint {
    const plot = plotPosition(position);
    return { x: plot.x * view.scale + view.pan.x, y: plot.y * view.scale + view.pan.y };
  }

  /** Where the projection puts a story, in the same rectangle as the districts. */
  const meaningPosition = (position: ScreenPoint): ScreenPoint => ({
    x: position.x * aspectOf(size),
    y: position.y,
  });

  /** Screen position of a story, between its place by meaning and in its district. */
  function screenOf(point: MapPoint): ScreenPoint {
    const byMeaning = meaningPosition(point);
    const bySubject = layout.positions.get(point.id) ?? byMeaning;
    return toScreen({
      x: byMeaning.x + (bySubject.x - byMeaning.x) * blend,
      y: byMeaning.y + (bySubject.y - byMeaning.y) * blend,
    });
  }

  function ensureLayout() {
    const aspect = aspectOf(size);
    if (!scene || aspect === layoutAspect) return;
    layout = layoutDistricts(scene.points, aspect);
    layoutAspect = aspect;
  }

  function draw() {
    drawFrame = 0;
    if (!context || !scene || !size.width) return;
    ensureLayout();
    const { width, height } = size;
    const { focus, selected } = scene;
    const radius = Math.min(6, 1.6 + Math.sqrt(view.scale) * 0.9);
    const unit = unitOf(size) * view.scale;
    const offscreen = ({ x, y }: ScreenPoint) =>
      x < -8 || y < -8 || x > width + 8 || y > height + 8;
    const circle = (center: ScreenPoint, r: number) => {
      context.beginPath();
      context.arc(center.x, center.y, r, 0, Math.PI * 2);
    };

    context.clearRect(0, 0, width, height);

    // By subject: a soft disc per subject, so the regions read before the dots do.
    for (const district of blend > 0.02 ? layout.districts : []) {
      const alpha = !focus ? 0.07 : district.id === focus ? 0.12 : 0.03;
      context.fillStyle = colorMix(topicColor(district.id), alpha * blend);
      circle(toScreen(district), district.r * unit + radius * 2);
      context.fill();
    }

    // By meaning: a coloured haze where the selected subject's stories gather.
    if (focus && blend < 0.98) {
      context.save();
      context.filter = "blur(18px)";
      context.globalAlpha = 0.12 * (1 - blend);
      context.fillStyle = topicColor(focus);
      for (const point of scene.visible) {
        circle(screenOf(point), 14 * Math.sqrt(view.scale));
        context.fill();
      }
      context.restore();
    }

    // Points outside the filters stay as a faint backdrop, so the map keeps its shape.
    context.fillStyle = colors.muted;
    for (const point of scene.points) {
      if (visibleIds.has(point.id)) continue;
      const at = screenOf(point);
      if (offscreen(at)) continue;
      circle(at, radius * 0.8);
      context.fill();
    }

    // Stories in their own subject's district are filled. With a subject selected, stories that
    // only touch on it (it is a secondary subject) stay in their own district as open rings.
    context.globalAlpha = selected ? 0.45 : 0.85;
    context.lineWidth = 1.2;
    for (const point of scene.visible) {
      const at = screenOf(point);
      if (offscreen(at)) continue;
      const color = topicColor(focus ?? point.topicId);
      if (focus && point.topicId !== focus && blend > 0.5) {
        context.strokeStyle = color;
        circle(at, radius - 0.6);
        context.stroke();
      } else {
        context.fillStyle = color;
        circle(at, radius);
        context.fill();
      }
    }
    context.globalAlpha = 1;

    // The selected story and its nearest neighbours.
    if (selected) {
      context.strokeStyle = colors.ink;
      context.lineWidth = 1;
      for (const id of scene.relatedIds) {
        const related = pointsById.get(id);
        if (!related) continue;
        circle(screenOf(related), radius + 2.5);
        context.stroke();
      }
      const at = screenOf(selected);
      context.fillStyle = topicColor(selected.topicId);
      context.strokeStyle = colors.surface;
      context.lineWidth = 2.5;
      circle(at, radius + 3.5);
      context.fill();
      context.stroke();
      context.strokeStyle = colors.ink;
      context.lineWidth = 1.25;
      circle(at, radius + 6);
      context.stroke();
    }

    // Subject names, while zoomed out: above their district, or on their densest area by meaning.
    if (view.scale >= LABEL_MAX_SCALE || selected) return;
    const bySubject = blend >= 0.5;
    context.font = labelFont;
    context.textAlign = "center";
    context.textBaseline = bySubject ? "bottom" : "middle";
    context.lineJoin = "round";
    context.lineWidth = 5;
    context.strokeStyle = colors.surface;
    context.fillStyle = colors.ink;
    const write = (categoryId: string, at: ScreenPoint) => {
      const label = atlasCategory(categoryId)?.label;
      if (!label || (focus && categoryId !== focus)) return;
      context.strokeText(label, at.x, at.y);
      context.fillText(label, at.x, at.y);
    };
    if (bySubject) {
      for (const district of layout.districts) {
        // Too small to carry a name without colliding with its neighbours (phones): zoom in.
        if (district.r * unit < 34) continue;
        const { x, y } = toScreen(district);
        write(district.id, { x, y: y - district.r * unit - radius * 2 - 4 });
      }
    } else {
      for (const [categoryId, anchor] of anchors) {
        if (categoryId !== OTHER_CATEGORY_ID) write(categoryId, toScreen(meaningPosition(anchor)));
      }
    }
  }

  function scheduleDraw() {
    if (!drawFrame) drawFrame = requestAnimationFrame(draw);
  }

  function hitAt(at: ScreenPoint): AtlasHover | null {
    if (!scene) return null;
    let best: AtlasHover | null = null;
    let bestDistance = HIT_RADIUS ** 2;
    for (const point of scene.visible) {
      const screen = screenOf(point);
      const distance = (screen.x - at.x) ** 2 + (screen.y - at.y) ** 2;
      if (distance < bestDistance) {
        best = { point, at: screen };
        bestDistance = distance;
      }
    }
    return best;
  }

  /** Reports the hovered story when it changes, or always when the view moved under it. */
  function updateHover(viewMoved = false) {
    const hover = cursor && pointer.kind !== "dragging" ? hitAt(cursor) : null;
    const id = hover?.point.id ?? null;
    if (id === hoverId && !(viewMoved && id)) return;
    hoverId = id;
    canvas.dataset.hover = String(id !== null);
    events.onHover(hover);
  }

  function setView(next: AtlasView) {
    view = next;
    scheduleDraw();
    updateHover(true);
  }

  function setPointer(next: AtlasPointer) {
    if (next === pointer) return;
    pointer = next;
    canvas.dataset.dragging = String(next.kind === "dragging");
  }

  const cursorOf = (event: MouseEvent): ScreenPoint => {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  function onPointerDown(event: PointerEvent) {
    canvas.setPointerCapture(event.pointerId);
    setPointer(
      atlasPointerReducer(pointer, {
        type: "down",
        at: { x: event.clientX, y: event.clientY },
        pan: view.pan,
      }),
    );
  }

  function onPointerMove(event: PointerEvent) {
    const at = { x: event.clientX, y: event.clientY };
    setPointer(atlasPointerReducer(pointer, { type: "move", at }));
    if (pointer.kind === "dragging") {
      cursor = null;
      setView({ scale: view.scale, pan: draggedPan(pointer, at) });
    } else if (pointer.kind === "idle" && event.pointerType === "mouse") {
      cursor = cursorOf(event);
      updateHover();
    }
  }

  function onPointerUp(event: PointerEvent) {
    const clicked = pointer.kind === "pressed";
    setPointer(atlasPointerReducer(pointer, { type: "up" }));
    if (clicked) events.onSelect(hitAt(cursorOf(event))?.point ?? null);
  }

  /** A cancelled touch or lost capture ends the press without a click. */
  function onPointerCancel() {
    setPointer(atlasPointerReducer(pointer, { type: "cancel" }));
  }

  function onPointerLeave() {
    cursor = null;
    updateHover();
  }

  function onWheel(event: WheelEvent) {
    event.preventDefault();
    event.stopPropagation();
    setView(zoomAtlasView(view, cursorOf(event), event.deltaY > 0 ? WHEEL_OUT : WHEEL_IN));
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const maxDpr = window.matchMedia("(pointer: coarse)").matches ? 1.25 : 1.5;
    const dpr = Math.min(maxDpr, Math.max(1, window.devicePixelRatio || 1));
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    context?.setTransform(dpr, 0, 0, dpr, 0, 0);
    size = { width: rect.width, height: rect.height };
    // Resizing clears the canvas: draw now, not a frame later.
    cancelAnimationFrame(drawFrame);
    draw();
  }

  function glideTo(target: number) {
    cancelAnimationFrame(blendFrame);
    if (blend === target) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      blend = target;
      return;
    }
    const from = blend;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / BLEND_MS);
      blend = from + (target - from) * easeInOut(t);
      scheduleDraw();
      if (t < 1) blendFrame = requestAnimationFrame(step);
    };
    blendFrame = requestAnimationFrame(step);
  }

  const listeners = [
    ["pointerdown", onPointerDown],
    ["pointermove", onPointerMove],
    ["pointerup", onPointerUp],
    ["pointercancel", onPointerCancel],
    ["lostpointercapture", onPointerCancel],
    ["pointerleave", onPointerLeave],
  ] as const;
  for (const [type, listener] of listeners) canvas.addEventListener(type, listener);
  canvas.addEventListener("wheel", onWheel, { passive: false });
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);

  return {
    setScene(next) {
      const target = next.arrangement === "subject" ? 1 : 0;
      if (scene) glideTo(target);
      else blend = target;
      if (scene?.points !== next.points) {
        pointsById = new Map(next.points.map((point) => [point.id, point]));
        anchors = meaningAnchors(next.points);
        layoutAspect = 0;
      }
      visibleIds = new Set(next.visible.map((point) => point.id));
      scene = next;
      scheduleDraw();
      updateHover();
    },
    zoomBy(factor) {
      setView(zoomAtlasView(view, { x: size.width / 2, y: size.height / 2 }, factor));
    },
    resetView() {
      setView(INITIAL_ATLAS_VIEW);
    },
    destroy() {
      for (const [type, listener] of listeners) canvas.removeEventListener(type, listener);
      canvas.removeEventListener("wheel", onWheel);
      observer.disconnect();
      cancelAnimationFrame(drawFrame);
      cancelAnimationFrame(blendFrame);
    },
  };
}
