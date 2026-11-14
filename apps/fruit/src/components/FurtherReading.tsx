import { LinkList, LinkListItem } from "@wilhalla/ui/components/link-list";
import { Section, SectionHeader } from "@wilhalla/ui/components/section";
import { typography } from "@wilhalla/ui/lib/typography";

import mapPointsData from "../data/generated/map-points.json";
import relatedPostsData from "../data/generated/related-posts.json";
import topicsData from "../data/generated/topics.json";
import { formatArchiveDate } from "../lib/archiveDateTime";
import { categoriesOf } from "../lib/archiveAtlas";
import type { MapPoint } from "../lib/generatedTypes";
import { pointsByPostId } from "../lib/postCategories";
import { aggregatedPostIndex, postIndex, type PostSummary } from "../lib/postIndex";
import PostThumbnail from "./PostThumbnail";

interface Props {
  postId: string;
}

// Build-time data: the JSON modules are checked against these types where they are imported.
const relatedPosts: Record<string, string[]> = relatedPostsData;
const topicLabels = new Map(topicsData.map((topic) => [topic.id, topic.label]));
const postsById = new Map<string, PostSummary>(postIndex.map((post) => [post.id, post]));
const storyByPostId =
  pointsByPostId<Pick<MapPoint, "id" | "postIds" | "topicId" | "categoryIds">>(mapPointsData);

const meta = (post: PostSummary) =>
  [
    formatArchiveDate(post),
    post.imageCount ? `${post.imageCount} beelden` : null,
    post.reactionCount ? `${post.reactionCount} reacties` : null,
  ]
    .filter(Boolean)
    .join(" · ");

/** Below a post: where it sits in the timeline, and stories close to it in meaning. */
export default function FurtherReading({ postId }: Props) {
  const index = aggregatedPostIndex.findIndex((post) => post.id === postId);
  const earlier = index >= 0 ? aggregatedPostIndex[index + 1] : undefined;
  const later = index > 0 ? aggregatedPostIndex[index - 1] : undefined;
  const related = (relatedPosts[postId] ?? []).flatMap((id) => postsById.get(id) ?? []).slice(0, 5);
  const story = storyByPostId.get(postId);
  const categories = (story ? categoriesOf(story) : []).flatMap((id) => {
    const label = topicLabels.get(id);
    return label ? { id, label } : [];
  });
  const hasTimeline = Boolean(earlier || later);

  return (
    (hasTimeline || related.length > 0) && (
      <Section aria-labelledby="further-reading-title">
        <SectionHeader id="further-reading-title" title="Verder lezen" level="subsection" />
        <div className="grid gap-12 lg:grid-cols-2">
          {hasTimeline && (
            <div>
              <h3 className={typography.eyebrow}>In de tijdlijn</h3>
              <LinkList className="mt-3">
                {earlier && (
                  <LinkListItem
                    href={`/posts/${earlier.slug}/`}
                    eyebrow={`Vorig bericht · ${formatArchiveDate(earlier)}`}
                    title={earlier.title}
                    media={<PostThumbnail image={earlier.images[0]} />}
                  />
                )}
                {later && (
                  <LinkListItem
                    href={`/posts/${later.slug}/`}
                    eyebrow={`Volgend bericht · ${formatArchiveDate(later)}`}
                    title={later.title}
                    media={<PostThumbnail image={later.images[0]} />}
                  />
                )}
              </LinkList>
              <a
                className="mt-4 inline-block font-sans text-body text-gravel underline decoration-chalk underline-offset-4 hover:text-obsidian"
                href="/archive/"
              >
                Alle berichten
              </a>
            </div>
          )}
          {related.length > 0 && (
            <div>
              <h3 className={typography.eyebrow}>
                Over hetzelfde
                {categories.length > 0 && (
                  <>
                    {" · "}
                    {categories.map((category, position) => (
                      <span key={category.id}>
                        {position > 0 && ", "}
                        <a
                          className="text-gravel underline decoration-chalk underline-offset-4 hover:text-obsidian"
                          href={`/archive/?category=${encodeURIComponent(category.id)}`}
                        >
                          {category.label}
                        </a>
                      </span>
                    ))}
                  </>
                )}
              </h3>
              <LinkList className="mt-3">
                {related.map((post) => (
                  <LinkListItem
                    key={post.id}
                    href={`/posts/${post.slug}/`}
                    eyebrow={meta(post)}
                    title={post.title}
                    media={<PostThumbnail image={post.images[0]} />}
                  />
                ))}
              </LinkList>
            </div>
          )}
        </div>
      </Section>
    )
  );
}
