# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Build static site to /build
npm run preview      # Preview the built site
npm run check        # Run svelte-check type checking
npm run check:watch  # Type checking in watch mode
```

To run the data grabber manually (from the `dataGrabber/` directory):
```bash
cd dataGrabber && npm install && node dewIt.js
```

## Architecture

**Sultans of Stats** is a static fantasy baseball stats site for a 4-division superleague on Fantrax. It is built with SvelteKit 2 + Svelte 5 (using the static adapter — fully prerendered, no SSR).

### Data pipeline

`dataGrabber/dewIt.js` is a Node.js script that:
1. Hits the Fantrax internal API (`/fxpa/req`) for each league's standings
2. Computes per-team rankings across 12 scoring categories (overall and per-division)
3. Applies promotion/relegation logic
4. Writes the result to `src/allTheData.json`

> **Note:** The data grabber writes to `../src/allTheData.json` (relative to the `dataGrabber/` dir), but the frontend imports from `$lib/data/allTheData.json` (`src/lib/data/allTheData.json`). These paths differ — if data isn't updating, check this discrepancy. Yearly snapshots (`allTheData-2022.json`, etc.) live in `src/lib/data/`.

A GitHub Actions workflow (`.github/workflows/main.yml`) runs `dewIt.js` daily at 09:23 UTC and commits the updated JSON automatically.

### Scoring system

Teams earn points in 12 roto categories: R, HR, RBI, SB, OBP, SLG, W+QS (WQS), K, K/9 (K9), SV+HLD (SVHLD), ERA, WHP (WHIP). Lower rank = more points; ERA and WHIP are sorted ascending (lower is better). Both overall (cross-all-divisions) and division-specific point values are calculated and stored in the JSON.

### Frontend routes

| Route | Description |
|---|---|
| `/` | Home/landing page |
| `/leaderboard` | Sortable roto leaderboard with heat-map chips; Toggle switches between overall and division view |
| `/charts` | ApexCharts line chart of stat history by league/stat |
| `/history` | Placeholder (not yet built) |
| `/about` | (exists in nav but not currently linked) |

### Key files

- `src/lib/types.ts` — `Data` interface (flat leaderboard row), `HeadCell`, `Order`
- `src/lib/components/Leaderboard.svelte` — sortable table; clicking a row highlights it; stat chips use 7-level heat coloring
- `src/lib/components/LineChart.svelte` — ApexCharts wrapper; uses dynamic `import('apexcharts')` to avoid SSR issues during prerender
- `src/lib/components/Toggle.svelte` — Division filter (Overall / D1–D4)
- `src/app.css` — All global styles and CSS custom properties (colors, heat chip classes)
- `dataGrabber/divisions.js` — Maps Fantrax league IDs → division numbers (1–4)
- `dataGrabber/categories.js` — Maps stat names to Fantrax cell IDs in the API response

### Svelte 5 patterns used

This codebase uses Svelte 5 runes throughout — `$state`, `$derived`, `$props`, `$effect`. Do not use Svelte 4 reactive syntax (`$:`, `export let`).
