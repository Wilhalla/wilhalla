import type * as React from "react";
import { Slot } from "radix-ui";

import { cn } from "../lib/utils";

/** Page-width column with a 16px gutter on each side (max-w-page). */
function Container({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-slot="container"
      className={cn("mx-auto w-[calc(100%-2rem)] max-w-page", className)}
      {...props}
    />
  );
}

export { Container };
