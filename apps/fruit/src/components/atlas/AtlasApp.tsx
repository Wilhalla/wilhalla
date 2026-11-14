import { PageBody } from "@wilhalla/ui/components/page-body";
import { PageHeader } from "@wilhalla/ui/components/page-header";
import { ToggleGroup, ToggleGroupItem } from "@wilhalla/ui/components/toggle-group";
import { typography } from "@wilhalla/ui/lib/typography";
import { cn } from "@wilhalla/ui/lib/utils";
import { atlasUrlCodec, type AtlasArrangement } from "../../lib/archiveAtlas";
import { updateUrlState, useUrlState } from "../../lib/urlState";
import DataBoundary from "../DataBoundary";
import AtlasBrowser from "./AtlasBrowser";

function changeArrangement(value: string) {
  if (value !== "subject" && value !== "meaning") return;
  const arrangement: AtlasArrangement = value;
  updateUrlState(atlasUrlCodec, (current) => ({ ...current, arrangement }));
}

/** Every story as a dot on a map, grouped per subject or placed by what it is about. */
export default function AtlasApp() {
  const state = useUrlState(atlasUrlCodec);

  return (
    <>
      <PageHeader
        size="page"
        title="Onderwerpen"
        intro={
          state.arrangement === "subject"
            ? "Alle berichten, per onderwerp. Klik op een stip om het bericht te lezen."
            : "Alle berichten, geordend op inhoud. Berichten die op elkaar lijken, staan dicht bij elkaar."
        }
        actions={
          <ToggleGroup
            type="single"
            value={state.arrangement}
            aria-label="Schikking"
            onValueChange={changeArrangement}
          >
            <ToggleGroupItem value="subject">Per onderwerp</ToggleGroupItem>
            <ToggleGroupItem value="meaning">Op inhoud</ToggleGroupItem>
          </ToggleGroup>
        }
      />
      <PageBody>
        <DataBoundary
          errorTitle="De berichten konden niet worden geladen."
          fallback={
            <p
              className={cn(
                typography.small,
                "m-0 grid h-stage min-h-96 place-items-center rounded-2xl bg-pure-surface text-gravel shadow-subtle-2",
              )}
            >
              Berichten laden…
            </p>
          }
        >
          <AtlasBrowser state={state} />
        </DataBoundary>
      </PageBody>
    </>
  );
}
