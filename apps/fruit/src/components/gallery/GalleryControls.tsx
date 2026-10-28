import { InputGroup, InputGroupAddon, InputGroupInput } from "@wilhalla/ui/components/input-group";
import { Button } from "@wilhalla/ui/components/button";
import { PageHeader } from "@wilhalla/ui/components/page-header";
import { RotateCcw, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wilhalla/ui/components/select";
import type { GalleryGroups } from "../../lib/imageGallerySession";

type GalleryHeaderProps = {
  filteredCount: number;
  plantCount: number;
  peopleCount: number;
  sortNewest: boolean;
  onSortNewestChange: (sortNewest: boolean) => void;
};

type GalleryFilterControlsProps = {
  groups: GalleryGroups;
  hasActiveFilters: boolean;
  query: string;
  season: string;
  theme: string;
  onQueryChange: (query: string) => void;
  onReset: () => void;
  onSeasonChange: (season: string) => void;
  onThemeChange: (theme: string) => void;
};

export function GalleryHeader({
  filteredCount,
  peopleCount,
  plantCount,
  sortNewest,
  onSortNewestChange,
}: GalleryHeaderProps) {
  return (
    <PageHeader
      size="page"
      title="Beeldarchief"
      intro="Alle foto's uit het blog, elk met een link naar het bericht waar ze bij horen. Beschrijvingen en filters zijn automatisch gemaakt."
      meta={`${filteredCount.toLocaleString("nl-BE")} foto's · ${peopleCount} met personen · ${plantCount.toLocaleString("nl-BE")} met planten`}
      actions={
        <Select
          value={sortNewest ? "new" : "old"}
          onValueChange={(value) => onSortNewestChange(value === "new")}
        >
          <SelectTrigger className="w-44" aria-label="Sorteer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="new">Nieuwste eerst</SelectItem>
            <SelectItem value="old">Oudste eerst</SelectItem>
          </SelectContent>
        </Select>
      }
    />
  );
}

export function GalleryFilterControls({
  groups,
  hasActiveFilters,
  query,
  season,
  theme,
  onQueryChange,
  onReset,
  onSeasonChange,
  onThemeChange,
}: GalleryFilterControlsProps) {
  return (
    <section className="border-b border-chalk py-5" aria-label="Beeldarchief filters">
      <div className="flex flex-wrap items-center gap-3">
        <InputGroup className="w-full sm:w-72">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            aria-label="Zoek in het beeldarchief"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Zoek plaats, persoon, onderwerp"
          />
        </InputGroup>
        <Select value={theme} onValueChange={onThemeChange}>
          <SelectTrigger className="w-48" aria-label="Beeldinhoud">
            <SelectValue placeholder="Beeldinhoud" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle beeldinhouden</SelectItem>
            {groups.themes.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={season} onValueChange={onSeasonChange}>
          <SelectTrigger className="w-40" aria-label="Seizoen">
            <SelectValue placeholder="Seizoen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle seizoenen</SelectItem>
            <SelectItem value="lente">Voorjaar</SelectItem>
            <SelectItem value="zomer">Zomer</SelectItem>
            <SelectItem value="herfst">Herfst</SelectItem>
            <SelectItem value="winter">Winter</SelectItem>
          </SelectContent>
        </Select>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onReset}>
            <RotateCcw /> Wis filters
          </Button>
        )}
      </div>
    </section>
  );
}
