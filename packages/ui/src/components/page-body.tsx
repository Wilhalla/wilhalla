import type * as React from "react";

import { cn } from "../lib/utils";
import { Container } from "./container";

/**
 * The content of a page under its `PageHeader`: the page column with the standard space above
 * and below. The header draws the hairline, so the body has none; further bands are `Section`s.
 */
function PageBody({ className, ...props }: React.ComponentProps<"div">) {
  return <Container data-slot="page-body" className={cn("py-10 md:py-16", className)} {...props} />;
}

export { PageBody };
