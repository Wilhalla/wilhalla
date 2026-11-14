import { typography } from "@wilhalla/ui/lib/typography";
import { cn } from "@wilhalla/ui/lib/utils";
import type { LucideIcon } from "lucide-react";

interface KpiProps {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
}

export default function Kpi({ label, value, detail, icon: Icon }: KpiProps) {
  return (
    <div className="border-t border-chalk pt-4">
      <div className="mb-5 flex items-center justify-between gap-3 text-gravel">
        <span className="font-sans text-body leading-body">{label}</span>
        <Icon className="size-4" aria-hidden="true" />
      </div>
      <div className="font-heading text-heading leading-heading font-light tracking-heading text-obsidian tabular-nums md:text-heading-lg md:leading-heading-lg">
        {value}
      </div>
      <p className={cn(typography.small, "m-0 mt-3 max-w-60 text-gravel")}>{detail}</p>
    </div>
  );
}
