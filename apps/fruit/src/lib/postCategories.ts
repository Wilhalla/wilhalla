interface PostPoint {
  id: string;
  postIds?: readonly string[];
}

/**
 * The atlas story each post belongs to, by post id. A story (map point) covers one post or a
 * series of posts; its categories are the categories of all of them.
 */
export function pointsByPostId<T extends PostPoint>(points: readonly T[]) {
  const byPostId = new Map<string, T>();
  for (const point of points)
    for (const postId of point.postIds?.length ? point.postIds : [point.id])
      byPostId.set(postId, point);
  return byPostId;
}
