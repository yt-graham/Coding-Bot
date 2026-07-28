# Clementi Town Secondary School Mine Sweeper

A self-contained Mine Sweeper web game themed around Clementi Town Secondary
School, with a shared, database-backed leaderboard.

## Features

- Beginner / Intermediate / Expert presets, plus a **Custom** board (rows,
  columns, mines) via a dedicated dialog with a live cell-count/density
  readout
- First-click-safe mine placement, flood-fill reveal, flagging (right-click
  / long-press / a flag-mode toggle for touch), and chording
- A live timer and mine counter styled as LED instrument readouts
- Manual light/dark theme toggle, remembered per browser
- A leaderboard (Today / All-time) that tries a real backend first and
  transparently falls back to `localStorage` if none is reachable — see
  below
- Responsive layout: the leaderboard sits in a left sidebar on wider
  screens and stacks above/below the board on narrow ones; the board
  itself scales to fill the available space up to a per-board-size ideal
  cell size
- A reserved ad-rail placeholder (visible on wide screens only), ready to
  swap in a real ad unit

## Project layout

```
index.html          the entire game: markup, styles, and client logic
api/score.js         POST a score (returns its all-time rank), PATCH a nickname onto one
api/leaderboard.js   GET the top 10 scores for a board config (today or all-time)
lib/db.js             thin wrapper around @neondatabase/serverless, reads DATABASE_URL
schema.sql            the `scores` table + indexes
```

No build step — `index.html` is served as-is.

## Running the shared leaderboard

The frontend calls `/api/score` and `/api/leaderboard`. Without a database
behind them, it silently falls back to a per-browser `localStorage`
leaderboard — so the game is always playable, but scores won't be shared
across visitors until this is set up.

1. Create a Postgres database on [Neon](https://neon.tech).
2. Run `schema.sql` against it (Neon's SQL editor, or `psql`).
3. Deploy this repo to [Vercel](https://vercel.com) (Import Git Repository
   → framework preset "Other" — `/api/*.js` is auto-detected as serverless
   functions, no config needed).
4. In the Vercel project's environment variables, set `DATABASE_URL` to
   your Neon connection string. **Never commit this value** — `.gitignore`
   already excludes `.env`.
5. Redeploy. The leaderboard note at the bottom of the panel will switch
   from "Local leaderboard" to "Shared leaderboard" once it's working.

## License

All rights reserved — see [LICENSE](./LICENSE). This is not open-source
software; no permission is granted to use, copy, modify, or distribute
this code without the copyright holder's written permission.
