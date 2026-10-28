import type { LinkProps } from "@wilhalla/ui/components/link";
import { Link } from "@tanstack/react-router";

/** Lets shared @wilhalla/ui components navigate with TanStack Router instead of a full reload. */
export function RouterLink({ href, ...props }: LinkProps) {
  return <Link to={href} {...props} />;
}
