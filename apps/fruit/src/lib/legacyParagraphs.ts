import * as cheerio from "cheerio";
import type { AnyNode, Element } from "domhandler";

// Seniorennet's editor wrote posts as one run of text with <br> between paragraphs, often wrapped
// in bare <div>s. This turns those runs into real <p> elements so the reading typography can space
// them. A single <br> between short lines (addresses, photo captions) stays a line break.

const INLINE_TAGS = new Set([
  "a",
  "abbr",
  "b",
  "big",
  "br",
  "cite",
  "code",
  "del",
  "em",
  "font",
  "i",
  "img",
  "ins",
  "mark",
  "q",
  "s",
  "small",
  "span",
  "strike",
  "strong",
  "sub",
  "sup",
  "u",
  "wbr",
]);

/** Wrappers without meaning of their own; their content is lifted into the parent. */
const TRANSPARENT_TAGS = new Set(["article", "center", "div", "section"]);

/** A line at least this long reads as prose, so a single <br> next to it starts a new paragraph. */
const PROSE_LINE_LENGTH = 60;

type Line = { nodes: AnyNode[]; text: string; image: boolean };

function tagName(node: AnyNode) {
  return node.type === "tag" ? (node as Element).name.toLowerCase() : "";
}

function isInline(node: AnyNode) {
  return node.type === "text" || (node.type === "tag" && INLINE_TAGS.has(tagName(node)));
}

function isStandaloneImage($: cheerio.CheerioAPI, node: AnyNode) {
  const name = tagName(node);
  if (name === "img") return true;
  return name === "a" && $(node).find("img").length > 0 && $(node).text().trim() === "";
}

function splitLines($: cheerio.CheerioAPI, nodes: AnyNode[]) {
  // Each entry is a line plus the number of <br>s that ended it.
  const lines: Array<Line & { breaks: number }> = [];
  let current: AnyNode[] = [];
  const flush = () => {
    const text = $(current).text().replace(/\s+/g, " ").trim();
    const image = $(current).find("img").addBack("img").length > 0;
    if (text || image) lines.push({ nodes: current, text, image, breaks: 0 });
    current = [];
  };
  for (const node of nodes) {
    if (tagName(node) === "br") {
      flush();
      if (lines.length > 0) lines[lines.length - 1].breaks += 1;
      continue;
    }
    if (isStandaloneImage($, node)) {
      // A photo (or a linked photo) never shares a paragraph with the text around it.
      flush();
      current.push(node);
      flush();
      continue;
    }
    current.push(node);
  }
  flush();
  return lines;
}

function startsParagraph(previous: Line & { breaks: number }, next: Line) {
  if (previous.breaks >= 2 || previous.image || next.image) return true;
  return previous.text.length >= PROSE_LINE_LENGTH || next.text.length >= PROSE_LINE_LENGTH;
}

function paragraphsHtml($: cheerio.CheerioAPI, nodes: AnyNode[]) {
  const lines = splitLines($, nodes);
  const paragraphs: Line[][] = [];
  lines.forEach((line, index) => {
    if (index === 0 || startsParagraph(lines[index - 1], line)) paragraphs.push([line]);
    else paragraphs[paragraphs.length - 1].push(line);
  });
  return paragraphs
    .map((paragraph) => {
      const inner = paragraph
        .map((line) =>
          line.nodes
            .map((node) => $.html(node))
            .join("")
            .trim(),
        )
        .join("<br>");
      return `<p>${inner}</p>`;
    })
    .join("\n");
}

/** Rewrites the children of `parent`: inline runs become paragraphs, wrappers are unwrapped. */
function paragraphizeChildren($: cheerio.CheerioAPI, parent: AnyNode[]): string {
  const out: string[] = [];
  let run: AnyNode[] = [];
  const flushRun = () => {
    if (run.length > 0) out.push(paragraphsHtml($, run));
    run = [];
  };
  for (const node of parent) {
    if (node.type === "comment") continue;
    if (isInline(node)) {
      run.push(node);
      continue;
    }
    flushRun();
    const name = tagName(node);
    const element = node as Element;
    if (TRANSPARENT_TAGS.has(name)) {
      out.push(paragraphizeChildren($, element.children));
    } else if (name === "p") {
      out.push(paragraphsHtml($, element.children));
    } else if (name === "blockquote") {
      $(element).html(paragraphizeChildren($, element.children));
      out.push($.html(element));
    } else {
      out.push($.html(node));
    }
  }
  flushRun();
  return out.filter(Boolean).join("\n");
}

export function paragraphizeLegacyHtml(html: string) {
  if (!html) return html;
  const $ = cheerio.load(`<main>${html}</main>`, null, false);
  return paragraphizeChildren($, $("main").contents().toArray());
}
