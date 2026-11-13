import type { LucideIcon } from "lucide-react";
import type { RankPost } from "@/lib/archiveStats";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@wilhalla/ui/components/card";
import { cn } from "@wilhalla/ui/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@wilhalla/ui/components/table";
import { formatNumber } from "./statsFormat";

export function MinimalCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card variant="flat" className={cn("min-w-0", className)}>
      {children}
    </Card>
  );
}

export function Kpi({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
}) {
  return (
    <div className="border-t border-chalk pt-4">
      <div className="mb-5 flex items-center justify-between gap-3 text-gravel">
        <span className="font-sans text-body">{label}</span>
        <Icon className="size-4" aria-hidden="true" />
      </div>
      <div className="font-heading text-heading leading-heading font-light tracking-heading text-obsidian tabular-nums md:text-heading-lg md:leading-heading-lg">
        {value}
      </div>
      <p className="mt-3 max-w-[22ch] text-sm leading-5 text-gravel">{detail}</p>
    </div>
  );
}

export function ChartBlock({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <MinimalCard>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="max-w-2xl">{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </MinimalCard>
  );
}

export function RankingTable({
  title,
  description,
  posts,
  metric,
}: {
  title: string;
  description: string;
  posts: RankPost[];
  metric: "charCount" | "imageCount" | "reactionCount";
}) {
  const metricLabel = {
    charCount: "tekens",
    imageCount: "beelden",
    reactionCount: "reacties",
  }[metric];

  return (
    <MinimalCard>
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
              <TableHead className="text-right">{metricLabel}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post, index) => (
              <TableRow key={post.id}>
                <TableCell>{String(index + 1).padStart(2, "0")}</TableCell>
                <TableCell className="max-w-[20rem] whitespace-normal">
                  <a
                    className="line-clamp-2 text-sm font-medium no-underline hover:underline"
                    href={post.url}
                  >
                    {post.title}
                  </a>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gravel">
                    <span>{post.year}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.topicLabel}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">{formatNumber(post[metric])}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </MinimalCard>
  );
}
