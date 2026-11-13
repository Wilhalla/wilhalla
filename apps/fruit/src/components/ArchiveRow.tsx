import { formatArchiveDate } from "../lib/date";
import { postCounts } from "../lib/postMeta";

type RowPost = Parameters<typeof formatArchiveDate>[0] & {
  slug: string;
  title: string;
  imageCount: number;
  reactionCount: number;
  seriesPostCount?: number;
};
type Props = { post: RowPost; index?: number };

/** One line of the full archive: date, title and counts, aligned in columns on wide screens. */
export default function ArchiveRow({ post }: Props) {
  const counts = postCounts(post);
  return (
    <a
      className="group grid min-h-16 items-baseline gap-x-6 gap-y-1 border-b border-chalk py-3 text-inherit no-underline outline-none transition-colors duration-150 hover:bg-powder/60 focus-visible:bg-powder/60 md:-mx-3 md:grid-cols-[9rem_minmax(0,1fr)_auto] md:rounded-lg md:px-3"
      href={`/posts/${post.slug}/`}
    >
      <span className="font-sans text-body text-gravel tabular-nums">
        {formatArchiveDate(post)}
      </span>
      <span className="truncate font-heading text-heading-sm leading-heading-sm text-obsidian max-md:whitespace-normal">
        {post.title}
      </span>
      <span className="font-sans text-body text-gravel md:text-right">{counts}</span>
    </a>
  );
}
