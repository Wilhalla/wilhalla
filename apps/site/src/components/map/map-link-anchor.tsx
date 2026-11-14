import type { MapLink } from "@/types";
import { Link } from "@tanstack/react-router";
import type { ComponentProps } from "react";

type MapLinkAnchorProps = Omit<ComponentProps<"a">, "href" | "target" | "rel"> & { link: MapLink };

/** The one place that knows a map link is either a route of this site or another website. */
export function MapLinkAnchor({ link, children, ...props }: MapLinkAnchorProps) {
  return "to" in link ? (
    <Link to={link.to} {...props}>
      {children}
    </Link>
  ) : (
    <a
      href={link.href}
      target={link.newTab ? "_blank" : undefined}
      rel={link.newTab ? "noreferrer" : undefined}
      {...props}
    >
      {children}
    </a>
  );
}
