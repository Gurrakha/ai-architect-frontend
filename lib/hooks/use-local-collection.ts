"use client";

import { useCallback, useSyncExternalStore } from "react";
import { readJSON, writeJSON } from "@/lib/utils/storage";

/**
 * A tiny localStorage-backed collection, used only to compensate for
 * endpoints the backend does not expose (see README "Known backend
 * limitations"). This is explicitly a client-side convenience cache,
 * not a substitute for real persistence -- it will not see data created
 * from another browser/device.
 */
function makeStore<T>(key: string) {
  let cached: T[] = readJSON<T[]>(key, []);
  const listeners = new Set<() => void>();

  function emit() {
    listeners.forEach((l) => l());
  }

  if (typeof window !== "undefined") {
    window.addEventListener("storage", (e) => {
      if (e.key === key) {
        cached = readJSON<T[]>(key, []);
        emit();
      }
    });
  }

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot(): T[] {
      return cached;
    },
    set(next: T[]) {
      cached = next;
      writeJSON(key, next);
      emit();
    },
  };
}

const stores = new Map<string, ReturnType<typeof makeStore>>();

function getStore<T>(key: string) {
  if (!stores.has(key)) {
    stores.set(key, makeStore<T>(key));
  }
  return stores.get(key) as ReturnType<typeof makeStore<T>>;
}

export function useLocalCollection<T>(key: string) {
  const store = getStore<T>(key);

  const items = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    () => [] as T[],
  );

  const upsert = useCallback(
    (item: T, matches: (existing: T) => boolean) => {
      const current = store.getSnapshot();
      const idx = current.findIndex(matches);
      const next =
        idx === -1
          ? [...current, item]
          : current.map((existing, i) => (i === idx ? item : existing));
      store.set(next);
    },
    [store],
  );

  return { items, upsert };
}
