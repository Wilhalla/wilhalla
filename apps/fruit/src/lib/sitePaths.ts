function trimLeadingSlash(value: string) {
  return value.replace(/^\/+/, "");
}

export function ensureTrailingSlash(value: string) {
  return value.endsWith("/") ? value : `${value}/`;
}

export function sitePath(path: string, base = import.meta.env.BASE_URL || "/") {
  const normalizedBase = ensureTrailingSlash(base || "/");
  if (/^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(path) || path.startsWith("data:")) return path;
  return `${normalizedBase}${trimLeadingSlash(path)}`;
}

export function generatedDataUrl(filename: string, base = import.meta.env.BASE_URL || "/") {
  return sitePath(`generated/${trimLeadingSlash(filename)}`, base);
}

/** An environment value as trimmed text; anything else is empty. */
export function envString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

/** `host` or `https://host` as a URL with a scheme. */
export function withScheme(value: string) {
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}
