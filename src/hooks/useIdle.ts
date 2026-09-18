"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const ACTIVITY_EVENTS = ["pointerdown", "pointermove", "keydown", "wheel", "touchstart", "scroll"] as const;

/**
 * Devine `true` după `timeoutMs` fără nicio interacțiune.
 * Evenimentele doar notează ora ultimei activități (fără timere noi la fiecare mișcare
 * de mouse), iar un interval de 1 s verifică dacă a trecut timpul.
 */
export function useIdle(timeoutMs: number, enabled = true) {
  const [idle, setIdle] = useState(false);
  const lastActivity = useRef(0);
  const isIdle = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    lastActivity.current = Date.now();

    const onActivity = () => {
      lastActivity.current = Date.now();
      if (isIdle.current) {
        isIdle.current = false;
        setIdle(false);
      }
    };
    const check = setInterval(() => {
      if (!isIdle.current && Date.now() - lastActivity.current >= timeoutMs) {
        isIdle.current = true;
        setIdle(true);
      }
    }, 1000);

    ACTIVITY_EVENTS.forEach((name) => window.addEventListener(name, onActivity, { passive: true }));
    return () => {
      clearInterval(check);
      ACTIVITY_EVENTS.forEach((name) => window.removeEventListener(name, onActivity));
    };
  }, [enabled, timeoutMs]);

  const dismiss = useCallback(() => {
    lastActivity.current = Date.now();
    isIdle.current = false;
    setIdle(false);
  }, []);

  return { idle: enabled && idle, dismiss };
}
