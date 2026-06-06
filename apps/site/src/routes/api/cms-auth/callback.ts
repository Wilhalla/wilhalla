import { handleSveltiaGithubCallback } from "@/modules/sveltia-github-oauth";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/cms-auth/callback")({
  server: {
    handlers: {
      GET: ({ request }) => handleSveltiaGithubCallback(request),
    },
  },
});
