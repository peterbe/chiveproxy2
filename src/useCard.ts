import { useQuery } from "@tanstack/react-query";

import type { ServerCard } from "./types";

export function useCard(uri: string | number) {
  return useQuery<ServerCard>({
    queryKey: ["card", uri],
    queryFn: async () => {
      const res = await fetch(`/api/cards/${uri}`);
      if (!res.ok) {
        throw new Error("Failed to fetch cards");
      }
      return res.json();
    },
    refetchOnWindowFocus: process.env.NODE_ENV === "production",
    staleTime: 1000 * 60 * 5,
  });
}
