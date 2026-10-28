import type * as React from "react";
import { Slot } from "radix-ui";

import { layout } from "../lib/typography";
import { cn } from "../lib/utils";

/** Page-width column with a 16px gutter on each side (max-w-page). */
function Container({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div";
  return <Comp data-slot="container" className={cn(layout.container, className)} {...props} />;
}

export { Container };
