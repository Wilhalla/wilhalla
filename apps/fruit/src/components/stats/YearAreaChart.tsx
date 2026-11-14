import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@wilhalla/ui/components/chart";
import { Area, AreaChart, CartesianGrid, Line, XAxis, YAxis } from "recharts";
import type { YearStat } from "../../lib/archiveStatsTypes";
import { yearChartConfig } from "./statsChartConfig";

interface YearAreaChartProps {
  data: YearStat[];
}

/** Posts, images and reactions per year. */
export default function YearAreaChart({ data }: YearAreaChartProps) {
  return (
    <ChartContainer
      config={yearChartConfig}
      className="aspect-auto h-(--chart-height) w-full"
      style={{ "--chart-height": "360px" }}
    >
      <AreaChart data={data} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="posts-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-posts)" stopOpacity={0.22} />
            <stop offset="100%" stopColor="var(--color-posts)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--color-chalk)" />
        <XAxis dataKey="year" tickLine={false} axisLine={false} interval="preserveStartEnd" />
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
  );
}
