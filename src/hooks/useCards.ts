import { useQuery } from "@tanstack/react-query";
// import { cardsCache } from "../cardsCache";
import { wrapCard } from "../wrapImageUrl";

import type { ServerCards } from "../types";

// async function backgroundRefresh() {
//   const res = await fetch(`/api/cards/`);
//   if (!res.ok) {
//     console.error("Failed to fetch card in background");
//   } else {
//     const data = (await res.json()) as ServerCards;
//     for (const card of data.cards) {
//       wrapCard(card);
//     }
//     data._cacheInfo = { created: new Date().toISOString(), hit: false };
//     cardsCache.set(`cards`, data);
//   }
// }

export function useCards() {
  return useQuery<ServerCards>({
    queryKey: ["cards"],
    queryFn: async () => {
      const res = await fetch("/api/cards/");
      if (!res.ok) {
        throw new Error("Failed to fetch cards");
      }
      const data = (await res.json()) as ServerCards;
      for (const card of data.cards) {
        wrapCard(card);
      }
      return data;
    },
    refetchIntervalInBackground: true,
    refetchInterval: 60 * 1000,
    refetchOnWindowFocus: process.env.NODE_ENV !== "production",
  });
}
