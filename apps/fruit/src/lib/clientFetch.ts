export type FetchPriority = "high" | "low" | "auto";

type PriorityRequestInit = RequestInit & { priority?: FetchPriority };

type FetchJsonOptions = {
  priority?: FetchPriority;
  signal?: AbortSignal;
};

export function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

async function fetchOk(url: string, options: FetchJsonOptions) {
  const init: PriorityRequestInit = {};
  if (options.priority) init.priority = options.priority;
  if (options.signal) init.signal = options.signal;

  const response = await fetch(url, init);
  if (!response.ok) throw new Error(`Failed to load ${url}: ${response.status}`);
  return response;
}

/** Untyped JSON: parse it with a zod schema before use. */
export async function fetchJsonValue(
  url: string,
  options: FetchJsonOptions = {},
): Promise<unknown> {
  return (await fetchOk(url, options)).json();
}

export async function fetchText(url: string, options: FetchJsonOptions = {}) {
  return (await fetchOk(url, options)).text();
}
