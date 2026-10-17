import { cardCache } from "../cardCache";

export function CacheInfo() {
  const cardCacheKeys = cardCache._getKeys();
  console.log("Card cache keys:", cardCacheKeys);
  const rawSizes: number[] = cardCacheKeys.map((key) => {
    const itemKey = cardCache._itemKey(key);
    const raw = localStorage.getItem(itemKey);
    return raw ? raw.length : 0;
  });

  return (
    <div>
      <p>Number of cached cards: {cardCacheKeys.length}</p>
      <p>Total size of cached cards: {formatBytes(rawSizes.reduce((a, b) => a + b, 0))}</p>
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
