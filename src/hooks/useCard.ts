import { useQuery } from "@tanstack/react-query";
import { wrapPicture } from "../wrapImageUrl";
import { CARD_CACHE_MAX_AGE } from "@/constants";

import type { ServerCard } from "../types";

export class Card404 extends Error {
  constructor(message: string) {
    super(message);
    this.name = "Error404";
  }
}

export function useCard(uri: string | number) {
  return useQuery<ServerCard>({
    queryKey: ["card", uri],
    queryFn: async () => {
      const res = await fetch(`/api/cards/${uri}/`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Card404(`/api/cards/${uri}/`);
        }
        throw new Error("Failed to fetch cards");
      }
      const data = (await res.json()) as ServerCard;
      for (const picture of data.pictures) {
        wrapPicture(picture);
      }
      return data;
    },
    refetchOnWindowFocus: process.env.NODE_ENV !== "production",
    // If the card is already cached (in memory or restored from
    // localStorage) and is less than a day old, don't re-fetch it.
    staleTime: 1000 * 60 * 60 * 24, // 1 day
    // Must be >= the persister's maxAge, otherwise queries are garbage
    // collected (and dropped from localStorage) before they expire.
    gcTime: CARD_CACHE_MAX_AGE,
    retry: 2,
  });
}
