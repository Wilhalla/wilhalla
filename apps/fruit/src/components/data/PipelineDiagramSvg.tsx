import { use } from "react";
import { pipelineDiagramResource } from "../../lib/pipelineDiagram";

export default function PipelineDiagramSvg() {
  const svg = use(pipelineDiagramResource.load());

  return (
    <div
      className="min-w-0"
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- an inline SVG drawing, not an image file
      role="img"
      aria-label="Diagram van de verwerking"
      // mermaid renders with securityLevel "strict" from a constant diagram definition.
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
