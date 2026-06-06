type MarkdownContentProps = {
  html: string;
};

export function MarkdownContent({ html }: MarkdownContentProps) {
  return (
    <div
      className="markdown-editorial space-y-6"
      // Markdown files are trusted repository content compiled at build time by
      // Content Collections, not arbitrary user-supplied runtime HTML.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
