import { Button } from "@wilhalla/ui/components/button";
import { Skeleton } from "@wilhalla/ui/components/skeleton";
import { typography } from "@wilhalla/ui/lib/typography";
import { cn } from "@wilhalla/ui/lib/utils";
import { Download } from "lucide-react";
import { useState } from "react";
import { formatNumber } from "../../lib/format";
import {
  DATASET_IDLE,
  DATASET_LOADING,
  loadDataset,
  type DatasetState,
} from "../../lib/rawDatasetLoad";
import {
  buildDataset,
  datasetDownload,
  type DatasetDefinition,
  type LoadedDataset,
} from "../../lib/rawDatasets";
import RawDataGrid from "./RawDataGrid";

const placeholderRows = [0, 1, 2, 3];

function download(definition: DatasetDefinition, dataset: LoadedDataset) {
  const url = URL.createObjectURL(
    new Blob([datasetDownload(definition, dataset)], { type: "application/json" }),
  );
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${definition.id}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

interface RawDatasetProps {
  definition: DatasetDefinition;
  /** The file's contents when they are known up front; the table then shows at once. */
  initialValue?: unknown;
}

export default function RawDataset({ definition, initialValue }: RawDatasetProps) {
  const [state, setState] = useState<DatasetState>(() =>
    initialValue === undefined
      ? DATASET_IDLE
      : { status: "ready", dataset: buildDataset(definition, initialValue) },
  );
  const load = () => {
    setState(DATASET_LOADING);
    void loadDataset(definition).then(setState);
  };

  return (
    <section
      id={definition.id}
      className="min-w-0 border-b border-chalk py-5"
      aria-labelledby={`${definition.id}-title`}
    >
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <div className="grid min-w-0 gap-0.5">
          <h3
            id={`${definition.id}-title`}
            className="m-0 font-sans text-body-lg leading-body-lg font-medium text-obsidian"
          >
            {definition.title}
          </h3>
          <p className={cn(typography.small, "m-0 text-gravel")}>
            <code className="font-mono text-mono">{definition.file}</code>
            {state.status === "ready" && ` · ${formatNumber(state.dataset.rows.length)} rijen`}
          </p>
          {state.status === "error" && (
            <p className={cn(typography.small, "m-0 text-destructive")}>
              Kon niet laden: {state.message}
            </p>
          )}
        </div>
        {state.status === "ready" ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => download(definition, state.dataset)}
            aria-label={`Download ${definition.title} als JSON`}
          >
            <Download /> JSON
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={load} disabled={state.status === "loading"}>
            {state.status === "loading" ? "Laden…" : "Toon tabel"}
          </Button>
        )}
      </div>

      {state.status === "loading" && (
        <div className="mt-4 grid gap-2" aria-live="polite" aria-busy="true">
          {placeholderRows.map((row) => (
            <Skeleton className="h-9" key={row} />
          ))}
        </div>
      )}
      {state.status === "ready" &&
        (state.dataset.rows.length === 0 ? (
          <p className={cn(typography.small, "m-0 mt-4 text-gravel")}>
            Geen rijen in deze dataset.
          </p>
        ) : (
          <RawDataGrid title={definition.title} dataset={state.dataset} />
        ))}
    </section>
  );
}
