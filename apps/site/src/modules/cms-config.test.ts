import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

// Sveltia CMS commits straight into the monorepo through GitHub, so every path in its config is
// relative to the repository root, not to apps/site. A wrong prefix makes the CMS write content
// the site never reads.
const repoRoot = fileURLToPath(new URL("../../../../", import.meta.url));
const config = readFileSync(new URL("../../public/admin/config.yml", import.meta.url), "utf8");

const values = (key: string) =>
  [...config.matchAll(new RegExp(`^\\s*${key}: (\\S+)$`, "gm"))].map((match) => match[1]);

describe("Sveltia CMS config", () => {
  it("targets the monorepo's main branch", () => {
    expect(values("repo")).toEqual(["Wilhalla/wilhalla"]);
    expect(values("branch")).toEqual(["main"]);
  });

  it.each(values("file"))("edits an existing content file: %s", (file) => {
    expect(file.startsWith("apps/site/")).toBe(true);
    expect(existsSync(repoRoot + file)).toBe(true);
  });

  it.each(values("media_folder"))("uploads media into apps/site/public: %s", (folder) => {
    expect(folder.startsWith("/apps/site/public/")).toBe(true);
    expect(existsSync(repoRoot + folder.slice(1))).toBe(true);
  });
});
