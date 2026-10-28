import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { Toggle as TogglePrimitive } from "radix-ui";

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-sans text-sm font-medium whitespace-nowrap text-cinder transition-[color,background-color,box-shadow] duration-150 ease-out outline-none hover:text-obsidian focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-pure-surface data-[state=on]:text-obsidian data-[state=on]:shadow-subtle-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-chalk bg-transparent hover:bg-powder",
      },
      size: {
        default: "h-8 min-w-8 px-3",
        sm: "h-7 min-w-7 px-2.5",
        lg: "h-10 min-w-10 px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
