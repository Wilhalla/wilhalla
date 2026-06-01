import type { ReactNode } from "react";

type MarkdownContentProps = {
  markdown: string;
};

const linkClasses = "";

export function MarkdownContent({ markdown }: MarkdownContentProps) {
  const blocks = markdown
    .trim()
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="markdown-editorial space-y-6">
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
}

function renderBlock(block: string, key: number) {
  const heading = /^(#{2,6})\s+(.+)$/.exec(block);
  if (heading) {
    const Tag = `h${heading[1].length}` as "h2" | "h3" | "h4" | "h5" | "h6";

    return (
      <Tag key={key} className="el-heading-sm pt-4 text-obsidian">
        {parseInline(heading[2])}
      </Tag>
    );
  }

  const lines = block
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.every((line) => /^[-*]\s+/.test(line))) {
    return (
      <ul key={key}>
        {lines.map((line) => (
          <li key={`${key}-${line}`}>
            {parseInline(line.replace(/^[-*]\s+/, ""))}
          </li>
        ))}
      </ul>
    );
  }

  return <p key={key}>{parseInline(lines.join(" "))}</p>;
}

function parseInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const nextLink = remaining.indexOf("[");
    const nextBold = remaining.indexOf("**");
    const nextItalic = remaining.indexOf("*");
    const next = [nextLink, nextBold, nextItalic]
      .filter((index) => index >= 0)
      .sort((a, b) => a - b)[0];

    if (next === undefined) {
      nodes.push(unescapeMarkdown(remaining));
      break;
    }

    if (next > 0) {
      nodes.push(unescapeMarkdown(remaining.slice(0, next)));
      remaining = remaining.slice(next);
      continue;
    }

    const link = /^\[([^\]]+)\]\(([^)]+)\)/.exec(remaining);
    if (link) {
      const href = unescapeMarkdown(link[2]);
      const external = isExternalSiteHref(href);
      nodes.push(
        <a
          key={key++}
          href={href}
          className={linkClasses}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
        >
          {parseInline(link[1])}
        </a>,
      );
      remaining = remaining.slice(link[0].length);
      continue;
    }

    const bold = /^\*\*([^*]+)\*\*/.exec(remaining);
    if (bold) {
      nodes.push(<strong key={key++}>{parseInline(bold[1])}</strong>);
      remaining = remaining.slice(bold[0].length);
      continue;
    }

    const italic = /^\*([^*]+)\*/.exec(remaining);
    if (italic) {
      nodes.push(<em key={key++}>{parseInline(italic[1])}</em>);
      remaining = remaining.slice(italic[0].length);
      continue;
    }

    nodes.push(unescapeMarkdown(remaining[0]));
    remaining = remaining.slice(1);
  }

  return nodes;
}

function isExternalSiteHref(href: string) {
  return /^(https?:)?\/\//i.test(href);
}

function unescapeMarkdown(text: string) {
  return text.replace(/\\([_&])/g, "$1");
}
