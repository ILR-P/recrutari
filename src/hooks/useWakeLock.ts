"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Ține ecranul aprins (Screen Wake Lock API): util pe tabletele de la stand. */
export function useWakeLock() {
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sentinel = useRef<WakeLockSentinel | null>(null);
  const wanted = useRef(false);

  const acquire = useCallback(async () => {
    if (!("wakeLock" in navigator)) {
      setError("Browserul acesta nu suportă Wake Lock. Setează manual ecranul să nu se stingă.");
      return;
    }
    try {
      const lock = await navigator.wakeLock.request("screen");
      sentinel.current = lock;
      setActive(true);
      setError(null);
      lock.addEventListener("release", () => setActive(false));
    } catch {
      setError("Nu am putut ține ecranul aprins. Încearcă din nou după o atingere pe ecran.");
    }
  }, []);

  const toggle = async () => {
    if (active) {
      wanted.current = false;
      await sentinel.current?.release();
      sentinel.current = null;
      return;
    }
    wanted.current = true;
    await acquire();
  };

  // Browserul eliberează lock-ul când tab-ul e ascuns, așa că îl cerem din nou la revenire.
  useEffect(() => {
    const onVisible = () => {
      const lost = !sentinel.current || sentinel.current.released;
      if (document.visibilityState === "visible" && wanted.current && lost) void acquire();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [acquire]);

  return { active, error, toggle };
}
