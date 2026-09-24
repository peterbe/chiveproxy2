import { useEffect, useState } from "react";

type Status = "loading" | "loaded" | "error";

export function useImagePreloader(urls: string[]) {
  const [statuses, setStatuses] = useState<Record<string, Status>>({});

  useEffect(() => {
    let cancelled = false;
    setStatuses(Object.fromEntries(urls.map((u) => [u, "loading" as Status])));

    const images = urls.map((url) => {
      const img = new Image();
      const settle = (status: Status) => () => {
        if (cancelled) return;
        setStatuses((prev) => ({ ...prev, [url]: status }));
      };
      img.onload = settle("loaded");
      img.onerror = settle("error");
      img.src = url;
      // If it's already in the browser cache, onload may not fire in some cases
      if (img.complete && img.naturalWidth > 0) settle("loaded")();
      return img;
    });

    return () => {
      cancelled = true;
      images.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
    // join so a new array with the same contents doesn't re-run the effect
  }, [urls]);

  const values = Object.values(statuses);
  return {
    statuses,
    total: urls.length,
    loaded: values.filter((s) => s === "loaded").length,
    failed: values.filter((s) => s === "error").length,
    done: values.length > 0 && values.every((s) => s !== "loading"),
  };
}
