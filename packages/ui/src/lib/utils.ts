import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge must know the theme's custom steps (tokens.css), or it mistakes `text-body`
// for a text colour and drops it next to `text-gravel`.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        "caption",
        "label",
        "mono",
        "display-fluid",
        "heading-lg-fluid",
        "body",
        "body-lg",
        "subheading",
        "heading-sm",
        "heading-md",
        "heading",
        "heading-lg",
        "display",
        "numeral",
        "reading",
        "prose",
        "map-card",
        "map-card-link",
        "map-place",
      ],
      leading: [
        "caption",
        "mono",
        "body",
        "body-lg",
        "subheading",
        "heading-sm",
        "heading-md",
        "heading",
        "heading-lg",
        "display",
        "numeral",
        "reading",
        "prose",
        "map-card",
        "map-card-link",
        "map-place",
      ],
      tracking: ["ui", "caps", "heading-md", "heading", "heading-lg", "display", "numeral"],
      spacing: ["navbar", "below-navbar", "stage", "safe"],
      container: ["page", "readable", "editorial", "prose", "column"],
      shadow: ["subtle", "subtle-2", "subtle-4", "subtle-7", "map-float", "map-hint"],
      radius: ["image", "map-card"],
      "drop-shadow": ["map-label", "on-image"],
      "text-shadow": ["map-emboss"],
      ease: ["enter", "exit", "move"],
    },
    classGroups: {
      "grid-cols": [{ "grid-cols": ["bar", "cards", "sidebar", "rail", "aside", "split"] }],
      duration: [{ duration: ["hover", "enter", "exit", "reveal", "move", "glow"] }],
      delay: [{ delay: ["reveal", "stagger"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
