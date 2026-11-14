import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { typography } from "../lib/typography";
import { cn } from "../lib/utils";
import { Container } from "./container";

const pageHeaderVariants = cva("", {
  variants: {
    size: {
      /** Landing pages of the site: airy, title and intro side by side; the hairline closes it. */
      hero: "pt-20 md:pt-28",
      /** Pages inside an app (lists, tools, articles): compact, one column. */
      page: "pt-10 pb-8 md:pt-14 md:pb-10",
    },
  },
  defaultVariants: { size: "hero" },
});

type PageHeaderProps = VariantProps<typeof pageHeaderVariants> & {
  title: React.ReactNode;
  intro?: React.ReactNode;
  /** Small line under the intro: counts, dates. */
  meta?: React.ReactNode;
  /** Controls aligned to the end of the header on wide screens. */
  actions?: React.ReactNode;
  className?: string;
};

export function PageHeader({ title, intro, meta, actions, size, className }: PageHeaderProps) {
  if (size === "page") {
    return (
      <Container asChild className={cn(pageHeaderVariants({ size }), className)}>
        <header className="flex flex-col gap-6 border-b border-chalk md:flex-row md:items-end md:justify-between">
          <div className="grid max-w-3xl min-w-0 gap-3">
            <h1 className={cn(typography.display, "text-balance")}>{title}</h1>
            {intro && <p className={cn(typography.intro, "m-0 max-w-2xl")}>{intro}</p>}
            {meta && <p className={cn(typography.small, "m-0 text-gravel")}>{meta}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </header>
      </Container>
    );
  }
  return (
    <Container asChild className={cn(pageHeaderVariants({ size }), className)}>
      <header>
        <div className="border-b border-chalk pb-10 md:pb-14">
          <div className="grid gap-6 md:grid-cols-12 md:items-end">
            <h1 className={cn(typography.display, "text-balance md:col-span-7")}>{title}</h1>
            {intro && (
              <p className={cn(typography.intro, "m-0 max-w-xl md:col-span-5 md:pb-1")}>{intro}</p>
            )}
          </div>
          {(meta || actions) && (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {meta && <p className={cn(typography.small, "m-0 text-gravel")}>{meta}</p>}
              {actions}
            </div>
          )}
        </div>
      </header>
    </Container>
  );
}
