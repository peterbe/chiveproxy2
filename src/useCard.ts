import { useQuery } from "@tanstack/react-query";
import { LocalStorageLRUCache } from "./LocalStorageLRUCache";

import type { ServerCard } from "./types";

const cardCache = new LocalStorageLRUCache<string, ServerCard>(
  "chiveproxy2:card",
  25,
  1000 * 60 * 60 * 24, // TODO: bump up
);

async function backgroundRefresh(uri: string | number) {
  const res = await fetch(`/api/cards/${uri}`);
  if (!res.ok) {
    console.error("Failed to fetch card in background", uri);
  } else {
    const data = await res.json();
    data._cacheInfo = { created: new Date().toISOString(), hit: false };
    cardCache.set(`card:${uri}`, data);
  }
}

export function useCard(uri: string | number) {
  return useQuery<ServerCard>({
    queryKey: ["card", uri],
    queryFn: async () => {
      const cached = cardCache.get(`card:${uri}`);
      if (cached) {
        console.log("CACHE HIT", uri);
        const typed = cached as ServerCard;
        if (typed._cacheInfo) {
          const ageSeconds = (Date.now() - new Date(typed._cacheInfo.created).getTime()) / 1000;
          console.log("IT WAS IN THE CACHE", { ageSeconds });
          if (ageSeconds > 60) {
            backgroundRefresh(uri);
          }
        } else {
          typed._cacheInfo = { created: new Date().toISOString(), hit: true };
        }
        typed._cacheInfo.hit = true;
        return typed;
      }
      const res = await fetch(`/api/cards/${uri}`);
      if (!res.ok) {
        throw new Error("Failed to fetch cards");
      }
      const data = await res.json();
      data._cacheInfo = { created: new Date().toISOString(), hit: false };
      cardCache.set(`card:${uri}`, data);
      console.log("CACHE MISS", uri);
      return data;
    },
    refetchOnWindowFocus: process.env.NODE_ENV === "production",
    staleTime: 1000 * 60 * 5,
  });
}
