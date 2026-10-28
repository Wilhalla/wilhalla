import { handleSveltiaGithubAuth } from "@/modules/sveltia-github-oauth";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/cms-auth/auth")({
  server: {
    handlers: {
      GET: ({ request }) => handleSveltiaGithubAuth(request),
    },
  },
});
