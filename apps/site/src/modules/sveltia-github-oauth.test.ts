import { afterEach, describe, expect, it, vi } from "vitest";
import { handleSveltiaGithubAuth, handleSveltiaGithubCallback } from "./sveltia-github-oauth";

const env = {
  ALLOWED_DOMAINS: "wilhalla-site.vercel.app",
  GITHUB_CLIENT_ID: "github-client-id",
  GITHUB_CLIENT_SECRET: "github-client-secret",
};

describe("Sveltia GitHub OAuth", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("redirects GitHub auth requests to GitHub with the Vercel callback URL", async () => {
    const response = await handleSveltiaGithubAuth(
      new Request(
        "https://wilhalla-site.vercel.app/api/cms-auth/auth?provider=github&site_id=wilhalla-site.vercel.app",
      ),
      env,
    );

    const location = response.headers.get("Location");

    expect(response.status).toBe(302);
    expect(location).toContain("https://github.com/login/oauth/authorize?");
    expect(location).toContain("client_id=github-client-id");
    expect(location).toContain(
      encodeURIComponent("https://wilhalla-site.vercel.app/api/cms-auth/callback"),
    );
    expect(response.headers.get("Set-Cookie")).toContain("sveltia-cms-oauth-csrf=github_");
  });

  it("rejects unconfigured domains", async () => {
    const response = await handleSveltiaGithubAuth(
      new Request(
        "https://wilhalla-site.vercel.app/api/cms-auth/auth?provider=github&site_id=example.com",
      ),
      env,
    );

    expect(await response.text()).toContain("UNSUPPORTED_DOMAIN");
  });

  it("exchanges a valid callback code for a token response for Sveltia", async () => {
    const fetch = vi.fn<typeof globalThis.fetch>(async () =>
      Response.json({ access_token: "gho_token" }),
    );
    vi.stubGlobal("fetch", fetch);

    const response = await handleSveltiaGithubCallback(
      new Request(
        "https://wilhalla-site.vercel.app/api/cms-auth/callback?code=oauth-code&state=csrf123",
        {
          headers: {
            Cookie: "sveltia-cms-oauth-csrf=github_csrf123",
          },
        },
      ),
      env,
    );

    const html = await response.text();

    expect(fetch).toHaveBeenCalledWith(
      "https://github.com/login/oauth/access_token",
      expect.objectContaining({ method: "POST" }),
    );
    expect(html).toContain("authorization:github:success");
    expect(html).toContain("gho_token");
  });

  it("never reflects the provider parameter into the page script", async () => {
    const response = await handleSveltiaGithubAuth(
      new Request(
        "https://wilhalla-site.vercel.app/api/cms-auth/auth?provider=%27);alert(document.domain);//&site_id=wilhalla-site.vercel.app",
      ),
      env,
    );

    const html = await response.text();

    expect(html).not.toContain("alert(");
    expect(html).toContain("UNSUPPORTED_BACKEND");
  });

  it("encodes a hostile error from the token endpoint as data", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof globalThis.fetch>(async () =>
        Response.json({ error: "');alert(1);//</script><script>alert(2)</script>" }),
      ),
    );

    const response = await handleSveltiaGithubCallback(
      new Request("https://wilhalla-site.vercel.app/api/cms-auth/callback?code=c&state=csrf123", {
        headers: { Cookie: "sveltia-cms-oauth-csrf=github_csrf123" },
      }),
      env,
    );

    const html = await response.text();
    const script = html.slice(html.indexOf("<script>") + 8, html.lastIndexOf("</script>"));

    expect(script).not.toContain("</script>");
    expect(() => new Function(script)).not.toThrow();
    expect(script).toContain(String.raw`\u003c/script>`);
  });

  it("rejects a callback whose state does not match the cookie", async () => {
    const response = await handleSveltiaGithubCallback(
      new Request("https://wilhalla-site.vercel.app/api/cms-auth/callback?code=c&state=other", {
        headers: { Cookie: "sveltia-cms-oauth-csrf=github_csrf123" },
      }),
      env,
    );

    expect(await response.text()).toContain("CSRF_DETECTED");
  });
});
