import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import { tanstackRouter } from "@tanstack/router-plugin/vite";

import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";

const config = defineConfig({
  plugins: [
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    viteReact(),
  ],
  server: {
    watch: {
      ignored: [
        "**/.dolt/**",
        "**/.roam/**",
        "**/.beads/**",
        "**/beads_wilhalla/**",
        "**/.doltcfg/**",
      ],
    },
  },
});

export default config;
