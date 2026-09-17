interface CacheRecord<V> {
  value: V;
  expiry: number | null;
}

export class LocalStorageLRUCache<K extends string | number, V> {
  private prefix: string;
  private maxSize: number;
  private defaultTTL: number;
  private keysKey: string;

  constructor(prefix = "lru_cache", maxSize = 50, defaultTTL = 3600000) {
    this.prefix = prefix;
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL; // in milliseconds
    this.keysKey = `${prefix}:keys`;
  }

  private _getKeys(): K[] {
    const data = localStorage.getItem(this.keysKey);
    return data ? (JSON.parse(data) as K[]) : [];
  }

  private _setKeys(keys: K[]): void {
    localStorage.setItem(this.keysKey, JSON.stringify(keys));
  }

  private _itemKey(key: K): string {
    return `${this.prefix}:item:${key}`;
  }

  public get(key: K): V | null {
    const itemKey = this._itemKey(key);
    const raw = localStorage.getItem(itemKey);

    if (!raw) return null;

    try {
      const record = JSON.parse(raw) as CacheRecord<V>;
      const now = Date.now();

      // Check if expired (TTL)
      if (record.expiry && now > record.expiry) {
        this.remove(key);
        return null;
      }

      // Refresh LRU order (move to front)
      let keys = this._getKeys();
      keys = keys.filter((k) => k !== key);
      keys.unshift(key);
      this._setKeys(keys);

      return record.value;
    } catch {
      // Handle corrupted data in localStorage
      this.remove(key);
      return null;
    }
  }

  public set(key: K, value: V, ttl: number = this.defaultTTL): void {
    const itemKey = this._itemKey(key);
    const now = Date.now();
    const expiry = ttl ? now + ttl : null;

    let keys = this._getKeys();

    // Remove if already exists to update position
    keys = keys.filter((k) => k !== key);

    // Add to the beginning (most recently used)
    keys.unshift(key);

    // Save record
    const record: CacheRecord<V> = { value, expiry };
    localStorage.setItem(itemKey, JSON.stringify(record));

    // Enforce max size limit (evict least recently used)
    while (keys.length > this.maxSize) {
      const oldestKey = keys.pop();
      if (oldestKey !== undefined) {
        localStorage.removeItem(this._itemKey(oldestKey));
      }
    }

    this._setKeys(keys);
  }

  public remove(key: K): void {
    let keys = this._getKeys();
    keys = keys.filter((k) => k !== key);
    this._setKeys(keys);
    localStorage.removeItem(this._itemKey(key));
  }

  public clear(): void {
    const keys = this._getKeys();
    // keys.forEach((k) => localStorage.removeItem(this._itemKey(k)));
    for (const k of keys) {
      localStorage.removeItem(this._itemKey(k));
    }
    localStorage.removeItem(this.keysKey);
  }
}
