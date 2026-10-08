import { LocalStorageLRUCache } from "./LocalStorageLRUCache";

import type { ServerCard } from "./types";

export const cardCache = new LocalStorageLRUCache<string, ServerCard>(
  "chiveproxy2:card",
  25,
  1000 * 60 * 60 * 24, // TODO: bump up
);
