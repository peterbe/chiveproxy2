import { useEffect, useRef } from "react";

/**
 * Sets `document.title` while the component is mounted, restoring the
 * previous title on unmount.
 */
export function useDocumentTitle(title: string) {
  const previousTitle = useRef(document.title);

  useEffect(() => {
    document.title = title;

    return () => {
      document.title = previousTitle.current;
    };
  }, [title]);
}
