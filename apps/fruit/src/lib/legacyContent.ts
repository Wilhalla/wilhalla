// Reactions under a post come from the old Seniorennet blog as HTML without classes of their own,
// so their (smaller, sans) typography targets the elements from the wrapper. Post bodies use the
// shared reading typography (`prose` from @wilhalla/ui/lib/typography).
export const legacyContent = [
  "font-sans text-body-lg leading-body-lg text-cinder text-pretty",
  "[&_:is(p,ul,ol)]:my-0 [&>*+*]:mt-3",
  "[&_a]:text-obsidian [&_a]:underline [&_a]:decoration-fog [&_a]:decoration-1 [&_a]:underline-offset-4 [&_a:hover]:decoration-obsidian",
  "[&_img]:my-4 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg [&_img]:outline [&_img]:outline-1 [&_img]:-outline-offset-1 [&_img]:outline-obsidian/10",
].join(" ");
