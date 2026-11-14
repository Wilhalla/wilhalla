import { useDeferredValue } from "react";
import { MIN_QUERY_LENGTH } from "../../lib/archiveSearch";
import type { FullTextState } from "../../lib/fullTextSearch";
import DataBoundary from "../DataBoundary";
import FullTextPrompt from "./FullTextPrompt";
import SearchResults from "./SearchResults";
import SearchStatus from "./SearchStatus";

interface SearchOutcomeProps {
  /** The trimmed query. */
  query: string;
  category: string | null;
  fullText: FullTextState;
  onRequestFullText: () => void;
}

/** What the search shows below its controls: a hint, the loading index, an error or the results. */
export default function SearchOutcome({
  query,
  category,
  fullText,
  onRequestFullText,
}: SearchOutcomeProps) {
  // Searching lags behind typing instead of blocking it.
  const deferredQuery = useDeferredValue(query);
  const searchQuery = deferredQuery.length >= MIN_QUERY_LENGTH ? deferredQuery : query;

  return query.length < MIN_QUERY_LENGTH ? (
    <SearchStatus message="Typ minstens twee letters." />
  ) : (
    <DataBoundary
      resetKeys={[category]}
      errorTitle="De zoekindex kon niet worden geladen."
      errorClassName="border-b border-chalk py-6"
      fallback={
        <SearchStatus
          message="Zoekindex laden…"
          action={<FullTextPrompt fullText={fullText} onRequest={onRequestFullText} />}
        />
      }
    >
      <SearchResults
        query={searchQuery}
        category={category}
        fullText={fullText}
        onRequestFullText={onRequestFullText}
      />
    </DataBoundary>
  );
}
