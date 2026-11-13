// PROTOTYPE (site/prototype/homepage-map): floating variant switcher, development builds only.
import { Button } from "@wilhalla/ui/components/button";
import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";

export type VariantOption = { key: string; name: string };

export function PrototypeSwitcher({
  variants,
  current,
}: {
  variants: VariantOption[];
  current: string;
}) {
  const navigate = useNavigate({ from: "/" });
  const index = Math.max(
    0,
    variants.findIndex((variant) => variant.key === current),
  );
  const go = (step: number) => {
    const next = variants[(index + step + variants.length) % variants.length];
    void navigate({ search: { variant: next.key }, replace: true });
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, [contenteditable]")) return;
      if (event.key === "ArrowLeft") go(-1);
      if (event.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!import.meta.env.DEV) return null;

  const variant = variants[index];
  return (
    <div className="fixed top-16 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full bg-signal-blue p-1 font-mono text-label text-pure-surface shadow-subtle-4">
      <Button size="icon-sm" variant="ghost" aria-label="Vorige variant" onClick={() => go(-1)}>
        <ChevronLeft />
      </Button>
      <span className="px-2 whitespace-nowrap">
        PROTOTYPE {variant.key} · {variant.name}
      </span>
      <Button size="icon-sm" variant="ghost" aria-label="Volgende variant" onClick={() => go(1)}>
        <ChevronRight />
      </Button>
    </div>
  );
}
