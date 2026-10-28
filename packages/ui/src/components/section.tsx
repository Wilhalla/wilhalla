import type * as React from "react";

import { typography } from "../lib/typography";
import { cn } from "../lib/utils";
import { Container } from "./container";

/** A band of a page with a hairline above it; every section of every page uses the same rhythm. */
function Section({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <Container asChild className={cn("border-t border-chalk py-12 md:py-16", className)}>
      <section data-slot="section" {...props} />
    </Container>
  );
}

type SectionHeaderProps = {
  /** Used as the `id` of the heading, for `aria-labelledby` on the section. */
  id?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  /** `section` for a page's main sections, `subsection` for supporting ones. */
  level?: "section" | "subsection";
  className?: string;
};

function SectionHeader({
  id,
  title,
  description,
  action,
  level = "section",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 md:mb-8",
        className,
      )}
    >
      <div className="grid max-w-2xl gap-2">
        <h2 id={id} className={typography[level]}>
          {title}
        </h2>
        {description && <p className={cn(typography.small, "m-0 text-gravel")}>{description}</p>}
      </div>
      {action}
    </div>
  );
}

export { Section, SectionHeader };
