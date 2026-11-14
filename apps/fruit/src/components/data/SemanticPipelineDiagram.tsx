import DataBoundary from "../DataBoundary";
import PipelineDiagramSvg from "./PipelineDiagramSvg";

/** The diagram of how the archive was processed; it draws itself once the page is idle. */
export default function SemanticPipelineDiagram() {
  return (
    <DataBoundary
      errorTitle="Het diagram kon niet worden getekend."
      fallback={<div className="min-h-64" aria-hidden="true" />}
    >
      <PipelineDiagramSvg />
    </DataBoundary>
  );
}
