/**
 * Class recipes for the Wilhalla type styles, usable from React (`className`) and Astro
 * (`class`). Combine with extra utilities through `cn()`:
 *
 *   <h1 className={cn(typography.display, "mt-4 max-w-5xl")}>
 */
export const typography = {
  /** Page title; scales from 36px on phones to 48px. */
  display:
    "m-0 font-heading text-display-fluid leading-display font-light tracking-display text-obsidian",
  /** Section title inside a page; scales from 32px to 36px. */
  section:
    "m-0 font-heading text-heading-lg-fluid leading-heading-lg font-light tracking-heading-lg text-obsidian",
  /** Smaller heading: card and teaser titles. */
  heading:
    "m-0 font-heading text-heading leading-heading font-light tracking-heading text-obsidian",
  /** Intro under a page or section title. */
  intro: "font-sans text-body-lg leading-body-lg tracking-ui text-cinder",
  /** Short line under a section title. */
  kicker: "mt-4 max-w-readable font-sans text-body-lg leading-body-lg tracking-ui text-gravel",
  /** Running text. */
  body: "font-sans text-body-lg leading-body-lg tracking-ui",
  /** Secondary text and labels. */
  small: "font-sans text-body leading-body tracking-ui",
  /** Small grey line above a title: date, author, section name. */
  eyebrow: "m-0 font-sans text-body leading-body font-normal tracking-ui text-gravel",
  /** Fine print, e.g. a source note in the footer. */
  caption: "font-sans text-caption leading-caption text-gravel",
} as const;

export const layout = {
  /** Page column: up to max-w-page wide with a 16px gutter on each side. */
  container: "mx-auto w-[calc(100%-2rem)] max-w-page",
} as const;
