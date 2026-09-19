import { serve } from "bun";
import index from "./index.html";
import { LRUCache } from "./lrucache";
import { wrapCard, wrapPicture } from "./wrapImageUrl";

import type { ServerCard, ServerCards } from "./types";

const cardsCache = new LRUCache<string, ServerCards>({
  maxItems: 50,
  ttlMs: 60_000,
});
const cardCache = new LRUCache<string, ServerCard>({
  maxItems: 50,
  ttlMs: 60_000 * 10,
});

const server = serve({
  routes: {
    "/api/cards": {
      async GET() {
        const cacheKey = "cards";
        const cached = cardsCache.get(cacheKey);
        if (cached) {
          return Response.json(cached);
        }

        const response = await fetch("https://chiveproxy.peterbe.com/api/cards/");
        if (!response.ok) {
          throw new Error("Failed to fetch cards");
        }
        const data = (await response.json()) as ServerCards;
        for (const card of data.cards) {
          wrapCard(card);
        }
        cardsCache.set(cacheKey, data);
        return Response.json(data);
      },
    },
    "/api/cards/:uri": {
      async GET(req) {
        const uri = req.params.uri;
        const cacheKey = `cards:${uri}`;
        const cached = cardCache.get(cacheKey);
        if (cached) {
          return Response.json(cached);
        }

        const response = await fetch(`https://chiveproxy.peterbe.com/api/cards/${uri}/`);
        if (!response.ok) {
          throw new Error("Failed to fetch cards");
        }
        const data = (await response.json()) as ServerCard;
        for (const picture of data.pictures) {
          wrapPicture(picture);
        }
        cardCache.set(cacheKey, data);
        return Response.json(data);
      },
    },

    // Serve index.html for all unmatched routes.
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
