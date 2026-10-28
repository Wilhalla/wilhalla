import type * as React from "react";

/**
 * Props every link component must accept. Shared components render plain <a> elements by
 * default; an app with a client-side router passes its own link through `linkComponent`
 * (e.g. a TanStack Router <Link> that maps `href` to `to`).
 */
export type LinkProps = React.ComponentProps<"a"> & { href: string };
export type LinkComponent = React.ComponentType<LinkProps>;

export function PlainLink({ children, ...props }: LinkProps) {
  return <a {...props}>{children}</a>;
}
