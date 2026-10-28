import type { ReactNode } from "react";

export type Story = {
  id: string;
  title: string;
  /** Import path apps use, shown next to the title. */
  source: string;
  description: string;
  render: () => ReactNode;
};

/** One labelled example inside a story. */
export function Example({ label, children }: { label: string; children: ReactNode }) {
  return (
    <figure className="m-0 flex min-w-0 flex-col gap-3">
      <figcaption className="font-mono text-xs text-gravel">{label}</figcaption>
      <div className="flex min-h-12 flex-wrap items-center gap-3">{children}</div>
    </figure>
  );
}

/** A grid of examples; `wide` gives each example the full row. */
export function Examples({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? "grid gap-8" : "grid gap-8 sm:grid-cols-2 xl:grid-cols-3"}>
      {children}
    </div>
  );
}

/** A full-width preview surface for layout components that bring their own page width. */
export function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="w-full overflow-hidden rounded-2xl bg-background shadow-subtle-2">
      {children}
    </div>
  );
}
