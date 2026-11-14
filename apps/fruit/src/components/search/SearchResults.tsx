import { use } from "react";
import { searchFullText, searchTitles, titleIndexResource } from "../../lib/archiveSearch";
import { formatNumber } from "../../lib/format";
import { loadedIndexes, type FullTextState } from "../../lib/fullTextSearch";
import { postCategoryIdsResource } from "../../lib/generatedData";
import FullTextPrompt from "./FullTextPrompt";
import SearchResultItem from "./SearchResultItem";
import SearchStatus from "./SearchStatus";

interface SearchResultsProps {
  /** Trimmed, at least `MIN_QUERY_LENGTH` long. */
  query: string;
  category: string | null;
  fullText: FullTextState;
  onRequestFullText: () => void;
}

export default function SearchResults({
  query,
  category,
  fullText,
  onRequestFullText,
}: SearchResultsProps) {
  const titleIndex = use(titleIndexResource.load());
  const filter = {
    category,
    postCategoryIds: category ? use(postCategoryIdsResource.load()) : null,
  };
  const indexes = loadedIndexes(fullText);
  const inFullText = indexes.length > 0;
  const hits = inFullText
    ? searchFullText(indexes, query, filter)
    : searchTitles(titleIndex, query, filter);

  return (
    <>
      <SearchStatus
        message={`${formatNumber(hits.length)} resultaten${inFullText ? "" : " in titels"}`}
        action={<FullTextPrompt fullText={fullText} onRequest={onRequestFullText} />}
      />
      <div className="grid" aria-live="polite">
        {hits.length === 0 && (
          <p className="m-0 border-b border-chalk py-10 font-sans text-body text-gravel">
            Geen resultaten.
          </p>
        )}
        {hits.map((hit) => (
          <SearchResultItem key={hit.id} hit={hit} />
        ))}
      </div>
    </>
  );
}
