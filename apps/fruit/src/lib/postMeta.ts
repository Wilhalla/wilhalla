import type { PostSummary } from "./postIndex";

/** "12 beelden · 3 reacties · 2 delen": the quiet counts line every post listing shows. */
export function postCounts(
  post: Pick<PostSummary, "imageCount" | "reactionCount"> & {
    seriesPostCount?: number;
  },
) {
  return [
    post.seriesPostCount ? `${post.seriesPostCount} delen` : null,
    post.imageCount ? `${post.imageCount} ${post.imageCount === 1 ? "beeld" : "beelden"}` : null,
    post.reactionCount
      ? `${post.reactionCount} ${post.reactionCount === 1 ? "reactie" : "reacties"}`
      : null,
  ]
    .filter(Boolean)
    .join(" · ");
}

/** Title and excerpt styles shared by every list of posts (timeline, archive, related). */
export const postListTitle =
  "m-0 font-heading text-heading-sm leading-heading-sm font-normal text-balance text-obsidian md:text-[1.6rem] md:leading-[1.25]";
export const postListExcerpt =
  "m-0 mt-2 line-clamp-2 max-w-[66ch] font-sans text-body leading-body text-cinder [overflow-wrap:anywhere]";
