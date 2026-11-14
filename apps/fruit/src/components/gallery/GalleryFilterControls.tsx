import { Button } from "@wilhalla/ui/components/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@wilhalla/ui/components/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wilhalla/ui/components/select";
import { RotateCcw, Search } from "lucide-react";
import {
  defaultGalleryFilters,
  isSeason,
  type GalleryFilters,
  type Season,
} from "../../lib/galleryFilters";
import type { GalleryGroups } from "../../lib/imageGallerySession";

interface GalleryFilterControlsProps {
  filters: GalleryFilters;
  themes: GalleryGroups["themes"];
  hasActiveFilters: boolean;
  onChange: (change: Partial<GalleryFilters>) => void;
}

/** The select's value for "no filter"; the filters themselves use `null`. */
const ANY = "all";
const seasonLabels: Record<Season, string> = {
  lente: "Voorjaar",
  zomer: "Zomer",
  herfst: "Herfst",
  winter: "Winter",
};

export default function GalleryFilterControls({
  filters,
  themes,
  hasActiveFilters,
  onChange,
}: GalleryFilterControlsProps) {
  return (
    <section
      className="flex flex-wrap items-center gap-3 border-b border-chalk py-5"
      aria-label="Beeldarchief filters"
    >
      <InputGroup className="w-full sm:w-72">
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput
          aria-label="Zoek in het beeldarchief"
          value={filters.query}
          onChange={(event) => onChange({ query: event.target.value })}
          placeholder="Zoek plaats, persoon, onderwerp"
        />
      </InputGroup>
      <Select
        value={filters.theme ?? ANY}
        onValueChange={(value) => onChange({ theme: value === ANY ? null : value })}
      >
        <SelectTrigger className="w-48" aria-label="Beeldinhoud">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ANY}>Alle beeldinhouden</SelectItem>
          {themes.map((theme) => (
            <SelectItem key={theme.id} value={theme.id}>
              {theme.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.season ?? ANY}
        onValueChange={(value) => onChange({ season: isSeason(value) ? value : null })}
      >
        <SelectTrigger className="w-40" aria-label="Seizoen">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ANY}>Alle seizoenen</SelectItem>
          {Object.entries(seasonLabels).map(([season, label]) => (
            <SelectItem key={season} value={season}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={() => onChange(defaultGalleryFilters)}>
          <RotateCcw /> Wis filters
        </Button>
      )}
    </section>
  );
}
