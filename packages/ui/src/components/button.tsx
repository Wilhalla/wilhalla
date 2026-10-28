import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "../lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full font-sans text-sm font-medium tracking-ui transition-[transform,background-color,color,box-shadow,opacity] duration-150 ease-out active:not-disabled:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "border border-chalk bg-obsidian text-eggshell shadow-subtle-2 hover:-translate-y-0.5 aria-expanded:-translate-y-0.5",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 aria-expanded:bg-destructive/90 focus-visible:ring-destructive/20",
        outline:
          "border border-chalk bg-pure-surface text-obsidian shadow-subtle-2 hover:-translate-y-0.5 hover:bg-powder aria-expanded:-translate-y-0.5 aria-expanded:bg-powder",
        secondary:
          "border border-chalk bg-powder text-obsidian hover:bg-pure-surface aria-expanded:bg-pure-surface",
        ghost: "text-obsidian hover:bg-powder aria-expanded:bg-powder",
        link: "text-obsidian underline decoration-chalk underline-offset-4 hover:decoration-obsidian",
        /** On photos and dark overlays (slideshow, viewer). */
        inverse:
          "border border-eggshell/25 bg-obsidian/55 text-eggshell backdrop-blur hover:bg-obsidian/75 aria-pressed:bg-eggshell/15 disabled:opacity-30",
      },
      size: {
        default: "h-[34px] px-4 has-[>svg]:px-3",
        xs: "h-6 gap-1 px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
        /** An action inside running text, e.g. "toon alles" after a sentence. */
        inline: "h-auto gap-1 p-0 align-baseline",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    /** Render the single child (e.g. a link) with the button's styling instead of a <button>. */
    asChild?: boolean;
  };

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants, type ButtonProps };
