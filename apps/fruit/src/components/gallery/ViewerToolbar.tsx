import { Button } from "@wilhalla/ui/components/button";
import { Separator } from "@wilhalla/ui/components/separator";
import { TooltipProvider } from "@wilhalla/ui/components/tooltip";
import { Maximize2, Minimize2, Play } from "lucide-react";
import { toggleFullscreen } from "../../hooks/useFullscreen";
import type { GalleryImageRecord } from "../../lib/imageGallerySession";
import type { ImageScaleMode } from "../../lib/imageZoom";
import ToolButton from "./ToolButton";
import type { ImageZoom } from "./useImageZoom";
import ViewerMoreMenu from "./ViewerMoreMenu";
import ViewerZoomControls from "./ViewerZoomControls";

interface ViewerToolbarProps {
  image: GalleryImageRecord;
  zoom: ImageZoom;
  scaleMode: ImageScaleMode;
  fullscreen: boolean;
  canStartSlideshow: boolean;
  onScaleModeChange: (mode: ImageScaleMode) => void;
  onStartSlideshow: () => void;
}

/** The viewer's controls: zoom and magnifier (wide screens), full screen, more, slideshow. */
export default function ViewerToolbar({
  image,
  zoom,
  scaleMode,
  fullscreen,
  canStartSlideshow,
  onScaleModeChange,
  onStartSlideshow,
}: ViewerToolbarProps) {
  return (
    <TooltipProvider delayDuration={400}>
      <div role="toolbar" aria-label="Beeldviewer" className="flex items-center gap-1">
        <div className="flex items-center gap-1 max-md:hidden">
          <ViewerZoomControls zoom={zoom} />
          <Separator orientation="vertical" className="mx-1 data-[orientation=vertical]:h-5" />
        </div>
        <ToolButton
          label={fullscreen ? "Volledig scherm verlaten" : "Volledig scherm"}
          // The whole page goes full screen, so these controls and their menus stay with the photo.
          onClick={() => toggleFullscreen(document.documentElement)}
        >
          {fullscreen ? <Minimize2 /> : <Maximize2 />}
        </ToolButton>
        <ViewerMoreMenu image={image} scaleMode={scaleMode} onScaleModeChange={onScaleModeChange} />
        <Button
          variant="outline"
          size="sm"
          className="ml-1"
          disabled={!canStartSlideshow}
          onClick={onStartSlideshow}
        >
          <Play /> Diashow
        </Button>
      </div>
    </TooltipProvider>
  );
}
