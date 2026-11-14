import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@wilhalla/ui/components/card";
import type { ArchiveStatsData } from "../../lib/archiveStatsTypes";
import { formatDay, formatNumber } from "../../lib/format";

interface StatsRecordsProps {
  consistency: ArchiveStatsData["consistency"];
  highlights: ArchiveStatsData["highlights"];
}

export default function StatsRecords({ consistency, highlights }: StatsRecordsProps) {
  const { longestStreak, longestGap } = consistency;
  const { mostActiveYear, mostVisualYear } = highlights;
  const records = [
    {
      label: "Langst elke dag geschreven",
      value: `${longestStreak.days} dagen`,
      detail: `${formatDay(longestStreak.start)} — ${formatDay(longestStreak.end)}`,
    },
    {
      label: "Langste pauze",
      value: `${longestGap.days} dagen`,
      detail: `${formatDay(longestGap.start)} — ${formatDay(longestGap.end)}`,
    },
    {
      label: "Drukste jaar",
      value: mostActiveYear?.year,
      detail: `${formatNumber(mostActiveYear?.posts ?? 0)} berichten · ${formatNumber(mostActiveYear?.activeDays ?? 0)} actieve dagen`,
    },
    {
      label: "Jaar met de meeste foto's",
      value: mostVisualYear?.year,
      detail: `${formatNumber(mostVisualYear?.images ?? 0)} beelden in ${formatNumber(mostVisualYear?.posts ?? 0)} berichten`,
    },
  ];

  return (
    <Card variant="flat" className="min-w-0">
      <CardHeader>
        <CardTitle>Records</CardTitle>
        <CardDescription>Langste reeksen en drukste jaren.</CardDescription>
      </CardHeader>
      <CardContent className="grid">
        {records.map((record) => (
          <div
            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-chalk py-3"
            key={record.label}
          >
            <span className="font-sans text-body leading-body text-gravel">{record.label}</span>
            <span className="font-sans text-body-lg font-medium tabular-nums">{record.value}</span>
            <span className="basis-full font-sans text-caption leading-caption text-gravel">
              {record.detail}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
