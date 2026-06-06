#!/usr/bin/env node

import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";
import { Readable } from "node:stream";
import { fileURLToPath, pathToFileURL } from "node:url";

const rootDir = resolve(fileURLToPath(new URL("..", import.meta.url)));
const clientDir = join(rootDir, "dist", "client");
const serverEntry = join(rootDir, "dist", "server", "server.js");
const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? "0.0.0.0";

if (!existsSync(serverEntry)) {
  console.error("Missing dist/server/server.js. Run `pnpm run build` first.");
  process.exit(1);
}

const { default: startServer } = await import(pathToFileURL(serverEntry).href);

const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".gif", "image/gif"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
  [".webp", "image/webp"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
]);

function toRequest(req) {
  const protocol = req.headers["x-forwarded-proto"] ?? "http";
  const hostHeader =
    req.headers["x-forwarded-host"] ?? req.headers.host ?? `localhost:${port}`;
  const url = new URL(req.url ?? "/", `${protocol}://${hostHeader}`);
  const headers = new Headers();

  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) {
      for (const item of value) headers.append(key, item);
    } else if (value !== undefined) {
      headers.set(key, value);
    }
  }

  const init = { method: req.method, headers };
  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = Readable.toWeb(req);
    init.duplex = "half";
  }

  return new Request(url, init);
}

function getStaticPath(pathname) {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    return null;
  }

  const relativePath = normalize(decodedPath).replace(/^([/\\])+/, "");
  const filePath = join(clientDir, relativePath);
  const normalizedClientDir = clientDir.endsWith(sep)
    ? clientDir
    : `${clientDir}${sep}`;

  if (filePath !== clientDir && !filePath.startsWith(normalizedClientDir)) {
    return null;
  }

  return filePath;
}

async function serveStatic(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") return false;

  const pathname = new URL(req.url ?? "/", "http://localhost").pathname;
  if (pathname === "/" || pathname.endsWith("/")) return false;

  const filePath = getStaticPath(pathname);
  if (!filePath || !existsSync(filePath)) return false;

  const fileStat = await stat(filePath);
  if (!fileStat.isFile()) return false;

  const contentType =
    mimeTypes.get(extname(filePath)) ?? "application/octet-stream";
  res.statusCode = 200;
  res.setHeader("content-type", contentType);
  res.setHeader("content-length", fileStat.size);

  if (pathname.startsWith("/assets/")) {
    res.setHeader("cache-control", "public, max-age=31536000, immutable");
  }

  if (req.method === "HEAD") {
    res.end();
    return true;
  }

  createReadStream(filePath).pipe(res);
  return true;
}

const nodeServer = createServer(async (req, res) => {
  try {
    if (await serveStatic(req, res)) return;

    const response = await startServer.fetch(toRequest(req));
    res.statusCode = response.status;
    res.statusMessage = response.statusText;
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    if (!response.body || req.method === "HEAD") {
      res.end();
      return;
    }

    Readable.fromWeb(response.body).pipe(res);
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader("content-type", "text/plain; charset=utf-8");
    }
    res.end("Internal Server Error");
  }
});

nodeServer.listen(port, host, () => {
  console.log(`Wilhalla SSR server listening on http://${host}:${port}`);
});
