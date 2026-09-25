import { useQuery } from "@tanstack/react-query";
import { LocalStorageLRUCache } from "./LocalStorageLRUCache";
import { wrapCard } from "./wrapImageUrl";

import type { ServerCards } from "./types";

const cardCache = new LocalStorageLRUCache<string, ServerCards>(
  "chiveproxy2:cards",
  1,
  1000 * 60 * 60 * 1,
);

async function backgroundRefresh() {
  const res = await fetch(`/api/cards/`);
  if (!res.ok) {
    console.error("Failed to fetch card in background");
  } else {
    const data = (await res.json()) as ServerCards;
    for (const card of data.cards) {
      wrapCard(card);
    }
    data._cacheInfo = { created: new Date().toISOString(), hit: false };
    cardCache.set(`cards`, data);
  }
}

export function useCards() {
  return useQuery<ServerCards>({
    queryKey: ["cards"],
    queryFn: async () => {
      const cached = cardCache.get("cards");
      if (cached) {
        console.log("CACHE HIT");
        const typed = cached as ServerCards;
        if (typed._cacheInfo) {
          const ageSeconds = (Date.now() - new Date(typed._cacheInfo.created).getTime()) / 1000;
          console.log("IT WAS IN THE CACHE", { ageSeconds });
          if (ageSeconds > 60) {
            backgroundRefresh();
          }
        } else {
          typed._cacheInfo = { created: new Date().toISOString(), hit: true };
        }
        typed._cacheInfo.hit = true;
        return typed;
      }

      const res = await fetch("/api/cards/");
      if (!res.ok) {
        throw new Error("Failed to fetch cards");
      }
      const data = (await res.json()) as ServerCards;
      for (const card of data.cards) {
        wrapCard(card);
        // if (card.img.startsWith("https://thechive.com")) {
        //   card.img = wrapImageUrl(card.img);
        // }
      }

      data._cacheInfo = { created: new Date().toISOString(), hit: false };
      cardCache.set("cards", data);
      console.log("CACHE MISS");
      return data;
    },
    refetchIntervalInBackground: true,
    refetchInterval: 60 * 5 * 1000, // Refetch every 5 min seconds
    refetchOnWindowFocus: process.env.NODE_ENV !== "production",
  });
}
