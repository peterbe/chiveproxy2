import { useQuery } from "@tanstack/react-query";
// import { cardCache } from "../cardCache";
import { wrapPicture } from "../wrapImageUrl";

import type { ServerCard } from "../types";

// async function backgroundRefresh(uri: string | number) {
//   const res = await fetch(`/api/cards/${uri}/`);
//   if (!res.ok) {
//     console.error("Failed to fetch card in background", uri);
//   } else {
//     const data = (await res.json()) as ServerCard;
//     for (const picture of data.pictures) {
//       wrapPicture(picture);
//     }
//     data._cacheInfo = { created: new Date().toISOString(), hit: false };
//     cardCache.set(`card:${uri}`, data);
//   }
// }

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
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}
