import { useCallback, useEffect, useRef } from "react";

export default function useRafDebounce(callback, deps = []) {
  const frameRef = useRef(null);

  const debouncedCallback = useCallback((...args) => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }

    frameRef.current = requestAnimationFrame(() => {
      callback(...args);
    });
  }, deps);

  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}