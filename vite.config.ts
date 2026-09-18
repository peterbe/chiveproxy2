import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

// import { LRUCache } from "./lrucache";
// import { wrapImageUrl } from "./wrapImageUrl";

// import type { ServerCard, ServerCards } from "./types";

// const cardsCache = new LRUCache<string, ServerCards>({
//   maxItems: 50,
//   ttlMs: 60_000,
// });
// const cardCache = new LRUCache<string, ServerCard>({
//   maxItems: 50,
//   ttlMs: 60_000 * 10,
// });

const API_TARGET = process.env.VITE_API_TARGET ?? "https://chiveproxy.peterbe.com";
console.log("API_TARGET:", API_TARGET);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: API_TARGET,
        changeOrigin: true,
        secure: false,
        // ws: true,
      },
    },
    // proxy: {
    //   "/api/cards": async () =>{
    //     const cacheKey = "cards";
    //     const cached = cardsCache.get(cacheKey);
    //     if (cached) {
    //       return Response.json(cached);
    //     }

    //     const response = await fetch("https://chiveproxy.peterbe.com/api/cards/");
    //     if (!response.ok) {
    //       throw new Error("Failed to fetch cards");
    //     }
    //     const data = (await response.json()) as ServerCards;
    //     for (const card of data.cards) {
    //       if (card.img.startsWith("https://thechive.com")) {
    //         card.img = wrapImageUrl(card.img);
    //       }
    //     }
    //     cardsCache.set(cacheKey, data);
    //     return Response.json(data);
    //   },
    // },
    // }
  },
});
