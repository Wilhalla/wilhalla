import { PageHeader } from "@wilhalla/ui/components/page-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wilhalla/ui/components/select";
import { formatNumber } from "../../lib/format";
import {
  imageShowsPeople,
  imageShowsPlants,
  type GalleryImageRecord,
} from "../../lib/imageGallerySession";

interface GalleryHeaderProps {
  /** The photos that pass the filters. */
  images: readonly GalleryImageRecord[];
  /** More photos or the species names are still arriving, so the counts can grow. */
  loading: boolean;
  sortNewest: boolean;
  onSortNewestChange: (sortNewest: boolean) => void;
}

export default function GalleryHeader({
  images,
  loading,
  sortNewest,
  onSortNewestChange,
}: GalleryHeaderProps) {
  const counts = [
    `${formatNumber(images.length)} foto's`,
    `${formatNumber(images.filter(imageShowsPeople).length)} met personen`,
    `${formatNumber(images.filter(imageShowsPlants).length)} met planten`,
    ...(loading ? ["beeldarchief laden…"] : []),
  ];

  return (
    <PageHeader
      size="page"
      title="Beeldarchief"
      intro="Alle foto's uit het blog, elk met een link naar het bericht waar ze bij horen. Beschrijvingen en filters zijn automatisch gemaakt."
      meta={counts.join(" · ")}
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
