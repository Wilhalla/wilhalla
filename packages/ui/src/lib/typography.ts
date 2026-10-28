/**
 * Class recipes for the editorial type styles, usable from React (`className`) and Astro
 * (`class`). Combine with extra utilities through `cn()`:
 *
 *   <h1 className={cn(typography.display, "mt-4 max-w-5xl")}>
 */
export const typography = {
  /** Small grey line above a title: date, author, section name. */
  eyebrow: "m-0 font-sans text-body leading-body font-normal tracking-[0.01em] text-gravel",
  /** Page title. */
  display:
    "m-0 font-heading text-display leading-display font-light tracking-display text-obsidian",
  /** Section title inside a page. */
  section:
    "m-0 font-heading text-heading-lg leading-heading-lg font-light tracking-heading-lg text-obsidian",
  /** Short intro under a section title. */
  kicker:
    "mt-4 max-w-readable font-sans text-body-lg leading-body-lg tracking-[0.01em] text-gravel",
  /** Fine print, e.g. a source note in the footer. */
  caption: "text-caption leading-caption text-gravel",
} as const;

export const layout = {
  /** Page column with inner padding (fruit's shell); `Container` is the gutter-only variant. */
  shell: "mx-auto w-full max-w-page px-8 max-md:px-4",
} as const;
