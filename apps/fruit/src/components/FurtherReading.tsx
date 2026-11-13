import { LinkList, LinkListItem } from "@wilhalla/ui/components/link-list";
import { Section, SectionHeader } from "@wilhalla/ui/components/section";
import { typography } from "@wilhalla/ui/lib/typography";
import { FileText } from "lucide-react";

import mapPointsData from "../data/generated/map-points.json";
import relatedPostsData from "../data/generated/related-posts.json";
import topicsData from "../data/generated/topics.json";
import { archiveSmallThumbUrl } from "../lib/assetUrls";
import { aggregatedPostIndex, formatDate, postIndex, type PostSummary } from "../lib/postIndex";

type Props = { postId: string };
type MapPoint = { id: string; postIds?: string[]; topicId: string; categoryIds?: string[] };
type Topic = { id: string; label: string };

const relatedPosts = relatedPostsData as Record<string, string[]>;
const topicsById = new Map((topicsData as Topic[]).map((topic) => [topic.id, topic]));
const postsById = new Map<string, PostSummary>(postIndex.map((post) => [post.id, post]));
const pointsByPostId = new Map<string, MapPoint>(
  (mapPointsData as MapPoint[]).flatMap((point) =>
    (point.postIds?.length ? point.postIds : [point.id]).map((id) => [id, point] as const),
  ),
);

function Thumbnail({ post }: { post: PostSummary }) {
  const image = post.images[0];
  return image ? (
    <img src={archiveSmallThumbUrl(image)} alt="" loading="lazy" decoding="async" />
  ) : (
    <span className="grid size-full place-items-center text-fog">
      <FileText className="size-5" strokeWidth={1.5} />
    </span>
  );
}

const meta = (post: PostSummary) =>
  [
    formatDate(post),
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
  const related = (relatedPosts[postId] ?? [])
    .map((id) => postsById.get(id))
    .filter((post): post is PostSummary => Boolean(post))
    .slice(0, 5);
  const point = pointsByPostId.get(postId);
  const categories = (point?.categoryIds ?? (point ? [point.topicId] : []))
    .map((id) => ({ id, label: topicsById.get(id)?.label }))
    .filter((category): category is Topic => Boolean(category.label));

  if (!earlier && !later && related.length === 0) return null;

  return (
    <Section aria-labelledby="further-reading-title">
      <SectionHeader id="further-reading-title" title="Verder lezen" level="subsection" />
      <div className="grid gap-12 lg:grid-cols-2">
        {(earlier || later) && (
          <div>
            <h3 className={typography.eyebrow}>In de tijdlijn</h3>
            <LinkList className="mt-3">
              {earlier && (
                <LinkListItem
                  href={`/posts/${earlier.slug}/`}
                  eyebrow={`Vorig bericht · ${formatDate(earlier)}`}
                  title={earlier.title}
                  media={<Thumbnail post={earlier} />}
                />
              )}
              {later && (
                <LinkListItem
                  href={`/posts/${later.slug}/`}
                  eyebrow={`Volgend bericht · ${formatDate(later)}`}
                  title={later.title}
                  media={<Thumbnail post={later} />}
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
                  media={<Thumbnail post={post} />}
                />
              ))}
            </LinkList>
          </div>
        )}
      </div>
    </Section>
  );
}
