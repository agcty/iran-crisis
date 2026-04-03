# Iran War Crisis Propagation

Interactive visualization tracking the 2026 Iran crisis — day-by-day timeline, severity map, commodity prices, and event log from February 28 onward.

The US and Israel launched Operation Epic Fury on February 28, 2026, killing Supreme Leader Khamenei. Iran retaliated with missiles and drones on Israel and Gulf states and closed the Strait of Hormuz. This dashboard tracks how the crisis propagated across countries, markets, and daily life.

## What it tracks

- **Crisis map** — Country-by-country severity (0-5 scale) on a world map, updated daily
- **Oil & energy prices** — Brent, Dubai physical, jet fuel (CIF NWE), EU gas storage
- **Strait of Hormuz** — Daily vessel transits, oil flow (mbpd), supply offline
- **Strategic reserves** — IEA SPR releases (cumulative million barrels)
- **Market indicators** — Gold, VIX
- **Events** — Structured log of government statements, military actions, diplomatic moves, and the gap between what leaders say and what they do
- **Scenario projections** — Three forward-looking scenarios (ceasefire, grind, escalation) modeled from Day 36-90

## Signal-action gaps

A core editorial theme. The dashboard highlights instances where governments say "remain calm" or "no shortages" while simultaneously implementing emergency measures — rationing fuel, releasing reserves, or banning exports.

## Data sources

All data is sourced from Reuters, AP, Bloomberg, CNBC, Al Jazeera, BBC, FT, WSJ, IEA, OPEC, EIA, S&P Global Platts, AGSI, and other verifiable sources. See [SOURCES.md](SOURCES.md) for full attribution. Projection methodology is documented in [METHODOLOGY.md](METHODOLOGY.md).

## Tech stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- react-simple-maps (TopoJSON)
- Cloudflare Workers (deployment)

## Development

```bash
bun install
bun run dev
```

## License

MIT
