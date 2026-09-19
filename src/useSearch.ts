import { useQuery } from "@tanstack/react-query";
import { wrapImageUrl } from "./wrapImageUrl";

import type { ServerSearchCards } from "./types";

export function useSearch(q: string) {
  return useQuery<ServerSearchCards>({
    queryKey: ["search", q],
    queryFn: async () => {
      const res = await fetch(`/api/cards/?search=${encodeURIComponent(q)}`);
      if (!res.ok) {
        throw new Error("Failed to fetch cards");
      }
      const data = (await res.json()) as ServerSearchCards;
      for (const card of data.cards) {
        if (card.img.startsWith("https://thechive.com")) {
          card.img = wrapImageUrl(card.img);
        }
      }

      return data;
    },
    enabled: !!q.trim(),
    refetchOnWindowFocus: process.env.NODE_ENV !== "production",
  });
}
