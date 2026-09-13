type LRUCacheEntry<V> = {
  value: V;
  expiresAt: number;
};

/**
 * A simple LRU (least-recently-used) cache with per-cache TTL and a max
 * item count. Backed by a `Map`, which preserves insertion order in JS,
 * so the oldest (least-recently-used) entry is always the first key.
 */
export class LRUCache<K, V> {
  #cache = new Map<K, LRUCacheEntry<V>>();
  #maxItems: number;
  #ttlMs: number;

  constructor(options: { maxItems: number; ttlMs: number }) {
    this.#maxItems = options.maxItems;
    this.#ttlMs = options.ttlMs;
  }

  get size() {
    return this.#cache.size;
  }

  get(key: K): V | undefined {
    const entry = this.#cache.get(key);
    if (!entry) {
      return undefined;
    }
    if (entry.expiresAt <= Date.now()) {
      this.#cache.delete(key);
      return undefined;
    }
    // Refresh recency by re-inserting the entry at the end of the Map.
    this.#cache.delete(key);
    this.#cache.set(key, entry);
    return entry.value;
  }

  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  set(key: K, value: V): void {
    // Delete first so a re-set of an existing key moves it to the end.
    this.#cache.delete(key);
    this.#cache.set(key, { value, expiresAt: Date.now() + this.#ttlMs });

    if (this.#cache.size > this.#maxItems) {
      // Map iteration order is insertion order, so the first key is the
      // least-recently-used entry.
      const oldestKey = this.#cache.keys().next().value as K;
      this.#cache.delete(oldestKey);
    }
  }

  delete(key: K): boolean {
    return this.#cache.delete(key);
  }

  clear(): void {
    this.#cache.clear();
  }
}
