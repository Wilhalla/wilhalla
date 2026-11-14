import { Button } from "@wilhalla/ui/components/button";
import { SectionHeader } from "@wilhalla/ui/components/section";
import { Download } from "lucide-react";

const mirrorArchiveDownloadUrl =
  "https://objects.janpeterdhalle.com/wilhalla-vake-blog/downloads/seniorennet-fruit-archive.zip";
const mirrorArchiveFileSize = "2,7 GiB";

/** Heading of the "Bron" section, with the download of the original blog mirror. */
export default function DataSourceHeader() {
  return (
    <SectionHeader
      id="sources-title"
      title="Bron"
      description="De volledige kopie van de oorspronkelijke Seniorennet-blogs waaruit dit archief is opgebouwd."
      action={
        <Button asChild>
          <a
            href={mirrorArchiveDownloadUrl}
            download="seniorennet-fruit-archive.zip"
            aria-label={`Download originele blogmirror (${mirrorArchiveFileSize})`}
          >
            <Download /> Download zip ({mirrorArchiveFileSize})
          </a>
        </Button>
      }
    />
  );
}
