import { Button } from "@wilhalla/ui/components/button";
import { loadedIndexes, type FullTextState } from "../../lib/fullTextSearch";

const requestLabel = {
  off: "Zoek ook in volledige tekst",
  loading: "Volledige tekst laden…",
  error: "Volledige tekst laden mislukt, opnieuw proberen",
  ready: "",
} satisfies Record<FullTextState["status"], string>;

interface FullTextPromptProps {
  fullText: FullTextState;
  onRequest: () => void;
}

/** Offers the full-text search until its first year has loaded, and again after a failed load. */
export default function FullTextPrompt({ fullText, onRequest }: FullTextPromptProps) {
  const offer = fullText.status === "error" || loadedIndexes(fullText).length === 0;

  return (
    <span className="inline-flex flex-wrap items-center gap-3">
      {offer && (
        <Button
          variant="link"
          size="inline"
          title={fullText.status === "error" ? fullText.message : undefined}
          onClick={onRequest}
        >
          {requestLabel[fullText.status]}
        </Button>
      )}
      <span>Gesorteerd op relevantie</span>
    </span>
  );
}
