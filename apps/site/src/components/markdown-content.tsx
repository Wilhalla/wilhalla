// biome-ignore-all lint/security/noDangerouslySetInnerHtml: Content Collections compiles trusted repository Markdown at build time.

type MarkdownContentProps = {
  html: string;
};

// CMS-authored HTML has no classes of its own, so the editorial typography targets its elements.
const editorial = [
  "max-w-editorial space-y-6 font-sans text-reading leading-reading text-cinder",
  "[&_:is(h2,h3,h4,h5,h6)]:mt-10",
  "[&_strong]:font-semibold [&_strong]:text-obsidian [&_em]:text-cinder [&_code]:font-mono",
  "[&_a]:text-obsidian [&_a]:underline [&_a]:decoration-fog [&_a]:decoration-1 [&_a]:underline-offset-4",
  "[&_a]:transition-[background-color,text-decoration-color] [&_a]:duration-hover [&_a]:ease-out",
  "[&_a:hover]:bg-powder [&_a:hover]:decoration-obsidian",
  "[&_li]:border-t [&_li]:border-chalk [&_li]:py-3",
  "[&_img]:block [&_img]:h-auto [&_img]:max-h-180 [&_img]:w-full [&_img]:rounded-image [&_img]:bg-powder [&_img]:object-cover",
].join(" ");

export function MarkdownContent({ html }: MarkdownContentProps) {
  return <div className={editorial} dangerouslySetInnerHTML={{ __html: html }} />;
}
