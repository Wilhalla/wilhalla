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
import { Tooltip, TooltipContent, TooltipTrigger } from "@wilhalla/ui/components/tooltip";
import { Download, ExternalLink, MoreHorizontal } from "lucide-react";
import { downloadImage } from "../../lib/downloadImage";
import {
  imageDownloadFilename,
  imageFullSrc,
  type GalleryImageRecord,
} from "../../lib/imageGallerySession";
import { isImageScaleMode, type ImageScaleMode } from "../../lib/imageZoom";

interface ViewerMoreMenuProps {
  image: GalleryImageRecord;
  scaleMode: ImageScaleMode;
  onScaleModeChange: (mode: ImageScaleMode) => void;
}

/** How each scale mode is offered: the one definition of their names. */
const scaleModeLabels: Record<ImageScaleMode, string> = {
  fit: "Passend",
  width: "Breedte passend",
  height: "Hoogte passend",
  cover: "Vullen",
  original: "Origineel formaat",
};

/** The less used actions of the viewer: how the photo is scaled, download, open the file. */
export default function ViewerMoreMenu({
  image,
  scaleMode,
  onScaleModeChange,
}: ViewerMoreMenuProps) {
  const src = imageFullSrc(image);

  return (
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
          value={scaleMode}
          onValueChange={(value) => {
            if (isImageScaleMode(value)) onScaleModeChange(value);
          }}
        >
          {Object.entries(scaleModeLabels).map(([mode, label]) => (
            <DropdownMenuRadioItem key={mode} value={mode}>
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => void downloadImage(src, imageDownloadFilename(image))}>
          <Download /> Origineel downloaden
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={src} target="_blank" rel="noreferrer">
            <ExternalLink /> Openen in nieuw tabblad
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
