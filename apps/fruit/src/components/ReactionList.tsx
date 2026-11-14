import { Section, SectionHeader } from "@wilhalla/ui/components/section";
import { typography } from "@wilhalla/ui/lib/typography";
import { cn } from "@wilhalla/ui/lib/utils";

import { legacyContent } from "@/lib/legacyContent";
import { rewriteArchiveAssetUrls } from "../lib/assetUrls";
import type { Reaction } from "../lib/archivePostReading";

interface Props {
  reactions: Reaction[];
}

const byDate = (a: Reaction, b: Reaction) => {
  const aTime = Date.parse(a.isoDate);
  const bTime = Date.parse(b.isoDate);
  if (Number.isNaN(aTime) || Number.isNaN(bTime)) return Number.isNaN(aTime) ? 1 : -1;
  return aTime - bTime;
};

/** The saved reactions under a post, oldest first, like a conversation. */
export default function ReactionList({ reactions }: Props) {
  return (
    reactions.length > 0 && (
      <Section id="reactions" aria-labelledby="reactions-title">
        <SectionHeader
          id="reactions-title"
          level="subsection"
          title={reactions.length === 1 ? "1 reactie" : `${reactions.length} reacties`}
        />
        <ol className="m-0 grid max-w-prose list-none gap-8 p-0">
          {reactions.toSorted(byDate).map((reaction) => (
            <li key={reaction.id}>
              <article className="grid gap-2">
                <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <p className="m-0 font-sans text-body font-medium text-obsidian">
                    {reaction.author}
                  </p>
                  <time className={cn(typography.small, "text-gravel")} dateTime={reaction.isoDate}>
                    {reaction.date}
                    {reaction.time ? ` · ${reaction.time}` : ""}
                  </time>
                </header>
                {reaction.title && (
                  <h3 className="m-0 font-sans text-body font-medium text-cinder">
                    {reaction.title}
                  </h3>
                )}
                <div
                  className={cn(legacyContent, "wrap-anywhere")}
                  dangerouslySetInnerHTML={{ __html: rewriteArchiveAssetUrls(reaction.html) }}
                />
              </article>
            </li>
          ))}
        </ol>
      </Section>
    )
  );
}
