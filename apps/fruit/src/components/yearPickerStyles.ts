// The year column beside the long lists (timeline, archive, gallery). The timeline renders it as
// static links, the others as buttons (`YearSelector`); both use these classes.

/** The column: sticks under the header, a hairline between it and the list. */
export const yearPickerAsideClass =
  "sticky top-navbar self-start border-r border-chalk pr-2 md:pr-6";

/** Its content, scrolling on its own when the years do not fit the screen. */
export const yearPickerScrollClass = "max-h-below-navbar overflow-auto py-2 md:py-5";

/** "Jaren" above the years, on wide screens. */
export const yearPickerTitleClass =
  "m-0 font-sans text-body leading-body text-gravel max-md:sr-only";

export const yearPickerItemClass =
  "flex min-h-8 w-full items-center justify-center gap-3 whitespace-nowrap rounded-full px-2 text-center font-sans text-body text-gravel no-underline transition-colors duration-hover ease-out hover:bg-powder hover:text-obsidian data-[active=true]:bg-obsidian data-[active=true]:font-medium data-[active=true]:text-eggshell data-[active=true]:hover:bg-obsidian data-[active=true]:hover:text-eggshell md:justify-between md:px-3 md:text-left md:text-body-lg";

export const yearPickerCountClass = "hidden shrink-0 font-mono text-caption tabular-nums md:inline";
