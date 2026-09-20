import { PrettyPrintDate } from "./PrettyDate";

import type { CacheInfo } from "@/types";

export function CachedInfo({ data }: { data?: CacheInfo }) {
  if (!data) return null;
  return (
    <div className="cache-info">
      {data.hit && (
        <p>
          Cache <b>hit</b> from <PrettyPrintDate date={data.created} withDate={false} />
        </p>
      )}
      {!data.hit && (
        <p>
          Cache <b>miss</b>
        </p>
      )}
    </div>
  );
}
