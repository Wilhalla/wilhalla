import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@wilhalla/ui/components/chart";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import { formatChartLabel } from "./chartLabels";
import { postChartConfig } from "./statsChartConfig";

const sizes = {
  large: { height: 300, top: 24 },
  small: { height: 210, top: 20 },
} as const;

interface PostsBarChartProps {
  data: { label: string; posts: number }[];
  size: keyof typeof sizes;
}

/** Number of posts per labelled bucket (a month, a length class). */
export default function PostsBarChart({ data, size }: PostsBarChartProps) {
  const { height, top } = sizes[size];

  return (
    <ChartContainer
      config={postChartConfig}
      className="aspect-auto h-(--chart-height) w-full"
      style={{ "--chart-height": `${height}px` }}
    >
      <BarChart data={data} margin={{ top, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--color-chalk)" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} />
        <YAxis hide />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="posts" fill="var(--color-posts)" radius={[2, 2, 0, 0]}>
          <LabelList
            dataKey="posts"
            position="top"
            className="fill-gravel text-label"
            formatter={formatChartLabel.compact}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
