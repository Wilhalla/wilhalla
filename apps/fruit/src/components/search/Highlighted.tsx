import { splitOnTerms } from "../../lib/archiveSearch";

interface HighlightedProps {
  text: string;
  terms: readonly string[];
}

/** `text` with the matched search terms marked. */
export default function Highlighted({ text, terms }: HighlightedProps) {
  return splitOnTerms(text, terms).map((part, index) =>
    index % 2 === 1 ? (
      // oxlint-disable-next-line react/no-array-index-key -- the parts of one string have no other identity
      <mark key={index} className="rounded-sm bg-ember/15 px-0.5 text-inherit">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}
