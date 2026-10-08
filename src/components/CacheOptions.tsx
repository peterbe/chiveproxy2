import { useState } from "react";
import { cardCache } from "../cardCache";
import buttonStyles from "./Buttons.module.css";
import styles from "./CacheOptions.module.css";
import { PrettyPrintDate } from "./PrettyDate";

import type { CacheInfo } from "@/types";

export function CacheOptions({
  data,
  refetch,
  uri,
}: {
  data?: CacheInfo;
  refetch: () => void;
  uri: string | number;
}) {
  const [isPurged, setIsPurged] = useState(false);
  if (!data) return null;

  return (
    <div className={styles.cacheOptions}>
      {data.hit ? (
        <div>
          <p>
            This card was served from cache. It was cached at:{" "}
            <PrettyPrintDate date={data.created} />
          </p>
          <p>
            {isPurged ? (
              <span>Cache Purged</span>
            ) : (
              <button
                type="button"
                className={buttonStyles.smallButton}
                onClick={() => {
                  cardCache.remove(`card:${uri}`);
                  refetch();
                  setIsPurged(true);
                }}
              >
                Purge Cache
              </button>
            )}
          </p>
        </div>
      ) : (
        <p>This card was not served from cache.</p>
      )}
    </div>
  );
}
