import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@wilhalla/ui/components/chart";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import type { BarDatum } from "../../lib/archiveStatsTypes";
import { formatChartLabel, type ChartLabelFormat } from "./chartLabels";
import { valueChartConfig } from "./statsChartConfig";

interface ValueBarChartProps {
  data: BarDatum[];
  height: number;
  labelWidth: number;
  format?: ChartLabelFormat;
}

/** A ranked list as horizontal bars. */
export default function ValueBarChart({
  data,
  height,
  labelWidth,
  format = "metric",
}: ValueBarChartProps) {
  return (
    <ChartContainer
      config={valueChartConfig}
      className="aspect-auto h-(--chart-height) w-full"
      style={{ "--chart-height": `${height}px` }}
    >
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 42, left: 0, bottom: 0 }}>
        <CartesianGrid horizontal={false} stroke="var(--color-chalk)" />
        <XAxis type="number" hide />
        <YAxis
          dataKey="label"
          type="category"
          tickLine={false}
          axisLine={false}
          width={labelWidth}
          className="text-caption"
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="value" fill="var(--color-value)" radius={[0, 2, 2, 0]}>
          <LabelList
            dataKey="value"
            position="right"
            className="fill-gravel text-label"
            formatter={formatChartLabel[format]}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
