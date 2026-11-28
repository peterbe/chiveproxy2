import { useQuery } from "@tanstack/react-query";
import { wrapCard } from "../wrapImageUrl";
import { CARD_CACHE_MAX_AGE } from "@/constants";

import type { ServerCards } from "../types";

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
    // Data restored from localStorage is shown immediately, but always
    // re-fetched from the network in the background on every mount.
    refetchOnMount: "always",
    // Must be >= the persister's maxAge, otherwise the query is garbage
    // collected (and dropped from localStorage) before it expires.
    gcTime: CARD_CACHE_MAX_AGE,
  });
}
