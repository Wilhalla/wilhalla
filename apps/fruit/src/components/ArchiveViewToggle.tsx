import { ToggleGroup, ToggleGroupItem } from "@wilhalla/ui/components/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@wilhalla/ui/components/tooltip";

export type ArchiveViewMode = "aggregated" | "all";

interface Props {
  mode: ArchiveViewMode;
  aggregatedCount: number;
  allCount: number;
  onChange: (mode: ArchiveViewMode) => void;
}

const modes = [
  {
    value: "aggregated",
    label: "Samengevoegd",
    description:
      "Bundelt vervolg-, aanvulling- en deelberichten tot één reeks, zodat lange verhalen als één bericht verschijnen.",
  },
  {
    value: "all",
    label: "Losse berichten",
    description:
      "Toont elk oorspronkelijk geïmporteerd blogbericht apart, ook vervolg-, aanvulling- en deelberichten.",
  },
] as const;

export default function ArchiveViewToggle({ mode, aggregatedCount, allCount, onChange }: Props) {
  return (
    <TooltipProvider>
      <ToggleGroup
        type="single"
        value={mode}
        aria-label="Kies archiefweergave"
        onValueChange={(value) => {
          if (value === "aggregated" || value === "all") onChange(value);
        }}
      >
        {modes.map((item) => (
          <Tooltip key={item.value}>
            <TooltipTrigger asChild>
              <ToggleGroupItem value={item.value}>
                {item.label}
                <span className="text-gravel tabular-nums">
                  {(item.value === "aggregated" ? aggregatedCount : allCount).toLocaleString(
                    "nl-BE",
                  )}
                </span>
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={8}>
              {item.description}
            </TooltipContent>
          </Tooltip>
        ))}
      </ToggleGroup>
    </TooltipProvider>
  );
}
