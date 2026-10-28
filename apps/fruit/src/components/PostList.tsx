import { buttonVariants } from "@wilhalla/ui/components/button";
import { cn } from "@wilhalla/ui/lib/utils";
import { layout, typography } from "@wilhalla/ui/lib/typography";
import type { PostSummary } from "../lib/postIndex";
import PostCard from "./PostCard";

type Props = { posts: PostSummary[]; title: string; intro?: string; limit?: number };

export default function PostList({ posts, title, intro, limit }: Props) {
  const visible = limit ? posts.slice(0, limit) : posts;
  return (
    <section className={cn(layout.container, "py-14")}>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className={typography.section}>{title}</h2>
          {intro && <p className={typography.kicker}>{intro}</p>}
        </div>
        {limit && (
          <a className={buttonVariants()} href="/archive/">
            Alle {posts.length.toLocaleString("nl-BE")} berichten
          </a>
        )}
      </div>
      <div>
        {visible.map((post, index) => (
          <PostCard key={post.id} post={post} featured={index === 0 && !!limit} />
        ))}
      </div>
    </section>
  );
}
