import "react";

// CSS custom properties in `style`: dynamic values reach utilities such as `h-(--total-size)`.
declare module "react" {
  interface CSSProperties {
    [property: `--${string}`]: string | number | undefined;
  }
}
