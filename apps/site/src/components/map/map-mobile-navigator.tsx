import { Button } from "@wilhalla/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@wilhalla/ui/components/dropdown-menu";
import { ChevronLeft, ChevronRight, ChevronsUpDown } from "lucide-react";

export type MapMobileStop = {
  id: string;
  label: string;
};

type MapMobileNavigatorProps = {
  activeStopId: string | null;
  stops: readonly MapMobileStop[];
  onSelect: (stopId: string) => void;
  onStep: (direction: -1 | 1) => void;
};

export function MapMobileNavigator({
  activeStopId,
  stops,
  onSelect,
  onStep,
}: MapMobileNavigatorProps) {
  const activeStop = stops.find((stop) => stop.id === activeStopId);

  return (
    <nav
      aria-label="Plekken op de kaart"
      className="fixed inset-x-0 bottom-0 z-20 px-2 pt-6 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-eggshell drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] lg:hidden"
    >
      <div className="grid grid-cols-[4rem_1fr_4rem] items-center">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Vorige plek"
          className="size-14 justify-self-center"
          onClick={() => onStep(-1)}
        >
          <ChevronLeft aria-hidden="true" strokeWidth={1.5} />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex min-h-14 w-full items-center justify-center gap-2 px-2 py-2 font-heading text-[1.6rem] leading-tight text-eggshell transition-colors outline-none hover:bg-obsidian/15 focus-visible:bg-obsidian/15 data-[state=open]:bg-obsidian/15"
              aria-label="Kies een plek op de kaart"
            >
              <span className="truncate">{activeStop?.label ?? "Wandel over het domein"}</span>
              <ChevronsUpDown aria-hidden="true" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="center" sideOffset={12}>
            <DropdownMenuRadioGroup value={activeStopId ?? undefined} onValueChange={onSelect}>
              {stops.map((stop) => (
                <DropdownMenuRadioItem key={stop.id} value={stop.id} size="touch">
                  {stop.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Volgende plek"
          className="size-14 justify-self-center"
          onClick={() => onStep(1)}
        >
          <ChevronRight aria-hidden="true" strokeWidth={1.5} />
        </Button>
      </div>
    </nav>
  );
}
