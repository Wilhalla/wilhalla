#!/usr/bin/env node
// Fails when React Compiler skips a component or hook: a skipped function silently loses its
// memoization, and the reason is always a Rules of React violation worth fixing.
//
//   tools/ci/react-compiler.mjs            every app that has the compiler installed
//   tools/ci/react-compiler.mjs apps/site  one app
import { readdirSync, readFileSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { join, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const apps =
  process.argv.length > 2 ? process.argv.slice(2) : ["apps/site", "apps/fruit", "apps/playground"];

function sourceFiles(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);

    if (statSync(path).isDirectory()) {
      return sourceFiles(path);
    }

    return /\.tsx?$/.test(name) && !/\.(test|gen|d)\.tsx?$/.test(name) ? [path] : [];
  });
}

let compiled = 0;
const skipped = [];

for (const app of apps) {
  const require = createRequire(join(root, app, "package.json"));
  const babel = require("@babel/core");
  const compiler = require.resolve("babel-plugin-react-compiler");

  for (const file of sourceFiles(join(root, app, "src"))) {
    const logger = {
      logEvent(_filename, event) {
        if (event.kind === "CompileSuccess") {
          compiled += 1;
        } else if (event.kind === "CompileError" || event.kind === "PipelineError") {
          const detail = event.detail?.options ?? event.detail ?? {};
          const line =
            detail.loc?.start?.line ??
            detail.details?.[0]?.loc?.start?.line ??
            event.fnLoc?.start?.line;
          skipped.push(
            `${relative(root, file)}:${line ?? "?"}: ${detail.reason ?? event.data ?? "skipped"}`,
          );
        }
      },
    };

    babel.transformSync(readFileSync(file, "utf8"), {
      filename: file,
      babelrc: false,
      configFile: false,
      parserOpts: { plugins: ["typescript", "jsx"] },
      plugins: [[compiler, { logger }]],
    });
  }
}

// The compiler itself opts out of components that call libraries whose functions cannot be
// memoized (TanStack Table and Virtual): keep those small and leaf-level.
const isLibraryOptOut = (line) => line.includes("incompatible library");
const optedOut = skipped.filter(isLibraryOptOut);
const broken = skipped.filter((line) => !isLibraryOptOut(line));

console.log(
  `React Compiler: ${compiled} components and hooks compiled, ${optedOut.length} library opt-outs, ${broken.length} skipped`,
);

if (optedOut.length > 0) {
  console.log(optedOut.join("\n"));
}

if (broken.length > 0) {
  console.error(broken.join("\n"));
  process.exit(1);
}
