import { postListExcerpt, postListTitle } from "../../lib/postMeta";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@wilhalla/ui/components/input-group";
import { Button } from "@wilhalla/ui/components/button";
import { PageHeader } from "@wilhalla/ui/components/page-header";
import { cn } from "@wilhalla/ui/lib/utils";
import { layout } from "@wilhalla/ui/lib/typography";
import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wilhalla/ui/components/select";
import { formatArchiveDate } from "../../lib/archiveDateTime";
import {
  useLazySearchIndex,
  useSearchCategoryFilter,
  useSearchManifest,
  useSearchResults,
  useTitleSearchResults,
  useUrlBackedSearchQuery,
} from "./searchClientHooks";

function snippet(block: string, terms: string[] = []) {
  const lower = block.toLowerCase();
  const first = terms
    .map((term) => lower.indexOf(term.toLowerCase()))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0];
  if (first === undefined) return block.slice(0, 320);
  const start = Math.max(0, first - 130);
  const end = Math.min(block.length, first + 260);
  return `${start > 0 ? "…" : ""}${block.slice(start, end)}${end < block.length ? "…" : ""}`;
}

function highlight(text: string, terms: string[] = []) {
  if (!terms.length) return text;
  const escaped = terms
    .filter((term) => term.length > 1)
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (!escaped.length) return text;
  const regex = new RegExp(`(${escaped.join("|")})`, "ig");
  return text.split(regex).map((part, index) =>
    regex.test(part) ? (
      <mark key={index} className="rounded-sm bg-ember/15 px-0.5 text-inherit">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

export default function SearchApp() {
  const { query, setQuery } = useUrlBackedSearchQuery();
  const { category, categories, postCategoryIds, categoryLoading, categoryError, changeCategory } =
    useSearchCategoryFilter();
  const [fullTextEnabled, setFullTextEnabled] = useState(false);
  const manifest = useSearchManifest();
  const titleSearch = useTitleSearchResults(query, category, postCategoryIds);
  const {
    chunks,
    loading: fullTextLoading,
    loaded: fullTextLoaded,
  } = useLazySearchIndex(query, fullTextEnabled, manifest);
  const fullTextResults = useSearchResults(chunks, query, category, postCategoryIds);
  const results = fullTextLoaded ? fullTextResults : titleSearch.results;
  const loading = categoryLoading || (fullTextLoaded ? fullTextLoading : titleSearch.loading);

  return (
    <section aria-labelledby="search-title">
      <PageHeader
        size="page"
        title={<span id="search-title">Zoeken</span>}
        intro="Zoek op titel, tekst of trefwoord in alle berichten."
        meta={
          fullTextLoading ? (
            <span className="inline-flex items-center gap-1.5">
              <Loader2 className="size-4 animate-spin" /> Volledige index laden…
            </span>
          ) : (
            `${manifest?.postCount.toLocaleString("nl-BE") ?? "…"} berichten doorzoekbaar`
          )
        }
      />
      <div className={cn(layout.container, "pb-20")}>
        <div className="min-w-0 border-b border-chalk py-6">
          <InputGroup className="w-full max-w-2xl">
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              aria-label="Zoekterm"
              autoFocus
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") setFullTextEnabled(true);
              }}
              placeholder="Bijvoorbeeld sterappel, bijen, compost, boskoop"
            />
          </InputGroup>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label className="text-sm text-gravel" htmlFor="search-category">
              Categorie
            </label>
            <Select value={category} onValueChange={changeCategory}>
              <SelectTrigger id="search-category" className="min-w-52">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle categorieën</SelectItem>
                {categories.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.label} ({item.postCount})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-3 flex flex-wrap justify-between gap-3 text-sm text-gravel">
            <span>
              {categoryError
                ? "Categorieën konden niet worden geladen."
                : query.trim().length < 2
                  ? "Typ minstens twee letters."
                  : loading
                    ? "Zoekindex laden…"
                    : `${results.length.toLocaleString("nl-BE")} resultaten${fullTextLoaded ? "" : " in titels"}`}
            </span>
            {query.trim().length >= 2 && (
              <span className="inline-flex flex-wrap items-center gap-3">
                {!fullTextLoaded && (
                  <Button variant="link" size="inline" onClick={() => setFullTextEnabled(true)}>
                    {fullTextLoading ? "Volledige tekst laden…" : "Zoek ook in volledige tekst"}
                  </Button>
                )}
                <span>Gesorteerd op relevantie</span>
              </span>
            )}
          </div>
        </div>

        <div className="grid" aria-live="polite">
          {query.trim().length >= 2 && !loading && !categoryError && results.length === 0 && (
            <p className="m-0 border-b border-chalk py-10 font-sans text-body text-gravel">
              Geen resultaten.
            </p>
          )}
          {results.map((result) => {
            const terms = result.terms ?? [];
            const text = result.block
              ? snippet(result.block, terms)
              : "Titelmatch. Laad de volledige tekstindex om in berichtinhoud en fragmenten te zoeken.";
            return (
              <article key={result.id} className="border-b border-chalk">
                <a
                  className="group block py-5 text-inherit no-underline transition-colors duration-150 hover:bg-powder/60 md:-mx-3 md:rounded-lg md:px-3"
                  href={result.url}
                >
                  <p className="m-0 mb-1.5 font-sans text-body leading-body text-gravel">
                    {[
                      formatArchiveDate(result),
                      result.imageCount ? `${result.imageCount} beelden` : null,
                      typeof result.blockIndex !== "number" ? "gevonden in de titel" : null,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  <h2 className={postListTitle}>{highlight(result.title, terms)}</h2>
                  {result.block && <p className={postListExcerpt}>{highlight(text, terms)}</p>}
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
