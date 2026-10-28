import { Slider } from "@wilhalla/ui/components/slider";
import type { CSSProperties, MouseEvent, PointerEvent, RefObject, WheelEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  ExternalLink,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  Play,
  Search,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import type * as React from "react";
import { Separator } from "@wilhalla/ui/components/separator";
import { Toggle } from "@wilhalla/ui/components/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@wilhalla/ui/components/tooltip";
import { Button } from "@wilhalla/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@wilhalla/ui/components/dropdown-menu";
import {
  IMAGE_ZOOM_MAX,
  IMAGE_ZOOM_MIN,
  IMAGE_ZOOM_STEP,
  ZOOM_LENS_SIZE,
  ZOOM_MAX,
  ZOOM_MIN,
  ZOOM_STEP,
  type ImageScaleMode,
} from "./useImageZoomPan";
import { type GalleryImageRecord as ImageRecord } from "../../lib/imageGallerySession";
import type { SlideshowMode } from "./useGallerySlideshow";

export const IMAGE_SCALE_OPTIONS: Array<{
  value: ImageScaleMode;
  label: string;
  description: string;
}> = [
  { value: "fit", label: "Passend", description: "Toon de volledige foto binnen het venster." },
  {
    value: "width",
    label: "Breedte passend",
    description: "Maak de foto zo breed als het kijkvlak; verticaal scrollen kan.",
  },
  {
    value: "height",
    label: "Hoogte passend",
    description: "Gebruik de beschikbare hoogte, handig voor panorama’s.",
  },
  {
    value: "cover",
    label: "Vullen",
    description: "Vul het hele kijkvlak zoals CSS cover; randen kunnen wegvallen.",
  },
  {
    value: "original",
    label: "Origineel formaat",
    description: "Gebruik de echte pixelgrootte en scroll indien nodig.",
  },
];

export function isImageScaleMode(value: string | null): value is ImageScaleMode {
  return IMAGE_SCALE_OPTIONS.some((option) => option.value === value);
}

function imageViewportClassName(scaleMode: ImageScaleMode, imageZoom: number) {
  if (scaleMode === "cover") return "absolute inset-0 grid place-items-center overflow-hidden";
  if (imageZoom > IMAGE_ZOOM_MIN)
    return "absolute inset-0 grid place-items-center overflow-hidden p-4 lg:p-8";
  if (scaleMode === "width" || scaleMode === "original")
    return "absolute inset-0 overflow-auto p-4 lg:p-8";
  return "absolute inset-0 grid place-items-center overflow-hidden p-4 lg:p-8";
}

function imageElementClassName(scaleMode: ImageScaleMode, zoomEnabled: boolean, imageZoom: number) {
  const interaction = zoomEnabled
    ? " cursor-none select-none"
    : imageZoom > IMAGE_ZOOM_MIN || scaleMode === "cover"
      ? " cursor-grab select-none touch-none active:cursor-grabbing"
      : "";
  if (scaleMode === "cover") return `block h-full w-full max-w-none object-cover${interaction}`;
  if (scaleMode === "width") return `block h-auto w-full max-w-none object-contain${interaction}`;
  if (scaleMode === "height") return `block h-full w-auto max-w-none object-contain${interaction}`;
  if (scaleMode === "original")
    return `block h-auto w-auto max-w-none object-contain${interaction}`;
  return `block h-auto w-auto max-h-full max-w-full object-contain${interaction}`;
}

type Props = {
  filteredCount: number;
  imageScaleMode: ImageScaleMode;
  imageStyle?: CSSProperties;
  imageZoom: number;
  imageZoomChanged: boolean;
  imageZoomLabel: string;
  nextImage: ImageRecord | null;
  previousImage: ImageRecord | null;
  slideshowMode: SlideshowMode;
  slideshowSeconds: number;
  viewerFullscreen: boolean;
  viewerImage: ImageRecord;
  viewerImageFullSrc: string;
  viewerImageRef: RefObject<HTMLImageElement | null>;
  viewerImageStageRef: RefObject<HTMLDivElement | null>;
  zoomEnabled: boolean;
  zoomLensRef: RefObject<HTMLDivElement | null>;
  zoomValue: number;
  zoomValueLabel: string;
  onCaptureZoomRects: (image: HTMLImageElement) => void;
  onDownload: () => void;
  onFinishPan: (event: PointerEvent<HTMLImageElement>) => void;
  onImageDoubleClick: (event: MouseEvent<HTMLImageElement>) => void;
  onImageLoad: (size: { width: number; height: number }) => void;
  onImagePointerDown: (event: PointerEvent<HTMLImageElement>) => void;
  onImagePointerMove: (event: PointerEvent<HTMLImageElement>) => void;
  onImageWheel: (event: WheelEvent<HTMLImageElement>) => void;
  onOpenImage: (imageId: string) => void;
  onResetZoom: () => void;
  onScaleModeChange: (mode: ImageScaleMode) => void;
  onSetImageZoomAt: (zoom: number) => void;
  onSetZoomEnabled: (updater: (current: boolean) => boolean) => void;
  onSetZoomValue: (value: number) => void;
  onSlideshowModeChange: (mode: SlideshowMode) => void;
  onSlideshowSecondsChange: (seconds: number) => void;
  onStartSlideshow: () => void;
  onToggleFullscreen: () => void;
  onHideZoomLens: () => void;
};

export default function ViewerImageStage({
  imageScaleMode,
  imageStyle,
  imageZoom,
  nextImage,
  previousImage,
  viewerImage,
  viewerImageFullSrc,
  viewerImageRef,
  viewerImageStageRef,
  zoomEnabled,
  zoomLensRef,
  onCaptureZoomRects,
  onFinishPan,
  onHideZoomLens,
  onImageDoubleClick,
  onImageLoad,
  onImagePointerDown,
  onImagePointerMove,
  onImageWheel,
  onOpenImage,
}: Props) {
  return (
    <div
      ref={viewerImageStageRef}
      className="relative min-h-[72svh] w-full min-w-0 overflow-hidden border-b border-chalk bg-powder/40 lg:min-h-0 lg:border-b-0 lg:border-r"
    >
      <div className={imageViewportClassName(imageScaleMode, imageZoom)} onScroll={onHideZoomLens}>
        <img
          ref={viewerImageRef}
          className={`${imageElementClassName(imageScaleMode, zoomEnabled, imageZoom)} touch-none`}
          style={imageStyle}
          src={viewerImageFullSrc}
          alt={viewerImage.visualDescription || viewerImage.postTitle}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          draggable={false}
          onLoad={(event) =>
            onImageLoad({
              width: event.currentTarget.naturalWidth,
              height: event.currentTarget.naturalHeight,
            })
          }
          onWheel={onImageWheel}
          onPointerEnter={(event) => {
            if (zoomEnabled) onCaptureZoomRects(event.currentTarget);
          }}
          onDoubleClick={onImageDoubleClick}
          onPointerDown={onImagePointerDown}
          onPointerMove={onImagePointerMove}
          onPointerUp={onFinishPan}
          onPointerLeave={(event) => {
            onFinishPan(event);
            onHideZoomLens();
          }}
          onPointerCancel={(event) => {
            onFinishPan(event);
            onHideZoomLens();
          }}
        />
      </div>
      {zoomEnabled && (
        <div
          ref={zoomLensRef}
          className="pointer-events-none absolute left-0 top-0 z-20 rounded-full border border-eggshell/95 bg-no-repeat opacity-0 shadow-[0_18px_60px_rgba(19,24,32,0.34),inset_0_0_0_1px_rgba(19,24,32,0.25)] ring-1 ring-obsidian/20 will-change-transform"
          style={{
            width: ZOOM_LENS_SIZE,
            height: ZOOM_LENS_SIZE,
            backgroundImage: `url("${viewerImageFullSrc.replace(/"/g, '\\\"')}")`,
          }}
          aria-hidden="true"
        />
      )}
      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-30 flex items-center justify-between px-3 lg:px-5">
        <Button
          variant="outline"
          size="icon-lg"
          className="pointer-events-auto"
          disabled={!previousImage}
          onClick={() => previousImage && onOpenImage(previousImage.id)}
          aria-label="Vorige afbeelding"
        >
          <ArrowLeft />
        </Button>
        <Button
          variant="outline"
          size="icon-lg"
          className="pointer-events-auto"
          disabled={!nextImage}
          onClick={() => nextImage && onOpenImage(nextImage.id)}
          aria-label="Volgende afbeelding"
        >
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}

function ToolButton({
  label,
  children,
  ...props
}: React.ComponentProps<typeof Button> & { label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={label} {...props}>
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
}

/**
 * The viewer's controls, in its header: zoom, magnifier, full screen and the slideshow up front;
 * scaling, download and opening the original under "Meer".
 */
export function ViewerToolbar({
  filteredCount,
  imageScaleMode,
  imageZoom,
  imageZoomChanged,
  imageZoomLabel,
  viewerFullscreen,
  viewerImageFullSrc,
  zoomEnabled,
  zoomValue,
  zoomValueLabel,
  onDownload,
  onResetZoom,
  onScaleModeChange,
  onSetImageZoomAt,
  onSetZoomEnabled,
  onSetZoomValue,
  onStartSlideshow,
  onToggleFullscreen,
}: Props) {
  return (
    <TooltipProvider delayDuration={400}>
      <div role="toolbar" aria-label="Beeldviewer" className="flex items-center gap-1">
        <div className="flex items-center gap-1 max-md:hidden">
          <ToolButton
            label="Uitzoomen"
            onClick={() => onSetImageZoomAt(imageZoom - IMAGE_ZOOM_STEP)}
            disabled={imageZoom <= IMAGE_ZOOM_MIN}
          >
            <ZoomOut />
          </ToolButton>
          <Button
            variant="ghost"
            size="sm"
            aria-label="Zoom terugzetten"
            disabled={!imageZoomChanged}
            onClick={onResetZoom}
          >
            <span className="w-10 tabular-nums" aria-live="polite">
              {imageZoomLabel}
            </span>
          </Button>
          <ToolButton
            label="Inzoomen"
            onClick={() => onSetImageZoomAt(imageZoom + IMAGE_ZOOM_STEP)}
            disabled={imageZoom >= IMAGE_ZOOM_MAX}
          >
            <ZoomIn />
          </ToolButton>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                aria-label="Vergrootglas"
                pressed={zoomEnabled}
                onPressedChange={(pressed) =>
                  onSetZoomEnabled(() => {
                    if (pressed) onResetZoom();
                    return pressed;
                  })
                }
              >
                <Search />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent side="bottom">Vergrootglas</TooltipContent>
          </Tooltip>
          {zoomEnabled && (
            <div className="flex items-center gap-2 px-2">
              <Slider
                className="w-28"
                aria-label="Sterkte van het vergrootglas"
                min={ZOOM_MIN}
                max={ZOOM_MAX}
                step={ZOOM_STEP}
                value={[zoomValue]}
                onValueChange={([value]) => onSetZoomValue(value)}
              />
              <span className="w-9 font-sans text-body text-gravel tabular-nums">
                {zoomValueLabel}×
              </span>
            </div>
          )}
          <Separator orientation="vertical" className="mx-1 data-[orientation=vertical]:h-5" />
        </div>
        <ToolButton
          label={viewerFullscreen ? "Volledig scherm verlaten" : "Volledig scherm"}
          onClick={onToggleFullscreen}
        >
          {viewerFullscreen ? <Minimize2 /> : <Maximize2 />}
        </ToolButton>
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label="Meer">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">Meer</TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Schaal</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={imageScaleMode}
              onValueChange={(value) => {
                if (isImageScaleMode(value)) onScaleModeChange(value);
              }}
            >
              {IMAGE_SCALE_OPTIONS.map((option) => (
                <DropdownMenuRadioItem key={option.value} value={option.value}>
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onDownload}>
              <Download /> Origineel downloaden
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href={viewerImageFullSrc} target="_blank" rel="noreferrer">
                <ExternalLink /> Openen in nieuw tabblad
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="outline"
          size="sm"
          className="ml-1"
          disabled={filteredCount === 0}
          onClick={onStartSlideshow}
        >
          <Play /> Diashow
        </Button>
      </div>
    </TooltipProvider>
  );
}
