import { useQuery } from "@tanstack/react-query";
import { wrapCard } from "../wrapImageUrl";

import type { ServerSearchCards } from "../types";

export function useSearchCards(q: string) {
  return useQuery<ServerSearchCards>({
    queryKey: ["search", "cards", q],
    queryFn: async () => {
      // const res = await fetch(`/api/cards/?search=${encodeURIComponent(q)}`);
      const res = await fetch(`/api/cards/?${new URLSearchParams({ search: q })}`);
      if (!res.ok) {
        throw new Error("Failed to fetch cards");
      }
      const data = (await res.json()) as ServerSearchCards;
      for (const card of data.cards) {
        wrapCard(card);
      }

      return data;
    },
    enabled: !!q.trim(),
    refetchOnWindowFocus: process.env.NODE_ENV !== "production",
  });
}
