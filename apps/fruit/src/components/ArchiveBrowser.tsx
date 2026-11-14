import { Button } from "@wilhalla/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wilhalla/ui/components/select";
import { layout } from "@wilhalla/ui/lib/typography";
import { cn } from "@wilhalla/ui/lib/utils";
import { use, useState } from "react";
import { archiveYear, buildArchiveChronology } from "../lib/archiveDateTime";
import {
  archiveTopicFilterLabel,
  archiveUrlCodec,
  filterArchivePostsByTopic,
} from "../lib/archiveTopicFilter";
import { formatNumber } from "../lib/format";
import { archivePostsResource } from "../lib/generatedData";
import type { ArchiveClientPost } from "../lib/generatedTypes";
import { useUrlState, writeUrlState } from "../lib/urlState";
import ArchiveRow from "./ArchiveRow";
import ArchiveViewToggle, { type ArchiveViewMode } from "./ArchiveViewToggle";
import YearVirtualList from "./YearVirtualList";

/** Select value for "no category": the control needs a non-empty string. */
const ALL_CATEGORIES = "all";

const postKey = (post: ArchiveClientPost) => post.id;
const estimateRowSize = () => (window.innerWidth < 768 ? 120 : 64);

function changeTopic(value: string) {
  writeUrlState(archiveUrlCodec, { topic: value === ALL_CATEGORIES ? null : value }, "push");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function ArchiveBrowser() {
  const payload = use(archivePostsResource.load());
  const { topic } = useUrlState(archiveUrlCodec);
  const [mode, setMode] = useState<ArchiveViewMode>("aggregated");

  const aggregated = filterArchivePostsByTopic(payload.aggregated, topic);
  const all = filterArchivePostsByTopic(payload.all, topic);
  const posts = mode === "aggregated" ? aggregated : all;
  const topicLabel = topic
    ? archiveTopicFilterLabel(
        payload.topics.find((item) => item.id === topic),
        topic,
      )
    : "";
  const years = buildArchiveChronology(posts, { sort: false }).yearGroups.map((group) => ({
    year: group.year,
    count: group.count,
    firstIndex: group.firstIndex,
  }));

  return (
    <>
      <section
        className={cn(
          layout.container,
          "flex flex-wrap items-center justify-between gap-4 border-b border-chalk py-6",
        )}
        aria-label="Archiefweergave"
      >
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <label className="font-sans text-body text-gravel" htmlFor="archive-category">
            Categorie
          </label>
          <Select value={topic ?? ALL_CATEGORIES} onValueChange={changeTopic}>
            <SelectTrigger id="archive-category" className="w-fit min-w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_CATEGORIES}>Alle categorieën</SelectItem>
              {payload.topics.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {archiveTopicFilterLabel(item, item.id)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {topic && (
            <span className="font-sans text-body text-gravel">
              {formatNumber(posts.length)} verhalen in {topicLabel}
            </span>
          )}
        </div>
        <ArchiveViewToggle
          mode={mode}
          aggregatedCount={aggregated.length}
          allCount={all.length}
          onChange={setMode}
        />
      </section>

      <YearVirtualList
        className={cn(
          layout.container,
          "grid-cols-rail gap-4 pt-6 pb-56 md:grid-cols-sidebar md:gap-8",
        )}
        items={posts}
        years={years}
        itemKey={postKey}
        yearOf={archiveYear}
        estimateSize={estimateRowSize}
        overscan={14}
        label="Alle blogberichten"
        yearsLabel="Archiefjaren"
        empty={
          posts.length === 0 && (
            <div className="rounded-2xl border border-dashed border-chalk bg-powder p-8 font-sans text-body text-gravel">
              Geen berichten gevonden in categorie{" "}
              <strong className="text-obsidian">{topicLabel}</strong>.{" "}
              <Button variant="link" size="inline" onClick={() => changeTopic(ALL_CATEGORIES)}>
                Toon alle berichten
              </Button>
              .
            </div>
          )
        }
      >
        {(post) => <ArchiveRow post={post} />}
      </YearVirtualList>
    </>
  );
}
