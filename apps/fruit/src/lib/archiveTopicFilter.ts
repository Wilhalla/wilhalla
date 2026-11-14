import { setParam, type UrlCodec } from "./urlState";

export interface TopicTaggedArchivePost {
  topicIds?: readonly string[];
}

export interface ArchiveTopicLabel {
  id: string;
  label?: string;
  generatedLabel?: string;
}

/** The label a topic carries until someone names it. */
export const UNNAMED_TOPIC_LABEL = "Nog te benoemen";

export interface ArchiveUrlState {
  /** The category the archive is filtered on; null shows everything. */
  topic: string | null;
}

/** `?category=`; the older `?topic=` links still work and are rewritten on the next change. */
export const archiveUrlCodec: UrlCodec<ArchiveUrlState> = {
  parse: (params) => ({
    topic: (params.get("category") ?? params.get("topic") ?? "").trim() || null,
  }),
  write: (state, params) => {
    params.delete("topic");
    setParam(params, "category", state.topic);
  },
};

export function filterArchivePostsByTopic<T extends TopicTaggedArchivePost>(
  posts: readonly T[],
  topicId: string | null,
): readonly T[] {
  if (!topicId) return posts;
  return posts.filter((post) => post.topicIds?.includes(topicId));
}

export function archiveTopicFilterLabel(topic: ArchiveTopicLabel | undefined, fallbackId: string) {
  if (!topic) return fallbackId;
  const label = topic.label?.trim();
  if (label && label !== UNNAMED_TOPIC_LABEL) return label;
  return topic.generatedLabel?.trim() || topic.id || fallbackId;
}
