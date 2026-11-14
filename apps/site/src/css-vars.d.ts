import "react";

declare module "react" {
  // Dynamic values reach Tailwind through CSS custom properties: style={{ "--x": value }}.
  interface CSSProperties {
    [property: `--${string}`]: string | number | undefined;
  }
}
