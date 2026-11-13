import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import babel from "@rolldown/plugin-babel";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";

const deploymentHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || "";
const siteUrl =
  process.env.PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  (deploymentHost
    ? `https://${deploymentHost.replace(/^https?:\/\//i, "")}`
    : "https://fruit.janpeterdhalle.com");

export default defineConfig({
  // The "Atlas" page was renamed; keep old links working.
  redirects: { "/atlas": "/onderwerpen" },
  output: "static",
  adapter: vercel(),
  integrations: [react()],
  prefetch: { prefetchAll: false, defaultStrategy: "hover" },
  vite: {
    plugins: [tailwindcss(), babel({ plugins: ["babel-plugin-react-compiler"] })],
    optimizeDeps: {
      include: ["minisearch", "lucide-react"],
    },
  },
  site: siteUrl,
  image: {
    responsiveStyles: true,
  },
});
