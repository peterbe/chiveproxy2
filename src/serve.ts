import path from "node:path";
import { wrapCard, wrapPicture } from "./wrapImageUrl";

import type { ServerCard, ServerCards } from "./types";

const DIST = path.resolve(import.meta.dirname, "../dist");

// Matches the default output name used by scripts/prerender.ts
function prerenderedName(pathname: string) {
  const slug = pathname.replace(/^\/+|\/+$/g, "").replace(/\//g, "_");
  return `${slug || "home"}.html`;
}

// Serve a real file from dist/ if there is one (assets, favicon, etc.),
// otherwise a pre-rendered page (e.g. /63835 -> dist/63835.html),
// otherwise fall back to dist/index.html.
async function serveDist(req: Request) {
  const { pathname } = new URL(req.url);

  for (const candidate of [pathname, prerenderedName(pathname)]) {
    let decoded: string;
    try {
      decoded = decodeURIComponent(candidate);
    } catch {
      continue;
    }
    const filePath = path.resolve(DIST, `.${path.sep}${decoded}`);
    // Don't allow escaping dist/ (e.g. /..%2f..%2fetc/passwd)
    if (!filePath.startsWith(DIST + path.sep)) continue;
    const file = Bun.file(filePath);
    if (await file.exists()) return new Response(file);
  }
  return new Response(Bun.file(path.join(DIST, "index.html")));
}

Bun.serve({
  port: 3000,
  hostname: "0.0.0.0",
  routes: {
    "/api/cards/": {
      async GET() {
        const response = await fetch("https://chive.peterbe.com/api/cards/");
        if (!response.ok) {
          throw new Error(`Failed to fetch cards: ${response.status} on ${response.url}`);
        }
        const data = (await response.json()) as ServerCards;
        for (const card of data.cards) {
          wrapCard(card);
        }
        return Response.json(data);
      },
    },
    "/api/cards/:uri/": {
      async GET(req) {
        let uri = req.params.uri;
        uri = uri.replace(".html", "");
        const response = await fetch(`https://chive.peterbe.com/api/cards/${uri}/`);
        if (!response.ok) {
          throw new Error(`Failed to fetch cards: ${response.status} on ${response.url}`);
        }
        const data = (await response.json()) as ServerCard;
        for (const picture of data.pictures) {
          wrapPicture(picture);
        }
        return Response.json(data);
      },
    },
    "/*": serveDist,
  },
});

console.log("Server running at http://localhost:3000");
