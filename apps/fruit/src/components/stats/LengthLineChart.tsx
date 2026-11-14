import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@wilhalla/ui/components/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import type { YearStat } from "../../lib/archiveStatsTypes";
import { formatChartLabel } from "./chartLabels";
import { densityChartConfig } from "./statsChartConfig";

interface LengthLineChartProps {
  data: YearStat[];
}

/** Average length of a post per year, in characters. */
export default function LengthLineChart({ data }: LengthLineChartProps) {
  return (
    <ChartContainer
      config={densityChartConfig}
      className="aspect-auto h-(--chart-height) w-full"
      style={{ "--chart-height": "300px" }}
    >
      <LineChart data={data} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--color-chalk)" />
        <XAxis dataKey="year" tickLine={false} axisLine={false} interval="preserveStartEnd" />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={44}
          tickFormatter={formatChartLabel.compact}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line dataKey="avgChars" stroke="var(--color-avgChars)" strokeWidth={2} dot={false} />
      </LineChart>
    </ChartContainer>
  );
}
