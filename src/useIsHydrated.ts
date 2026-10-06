import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Returns `false` during server rendering and while hydrating, then `true`.
 * Use it to defer output that can't match between server and browser
 * (current time, user agent, locale, etc.) so hydration doesn't mismatch.
 */
export function useIsHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
