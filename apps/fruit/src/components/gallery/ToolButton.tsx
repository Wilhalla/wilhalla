import { Button } from "@wilhalla/ui/components/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@wilhalla/ui/components/tooltip";
import type { ComponentProps } from "react";

/** An icon button of the viewer's toolbar: the label names it for everyone, as tooltip and aria-label. */
export default function ToolButton({
  label,
  children,
  ...props
}: ComponentProps<typeof Button> & { label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={label} {...props}>
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
}
