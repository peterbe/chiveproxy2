import { useQuery } from "@tanstack/react-query";

import type { ServerCards } from "./types";

const isProd = process.env.NODE_ENV === "production";

export function useCards() {
  return useQuery<ServerCards>({
    queryKey: ["cards"],
    queryFn: async () => {
      const res = await fetch("/api/cards");
      if (!res.ok) {
        throw new Error("Failed to fetch cards");
      }
      return res.json();
    },
    refetchIntervalInBackground: true,
    refetchInterval: 60000, // Refetch every 60 seconds
    refetchOnWindowFocus: isProd,
  });
}
