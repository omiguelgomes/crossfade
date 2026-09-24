"use client";

import { useState } from "react";
import { getName } from "@/lib/graph";
import { useArtistImage } from "@/lib/artist-image";

// Artist avatar: a real photo (resolved via Deezer, cached) fading in over a
// deterministic gradient monogram. The monogram always renders, so there is
// never a broken image or empty circle while a photo loads or if none exists.

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function initials(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2).toUpperCase() || "?";
}

function gradient(name: string): string {
  const h = hash(name);
  const hue = h % 360;
  const hue2 = (hue + 38) % 360;
  return `linear-gradient(135deg, hsl(${hue} 58% 42%), hsl(${hue2} 62% 30%))`;
}

export function Avatar({
  id,
  size = 36,
  ring,
}: {
  id: string;
  size?: number;
  ring?: string;
}) {
  const name = getName(id);
  const photo = useArtistImage(id, name);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const showPhoto = photo && !failed;

  return (
    <span
      aria-hidden
      className="relative grid shrink-0 select-none place-items-center overflow-hidden rounded-full font-semibold text-white/95"
      style={{
        width: size,
        height: size,
        background: gradient(name),
        fontSize: size * 0.36,
        letterSpacing: "-0.02em",
        boxShadow: ring ? `0 0 0 2px ${ring}` : "0 0 0 1px var(--color-line)",
      }}
    >
      {initials(name)}
      {showPhoto && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photo}
          alt=""
          width={size}
          height={size}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
          style={{ opacity: loaded ? 1 : 0 }}
        />
      )}
    </span>
  );
}
