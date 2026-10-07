import styles from "./CacheOptions.module.css";
import { PrettyPrintDate } from "./PrettyDate";

import type { CacheInfo } from "@/types";

export function CacheOptions({ data }: { data?: CacheInfo }) {
  if (!data) return null;

  return (
    <div className={styles.cacheOptions}>
      {data.hit ? (
        <p>
          This card was served from cache. It was cached at: <PrettyPrintDate date={data.created} />
        </p>
      ) : (
        <p>This card was not served from cache.</p>
      )}
    </div>
  );
}
