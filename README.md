# Crossfade

A daily music puzzle. You get two artists and connect them by naming songs, where every song is a real collaboration that hands you off to the next artist. One puzzle a day, plus custom challenges you can send to a friend.

Live: https://crossfade-seven.vercel.app

## How it works

Each puzzle has a start artist and a target artist. From the start you write a song that features another artist on the graph, and that artist becomes your new position. Keep going until you reach the target. The shortest possible chain is the par; using extra songs or asking for hints lowers your score, and a flawless run scores 100.

The daily game runs entirely in the browser. There is no backend call to fetch a puzzle: the day number seeds a small deterministic PRNG, so everyone gets the same puzzle without a server, the way Wordle rolls over at local midnight.

## The graph

The artists and their links live in a hand-authored edge list (`lib/graph-data.ts`), where each edge is a pair of artists and the song that connects them. At load, that becomes an adjacency map, and the rest of the game is graph work on top of it:

- shortest path and par come from a breadth-first search (`lib/graph.ts`)
- a hint reveals the first step along a shortest path, so you cannot get stuck on an artist you do not recognise
- the daily puzzle picks a start and target 3 to 4 hops apart, from artists with enough links to be recognisable

## Stack

- Next.js (App Router) with React and TypeScript
- Tailwind CSS v4, with a token-based theme
- Motion for animation
- Phosphor for icons
- Redis (Upstash or Vercel KV) over its REST API for the leaderboard and cached artist images

The leaderboard and artist photos are optional. Without the Redis credentials the app still plays; it skips the global board and falls back to generated monogram avatars.

## Theming

Dark is the default. Colours are CSS custom properties, so switching theme swaps one set of values instead of restyling components. A small blocking script in the document head applies a saved light preference before first paint, so there is no flash on load. The toggle animation and the dark-to-light cross-fade both respect `prefers-reduced-motion`.

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

To enable the leaderboard and cached artist images, add Redis REST credentials to `.env.local`:

```
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
```

(`UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` also work.)
