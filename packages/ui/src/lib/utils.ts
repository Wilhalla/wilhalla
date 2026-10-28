import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge must know the theme's custom steps (tokens.css), or it mistakes `text-body`
// for a text colour and drops it next to `text-gravel`.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        "caption",
        "body",
        "body-lg",
        "subheading",
        "heading-sm",
        "heading",
        "heading-lg",
        "display",
      ],
      leading: [
        "caption",
        "body",
        "body-lg",
        "subheading",
        "heading-sm",
        "heading",
        "heading-lg",
        "display",
      ],
      tracking: ["heading", "heading-lg", "display"],
      shadow: ["subtle", "subtle-2", "subtle-4", "subtle-7"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
