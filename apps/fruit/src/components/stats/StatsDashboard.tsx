import { SectionHeader } from "@wilhalla/ui/components/section";
import { PageHeader } from "@wilhalla/ui/components/page-header";
import { cn } from "@wilhalla/ui/lib/utils";
import { layout } from "@wilhalla/ui/lib/typography";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import { CalendarDays, Image, MessageCircle, Ruler, Sparkles } from "lucide-react";
import type { ArchiveStatsData } from "@/lib/archiveStats";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@wilhalla/ui/components/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@wilhalla/ui/components/chart";
import { Separator } from "@wilhalla/ui/components/separator";
import TopicSeasonHeatmap from "@/components/atlas/TopicSeasonHeatmap";
import { useDismissHydrationLoader } from "@/components/gallery/useGracefulLoader";
import { ChartBlock, Kpi, MinimalCard, RankingTable } from "./StatsBlocks";
import { DistributionChart, ValueBarChart, WeekHeatmap } from "./StatsCharts";
import {
  densityChartConfig,
  postChartConfig,
  topicChartConfig,
  yearChartConfig,
} from "./statsChartConfig";
import {
  formatCompact,
  formatDate,
  formatLabelCompact,
  formatLabelNumber,
  formatNumber,
  pct,
  WEEKDAY_LABELS,
} from "./statsFormat";

export default function StatsDashboard({ stats }: { stats: ArchiveStatsData }) {
  useDismissHydrationLoader("stats-hydration-loader", false);

  const mostActiveYear = [...stats.byYear].sort((a, b) => b.posts - a.posts)[0];
  const mostVisualYear = [...stats.byYear].sort((a, b) => b.images - a.images)[0];
  const tempoYears = [...stats.byYear]
    .filter((year) => year.activeDays > 0)
    .map((year) => ({
      label: String(year.year),
      value: Number((year.posts / year.activeDays).toFixed(2)),
      detail: `${year.posts} berichten · ${year.activeDays} dagen`,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
  const visualYears = [...stats.byYear]
    .filter((year) => year.posts > 0)
    .map((year) => ({
      label: String(year.year),
      value: year.avgImages,
      detail: `${year.images} beelden`,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
  const discussionTopics = [...stats.topics]
    .filter((topic) => topic.reactions > 0)
    .map((topic) => ({
      label: topic.label,
      value: Number(((topic.reactions / topic.posts) * 100).toFixed(1)),
      detail: `${topic.reactions} reacties`,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
  const weekdayTotals = WEEKDAY_LABELS.map((label, day) => ({
    label,
    value: stats.byWeekday[day]?.posts ?? 0,
  }));

  return (
    <>
      <PageHeader
        size="page"
        title="Statistieken"
        intro="Wanneer en hoeveel er geschreven werd, met hoeveel foto's en reacties."
        meta={`${formatDate(stats.totals.firstDate)} tot ${formatDate(stats.totals.lastDate)} · ${formatNumber(stats.totals.activeDays)} actieve dagen · mediaan ${formatNumber(stats.totals.medianChars)} tekens per bericht`}
      />
      <div className={cn(layout.container, "pt-10 pb-20")}>
        <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-4" aria-label="Kerncijfers">
          <Kpi
            icon={CalendarDays}
            label="Berichten"
            value={formatNumber(stats.totals.posts)}
            detail={`${formatNumber(stats.totals.activeYears)} jaar, gemiddeld om de ${stats.totals.avgDaysBetweenActiveDays} dagen een bericht.`}
          />
          <Kpi
            icon={Image}
            label="Beelden"
            value={formatNumber(stats.totals.images)}
            detail={`${pct(stats.totals.illustratedPosts, stats.totals.posts)} van de berichten heeft foto's.`}
          />
          <Kpi
            icon={MessageCircle}
            label="Reacties"
            value={formatNumber(stats.totals.reactions)}
            detail={`${pct(stats.totals.reactedPosts, stats.totals.posts)} van de berichten kreeg een reactie.`}
          />
          <Kpi
            icon={Ruler}
            label="Woorden"
            value={formatCompact(stats.totals.words)}
            detail={`${formatCompact(stats.totals.chars)} tekens. De langste berichten tellen meer dan ${formatNumber(stats.totals.p95Chars)} tekens.`}
          />
        </section>

        <Separator className="my-10" />

        <TopicSeasonHeatmap initialData={stats.topicCalendar} />

        <section className="mt-10 grid gap-8 lg:grid-cols-[1.45fr_0.95fr]">
          <ChartBlock title="Per jaar" description="Berichten, foto's en reacties per jaar.">
            <ChartContainer config={yearChartConfig} className="h-[360px] w-full aspect-auto">
              <AreaChart data={stats.byYear} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="posts-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-posts)" stopOpacity={0.22} />
                    <stop offset="100%" stopColor="var(--color-posts)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--color-chalk)" />
                <XAxis
                  dataKey="year"
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis tickLine={false} axisLine={false} width={36} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="posts"
                  stroke="var(--color-posts)"
                  fill="url(#posts-fill)"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="images"
                  stroke="var(--color-images)"
                  strokeWidth={1.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="reactions"
                  stroke="var(--color-reactions)"
                  strokeWidth={1.5}
                  dot={false}
                />
              </AreaChart>
            </ChartContainer>
          </ChartBlock>

          <div className="grid content-start gap-6">
            <MinimalCard>
              <CardHeader>
                <CardTitle>Records</CardTitle>
                <CardDescription>Langste reeksen en drukste jaren.</CardDescription>
              </CardHeader>
              <CardContent className="grid">
                <div className="grid grid-cols-[1fr_auto] items-baseline gap-4 border-t border-chalk pt-4">
                  <span className="text-gravel">Langst elke dag geschreven</span>
                  <span className="font-sans text-body-lg font-medium tabular-nums">
                    {stats.consistency.longestStreak.days} dagen
                  </span>
                  <span className="col-span-2 text-xs text-gravel">
                    {formatDate(stats.consistency.longestStreak.start)} —{" "}
                    {formatDate(stats.consistency.longestStreak.end)}
                  </span>
                </div>
                <div className="grid grid-cols-[1fr_auto] items-baseline gap-4 border-t border-chalk pt-4">
                  <span className="text-gravel">Langste pauze</span>
                  <span className="font-sans text-body-lg font-medium tabular-nums">
                    {stats.consistency.longestGap.days} dagen
                  </span>
                  <span className="col-span-2 text-xs text-gravel">
                    {formatDate(stats.consistency.longestGap.start)} —{" "}
                    {formatDate(stats.consistency.longestGap.end)}
                  </span>
                </div>
                <div className="grid grid-cols-[1fr_auto] items-baseline gap-4 border-t border-chalk pt-4">
                  <span className="text-gravel">Drukste jaar</span>
                  <span className="font-sans text-body-lg font-medium tabular-nums">
                    {mostActiveYear?.year}
                  </span>
                  <span className="col-span-2 text-xs text-gravel">
                    {formatNumber(mostActiveYear?.posts ?? 0)} berichten ·{" "}
                    {formatNumber(mostActiveYear?.activeDays ?? 0)} actieve dagen
                  </span>
                </div>
                <div className="grid grid-cols-[1fr_auto] items-baseline gap-4 border-t border-chalk pt-4">
                  <span className="text-gravel">Jaar met de meeste foto's</span>
                  <span className="font-sans text-body-lg font-medium tabular-nums">
                    {mostVisualYear?.year}
                  </span>
                  <span className="col-span-2 text-xs text-gravel">
                    {formatNumber(mostVisualYear?.images ?? 0)} beelden in{" "}
                    {formatNumber(mostVisualYear?.posts ?? 0)} berichten
                  </span>
                </div>
              </CardContent>
            </MinimalCard>
          </div>
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <ChartBlock title="Per maand" description="Berichten per maand, alle jaren samen.">
            <ChartContainer config={postChartConfig} className="h-[300px] w-full aspect-auto">
              <BarChart data={stats.byMonth} margin={{ top: 24, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--color-chalk)" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis hide />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="posts" fill="var(--color-posts)" radius={[2, 2, 0, 0]}>
                  <LabelList
                    dataKey="posts"
                    position="top"
                    className="fill-gravel text-label"
                    formatter={formatLabelCompact}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </ChartBlock>

          <ChartBlock
            title="Drukste dagen"
            description="Dagen waarop veel berichten tegelijk verschenen."
          >
            <div className="grid gap-1">
              {stats.consistency.busiestDays.map((day) => (
                <div
                  className="grid grid-cols-[minmax(8rem,1fr)_auto] items-center gap-4 border-t border-chalk py-3"
                  key={day.date}
                >
                  <div>
                    <div className="font-medium">{day.label}</div>
                    <div className="mt-1 text-xs text-gravel">
                      {formatNumber(day.images)} beelden · {formatNumber(day.reactions)} reacties
                    </div>
                  </div>
                  <div className="font-sans text-heading-sm tabular-nums">{day.posts}</div>
                </div>
              ))}
            </div>
          </ChartBlock>
        </section>

        <Separator className="my-10" />

        <section>
          <SectionHeader
            title="Per bericht"
            description="Hoe lang de berichten zijn, en hoeveel foto's en reacties ze hebben."
          />
          <div className="grid gap-6 lg:grid-cols-3">
            <ChartBlock title="Tekens per bericht" description="Aantal tekens per bericht.">
              <DistributionChart data={stats.distributions.length} />
            </ChartBlock>
            <ChartBlock title="Foto's per bericht" description="Aantal foto's per bericht.">
              <DistributionChart data={stats.distributions.images} />
            </ChartBlock>
            <ChartBlock title="Reacties per bericht" description="Aantal reacties per bericht.">
              <DistributionChart data={stats.distributions.reactions} />
            </ChartBlock>
          </div>
        </section>

        <section className="mt-10">
          <SectionHeader
            title="Gemiddelden"
            description="Gemiddelden per jaar, onderwerp en weekdag."
          />
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartBlock
              title="Berichten per schrijfdag"
              description="Gemiddeld aantal berichten op een dag waarop er geschreven werd."
            >
              <ValueBarChart data={tempoYears} height={280} labelWidth={48} />
            </ChartBlock>
            <ChartBlock
              title="Foto's per bericht, per jaar"
              description="Gemiddeld aantal foto's per bericht."
            >
              <ValueBarChart data={visualYears} height={280} labelWidth={48} />
            </ChartBlock>
            <ChartBlock
              title="Reacties per onderwerp"
              description="Reacties per 100 berichten, volgens de primaire categorie van elk bericht."
            >
              <ValueBarChart data={discussionTopics} height={320} labelWidth={150} />
            </ChartBlock>
            <ChartBlock title="Per weekdag" description="Berichten per dag van de week.">
              <ValueBarChart
                data={weekdayTotals}
                height={220}
                labelWidth={36}
                formatter={formatLabelNumber}
              />
            </ChartBlock>
          </div>
        </section>

        <section className="mt-10 grid gap-x-8 gap-y-10 lg:grid-cols-3">
          <RankingTable
            title="Langste berichten"
            description="Aantal tekens, zonder de reacties."
            posts={stats.top.longest}
            metric="charCount"
          />
          <RankingTable
            title="Meeste foto's"
            description="De berichten met de meeste foto's."
            posts={stats.top.imageRich}
            metric="imageCount"
          />
          <RankingTable
            title="Meeste reacties"
            description="De berichten met de meeste reacties."
            posts={stats.top.mostDiscussed}
            metric="reactionCount"
          />
        </section>

        <Separator className="my-10" />

        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <ChartBlock
            title="Berichten per onderwerp"
            description="Elk bericht telt bij zijn belangrijkste onderwerp."
          >
            <ChartContainer config={topicChartConfig} className="h-[520px] w-full aspect-auto">
              <BarChart
                data={stats.topics}
                layout="vertical"
                margin={{ top: 0, right: 38, left: 8, bottom: 0 }}
              >
                <CartesianGrid horizontal={false} stroke="var(--color-chalk)" />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="label"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={150}
                  className="text-xs"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="posts" fill="var(--color-posts)" radius={[0, 2, 2, 0]}>
                  <LabelList
                    dataKey="posts"
                    position="right"
                    className="fill-gravel text-label"
                    formatter={formatLabelNumber}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </ChartBlock>

          <MinimalCard>
            <CardHeader>
              <CardTitle>Categoriedetails</CardTitle>
              <CardDescription>
                Gemiddelde lengte en beelden per primaire categorie.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {stats.topics.slice(0, 8).map((topic) => (
                  <div className="border-t border-chalk pt-3" key={topic.id}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-medium">{topic.label}</span>
                      <span className="font-sans text-body tabular-nums">
                        {formatNumber(topic.posts)}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-gravel">
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
          </MinimalCard>
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <ChartBlock title="Lengte per jaar" description="Gemiddeld aantal tekens per bericht.">
            <ChartContainer config={densityChartConfig} className="h-[300px] w-full aspect-auto">
              <LineChart data={stats.byYear} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--color-chalk)" />
                <XAxis
                  dataKey="year"
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={44}
                  tickFormatter={(value) => formatCompact(Number(value))}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  dataKey="avgChars"
                  stroke="var(--color-avgChars)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </ChartBlock>

          <ChartBlock
            title="Per weekdag en uur"
            description="Hoe donkerder, hoe meer berichten op dat uur. Berichten zonder uur tellen niet mee."
          >
            <WeekHeatmap data={stats.weekdayHour} />
          </ChartBlock>
        </section>

        <div className="mt-14 flex items-center gap-3 border-t border-chalk pt-5 text-sm text-gravel">
          <Sparkles className="size-4" aria-hidden="true" />
          <span>
            Gebaseerd op gegenereerde archiefdata; tekstlengte telt auteurstekst en knipt zichtbare
            reacties waar mogelijk weg.
          </span>
        </div>
      </div>
    </>
  );
}
