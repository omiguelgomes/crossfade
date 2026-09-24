"use client";

import { useEffect, useState } from "react";

// Resolves artist photos once per id, then remembers the answer in memory and
// localStorage so navigating the game doesn't re-hit the API. Concurrent lookups
// of the same artist share one in-flight request.

const LS_PREFIX = "crossfade:img:v1:";
const memory = new Map<string, string | null>();
const inflight = new Map<string, Promise<string | null>>();

function readLocal(id: string): string | null | undefined {
  try {
    const raw = window.localStorage.getItem(LS_PREFIX + id);
    if (raw === null) return undefined; // never looked up
    return raw === "" ? null : raw; // "" = confirmed no image
  } catch {
    return undefined;
  }
}

function writeLocal(id: string, url: string | null) {
  try {
    window.localStorage.setItem(LS_PREFIX + id, url ?? "");
  } catch {
    // storage unavailable — memory cache still applies for the session
  }
}

async function resolve(id: string, name: string): Promise<string | null> {
  if (memory.has(id)) return memory.get(id)!;

  const local = readLocal(id);
  if (local !== undefined) {
    memory.set(id, local);
    return local;
  }

  if (inflight.has(id)) return inflight.get(id)!;

  const p = (async () => {
    try {
      const res = await fetch(
        `/api/artist-image?id=${encodeURIComponent(id)}&name=${encodeURIComponent(name)}`,
      );
      const json = (await res.json()) as { url: string | null };
      const url = json.url ?? null;
      memory.set(id, url);
      writeLocal(id, url);
      return url;
    } catch {
      return null;
    } finally {
      inflight.delete(id);
    }
  })();
  inflight.set(id, p);
  return p;
}

export function useArtistImage(id: string, name: string): string | null {
  const [url, setUrl] = useState<string | null>(() => memory.get(id) ?? null);

  useEffect(() => {
    let alive = true;
    resolve(id, name).then((u) => {
      if (alive) setUrl(u);
    });
    return () => {
      alive = false;
    };
  }, [id, name]);

  return url;
}
