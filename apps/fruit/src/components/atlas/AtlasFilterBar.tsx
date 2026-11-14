import { Button } from "@wilhalla/ui/components/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@wilhalla/ui/components/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wilhalla/ui/components/select";
import { Switch } from "@wilhalla/ui/components/switch";
import { typography } from "@wilhalla/ui/lib/typography";
import { cn } from "@wilhalla/ui/lib/utils";
import { Search, X } from "lucide-react";
import { NO_ATLAS_FILTERS, type AtlasFilters } from "../../lib/archiveAtlas";
import { SEASONS, SEASON_LABELS, isSeason } from "../../lib/archiveDateTime";
import { formatNumber } from "../../lib/format";

/** Select value for "no filter": the control needs a non-empty string. */
const ALL = "all";

interface AtlasFilterBarProps {
  filters: AtlasFilters;
  years: readonly number[];
  visibleCount: number;
  totalCount: number;
  onChange: (patch: Partial<AtlasFilters>) => void;
}

export default function AtlasFilterBar({
  filters,
  years,
  visibleCount,
  totalCount,
  onChange,
}: AtlasFilterBarProps) {
  const filtered =
    filters.year !== null || filters.season !== null || filters.imagesOnly || filters.search;

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-chalk pb-4">
      <InputGroup className="w-full sm:w-72">
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Zoek een bericht"
          aria-label="Zoek een bericht"
          value={filters.search}
          onChange={(event) => onChange({ search: event.target.value })}
        />
        {filters.search && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-xs"
              aria-label="Zoekterm wissen"
              onClick={() => onChange({ search: "" })}
            >
              <X />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>
      <Select
        value={filters.year === null ? ALL : String(filters.year)}
        onValueChange={(year) => onChange({ year: year === ALL ? null : Number(year) })}
      >
        <SelectTrigger className="w-36" aria-label="Jaar">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Alle jaren</SelectItem>
          {years.map((year) => (
            <SelectItem key={year} value={String(year)}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.season ?? ALL}
        onValueChange={(season) => onChange({ season: isSeason(season) ? season : null })}
      >
        <SelectTrigger className="w-40" aria-label="Seizoen">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Alle seizoenen</SelectItem>
          {SEASONS.map((season) => (
            <SelectItem key={season} value={season}>
              {SEASON_LABELS[season]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <label
        className="flex items-center gap-2 font-sans text-body text-cinder"
        htmlFor="atlas-images-only"
      >
        <Switch
          id="atlas-images-only"
          checked={filters.imagesOnly}
          onCheckedChange={(imagesOnly) => onChange({ imagesOnly })}
        />
        Met beelden
      </label>
      {filtered && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange({ ...NO_ATLAS_FILTERS, category: filters.category })}
        >
          Wis filters
        </Button>
      )}
      <p className={cn(typography.small, "m-0 ml-auto text-gravel")}>
        {formatNumber(visibleCount)} van {formatNumber(totalCount)} berichten
      </p>
    </div>
  );
}
