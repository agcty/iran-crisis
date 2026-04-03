# Iran Crisis

Interactive visualization of the 2026 Iran crisis propagation — timeline, map, and event tracking. The war began February 28, 2026 when the US and Israel launched Operation Epic Fury, killing Supreme Leader Khamenei. Iran retaliated with missiles/drones on Israel and Gulf states and closed the Strait of Hormuz.

## What This Project Tracks

The core data file is `src/data/crisis-data.ts`. It contains:

- **Timeline**: Day-by-day from Feb 28 onward (DATES array, 1-indexed as "Day 1", "Day 2", etc.)
- **Oil/energy prices**: Brent, Dubai physical, jet fuel CIF NWE, EU gas storage
- **Strait of Hormuz**: daily vessel transits, oil flow (mbpd), supply offline
- **Strategic reserves**: IEA SPR releases (cumulative million barrels)
- **Market indicators**: Gold, VIX
- **Country severity**: 0-5 scale per country per day (COUNTRY_STATUS)
- **Events**: Structured CrisisEvent objects with day, country, who, type, text, and signal-action gap
- **Derived metrics**: force majeures, signal-action gaps, unrest index

## Updating Crisis Data

When asked to update or check what's happening, use **WebSearch** to find the latest developments. Always:

1. **Use renowned, verifiable sources**: Reuters, AP, Bloomberg, CNBC, Al Jazeera, CNN, BBC, FT, WSJ, IEA, OPEC, EIA, UANI (shipping data), S&P Global Platts (commodities), AGSI (EU gas storage), official government statements, CSIS, ICG, Atlantic Council, CFR. Wikipedia's timeline articles are good aggregators.
2. **Get accurate numbers**: Oil prices should be settlement/close prices, not intraday. Hormuz transits from UANI/Lloyd's List/MarineTraffic. SPR data from IEA/DOE. EU gas from AGSI.
3. **Cross-reference claims**: Don't take a single source at face value. Military claims especially need cross-referencing.
4. **Update ALL data arrays** when adding a new day — not just events. Every array in the file must get a new entry:
   - DATES, BRENT_PRICES, DUBAI_PRICES, JET_FUEL_PRICES, HORMUZ_FLOW, SUPPLY_OFFLINE, SPR_RELEASED, HORMUZ_TRANSITS, EU_GAS_STORAGE, FORCE_MAJEURES, SIGNAL_ACTION_GAPS, UNREST_INDEX, GOLD_PRICES, VIX
   - Every country in COUNTRY_STATUS
5. **Add contextual comments** above updated arrays explaining the data source and reasoning.
6. **Verify array lengths** after updating — all arrays and country status arrays must have the same length as DATES.
7. **Run `bun run build`** after changes to ensure no TypeScript errors.

### Event Structure

```ts
{
  day: number,        // 1-based day index
  country: string,    // Human-readable name or "Global"
  who: string,        // Who said/did it (person, org, or entity)
  type: EventType,    // One of: reassurance, price_controls, reserve_release, rationing,
                      //   emergency, warning, diplomatic, military_fuel, export_ban,
                      //   medical_warning, political
  text: string,       // What happened — include quotes where possible
  gap: string | null  // Signal-action gap: what the government said vs reality
}
```

### Signal-Action Gaps

A core editorial theme. Track instances where governments say "remain calm" / "no shortages" while simultaneously implementing emergency measures. The `gap` field captures this contradiction. Increment SIGNAL_ACTION_GAPS when a new country or leader exhibits this pattern.

## Workflow

When the user approves a change ("I like it", "looks good", etc.), immediately:
1. Create a new branch off `main`
2. Commit the changes
3. Create a GitHub PR targeting `main`
4. Merge the PR
5. Switch back to `main` and pull

This keeps a clean history in GitHub of each design iteration.

## Conventions

- Component files use **kebab-case** (e.g., `crisis-map.tsx`)
- React component names use PascalCase as usual
- Use **bun** for package management and builds (not npm)

## Routes

- `/` — Crisis propagation map (`crisis-map.tsx`)
