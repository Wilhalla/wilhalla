import { Calendar, Play, Shuffle, Timer } from "lucide-react";
import { Button } from "@wilhalla/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wilhalla/ui/components/select";
import {
  SLIDESHOW_SECONDS_MAX,
  SLIDESHOW_SECONDS_MIN,
  type SlideshowMode,
} from "./useGallerySlideshow";

type ControlsProps = {
  mode: SlideshowMode;
  seconds: number;
  disabled?: boolean;
  onModeChange: (mode: SlideshowMode) => void;
  onSecondsChange: (seconds: number) => void;
  onStart: () => void;
};

/** Preset durations instead of a number field; the current value is kept if it is not a preset. */
export function SlideshowSecondsSelect({
  seconds,
  variant,
  onSecondsChange,
}: {
  seconds: number;
  variant?: "outline" | "inverse";
  onSecondsChange: (seconds: number) => void;
}) {
  const options = [...new Set([3, 5, 8, 12, 20, 30, seconds])]
    .filter((value) => value >= SLIDESHOW_SECONDS_MIN && value <= SLIDESHOW_SECONDS_MAX)
    .sort((a, b) => a - b);
  return (
    <Select value={String(seconds)} onValueChange={(value) => onSecondsChange(Number(value))}>
      <SelectTrigger size="sm" variant={variant} className="w-36" aria-label="Seconden per beeld">
        <Timer />
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="z-[250]">
        {options.map((value) => (
          <SelectItem key={value} value={String(value)}>
            {value} sec per beeld
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function GallerySlideshowControls({
  mode,
  seconds,
  disabled,
  onModeChange,
  onSecondsChange,
  onStart,
}: ControlsProps) {
  return (
    <>
      <Select value={mode} onValueChange={(value) => onModeChange(value as SlideshowMode)}>
        <SelectTrigger
          size="sm"
          variant="outline"
          className="hidden w-44 shrink-0 sm:flex"
          aria-label="Diashow volgorde"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="z-[250]">
          <SelectItem value="chronological">
            <Calendar className="size-4" aria-hidden="true" /> Chronologisch
          </SelectItem>
          <SelectItem value="random">
            <Shuffle className="size-4" aria-hidden="true" /> Willekeurig
          </SelectItem>
        </SelectContent>
      </Select>
      <div className="hidden shrink-0 sm:block">
        <SlideshowSecondsSelect
          seconds={seconds}
          variant="outline"
          onSecondsChange={onSecondsChange}
        />
      </div>
      <Button className="shrink-0" disabled={disabled} onClick={onStart}>
        <Play /> Diashow
      </Button>
    </>
  );
}
