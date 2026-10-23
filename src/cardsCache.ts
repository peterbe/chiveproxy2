import { LocalStorageLRUCache } from "./LocalStorageLRUCache";

import type { ServerCards } from "./types";

export const cardsCache = new LocalStorageLRUCache<string, ServerCards>(
  "chiveproxy2:cards",
  1,
  1000 * 60 * 60 * 24,
);
