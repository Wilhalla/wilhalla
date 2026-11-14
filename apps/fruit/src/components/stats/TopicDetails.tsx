import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@wilhalla/ui/components/card";
import type { TopicStat } from "../../lib/archiveStatsTypes";
import { formatNumber } from "../../lib/format";

interface TopicDetailsProps {
  topics: readonly TopicStat[];
}

export default function TopicDetails({ topics }: TopicDetailsProps) {
  return (
    <Card variant="flat" className="min-w-0">
      <CardHeader>
        <CardTitle>Categoriedetails</CardTitle>
        <CardDescription>Gemiddelde lengte en beelden per primaire categorie.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {topics.slice(0, 8).map((topic) => (
            <div className="border-t border-chalk pt-3" key={topic.id}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-sans text-body font-medium">{topic.label}</span>
                <span className="font-sans text-body tabular-nums">
                  {formatNumber(topic.posts)}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2 font-sans text-caption leading-caption text-gravel">
                <span>{formatNumber(topic.avgWords)} woorden/post</span>
                <span>·</span>
                <span>{topic.illustratedShare.toFixed(2)} beelden/post</span>
                <span>·</span>
                <span>{formatNumber(topic.reactions)} reacties</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
