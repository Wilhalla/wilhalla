import { formatArchiveDate } from "../lib/archiveDateTime";
import { postCounts } from "../lib/postMeta";

interface RowPost {
  slug: string;
  title: string;
  date: string;
  isoDate: string;
  imageCount: number;
  reactionCount: number;
  seriesPostCount?: number;
}

interface Props {
  post: RowPost;
}

/** One line of the full archive: date, title and counts, aligned in columns on wide screens. */
export default function ArchiveRow({ post }: Props) {
  const counts = postCounts(post);
  return (
    <a
      className="group flex min-h-16 flex-col gap-1 border-b border-chalk py-3 text-inherit no-underline transition-colors duration-hover ease-out hover:bg-powder focus-visible:bg-powder focus-visible:outline-none md:-mx-3 md:flex-row md:items-baseline md:gap-x-6 md:rounded-lg md:px-3"
      href={`/posts/${post.slug}/`}
    >
      <span className="font-sans text-body text-gravel tabular-nums md:w-36 md:shrink-0">
        {formatArchiveDate(post)}
      </span>
      <span className="min-w-0 flex-1 truncate font-heading text-heading-sm leading-heading-sm text-obsidian max-md:whitespace-normal">
        {post.title}
      </span>
      <span className="font-sans text-body text-gravel md:shrink-0 md:text-right">{counts}</span>
    </a>
  );
}
