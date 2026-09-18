"use client";

import { useCallback, useEffect, useRef } from "react";

/** setTimeout care se anulează singur când componenta dispare (ex. la resetarea pentru inactivitate). */
export function useSafeTimeout() {
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  return useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);
}
