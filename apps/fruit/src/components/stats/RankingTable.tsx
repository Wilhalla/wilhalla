import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@wilhalla/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@wilhalla/ui/components/table";
import type { RankPost } from "../../lib/archiveStatsTypes";
import { formatNumber } from "../../lib/format";

const metricLabel = {
  charCount: "tekens",
  imageCount: "beelden",
  reactionCount: "reacties",
} as const;

interface RankingTableProps {
  title: string;
  description: string;
  posts: readonly RankPost[];
  metric: keyof typeof metricLabel;
}

export default function RankingTable({ title, description, posts, metric }: RankingTableProps) {
  return (
    <Card variant="flat" className="min-w-0">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8">#</TableHead>
              <TableHead>Bericht</TableHead>
              <TableHead className="text-right">{metricLabel[metric]}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post, index) => (
              <TableRow key={post.id}>
                <TableCell>
                  <span className="text-gravel tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </TableCell>
                <TableCell className="max-w-80 whitespace-normal">
                  <a
                    className="line-clamp-2 font-sans text-body font-medium no-underline decoration-fog underline-offset-4 hover:underline"
                    href={post.url}
                  >
                    {post.title}
                  </a>
                  <div className="mt-1 flex flex-wrap items-center gap-2 font-sans text-caption leading-caption text-gravel">
                    <span>{post.year}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.topicLabel}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span className="tabular-nums">{formatNumber(post[metric])}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
