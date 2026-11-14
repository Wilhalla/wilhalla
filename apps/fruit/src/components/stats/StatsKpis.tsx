import { CalendarDays, Image, MessageCircle, Ruler } from "lucide-react";
import type { ArchiveStatsData } from "../../lib/archiveStatsTypes";
import { formatCompact, formatNumber, pct } from "../../lib/format";
import Kpi from "./Kpi";

interface StatsKpisProps {
  totals: ArchiveStatsData["totals"];
}

export default function StatsKpis({ totals }: StatsKpisProps) {
  return (
    <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-4" aria-label="Kerncijfers">
      <Kpi
        icon={CalendarDays}
        label="Berichten"
        value={formatNumber(totals.posts)}
        detail={`${formatNumber(totals.activeYears)} jaar, gemiddeld om de ${totals.avgDaysBetweenActiveDays} dagen een bericht.`}
      />
      <Kpi
        icon={Image}
        label="Beelden"
        value={formatNumber(totals.images)}
        detail={`${pct(totals.illustratedPosts, totals.posts)} van de berichten heeft foto's.`}
      />
      <Kpi
        icon={MessageCircle}
        label="Reacties"
        value={formatNumber(totals.reactions)}
        detail={`${pct(totals.reactedPosts, totals.posts)} van de berichten kreeg een reactie.`}
      />
      <Kpi
        icon={Ruler}
        label="Woorden"
        value={formatCompact(totals.words)}
        detail={`${formatCompact(totals.chars)} tekens. De langste berichten tellen meer dan ${formatNumber(totals.p95Chars)} tekens.`}
      />
    </section>
  );
}
