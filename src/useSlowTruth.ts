import { useEffect, useState } from "react";

type Options = {
  delay?: number;
};

/**
 * A hook that throttles the truth. Useful when you want something to be true
 * only if it's been true for a certain delay in milliseconds. Example use:
 *
 *   const stillLoading = useSlowTruth(isLoading);
 *
 * If the value of `isLoading` quickly changes from false, to true, to false;
 * the value of `stillLoading` will remain false the whole time.
 *
 * @param initialState boolean
 * @param options
 * @returns a single boolean that is a delayed mirror of the input, if it's true
 */
export function useSlowTruth(initialState: boolean, { delay = 1000 }: Options) {
  const [isTrue, setIsTrue] = useState(initialState);
  useEffect(() => {
    let mounted = true;
    let timer: number | null = null;
    if (initialState) {
      timer = window.setTimeout(() => {
        if (mounted) {
          setIsTrue(true);
        }
      }, delay);
    } else {
      if (timer !== null) {
        window.clearTimeout(timer);
      }
      setIsTrue(false);
    }
    return () => {
      if (timer !== null) {
        window.clearTimeout(timer);
      }
      mounted = false;
    };
  }, [initialState, delay]);
  return isTrue;
}
