const GITHUB_PROVIDER = "github";
const CSRF_COOKIE_NAME = "sveltia-cms-oauth-csrf";
const DEFAULT_ALLOWED_DOMAINS = "wilhalla-site.vercel.app,www.wilhalla.be,wilhalla.be";

type OAuthEnvironment = Partial<{
  ALLOWED_DOMAINS: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  GITHUB_HOSTNAME: string;
}>;

type OAuthResult = { token: string } | { error: string; errorCode: string };

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** A JavaScript string literal that is safe inside an inline `<script>`. */
function scriptLiteral(value: string) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

/**
 * The page Sveltia's popup protocol expects. Only the constant provider name and JSON-encoded
 * literals reach the script: nothing from the request is interpolated as code.
 */
function outputHTML(result: OAuthResult) {
  const state = "token" in result ? "success" : "error";
  const handshake = `authorizing:${GITHUB_PROVIDER}`;
  const message = `authorization:${GITHUB_PROVIDER}:${state}:${JSON.stringify({ provider: GITHUB_PROVIDER, ...result })}`;

  return new Response(
    `<!doctype html><html><body><script>
(() => {
  const handshake = ${scriptLiteral(handshake)};
  window.addEventListener('message', ({ data, origin }) => {
    if (data === handshake) {
      window.opener?.postMessage(${scriptLiteral(message)}, origin);
    }
  });
  window.opener?.postMessage(handshake, '*');
})();
</script></body></html>`,
    {
      headers: {
        "Content-Type": "text/html;charset=UTF-8",
        "Set-Cookie": `${CSRF_COOKIE_NAME}=deleted; HttpOnly; Max-Age=0; Path=/api/cms-auth; SameSite=Lax; Secure`,
      },
    },
  );
}

function getCallbackUrl(request: Request) {
  const url = new URL(request.url);
  url.search = "";
  url.pathname = url.pathname.replace(/\/auth$/, "/callback");
  return url.toString();
}

function isAllowedDomain(siteId: string | null, allowedDomains?: string) {
  if (!allowedDomains) {
    return true;
  }

  const domain = normalizeDomain(siteId ?? "");

  return allowedDomains.split(",").some((allowedDomain) => {
    const pattern = allowedDomain.trim();

    if (!pattern) {
      return false;
    }

    const regex = new RegExp(`^${escapeRegExp(pattern).replace("\\*", ".+")}$`);

    return regex.test(domain);
  });
}

function normalizeDomain(value: string) {
  try {
    return new URL(value).hostname;
  } catch {
    return value;
  }
}

/** GitHub's token endpoint answers `{access_token}` or `{error}`; anything else is neither. */
function parseTokenResponse(value: unknown) {
  if (typeof value !== "object" || value === null) {
    return {};
  }

  return {
    token:
      "access_token" in value && typeof value.access_token === "string"
        ? value.access_token
        : undefined,
    error: "error" in value && typeof value.error === "string" ? value.error : undefined,
  };
}

function getCookie(headers: Headers, name: string) {
  return headers
    .get("Cookie")
    ?.split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

export async function handleSveltiaGithubAuth(
  request: Request,
  env: OAuthEnvironment = process.env,
) {
  const url = new URL(request.url);
  const provider = url.searchParams.get("provider");
  const siteId = url.searchParams.get("site_id");

  if (provider !== GITHUB_PROVIDER) {
    return outputHTML({
      error: "Your Git backend is not supported by the authenticator.",
      errorCode: "UNSUPPORTED_BACKEND",
    });
  }

  if (!isAllowedDomain(siteId, env.ALLOWED_DOMAINS ?? DEFAULT_ALLOWED_DOMAINS)) {
    return outputHTML({
      error: "Your domain is not allowed to use the authenticator.",
      errorCode: "UNSUPPORTED_DOMAIN",
    });
  }

  const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_HOSTNAME = "github.com" } = env;

  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    return outputHTML({
      error: "OAuth app client ID or secret is not configured.",
      errorCode: "MISCONFIGURED_CLIENT",
    });
  }

  const csrfToken = globalThis.crypto.randomUUID().replaceAll("-", "");
  const callbackUrl = getCallbackUrl(request);
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: callbackUrl,
    scope: "repo,user",
    state: csrfToken,
  });

  return new Response("", {
    status: 302,
    headers: {
      Location: `https://${GITHUB_HOSTNAME}/login/oauth/authorize?${params.toString()}`,
      "Set-Cookie": `${CSRF_COOKIE_NAME}=${provider}_${csrfToken}; HttpOnly; Path=/api/cms-auth; Max-Age=600; SameSite=Lax; Secure`,
    },
  });
}

export async function handleSveltiaGithubCallback(
  request: Request,
  env: OAuthEnvironment = process.env,
) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const [provider, csrfToken] = getCookie(request.headers, CSRF_COOKIE_NAME)?.split("_") ?? [];

  if (provider !== GITHUB_PROVIDER) {
    return outputHTML({
      error: "Your Git backend is not supported by the authenticator.",
      errorCode: "UNSUPPORTED_BACKEND",
    });
  }

  if (!code || !state) {
    return outputHTML({
      error: "Failed to receive an authorization code. Please try again later.",
      errorCode: "AUTH_CODE_REQUEST_FAILED",
    });
  }

  if (!csrfToken || state !== csrfToken) {
    return outputHTML({
      error: "Potential CSRF attack detected. Authentication flow aborted.",
      errorCode: "CSRF_DETECTED",
    });
  }

  const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_HOSTNAME = "github.com" } = env;

  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    return outputHTML({
      error: "OAuth app client ID or secret is not configured.",
      errorCode: "MISCONFIGURED_CLIENT",
    });
  }

  let response: Response;

  try {
    response = await fetch(`https://${GITHUB_HOSTNAME}/login/oauth/access_token`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        redirect_uri: getCallbackUrl(request),
      }),
    });
  } catch {
    return outputHTML({
      error: "Failed to request an access token. Please try again later.",
      errorCode: "TOKEN_REQUEST_FAILED",
    });
  }

  let tokenPayload: unknown;

  try {
    tokenPayload = await response.json();
  } catch {
    return outputHTML({
      error: "Server responded with malformed data. Please try again later.",
      errorCode: "MALFORMED_RESPONSE",
    });
  }

  const { token, error } = parseTokenResponse(tokenPayload);

  if (!token) {
    return outputHTML({
      error: error || "Failed to receive an access token.",
      errorCode: "TOKEN_REQUEST_FAILED",
    });
  }

  return outputHTML({ token });
}
