import { Button } from "@wilhalla/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@wilhalla/ui/components/dropdown-menu";
import { ChevronLeft, ChevronRight, ChevronsUpDown } from "lucide-react";
import { type SentinelId, mapStops } from "./map-sentinels";

interface MapMobileNavigatorProps {
  activeStopId: SentinelId | null;
  onSelect: (stopId: SentinelId) => void;
  onStep: (direction: -1 | 1) => void;
}

/** On small screens: step through the places or pick one by name; the map pans to it. */
export function MapMobileNavigator({ activeStopId, onSelect, onStep }: MapMobileNavigatorProps) {
  const activeStop = mapStops.find((stop) => stop.id === activeStopId);

  return (
    <nav
      aria-label="Wandel over de kaart"
      className="fixed inset-x-0 bottom-0 z-20 flex items-center px-1 pt-6 pb-safe lg:hidden"
    >
      <Button
        variant="overlay"
        size="icon-touch"
        aria-label="Vorige plek"
        onClick={() => onStep(-1)}
      >
        <ChevronLeft strokeWidth={1.5} />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex min-h-14 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full px-1 font-heading text-map-place leading-map-place text-eggshell drop-shadow-on-image transition-colors duration-hover ease-out outline-none hover:bg-obsidian/15 focus-visible:bg-obsidian/15 aria-expanded:bg-obsidian/15"
            aria-label="Kies een plek op de kaart"
          >
            <span className="truncate">{activeStop?.label ?? "Wandel over het domein"}</span>
            <ChevronsUpDown className="size-4 shrink-0" strokeWidth={1.5} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="center" sideOffset={12}>
          <DropdownMenuRadioGroup
            value={activeStopId ?? undefined}
            onValueChange={(value) => {
              const stop = mapStops.find((candidate) => candidate.id === value);

              if (stop) {
                onSelect(stop.id);
              }
            }}
          >
            {mapStops.map((stop) => (
              <DropdownMenuRadioItem key={stop.id} value={stop.id} size="touch">
                {stop.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        variant="overlay"
        size="icon-touch"
        aria-label="Volgende plek"
        onClick={() => onStep(1)}
      >
        <ChevronRight strokeWidth={1.5} />
      </Button>
    </nav>
  );
}
