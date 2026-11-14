import { Section, SectionHeader } from "@wilhalla/ui/components/section";
import { datasetDefinitions, MANIFEST_DATASET_ID } from "../../lib/rawDatasets";
import RawDataset from "./RawDataset";

interface SemanticDataTablesProps {
  /** Contents of manifest.json, read at build time. */
  manifest: unknown;
}

/** The generated files behind the archive, each as a table that loads when asked for. */
export default function SemanticDataTables({ manifest }: SemanticDataTablesProps) {
  return (
    <Section aria-labelledby="datasets-title">
      <SectionHeader
        id="datasets-title"
        title="Datasets"
        description="De bestanden achter de onderwerpen, het beeldarchief en het zoeken."
      />
      <div className="min-w-0 border-t border-chalk">
        {datasetDefinitions.map((definition) => (
          <RawDataset
            key={definition.id}
            definition={definition}
            initialValue={definition.id === MANIFEST_DATASET_ID ? manifest : undefined}
          />
        ))}
      </div>
    </Section>
  );
}
