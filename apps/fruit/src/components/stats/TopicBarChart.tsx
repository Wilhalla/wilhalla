import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@wilhalla/ui/components/chart";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import type { TopicStat } from "../../lib/archiveStatsTypes";
import { formatChartLabel } from "./chartLabels";
import { topicChartConfig } from "./statsChartConfig";

interface TopicBarChartProps {
  data: TopicStat[];
}

/** Posts per topic, each post counted under its main topic. */
export default function TopicBarChart({ data }: TopicBarChartProps) {
  return (
    <ChartContainer
      config={topicChartConfig}
      className="aspect-auto h-(--chart-height) w-full"
      style={{ "--chart-height": "520px" }}
    >
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 38, left: 8, bottom: 0 }}>
        <CartesianGrid horizontal={false} stroke="var(--color-chalk)" />
        <XAxis type="number" hide />
        <YAxis
          dataKey="label"
          type="category"
          tickLine={false}
          axisLine={false}
          width={150}
          className="text-caption"
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="posts" fill="var(--color-posts)" radius={[0, 2, 2, 0]}>
          <LabelList
            dataKey="posts"
            position="right"
            className="fill-gravel text-label"
            formatter={formatChartLabel.number}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
