import { typography } from "@wilhalla/ui/lib/typography";
import { cn } from "@wilhalla/ui/lib/utils";
import { ArrowRight, ArrowUpRight } from "lucide-react";

interface ContactLinkProps {
  label: string;
  detail: string;
  /** An `https:` or `mailto:` address. */
  href: string;
  /** Name of a brand mark in `public/icons`. */
  icon: "facebook" | "google-maps" | "instagram" | "outlook";
}

export function ContactLink({ label, detail, href, icon }: ContactLinkProps) {
  const opensSite = href.startsWith("http");
  const Arrow = opensSite ? ArrowUpRight : ArrowRight;

  return (
    <a
      href={href}
      target={opensSite ? "_blank" : undefined}
      rel={opensSite ? "noreferrer" : undefined}
      className="group flex min-h-14 items-center justify-between gap-4 rounded-2xl px-3 py-2.5 text-obsidian no-underline transition-colors duration-hover ease-out hover:bg-powder focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-obsidian"
    >
      <span className="flex min-w-0 items-center gap-3">
        <img src={`/icons/${icon}.svg`} alt="" className="m-1.5 size-6 shrink-0" />
        <span className="grid min-w-0 gap-0.5">
          <span className="font-heading text-heading-sm leading-heading-sm">{label}</span>
          <span className={cn(typography.small, "truncate text-gravel")}>{detail}</span>
        </span>
      </span>
      <Arrow
        aria-hidden="true"
        className="size-4 shrink-0 text-gravel transition-transform duration-hover ease-out group-hover:translate-x-0.5 group-hover:text-obsidian"
        strokeWidth={1.5}
      />
    </a>
  );
}
