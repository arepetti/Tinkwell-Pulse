import { useEffect, useRef } from "react";

// To be honest this is just a quick workaround for that
// idiotic idea, introduced by React 18, to mount the same
// component twice in development mmode with StrictMode enabled.
export function useDebouncedMount(callback: () => void, delay = 100) {
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    timeoutRef.current = window.setTimeout(() => {
      callback();
    }, delay);

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);
}