import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig, lazyPlugins } from "vite-plus";

const API_TARGET = process.env.VITE_API_TARGET ?? "https://chive.peterbe.com";

// https://vite.dev/config/
export default defineConfig({
  fmt: {
    ignorePatterns: [],
    sortImports: {
      newlinesBetween: false,
      groups: [
        ["value-builtin", "value-external"],
        ["value-internal", "value-parent", "value-sibling", "value-index"],
        { newlinesBetween: true },
        "type-import",
        "unknown",
      ],
    },
  },
  lint: {
    plugins: ["react", "typescript", "oxc"],
    rules: {
      "react/rules-of-hooks": "error",
      "react/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
        },
      ],
      "vite-plus/prefer-vite-plus-imports": "error",
    },
    options: {
      typeAware: true,
      typeCheck: true,
    },
    jsPlugins: [
      {
        name: "vite-plus",
        specifier: "vite-plus/oxlint-plugin",
      },
    ],
  },
  plugins: lazyPlugins(() => [react(), babel({ presets: [reactCompilerPreset()] })]),
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  css: {
    // From https://github.com/picocss/pico/issues/717#issuecomment-3695614717
    preprocessorOptions: { scss: { quietDeps: true } },
  },
  server: {
    proxy: {
      "/api": {
        target: API_TARGET,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
