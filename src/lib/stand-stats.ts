"use client";

import { useSyncExternalStore } from "react";

/**
 * Statistici și setări salvate doar pe dispozitivul curent (localStorage).
 * Fiecare laptop sau tabletă de la stand are propriile cifre.
 */

const KEY = "best-stand-v1";

export type StandData = {
  results: Record<string, number>;
  total: number;
  catchRecord: number;
  idleEnabled: boolean;
  since: string | null;
};

const DEFAULTS: StandData = { results: {}, total: 0, catchRecord: 0, idleEnabled: true, since: null };

let cache: StandData | null = null;
const listeners = new Set<() => void>();

function read(): StandData {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    cache = raw ? { ...DEFAULTS, ...(JSON.parse(raw) as Partial<StandData>) } : DEFAULTS;
  } catch {
    cache = DEFAULTS;
  }
  return cache;
}

function write(next: StandData) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Mod privat sau stocare blocată: păstrăm datele doar în memorie.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== KEY) return;
    cache = null;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useStandData() {
  return useSyncExternalStore(subscribe, read, () => DEFAULTS);
}

export function getStandData() {
  return read();
}

export function recordResult(archetypeId: string) {
  const data = read();
  write({
    ...data,
    total: data.total + 1,
    results: { ...data.results, [archetypeId]: (data.results[archetypeId] ?? 0) + 1 },
    since: data.since ?? new Date().toISOString(),
  });
}

/** Salvează scorul la jocul de prins și întoarce true dacă e record nou. */
export function recordCatchScore(score: number) {
  const data = read();
  if (score <= data.catchRecord) return false;
  write({ ...data, catchRecord: score });
  return true;
}

export function setIdleEnabled(idleEnabled: boolean) {
  write({ ...read(), idleEnabled });
}

export function resetStandStats() {
  write({ ...DEFAULTS, idleEnabled: read().idleEnabled, since: new Date().toISOString() });
}
