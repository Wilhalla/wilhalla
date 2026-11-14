import { formatCompact, formatMetric, formatNumber } from "../../lib/format";

/** recharts hands a label formatter any value; numbers are formatted, the rest shown as is. */
const labelFormatter = (format: (value: number) => string) => (value: unknown) =>
  typeof value === "number" ? format(value) : String(value ?? "");

export const formatChartLabel = {
  number: labelFormatter(formatNumber),
  compact: labelFormatter(formatCompact),
  metric: labelFormatter(formatMetric),
};

export type ChartLabelFormat = keyof typeof formatChartLabel;
