import { wrapImageUrl } from "./wrapImageUrl";

import type { ServerCard, ServerCards } from "./types";

Bun.serve({
  port: 3000,
  routes: {
    "/api/cards": {
      async GET() {
        const response = await fetch(
          "https://chiveproxy.peterbe.com/api/cards/",
        );
        if (!response.ok) {
          throw new Error("Failed to fetch cards");
        }
        const data = (await response.json()) as ServerCards;
        for (const card of data.cards) {
          if (card.img.startsWith("https://thechive.com")) {
            card.img = wrapImageUrl(card.img);
          }
        }
        return Response.json(data);
      },
    },
    "/api/cards/:uri": {
      async GET(req) {
        const uri = req.params.uri;
        const response = await fetch(
          `https://chiveproxy.peterbe.com/api/cards/${uri}/`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch cards");
        }
        const data = (await response.json()) as ServerCard;
        for (const picture of data.pictures) {
          if (picture.img.startsWith("https://thechive.com")) {
            picture.img = wrapImageUrl(picture.img);
          }
        }
        return Response.json(data);
      },
    },
    "/*": { dir: "./dist" },
  },
});

console.log("Server running at http://localhost:3000");
