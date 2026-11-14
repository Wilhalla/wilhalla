import babel from "@rolldown/plugin-babel";
import contentCollections from "@content-collections/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const config = defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    contentCollections({ isEnabled: () => process.env.VITEST !== "true" }),
    tailwindcss(),
    tanstackStart(),
    nitro(),
    viteReact(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  server: {
    allowedHosts: ["tower.tailcc37.ts.net"],
    watch: {
      ignored: ["**/.dolt/**", "**/.roam/**", "**/.doltcfg/**"],
    },
  },
});

export default config;
