import { SectionHeader } from "@wilhalla/ui/components/section";
import { seasonForMonth } from "../../lib/archiveDateTime";
import type { TopicCalendarData } from "../../lib/archiveStatsTypes";
import { UNNAMED_TOPIC_LABEL } from "../../lib/archiveTopicFilter";
import { MONTH_LABELS } from "../../lib/format";

const TOPICS_SHOWN = 14;
// The chart's own geometry: a label column, one column per month and the total.
const grid =
  "grid grid-cols-[minmax(10rem,14rem)_repeat(12,minmax(0,1.65rem))_3rem] items-center gap-2";

function shortTopic(label: string, fallback: string) {
  const source = label && label !== UNNAMED_TOPIC_LABEL ? label : fallback;
  return source.split(",").slice(0, 2).join(" · ").toLowerCase();
}

/** One step of the neutral ramp per share of the busiest month: the more posts, the darker. */
function cellClass(value: number, max: number) {
  if (!value) return "bg-powder text-transparent";
  const ratio = value / max;
  if (ratio > 0.7) return "bg-obsidian text-eggshell";
  if (ratio > 0.4) return "bg-gravel text-eggshell";
  if (ratio > 0.2) return "bg-slate text-obsidian";
  return "bg-chalk text-obsidian";
}

interface TopicSeasonHeatmapProps {
  data: TopicCalendarData;
}

/** The most common topics by month of the year. */
export default function TopicSeasonHeatmap({ data }: TopicSeasonHeatmapProps) {
  const rows = data.topics
    .toSorted((a, b) => b.postCount - a.postCount)
    .slice(0, TOPICS_SHOWN)
    .map((topic) => ({
      ...topic,
      displayLabel: shortTopic(topic.label, topic.generatedLabel),
      total: topic.monthsAllYears.reduce((sum, value) => sum + value, 0),
    }));
  const max = Math.max(1, data.maxMonthCount, ...rows.flatMap((row) => row.monthsAllYears));

  return (
    <section aria-labelledby="topic-season-title">
      <SectionHeader
        id="topic-season-title"
        title="Seizoensritme"
        description="Elke rij is een veelvoorkomend onderwerp. Elk vakje is een maand; het cijfer is het aantal berichten, donkerder betekent vaker."
        action={
          <div
            className="flex items-center gap-2 font-sans text-body leading-body text-gravel"
            aria-hidden="true"
          >
            minder
            <span className="size-4 rounded-md bg-chalk" />
            <span className="size-4 rounded-md bg-slate" />
            <span className="size-4 rounded-md bg-gravel" />
            <span className="size-4 rounded-md bg-obsidian" />
            meer
          </div>
        }
      />

      <div
        className="min-w-0 overflow-x-auto py-2"
        role="img"
        aria-label="Mini heatmap van de grootste onderwerpen per maand"
      >
        <div
          className={`${grid} font-sans text-caption font-medium text-gravel`}
          aria-hidden="true"
        >
          <span />
          {MONTH_LABELS.map((month, index) => (
            <span key={month}>{seasonForMonth(index + 1).slice(0, 1)}</span>
          ))}
          <span />
        </div>
        <div
          className={`${grid} my-3 font-sans text-caption font-medium text-gravel`}
          aria-hidden="true"
        >
          <span>onderwerp</span>
          {MONTH_LABELS.map((month) => (
            <span className="rotate-180 [writing-mode:vertical-rl]" key={month}>
              {month}
            </span>
          ))}
          <span className="justify-self-end">totaal</span>
        </div>
        {rows.map((row) => (
          <div className={`${grid} min-h-8`} key={row.topicId}>
            <span
              className="truncate font-sans text-body font-medium text-gravel"
              title={row.label}
            >
              {row.displayLabel}
            </span>
            {row.monthsAllYears.map((value, index) => (
              <span
                className={`grid size-7 place-items-center rounded-md font-sans text-caption tabular-nums ${cellClass(value, max)}`}
                key={MONTH_LABELS[index]}
                title={`${row.displayLabel} · ${MONTH_LABELS[index]} · ${value} berichten`}
              >
                {value || ""}
              </span>
            ))}
            <strong className="justify-self-end font-sans text-caption text-obsidian tabular-nums">
              {row.total}
            </strong>
          </div>
        ))}
      </div>
    </section>
  );
}
