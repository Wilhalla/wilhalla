import { Button } from "@wilhalla/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wilhalla/ui/components/select";
import { Calendar, Pause, Play, Shuffle, Timer, type LucideIcon } from "lucide-react";
import type { Dispatch } from "react";
import {
  SLIDESHOW_SECONDS,
  isSlideshowMode,
  type SlideshowEvent,
  type SlideshowMode,
  type SlideshowSettings,
} from "../../lib/gallerySlideshow";

interface SlideshowControlsProps {
  settings: SlideshowSettings;
  /** False when there is only one slide. */
  canPlay: boolean;
  dispatch: Dispatch<SlideshowEvent>;
}

/** How each order is offered: the one definition of their names and icons. */
const modes: Record<SlideshowMode, { label: string; Icon: LucideIcon }> = {
  chronological: { label: "Chronologisch", Icon: Calendar },
  random: { label: "Willekeurig", Icon: Shuffle },
};

/** Pause, the order of the slides and how long each one stays. */
export default function SlideshowControls({ settings, canPlay, dispatch }: SlideshowControlsProps) {
  return (
    <>
      <Button
        variant="inverse"
        size="sm"
        onClick={() => dispatch({ type: "togglePaused" })}
        disabled={!canPlay}
        aria-pressed={settings.paused}
      >
        {settings.paused ? <Play /> : <Pause />}
        {settings.paused ? "Hervatten" : "Pauze"}
      </Button>
      <Select
        value={settings.mode}
        onValueChange={(mode) => {
          // The seed picks the shuffle: a new one each time "random" is chosen.
          if (isSlideshowMode(mode)) dispatch({ type: "mode", mode, seed: Date.now() });
        }}
      >
        <SelectTrigger
          size="sm"
          variant="inverse"
          className="w-fit shrink-0"
          aria-label="Diashow volgorde"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(modes).map(([mode, { label, Icon }]) => (
            <SelectItem key={mode} value={mode}>
              <Icon /> {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={String(settings.seconds)}
        onValueChange={(seconds) => dispatch({ type: "seconds", seconds: Number(seconds) })}
      >
        <SelectTrigger
          size="sm"
          variant="inverse"
          className="w-fit shrink-0"
          aria-label="Seconden per beeld"
        >
          <Timer />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SLIDESHOW_SECONDS.map((seconds) => (
            <SelectItem key={seconds} value={String(seconds)}>
              {seconds} sec per beeld
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
