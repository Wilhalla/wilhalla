import { Button } from "@wilhalla/ui/components/button";
import { Slider } from "@wilhalla/ui/components/slider";
import { Toggle } from "@wilhalla/ui/components/toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@wilhalla/ui/components/tooltip";
import { Search, ZoomIn, ZoomOut } from "lucide-react";
import { formatMetric } from "../../lib/format";
import { IMAGE_ZOOM, LENS } from "../../lib/imageZoom";
import ToolButton from "./ToolButton";
import type { ImageZoom } from "./useImageZoom";

/** Zoom out, the zoom level (press to reset), zoom in, and the magnifier with its strength. */
export default function ViewerZoomControls({ zoom }: { zoom: ImageZoom }) {
  const { state } = zoom;

  return (
    <>
      <ToolButton
        label="Uitzoomen"
        onClick={() => zoom.zoomBy(-1)}
        disabled={state.zoom <= IMAGE_ZOOM.min}
      >
        <ZoomOut />
      </ToolButton>
      <Button
        variant="ghost"
        size="sm"
        aria-label="Zoom terugzetten"
        disabled={!zoom.changed}
        onClick={zoom.reset}
      >
        <span className="w-10 tabular-nums" aria-live="polite">
          {Math.round(state.zoom * 100)}%
        </span>
      </Button>
      <ToolButton
        label="Inzoomen"
        onClick={() => zoom.zoomBy(1)}
        disabled={state.zoom >= IMAGE_ZOOM.max}
      >
        <ZoomIn />
      </ToolButton>
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            size="sm"
            aria-label="Vergrootglas"
            pressed={state.lens}
            onPressedChange={zoom.setLens}
          >
            <Search />
          </Toggle>
        </TooltipTrigger>
        <TooltipContent side="bottom">Vergrootglas</TooltipContent>
      </Tooltip>
      {state.lens && (
        <div className="flex items-center gap-2 px-2">
          <Slider
            className="w-28"
            aria-label="Sterkte van het vergrootglas"
            min={LENS.min}
            max={LENS.max}
            step={LENS.step}
            value={[state.lensStrength]}
            onValueChange={([value]) => value !== undefined && zoom.setLensStrength(value)}
          />
          <span className="w-9 font-sans text-body text-gravel tabular-nums">
            {formatMetric(state.lensStrength)}×
          </span>
        </div>
      )}
    </>
  );
}
