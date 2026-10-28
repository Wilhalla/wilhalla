import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@wilhalla/ui/components/chart";
import { ScrollArea } from "@wilhalla/ui/components/scroll-area";
import { Skeleton } from "@wilhalla/ui/components/skeleton";
import { Spinner } from "@wilhalla/ui/components/spinner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@wilhalla/ui/components/table";
import { Bar, BarChart, XAxis } from "recharts";

import { Example, Examples, type Story } from "./story";

const rows = [
  { year: 2010, posts: 112, images: 640 },
  { year: 2011, posts: 98, images: 512 },
  { year: 2012, posts: 131, images: 801 },
];

export const tableStory: Story = {
  id: "table",
  title: "Table",
  source: "@wilhalla/ui/components/table",
  description: "Data table; hover a row.",
  render: () => (
    <Examples wide>
      <Example label="header, rows, caption">
        <Table>
          <TableCaption>Berichten en afbeeldingen per jaar.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Jaar</TableHead>
              <TableHead className="text-right">Berichten</TableHead>
              <TableHead className="text-right">Afbeeldingen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.year}>
                <TableCell>{row.year}</TableCell>
                <TableCell className="text-right">{row.posts}</TableCell>
                <TableCell className="text-right">{row.images}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Example>
    </Examples>
  ),
};

const chartConfig = {
  posts: { label: "Berichten", color: "var(--color-obsidian)" },
  images: { label: "Afbeeldingen", color: "var(--color-slate)" },
} satisfies ChartConfig;

export const chartStory: Story = {
  id: "chart",
  title: "Chart",
  source: "@wilhalla/ui/components/chart",
  description: "shadcn/ui chart wrapper around Recharts; hover a bar for the tooltip.",
  render: () => (
    <Examples wide>
      <Example label="BarChart with ChartTooltip">
        <ChartContainer config={chartConfig} className="h-56 w-full max-w-xl">
          <BarChart data={rows}>
            <XAxis dataKey="year" tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="posts" fill="var(--color-posts)" radius={6} isAnimationActive={false} />
            <Bar dataKey="images" fill="var(--color-images)" radius={6} isAnimationActive={false} />
          </BarChart>
        </ChartContainer>
      </Example>
    </Examples>
  ),
};

export const feedbackStory: Story = {
  id: "feedback",
  title: "Skeleton · Spinner · ScrollArea",
  source: "@wilhalla/ui/components/{skeleton,spinner,scroll-area}",
  description: "Loading placeholders and a styled scroll container.",
  render: () => (
    <Examples>
      <Example label="Skeleton (card)">
        <div className="grid w-full max-w-xs gap-3">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </Example>
      <Example label="Spinner sizes">
        <Spinner />
        <Spinner className="size-6" />
        <Spinner className="size-8 text-gravel" />
      </Example>
      <Example label="ScrollArea">
        <ScrollArea className="h-40 w-full max-w-xs rounded-2xl shadow-subtle-2">
          <ul className="m-0 list-none p-4">
            {Array.from({ length: 20 }, (_, i) => (
              <li
                key={i}
                className="border-b border-chalk py-2 text-body text-cinder last:border-0"
              >
                Bericht {i + 1}
              </li>
            ))}
          </ul>
        </ScrollArea>
      </Example>
    </Examples>
  ),
};
