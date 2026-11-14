import { InputGroup, InputGroupAddon, InputGroupInput } from "@wilhalla/ui/components/input-group";
import { PageBody } from "@wilhalla/ui/components/page-body";
import { PageHeader } from "@wilhalla/ui/components/page-header";
import { Spinner } from "@wilhalla/ui/components/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wilhalla/ui/components/select";
import { Search } from "lucide-react";
import { searchUrlCodec } from "../../lib/archiveSearch";
import { formatNumber } from "../../lib/format";
import { requestFullText, useFullTextSearch } from "../../lib/fullTextSearch";
import type { SearchCategory, SearchChunkManifestEntry } from "../../lib/generatedTypes";
import { useUrlState, writeUrlState } from "../../lib/urlState";
import SearchOutcome from "./SearchOutcome";

/** Select value for "no category": the control needs a non-empty string. */
const ALL_CATEGORIES = "all";

interface SearchAppProps {
  categories: readonly SearchCategory[];
  postCount: number;
  /** The years of the full-text index, in the order they load. */
  chunks: readonly SearchChunkManifestEntry[];
}

export default function SearchApp({ categories, postCount, chunks }: SearchAppProps) {
  const { query, category } = useUrlState(searchUrlCodec);
  const fullText = useFullTextSearch();
  const loadFullText = () => requestFullText(chunks);

  return (
    <section aria-labelledby="search-title">
      <PageHeader
        size="page"
        title={<span id="search-title">Zoeken</span>}
        intro="Zoek op titel, tekst of trefwoord in alle berichten."
        meta={
          fullText.status === "loading" ? (
            <span className="inline-flex items-center gap-1.5">
              <Spinner aria-hidden="true" /> Volledige index laden…
            </span>
          ) : (
            `${formatNumber(postCount)} berichten doorzoekbaar`
          )
        }
      />
      <PageBody>
        <div className="min-w-0">
          <InputGroup className="w-full max-w-2xl">
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              aria-label="Zoekterm"
              // oxlint-disable-next-line jsx-a11y/no-autofocus -- the search page exists to type a query
              autoFocus
              type="search"
              value={query}
              onChange={(event) =>
                writeUrlState(searchUrlCodec, { query: event.target.value, category })
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") loadFullText();
              }}
              placeholder="Bijvoorbeeld sterappel, bijen, compost, boskoop"
            />
          </InputGroup>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label className="font-sans text-body text-gravel" htmlFor="search-category">
              Categorie
            </label>
            <Select
              value={category ?? ALL_CATEGORIES}
              onValueChange={(value) =>
                writeUrlState(
                  searchUrlCodec,
                  { query, category: value === ALL_CATEGORIES ? null : value },
                  "push",
                )
              }
            >
              <SelectTrigger id="search-category" className="w-fit min-w-52">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_CATEGORIES}>Alle categorieën</SelectItem>
                {categories.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.label} ({item.postCount})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <SearchOutcome
          query={query.trim()}
          category={category}
          fullText={fullText}
          onRequestFullText={loadFullText}
        />
      </PageBody>
    </section>
  );
}
