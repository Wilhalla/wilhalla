import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

const config = defineConfig({
  plugins: [
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    tanstackStart(),
    nitro(),
    viteReact(),
  ],
  server: {
    watch: {
      ignored: ["**/.dolt/**", "**/.roam/**", "**/.doltcfg/**"],
    },
  },
});

export default config;
