import { useQuery } from "@tanstack/react-query";
import { wrapPicture } from "../wrapImageUrl";

import type { CardPicture, PictureSearch } from "../types";

type ServerSearchResponse = {
  pictures: PictureSearch[];
  metadata: {
    query: string;
    count: number;
    batch_size: number;
    took_seconds: number;
  };
};

export function useSearchPictures(q: string) {
  return useQuery<ServerSearchResponse>({
    queryKey: ["search", "pictures", q],
    queryFn: async () => {
      const response = await fetch(
        `/api/pictures/search?${new URLSearchParams({ query: q }).toString()}`,
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const data = (await response.json()) as ServerSearchResponse;
      for (const picture of data.pictures) {
        wrapPicture(picture as CardPicture);
      }
      return data;
    },
    enabled: !!q.trim(),
  });
}
