// Cleans up post titles in every data file: all-caps titles become sentence case (see
// src/lib/titleCase.ts), and titles the extractor cut from the first 72 characters of an untitled
// post become that post's first line. Rewrites only the title-like string values it changes, in
// place, so the generated files keep their formatting. Safe to run again.
import fs from "node:fs/promises";
import path from "node:path";
import * as cheerio from "cheerio";
import { paragraphizeLegacyHtml } from "../src/lib/legacyParagraphs.ts";
import { collectWordForms, sentenceCaseTitle } from "../src/lib/titleCase.ts";

type Post = { title: string; excerpt: string; html: string };

const root = path.resolve(import.meta.dirname, "..");
const dataDirs = ["src/data", "public/generated"].map((dir) => path.join(root, dir));
const TITLE_KEYS = ["title", "postTitle", "seriesTitle", "caption"];

function plainText(html: string) {
  return cheerio
    .load(html.replace(/<br\s*\/?>|<\/(?:p|div|h\d|li|td|tr)>/gi, "\n"), null, false)
    .root()
    .text();
}

function squash(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

/** The extractor's fallback for an untitled post: the first 72 characters of its text. */
function firstLineTitle(post: Post) {
  const title = squash(post.title);
  if (post.title.length < 70 || post.title.length > 72) return undefined;
  if (!squash(post.excerpt).startsWith(title)) return undefined;
  const first = cheerio.load(paragraphizeLegacyHtml(post.html), null, false)("p").first();
  const line = squash(first.text().replace(/[.:,;]+$/, ""));
  return line && line.length < title.length ? line : undefined;
}

async function jsonFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return jsonFiles(full);
      return Promise.resolve(entry.name.endsWith(".json") ? [full] : []);
    }),
  );
  return nested.flat();
}

const posts: Post[] = JSON.parse(await fs.readFile(path.join(root, "src/data/posts.json"), "utf8"));
const forms = collectWordForms(posts.map((post) => plainText(post.html)));

const replacements = new Map<string, string>();
for (const post of posts) {
  const fixed = sentenceCaseTitle(firstLineTitle(post) ?? post.title, forms);
  if (fixed !== post.title) replacements.set(post.title, fixed);
}
if (process.argv.includes("--dry-run")) {
  for (const [from, to] of replacements) console.log(`${from}  →  ${to}`);
  process.exit(0);
}
const fix = (value: string) => replacements.get(value) ?? sentenceCaseTitle(value, forms);

const pattern = new RegExp(`"(${TITLE_KEYS.join("|")})"(\\s*:\\s*)"((?:[^"\\\\]|\\\\.)*)"`, "g");
let changedValues = 0;
for (const file of (await Promise.all(dataDirs.map(jsonFiles))).flat()) {
  const source = await fs.readFile(file, "utf8");
  const asciiEscaped = /\\u00[0-9a-f]{2}/i.test(source);
  const output = source.replace(pattern, (match, key: string, colon: string, raw: string) => {
    const value: string = JSON.parse(`"${raw}"`);
    const next = fix(value);
    if (next === value) return match;
    changedValues += 1;
    let encoded = JSON.stringify(next);
    if (asciiEscaped) {
      encoded = encoded.replace(
        /[\u007f-￿]/g,
        (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`,
      );
    }
    return `"${key}"${colon}${encoded}`;
  });
  if (output !== source) {
    await fs.writeFile(file, output);
    console.log(`updated ${path.relative(root, file)}`);
  }
}
console.log(`${replacements.size} post titles fixed, ${changedValues} values rewritten`);
