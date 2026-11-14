import { Button } from "@wilhalla/ui/components/button";
import { Maximize2, Minus, Plus, Scan } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { MapPoint } from "../../lib/archiveAtlas";
import {
  createAtlasRenderer,
  type AtlasHover,
  type AtlasRenderer,
  type AtlasScene,
} from "../../lib/atlasRenderer";
import AtlasHoverCard from "./AtlasHoverCard";

const ZOOM_STEP = 1.4;

interface AtlasPlotProps {
  scene: AtlasScene;
  /** A click on a story, or on empty map (null). Must be stable: it is bound once. */
  onSelect: (point: MapPoint | null) => void;
}

/** The map itself: a canvas drawn by the atlas renderer, with its zoom controls and hover card. */
export default function AtlasPlot({ scene, onSelect }: AtlasPlotProps) {
  const plotRef = useRef<HTMLDivElement | null>(null);
  const [renderer, setRenderer] = useState<AtlasRenderer | null>(null);
  const [hover, setHover] = useState<AtlasHover | null>(null);

  const attachCanvas = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return undefined;
    const created = createAtlasRenderer(canvas, { onHover: setHover, onSelect });
    setRenderer(created);
    return () => created.destroy();
  };

  // The canvas is outside React: hand it the scene whenever the scene changes.
  useEffect(() => {
    renderer?.setScene(scene);
  }, [renderer, scene]);

  return (
    <div
      ref={plotRef}
      className="relative h-stage min-h-96 overflow-hidden rounded-2xl bg-pure-surface shadow-subtle-2"
    >
      <canvas
        ref={attachCanvas}
        aria-label="Alle berichten als stippen, per onderwerp"
        className="block size-full touch-none data-[dragging=true]:cursor-grabbing data-[hover=true]:cursor-pointer"
      />
      {hover && <AtlasHoverCard hover={hover} />}
      <div className="absolute right-3 bottom-3 flex flex-col gap-1">
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Inzoomen"
          onClick={() => renderer?.zoomBy(ZOOM_STEP)}
        >
          <Plus />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Uitzoomen"
          onClick={() => renderer?.zoomBy(1 / ZOOM_STEP)}
        >
          <Minus />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Hele kaart tonen"
          onClick={() => renderer?.resetView()}
        >
          <Scan />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Volledig scherm"
          onClick={() => {
            if (document.fullscreenElement) void document.exitFullscreen();
            else void plotRef.current?.requestFullscreen();
          }}
        >
          <Maximize2 />
        </Button>
      </div>
    </div>
  );
}
