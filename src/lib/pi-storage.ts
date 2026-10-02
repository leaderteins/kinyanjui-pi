"use client";

import * as React from "react";

const FAV_KEY = "kinyanjui-pi-favorites";
const RECENT_KEY = "kinyanjui-pi-recent";
const RECENT_LIMIT = 6;

export interface FavDomain {
  id: string;
  name: string;
  label: string;
  emoji: string;
  accent: string;
  pricePi: number | null;
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("kinyanjui-pi-storage", { detail: { key } }));
  } catch {
    /* ignore */
  }
}

// --- Favorites ---

export function useFavorites() {
  const [favorites, setFavorites] = React.useState<FavDomain[]>([]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    setFavorites(read<FavDomain[]>(FAV_KEY, []));
    const handler = (e: Event) => {
      if ((e as CustomEvent).detail?.key === FAV_KEY) {
        setFavorites(read<FavDomain[]>(FAV_KEY, []));
      }
    };
    window.addEventListener("kinyanjui-pi-storage", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("kinyanjui-pi-storage", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  function isFav(id: string) {
    return favorites.some((f) => f.id === id);
  }

  function toggle(domain: FavDomain) {
    const next = isFav(domain.id)
      ? favorites.filter((f) => f.id !== domain.id)
      : [...favorites, domain];
    write(FAV_KEY, next);
    setFavorites(next);
  }

  function clear() {
    write(FAV_KEY, []);
    setFavorites([]);
  }

  return { favorites, mounted, isFav, toggle, clear, count: favorites.length };
}

// --- Recently viewed ---

export function useRecentlyViewed() {
  const [recent, setRecent] = React.useState<FavDomain[]>([]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    setRecent(read<FavDomain[]>(RECENT_KEY, []));
    const handler = (e: Event) => {
      if ((e as CustomEvent).detail?.key === RECENT_KEY) {
        setRecent(read<FavDomain[]>(RECENT_KEY, []));
      }
    };
    window.addEventListener("kinyanjui-pi-storage", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("kinyanjui-pi-storage", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  function track(domain: FavDomain) {
    const filtered = read<FavDomain[]>(RECENT_KEY, []).filter(
      (d) => d.id !== domain.id
    );
    const next = [domain, ...filtered].slice(0, RECENT_LIMIT);
    write(RECENT_KEY, next);
    setRecent(next);
  }

  function clear() {
    write(RECENT_KEY, []);
    setRecent([]);
  }

  return { recent, mounted, track, clear };
}

export const FAVORITES_EVENT = "kinyanjui-pi-storage";
