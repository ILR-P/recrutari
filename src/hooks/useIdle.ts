"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const ACTIVITY_EVENTS = ["pointerdown", "pointermove", "keydown", "wheel", "touchstart", "scroll"] as const;

/** Devine `true` după `timeoutMs` fără nicio interacțiune. */
export function useIdle(timeoutMs: number, enabled = true) {
  const [idle, setIdle] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const arm = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setIdle(true), timeoutMs);
  }, [timeoutMs]);

  useEffect(() => {
    if (!enabled) return;
    const onActivity = () => {
      setIdle(false);
      arm();
    };
    arm();
    ACTIVITY_EVENTS.forEach((name) => window.addEventListener(name, onActivity, { passive: true }));
    return () => {
      clearTimeout(timer.current);
      ACTIVITY_EVENTS.forEach((name) => window.removeEventListener(name, onActivity));
    };
  }, [enabled, arm]);

  const dismiss = useCallback(() => {
    setIdle(false);
    arm();
  }, [arm]);

  return { idle: enabled && idle, dismiss };
}
