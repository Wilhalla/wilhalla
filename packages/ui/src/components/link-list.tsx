import { ArrowRight } from "lucide-react";
import type * as React from "react";

import { typography } from "../lib/typography";
import { cn } from "../lib/utils";
import { PlainLink, type LinkComponent } from "./link";

/**
 * A list of links to other pages, one row each: optional thumbnail, a small line above the title
 * (date, kind), the title and an optional one-line description. Quieter and denser than cards.
 */
function LinkList({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="link-list"
      className={cn("m-0 grid list-none border-t border-chalk p-0", className)}
      {...props}
    />
  );
}

type LinkListItemProps = {
  href: string;
  title: React.ReactNode;
  eyebrow?: React.ReactNode;
  description?: React.ReactNode;
  /** A square thumbnail (an `<img>`), shown at 4rem. */
  media?: React.ReactNode;
  /** Shown at the end of the row; defaults to an arrow. Pass `null` for none. */
  trailing?: React.ReactNode;
  linkComponent?: LinkComponent;
};

function LinkListItem({
  href,
  title,
  eyebrow,
  description,
  media,
  trailing = <ArrowRight className="size-4" strokeWidth={1.5} />,
  linkComponent: Link = PlainLink,
}: LinkListItemProps) {
  return (
    <li className="border-b border-chalk">
      <Link
        href={href}
        className="group flex items-center gap-4 py-4 text-obsidian no-underline transition-colors duration-150 hover:bg-powder/60 focus-visible:bg-powder/60 focus-visible:outline-none md:-mx-3 md:rounded-lg md:px-3"
      >
        {media && (
          <span className="size-16 shrink-0 overflow-hidden rounded-lg bg-powder [&>img]:size-full [&>img]:object-cover">
            {media}
          </span>
        )}
        <span className="grid min-w-0 flex-1 gap-1">
          {eyebrow && <span className={cn(typography.small, "text-gravel")}>{eyebrow}</span>}
          <span className="font-heading text-heading-sm leading-heading-sm text-balance">
            {title}
          </span>
          {description && (
            <span className={cn(typography.small, "line-clamp-1 text-cinder")}>{description}</span>
          )}
        </span>
        {trailing && (
          <span
            aria-hidden="true"
            className="shrink-0 text-gravel transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:text-obsidian"
          >
            {trailing}
          </span>
        )}
      </Link>
    </li>
  );
}

export { LinkList, LinkListItem };
