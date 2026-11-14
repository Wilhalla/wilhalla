import { formatArchiveDate } from "../../lib/archiveDateTime";
import { snippet, type SearchHit } from "../../lib/archiveSearch";
import { postListExcerpt, postListTitle } from "../../lib/postMeta";
import Highlighted from "./Highlighted";

interface SearchResultItemProps {
  hit: SearchHit;
}

export default function SearchResultItem({ hit }: SearchResultItemProps) {
  return (
    <article className="border-b border-chalk">
      <a
        className="group block py-5 text-inherit no-underline transition-colors duration-hover ease-out hover:bg-powder focus-visible:bg-powder focus-visible:outline-none md:-mx-3 md:rounded-lg md:px-3"
        href={hit.url}
      >
        <p className="m-0 mb-1.5 font-sans text-body leading-body text-gravel">
          {[
            formatArchiveDate(hit),
            hit.imageCount ? `${hit.imageCount} beelden` : null,
            hit.block === null ? "gevonden in de titel" : null,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
        <h2 className={postListTitle}>
          <Highlighted text={hit.title} terms={hit.terms} />
        </h2>
        {hit.block && (
          <p className={postListExcerpt}>
            <Highlighted text={snippet(hit.block, hit.terms)} terms={hit.terms} />
          </p>
        )}
      </a>
    </article>
  );
}
