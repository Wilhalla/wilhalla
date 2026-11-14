import fs from "node:fs/promises";
import path from "node:path";
import postIndexData from "../src/data/post-index.json" with { type: "json" };
import postSeriesData from "../src/data/post-series.json" with { type: "json" };
import mapPointsData from "../src/data/generated/map-points.json" with { type: "json" };
import topicsData from "../src/data/generated/topics.json" with { type: "json" };
import { buildArchiveSeries } from "../src/lib/archiveSeries.ts";
import { sortArchiveChronologically } from "../src/lib/archiveDateTime.ts";
import type {
  ArchiveClientPayload,
  ArchiveClientPost,
  ArchiveClientTopic,
  MapPoint,
} from "../src/lib/generatedTypes.ts";
import { pointsByPostId } from "../src/lib/postCategories.ts";

type PostSummary = {
  id: string;
  slug: string;
  title: string;
  date: string;
  isoDate: string;
  imageCount: number;
  reactionCount: number;
  images?: string[];
  isSeries?: boolean;
  seriesId?: string;
  seriesPostIds?: string[];
  seriesPostCount?: number;
};

type StoryPoint = Pick<MapPoint, "id" | "postIds" | "categoryIds"> & { topicId?: string };

const ROOT = process.cwd();
const OUT_DIRS = [path.join(ROOT, "public/generated"), path.join(ROOT, "src/data/generated")];
const postIndex = postIndexData as PostSummary[];
const postSeries = (
  postSeriesData as {
    series: Array<{
      id: string;
      title: string;
      primaryPostId: string;
      postIds: string[];
      postCount: number;
    }>;
  }
).series;
const storyByPostId = pointsByPostId<StoryPoint>(mapPointsData);
const topics: Partial<ArchiveClientTopic>[] = topicsData;
const archiveSeries = buildArchiveSeries(postIndex, postSeries);

function categoryIdsOf(postId: string) {
  const story = storyByPostId.get(postId);
  if (!story) return [];
  return story.categoryIds?.length ? story.categoryIds : story.topicId ? [story.topicId] : [];
}

function topicIdsFor(post: PostSummary) {
  const postIds = post.seriesPostIds?.length ? post.seriesPostIds : [post.id];
  return Array.from(new Set(postIds.flatMap(categoryIdsOf))).toSorted();
}

function slim(post: PostSummary): ArchiveClientPost {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    date: post.date,
    isoDate: post.isoDate,
    imageCount: post.imageCount,
    reactionCount: post.reactionCount,
    isSeries: post.isSeries || undefined,
    seriesPostCount: post.seriesPostCount || undefined,
    topicIds: topicIdsFor(post),
  };
}

const content: ArchiveClientPayload = {
  topics: topics.map((topic) => ({
    id: topic.id ?? "",
    label: topic.label || "",
    generatedLabel: topic.generatedLabel || "",
    postCount: topic.postCount || 0,
  })),
  aggregated: sortArchiveChronologically(archiveSeries.aggregated).map(slim),
  all: sortArchiveChronologically(archiveSeries.all).map(slim),
};
const payload = {
  generatedAt: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
  ...content,
};

for (const outDir of OUT_DIRS) {
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(
    path.join(outDir, "archive-posts.client.json"),
    `${JSON.stringify(payload)}\n`,
    "utf8",
  );
}

// The data explorer fetches these large tables lazily from /generated/ so they do not get bundled into JS.
await fs.copyFile(
  path.join(ROOT, "src/data/generated/posts-index.json"),
  path.join(ROOT, "public/generated/posts-index.json"),
);
await fs.copyFile(
  path.join(ROOT, "src/data/generated/related-posts.json"),
  path.join(ROOT, "public/generated/related-posts.json"),
);

console.log(
  `[client-data] wrote archive client index: ${payload.aggregated.length} aggregated, ${payload.all.length} all`,
);
