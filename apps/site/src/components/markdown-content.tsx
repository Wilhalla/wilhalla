// biome-ignore-all lint/security/noDangerouslySetInnerHtml: Content Collections compiles trusted repository Markdown at build time.

type MarkdownContentProps = {
  html: string;
};

export function MarkdownContent({ html }: MarkdownContentProps) {
  return (
    <div
      className="markdown-editorial space-y-6"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
