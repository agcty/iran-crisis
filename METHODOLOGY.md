# Projection Methodology

How we model the forward projections (Days 36-90) and why we made the choices we did. The point is not perfect prediction — it's making our assumptions explicit so you can judge the reasoning.

## Three Scenarios

| Scenario | Probability | Brent Target | Rationale |
|----------|------------|-------------|-----------|
| A: Ceasefire | 12% | $95/bbl | Deal by April 6. Hormuz reopens via S-curve over 2-4 weeks. $95 (not $72 pre-war) because Qatar LNG trains need 3-5 years to repair, insurance stays elevated, 15,000+ targets hit in Iran. The pre-war world is gone for years. |
| B: Grind | 50% | $140/bbl | War winds down but Strait stays closed. IRGC tollbooth expands slowly (12→20 transits/day). Europe outbid by Asia for every available barrel. Sustained disruption + cargo diversion premium. |
| C: Escalation | 38% | $195/bbl | April 6 power grid strikes + Houthi Bab al-Mandeb blockade. $200 oil per Macquarie (40% probability). Saudi Yanbu bypass threatened. |

Probabilities cross-checked against: Polymarket (ceasefire by Apr 30 ~10-15%), Capital Alpha Partners (45% fall resolution), IndraStra (42% controlled escalation), Macquarie (40% escalation). Our numbers are within the market/analyst consensus range.

## Oil Price Model

**Exponential mean-reversion**: `price(d) = target + (prev - target) * exp(-1/tau)`

Each day, the price decays toward the scenario target from the previous day's value. The time constant (tau) controls how fast:
- Ceasefire tau=20 days (fast: markets price in relief quickly)
- Grind tau=35 days (slow: gradual realization of sustained disruption)
- Escalation tau=25 days (medium-fast: shock events drive rapid repricing)

**Why not linear?** Oil prices don't move linearly. They spike on shocks and mean-revert toward a new equilibrium. Exponential decay captures this naturally — fast initial movement, then convergence.

**Dubai physical spread**: Models the paper-vs-physical disconnect. Dubai trades at a premium to Brent because physical barrels in Asia are scarcer than paper contracts in London. Spread widens in escalation ($50) and narrows in ceasefire ($6).

**Seeded noise**: Deterministic pseudo-random noise (±3%) prevents unrealistically smooth curves without flickering on re-render.

**Limitation**: Brent converges to ~$102 in ceasefire rather than exactly $95 due to rounding. This is acceptable — markets never perfectly price in targets.

## Fuel Depletion Model

This is the most complex part. Each country's daily fuel reserves are computed as:

```
new_reserves = old_reserves - (consumption - resupply)
```

Where:

### Consumption

```
consumption = baseBurn × rationingFactor × priceElasticity × euSupplyStress
```

- **baseBurn**: Per-country daily consumption rate (days/day) based on EIA/IEA country profiles. Pakistan=1.2, UK=1.3, Germany=0.8, USA=1.5, Spain=0.5.
- **rationingFactor**: When reserves drop below 30 days, governments ration. Factor = `multiplier × (reserves/30)`, floored at 0.1. Deeper crisis = deeper rationing. This creates the "long tail" where the last 10 days stretch to 20+ calendar days.
- **priceElasticity**: `1 - 0.06 × (brent-72)/72`. Short-run demand elasticity of -0.06 (literature: -0.024 to -0.077, midpoint per SocGen/Dallas Fed). At $195 Brent, demand drops ~10%.
- **euSupplyStress**: Europe-only multiplier that ramps from 1.0x to 2.5x starting Day 42 as pre-closure inventories deplete and cargo diversion kicks in (see below).

### Resupply

```
resupply = baseBurn × hormuzBenefit × accessMultiplier × 0.7
```

- **hormuzBenefit**: `transits/138` — what fraction of normal Hormuz flow exists.
- **accessMultiplier**: Iran's tollbooth is selective. Pakistan=5x, China=6x, India=4x (approved list). UK=0.15x, USA=0.2x (blocked). Based on UANI shipping data (80%+ of March transits are shadow fleet / approved nations).
- **0.7 damping**: Even with Hormuz access, damaged infrastructure (refineries, ports, insurance) limits effective resupply.

When resupply > consumption (e.g., ceasefire with Hormuz reopened), reserves **rebuild** — capped at pre-war level.

### Why this structure matters

The model captures the **geopolitical access divide**: countries with Iran deals maintain supply while Western-aligned countries burn through reserves. Pakistan stabilizes at ~20-22d in Grind because Iran keeps ships flowing. UK depletes to 2.4d because Shell's CEO correctly identified it as "the worst hit major economy."

## European Supply Chain Stress

The most important modeling choice. Europe's crisis is NOT about reserves draining linearly — it's about the **inflow of refined products collapsing**.

### Why Europe is different

1. Only ~6% of EU crude directly transits Hormuz. But **20% of EU diesel** and **50-60% of EU jet fuel** comes from the Gulf as finished product (S&P Global, Argus).
2. Russia's gasoline export ban (Apr 1) removes another source.
3. Asian buyers outbid Europe 5:1 for non-Gulf cargoes (ship-tracking data, Euronews).
4. European refinery closures (Shell Wesseling, BP Scholven, Grangemouth) reduce domestic capacity.
5. The last pre-closure cargoes have 2-4 week transit times — consumed by Day ~47.

### The cascade (Shell CEO Sawan, CERAWeek)

> "South Asia was first to get that brunt. That's moved to Southeast Asia, Northeast Asia and then more so into Europe as we get into April."

### The timeline

| Day | EU Stress Multiplier | What's happening |
|-----|---------------------|------------------|
| 35-42 | 1.0x | Pre-closure cargoes still arriving. No additional stress. |
| 42-55 | 1.0→1.65x | Last cargoes consumed. "Second week of April" price shock (analysts). |
| 55-62 | 1.65→2.0x | Stations dry at scale. Germany minister's "end of April" window. |
| 62-70 | 2.0→2.25x | Formal rationing expands. Ryanair CEO: "early May." |
| 70+ | 2.25→2.5x cap | Supply chain breakdown. Industrial shutdowns begin. |

In ceasefire, stress eases after Day 55 as Hormuz reopens.

### Country-specific access multipliers

| Country | Hormuz Access | Rationale |
|---------|--------------|-----------|
| China | 6.0x | Largest buyer, yuan payments, negotiated safe passage |
| Pakistan | 5.0x | Iran deal Day 30: 20 ships through |
| India | 4.0x | Major buyer, ~25% of Hormuz oil |
| Thailand | 4.0x | Added to approved list Day 29 |
| Philippines | 3.0x | Added to approved list Day 35 |
| South Korea | 2.5x | 20M barrel swap program |
| Spain | 0.4x | Americas-sourced crude, 60% renewables |
| Italy | 0.35x | Libya/Algeria pipelines help somewhat |
| Germany | 0.3x | Losing bidding war, 5:1 tanker ratio |
| France | 0.3x | First French ship exited Day 35 — symbolic |
| Austria | 0.25x | Landlocked, depends on German/Italian refineries |
| Australia | 0.2x | US ally, isolated |
| USA | 0.2x | Combatant, zero direct Hormuz access |
| UK | 0.15x | "Worst hit major economy" (Shell CEO) |

## Pump Price Model

Two components:

1. **Brent passthrough**: `preWar × (1 + passthrough × brentChange)`. The passthrough coefficient is inferred from real data (how much each country's pump price moved relative to Brent in Days 1-35). India has low passthrough (~0.15, government absorbs shock). Germany has high passthrough (~0.64).

2. **Scarcity premium**: When fuel reserves drop below 20 days, prices decouple from Brent. `scarcity = 1 + max(0, (20-fuelDays)/20) × 2.0`. At 10 days: 1.5x. At 3 days: 2.5x. At 0: 3.0x. This models panic buying, hoarding, black markets, and physical unavailability. UK diesel goes from 187p at Day 36 to 573p/L at Day 90 in Grind — not because Brent moved that much, but because there's 2.4 days of fuel left.

## Severity Model

Country severity (0-5 scale) is projected with:
- **Trend**: Escalate every N days (grind=20, escalation=8) or de-escalate (ceasefire=10).
- **Fuel override**: Countries below 5 days → severity 5 (crisis). Below 15 → severity 4 (rationing). Fuel depletion forces escalation regardless of the general trend.
- **Caps**: Russia capped at 2 (net beneficiary, $151B extra revenue). China at 4, Saudi at 4.
- **Floors**: Iran≥4, Israel≥3, Qatar≥3, Yemen≥4. War-zone countries don't magically normalize in ceasefire.

## Other Projected Metrics

- **SPR**: Cumulative release at configured daily rate, capped at 400M (IEA policy limit, not 1485M total reserves). Stops at scenario-specific day.
- **EU gas storage**: Daily drawdown (0.15-0.3%/day), floor at scenario minimum. Ceasefire restocking begins Day 55.
- **Gold**: Mean-reverts toward $5,100 (ceasefire, recovery), $4,900 (grind), $5,500 (escalation, safe haven).
- **VIX**: Mean-reverts toward 18 (ceasefire), 28 (grind), 40 (escalation).
- **Hormuz transits**: Logistic S-curve for ceasefire reopening. Linear drift for grind (12→20) and escalation (12→5).

## What This Model Cannot Do

- Predict specific events (attacks, deals, political decisions)
- Model second-order economic effects (unemployment, GDP, trade flows)
- Account for black swan events (nuclear escalation, cyber attacks on energy grids)
- Capture intra-day market dynamics or speculative trading
- Model individual refinery operations or pipeline routing decisions

The model is a scenario-based projection tool, not a crystal ball. Its value is in making the assumptions explicit and showing the *shape* of each scenario's consequences.

## Sources

Key sources informing model parameters:
- Shell CEO Sawan cascade prediction (CERAWeek, Mar 24)
- IEA "largest supply disruption in history" + April warning
- Germany Economy Minister Reiche "end of April" (Brussels Signal)
- Goldman Sachs base case + adverse scenarios (CNBC)
- Macquarie $200 oil / 40% escalation probability (Bloomberg)
- Polymarket ceasefire/conflict resolution odds
- Capital Alpha Partners resolution timeline
- S&P Global: ME diesel exports to Europe (519K b/d record 2025)
- Argus: UK "most at risk in Europe" for jet/diesel
- UANI: Hormuz transit tracking data
- DOE: SPR capacity and drawdown rates
- Dallas Fed / SocGen: oil demand elasticity research
- ÖAMTC / BMWET: Austria Fuel Price Brake details
- Euronews: cargo diversion tracking
- CNBC: IEA 400M barrel coordinated release
