/** Number and short-date formatting for nl-BE, shared by every page. */
export const WEEKDAY_LABELS = ["zo", "ma", "di", "wo", "do", "vr", "za"] as const;
export const MONTH_LABELS = [
  "jan",
  "feb",
  "mrt",
  "apr",
  "mei",
  "jun",
  "jul",
  "aug",
  "sep",
  "okt",
  "nov",
  "dec",
] as const;

const numberFormatter = new Intl.NumberFormat("nl-BE");
const compactFormatter = new Intl.NumberFormat("nl-BE", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const metricFormatter = new Intl.NumberFormat("nl-BE", { maximumFractionDigits: 1 });
const dayFormatter = new Intl.DateTimeFormat("nl-BE", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function formatNumber(value: number) {
  return numberFormatter.format(value);
}

export function formatCompact(value: number) {
  return compactFormatter.format(value);
}

export function formatMetric(value: number) {
  return metricFormatter.format(value);
}

/** "8 apr 2020" for a `YYYY-MM-DD` day. */
export function formatDay(isoDay: string) {
  return dayFormatter.format(new Date(`${isoDay}T00:00:00`));
}

export function pct(value: number, total: number) {
  if (!total) return "0%";
  return `${Math.round((value / total) * 100)}%`;
}
