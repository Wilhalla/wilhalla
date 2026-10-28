import { buttonVariants } from "@wilhalla/ui/components/button";
import { cn } from "@wilhalla/ui/lib/utils";
import { layout, typography } from "@wilhalla/ui/lib/typography";
import type { PostSummary } from "../lib/postIndex";
import { formatArchiveDate } from "../lib/date";
import { archiveAssetUrl } from "../lib/assetUrls";

type Props = {
  leadPost: PostSummary;
  postCount: number;
};

export default function Hero({ leadPost, postCount }: Props) {
  const leadImage = leadPost.images[0];

  return (
    <section
      className={cn(
        layout.container,
        "relative grid min-h-[32rem] items-end gap-14 overflow-hidden py-14 md:grid-cols-[minmax(0,1fr)_minmax(20rem,0.6fr)]",
      )}
    >
      <div className="grid gap-5">
        <h1 className={typography.display}>Blogarchief Daniël Willaeys</h1>
        <p className="m-0 max-w-3xl text-lg leading-snug text-gravel">
          {postCount.toLocaleString("nl-BE")} bewaarde berichten met foto’s en reacties.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <a className={buttonVariants()} href="/archive/">
            Bekijk alle berichten
          </a>
          <a className="font-medium text-obsidian no-underline" href={`/posts/${leadPost.slug}/`}>
            Uitgelicht: {leadPost.title}
          </a>
        </div>
      </div>
      <a
        className="grid gap-3 rounded-2xl bg-pure-surface p-5 text-inherit no-underline shadow-subtle-7"
        href={`/posts/${leadPost.slug}/`}
        aria-label={`Lees ${leadPost.title}`}
      >
        {leadImage && (
          <img
            className="aspect-[4/5] w-full rounded-2xl object-cover"
            src={archiveAssetUrl(leadImage)}
            alt=""
            loading="eager"
            decoding="async"
          />
        )}
        <div>
          <p className="m-0 text-sm text-gravel">{formatArchiveDate(leadPost)}</p>
          <strong className="block text-3xl font-medium leading-tight">{leadPost.title}</strong>
        </div>
      </a>
    </section>
  );
}
