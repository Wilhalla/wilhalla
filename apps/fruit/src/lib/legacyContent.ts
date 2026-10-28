// Archive post and reaction HTML comes from the old Seniorennet blog and has no classes of its
// own, so its typography targets the elements from the wrapper.
export const legacyContent = [
  "text-body-lg leading-body-lg text-obsidian",
  "[&_:is(p,h2,h3,h4,ul,ol)]:mt-0 [&_:is(p,h2,h3,h4,ul,ol)]:mb-4",
  "[&_:is(h2,h3,h4)]:font-heading [&_:is(h2,h3,h4)]:leading-heading [&_:is(h2,h3,h4)]:font-light [&_:is(h2,h3,h4)]:tracking-heading",
  "[&_img]:my-5 [&_img]:h-auto [&_img]:w-full",
  "[&_table]:block [&_table]:max-w-full [&_table]:border-collapse [&_table]:overflow-x-auto",
  "[&_:is(td,th)]:border [&_:is(td,th)]:border-chalk [&_:is(td,th)]:p-2",
].join(" ");
