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
  /** Heading of a section inside a page that is not the page's main subject (related posts, reactions). */
  subsection: "m-0 font-heading text-heading-sm leading-heading-sm font-normal text-obsidian",
  /** Fine print, e.g. a source note in the footer. */
  caption: "font-sans text-caption leading-caption text-gravel",
} as const;

export const layout = {
  /** Page column: up to max-w-page wide with a 16px gutter on each side. */
  container: "mx-auto w-[calc(100%-2rem)] max-w-page",
} as const;

/**
 * Long-form reading text (blog posts, CMS pages): set on the wrapper of HTML you do not control.
 * EB Garamond at 20px with generous leading, a ~66 character measure, Dutch hyphenation (needs
 * `lang="nl"` on the page) and balanced last lines.
 */
export const prose = [
  "max-w-[66ch] font-heading text-[1.25rem] leading-[1.7] text-obsidian hyphens-auto [text-wrap:pretty]",
  "[&_:is(p,ul,ol,blockquote,figure,table)]:my-0 [&>*+*]:mt-[1.1em]",
  "[&_:is(h2,h3,h4)]:mt-[1.8em] [&_:is(h2,h3,h4)]:mb-0 [&_:is(h2,h3,h4)]:leading-heading [&_:is(h2,h3,h4)]:font-normal [&_:is(h2,h3,h4)]:text-balance",
  "[&_h2]:text-heading [&_h3]:text-heading-sm [&_h4]:text-subheading",
  "[&_:is(strong,b)]:font-semibold [&_em]:italic",
  "[&_a]:text-obsidian [&_a]:underline [&_a]:decoration-fog [&_a]:decoration-1 [&_a]:underline-offset-4 [&_a:hover]:decoration-obsidian",
  "[&_:is(ul,ol)]:pl-[1.2em] [&_ul]:list-disc [&_ol]:list-decimal [&_li+li]:mt-[0.35em] [&_li::marker]:text-gravel",
  "[&_blockquote]:border-l-2 [&_blockquote]:border-chalk [&_blockquote]:pl-[1em] [&_blockquote]:text-cinder [&_blockquote]:italic",
  "[&_img]:my-[1.6em] [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-image [&_img]:bg-powder",
  "[&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_table]:font-sans [&_table]:text-body [&_:is(td,th)]:border [&_:is(td,th)]:border-chalk [&_:is(td,th)]:px-2 [&_:is(td,th)]:py-1",
  "[&_code]:font-mono [&_code]:text-mono",
].join(" ");
