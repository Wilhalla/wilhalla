import type { ChartConfig } from "@wilhalla/ui/components/chart";

export const yearChartConfig = {
  posts: { label: "Berichten", color: "var(--color-cinder)" },
  images: { label: "Beelden", color: "var(--color-slate)" },
  reactions: { label: "Reacties", color: "var(--color-ember)" },
} satisfies ChartConfig;

export const postChartConfig = {
  posts: { label: "Berichten", color: "var(--color-cinder)" },
} satisfies ChartConfig;

export const topicChartConfig = {
  posts: { label: "Berichten", color: "var(--color-cinder)" },
  images: { label: "Beelden", color: "var(--color-slate)" },
} satisfies ChartConfig;

export const densityChartConfig = {
  avgChars: { label: "Gem. tekens", color: "var(--color-signal-blue)" },
} satisfies ChartConfig;

export const valueChartConfig = {
  value: { label: "Waarde", color: "var(--color-cinder)" },
} satisfies ChartConfig;
