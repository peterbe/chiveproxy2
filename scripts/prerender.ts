// Server-side render the app for a given URL and write the result as a
// static .html file next to dist/index.html.
//
// Usage:
//   bun run prerender <url> [output-name]
//
// Examples:
//   bun run prerender /search                 -> dist/search.html
//   bun run prerender /some-card-uri          -> dist/some-card-uri.html
//   bun run prerender /                       -> dist/home.html
//   bun run prerender /search search-ssr.html -> dist/search-ssr.html
//
// Requires that `bun run build` has already produced dist/index.html.

import { existsSync } from "node:fs";
import { readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "vite-plus";

const root = path.resolve(import.meta.dirname, "..");
const distDir = path.join(root, "dist");
const ssrOutDir = path.join(root, "dist-ssr");
const templatePath = path.join(distDir, "index.html");

const [urlArg, outArg] = process.argv.slice(2);
if (!urlArg) {
  console.error("Usage: bun run prerender <url> [output-name]");
  process.exit(1);
}
if (!existsSync(templatePath)) {
  console.error(`${templatePath} not found. Run 'bun run build' first.`);
  process.exit(1);
}

// Accept both "/search" and "https://example.com/search"
const url = new URL(urlArg, "http://localhost");
const pathAndQuery = url.pathname + url.search;

function outputName(): string {
  if (outArg) return outArg.endsWith(".html") ? outArg : `${outArg}.html`;
  const slug = url.pathname.replace(/^\/+|\/+$/g, "").replace(/\//g, "_");
  return `${slug || "home"}.html`;
}
const outName = outputName();
if (outName === "index.html") {
  console.error("Refusing to overwrite dist/index.html");
  process.exit(1);
}

await build({
  root,
  logLevel: "warn",
  build: {
    ssr: "src/entry-server.tsx",
    outDir: ssrOutDir,
    emptyOutDir: true,
  },
});

try {
  const { render } = (await import(
    pathToFileURL(path.join(ssrOutDir, "entry-server.js")).href
  )) as {
    // See src/entry-server.tsx
    render: (url: string) => Promise<{ html: string; dehydratedState: unknown }>;
  };
  const { html: appHtml, dehydratedState } = await render(pathAndQuery);
  // Escape "<" so the JSON can't close the <script> tag early
  const stateJSON = JSON.stringify(dehydratedState).replace(/</g, "\\u003c");
  const template = await readFile(templatePath, "utf-8");
  const marker = '<div id="root"></div>';
  if (!template.includes(marker)) {
    throw new Error(`Could not find ${marker} in ${templatePath}`);
  }
  // Use a replacer function so "$" sequences in the HTML aren't treated specially
  const html = template.replace(
    marker,
    () =>
      `<div id="root">${appHtml}</div>\n    <script>window.__REACT_QUERY_STATE__ = ${stateJSON};</script>`,
  );
  const outPath = path.join(distDir, outName);
  await writeFile(outPath, html);
  console.log(`Wrote ${path.relative(root, outPath)} (rendered ${pathAndQuery})`);
} finally {
  await rm(ssrOutDir, { recursive: true, force: true });
}
