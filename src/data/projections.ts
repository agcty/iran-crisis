// Projection engine for Iran crisis scenarios
// Generates Days 36-90 from Day 35 real data + scenario parameters
// Uses forward Euler simulation with feedback loops for fuel depletion

import {
  BRENT_PRICES,
  DUBAI_PRICES,
  JET_FUEL_PRICES,
  SPR_RELEASED,
  IEA_RESERVES_TOTAL,
  EU_GAS_STORAGE,
  FORCE_MAJEURES,
  SIGNAL_ACTION_GAPS,
  UNREST_INDEX,
  GOLD_PRICES,
  VIX,
  FUEL_DAYS,
  PUMP_PRICES,
  COUNTRY_STATUS,
  TOTAL_DAYS,
} from './crisis-data';

// ── Types ──

export type ScenarioId = 'ceasefire' | 'grind' | 'escalation';

export interface ScenarioParams {
  id: ScenarioId;
  label: string;
  shortLabel: string;
  description: string;
  color: string;
  probability: number; // 0-1

  // Hormuz reopening
  hormuzReopenStartDay: number | null; // absolute day, null = stays closed
  hormuzReopenFullDay: number | null;
  hormuzFloorTransits: number;
  hormuzCeilingTransits: number;

  // Oil prices
  brentTarget: number;
  brentTauDays: number;
  dubaiSpreadTarget: number;
  jetFuelBrentRatio: number;

  // Fuel depletion
  bypassSupplyMbpd: number;
  sprRateMbpd: number;
  sprStopDay: number | null;
  rationingMultiplier: number;
  rationingThresholdDays: number;

  // EU gas
  gasDrawdownPerDay: number;
  gasFloorPct: number;
  gasRestockStartDay: number | null;
  gasRestockPerDay: number;

  // Severity trajectory
  severityTrend: 'hold' | 'escalate' | 'deescalate';
  severityIntervalDays: number;

  // Projected narrative events
  events: ProjectedEvent[];
}

export interface ProjectedEvent {
  day: number; // absolute day (36-90)
  country: string;
  text: string;
}

export interface ProjectedDay {
  day: number;
  date: string;
  isProjected: true;
  brent: number;
  dubai: number;
  spread: number;
  jetFuel: number;
  jetFuelChange: number;
  hormuzTransits: number;
  hormuzFlow: number;
  supplyOffline: number;
  sprReleased: number;
  sprRemaining: number;
  euGasStorage: number;
  gold: number;
  vix: number;
  forceMajeures: number;
  signalGaps: number;
  unrest: number;
  affected: number;
  rationing: number;
  emergencies: number;
  fuelDays: Record<string, number>;
  pumpPrices: Record<string, number>;
  countrySeverity: Record<string, number>;
}

export interface ScenarioProjection {
  scenario: ScenarioParams;
  days: ProjectedDay[]; // 55 entries, Days 36-90
}

// ── Scenario Definitions ──

export const SCENARIOS: Record<ScenarioId, ScenarioParams> = {
  ceasefire: {
    id: 'ceasefire',
    label: 'Ceasefire',
    shortLabel: 'A',
    description: 'Deal by April 6. Hormuz reopens gradually over 2-4 weeks.',
    color: '#66bb6a',
    probability: 0.12,

    hormuzReopenStartDay: 40,
    hormuzReopenFullDay: 58,
    hormuzFloorTransits: 12,
    hormuzCeilingTransits: 130, // not quite pre-war due to lingering risk

    brentTarget: 95,  // infrastructure damage premium: Qatar LNG 3-5yr repair, 15K+ targets hit,
                       // insurance elevated for months. Pre-war $72 world gone for years.
    brentTauDays: 20,
    dubaiSpreadTarget: 6, // wider than pre-war due to lingering physical market stress
    jetFuelBrentRatio: 15.5, // $/mt per $/bbl (jet ~15.5x brent in $/mt terms)

    bypassSupplyMbpd: 4.5, // Yanbu port bottleneck limits to ~4.0-4.5 despite 7 mbpd pipeline (Argus)
    sprRateMbpd: 3.6,
    sprStopDay: 60,
    rationingMultiplier: 0.7,
    rationingThresholdDays: 30,

    gasDrawdownPerDay: 0.15,
    gasFloorPct: 20,
    gasRestockStartDay: 55,
    gasRestockPerDay: 0.25,

    severityTrend: 'deescalate',
    severityIntervalDays: 10,

    events: [
      { day: 38, country: 'Global', text: 'Ceasefire agreement signed. Hormuz demining operations begin.' },
      { day: 45, country: 'IEA', text: 'SPR release rate reduced as crisis eases. Markets stabilizing.' },
      { day: 55, country: 'Qatar', text: 'Hormuz-related force majeure lifted. But Ras Laffan LNG damage (17% capacity) needs 3-5 years to repair.' },
      { day: 65, country: 'Global shipping', text: 'Hormuz transits above 100/day. Insurance premiums falling. Mine clearance ongoing.' },
    ],
  },

  grind: {
    id: 'grind',
    label: 'Grind',
    shortLabel: 'B',
    description: 'War winds down but Strait remains contested. Tollbooth expands slowly.',
    color: '#ffab40',
    probability: 0.50,

    hormuzReopenStartDay: null,
    hormuzReopenFullDay: null,
    hormuzFloorTransits: 12,
    hormuzCeilingTransits: 20, // tollbooth slowly expands

    brentTarget: 140,  // sustained partial-disruption + cargo diversion premium
    brentTauDays: 35,
    dubaiSpreadTarget: 22, // Asian premium widens as bidding war intensifies
    jetFuelBrentRatio: 16.5,

    bypassSupplyMbpd: 4.5, // Yanbu port bottleneck (Argus: pipeline 7 mbpd, port ~4.5 effective)
    sprRateMbpd: 3.6,
    sprStopDay: 80,
    rationingMultiplier: 0.6,
    rationingThresholdDays: 30,

    gasDrawdownPerDay: 0.2,
    gasFloorPct: 15,
    gasRestockStartDay: null,
    gasRestockPerDay: 0,

    severityTrend: 'escalate',
    severityIntervalDays: 20,

    events: [
      { day: 38, country: 'USA', text: 'Trump declares "mission accomplished." Begins withdrawal timeline.' },
      { day: 45, country: 'UK', text: 'Starmer 35-nation coalition begins Hormuz escort planning.' },
      { day: 55, country: 'Germany', text: 'First fuel shortages reported. End-of-April warning materializes.' },
      { day: 65, country: 'EU', text: 'Emergency energy summit. Mandatory demand reduction discussed.' },
      { day: 75, country: 'Global', text: 'European recession officially declared. Q2 GDP negative.' },
    ],
  },

  escalation: {
    id: 'escalation',
    label: 'Escalation',
    shortLabel: 'C',
    description: 'Power grid strikes + Houthi Red Sea blockade. $200 oil.',
    color: '#ff4444',
    probability: 0.38,

    hormuzReopenStartDay: null,
    hormuzReopenFullDay: null,
    hormuzFloorTransits: 12,
    hormuzCeilingTransits: 5, // drops as Houthis threaten Bab al-Mandeb

    brentTarget: 195,
    brentTauDays: 25,
    dubaiSpreadTarget: 50,
    jetFuelBrentRatio: 18.0,

    bypassSupplyMbpd: 3.0, // Yanbu port ~4.5 normal, but Houthi threats to Red Sea tankers reduce to ~3.0
    sprRateMbpd: 4.4, // max drawdown rate
    sprStopDay: 70, // countries start hoarding
    rationingMultiplier: 0.5,
    rationingThresholdDays: 30,

    gasDrawdownPerDay: 0.3,
    gasFloorPct: 10,
    gasRestockStartDay: null,
    gasRestockPerDay: 0,

    severityTrend: 'escalate',
    severityIntervalDays: 8,

    events: [
      { day: 38, country: 'USA', text: 'US strikes all Iranian power plants simultaneously. 85M people lose electricity.' },
      { day: 42, country: 'Yemen', text: 'Houthis declare Bab al-Mandeb blockade. Red Sea shipping halted.' },
      { day: 48, country: 'Iran', text: 'Iran retaliates against Saudi Abqaiq. 5M bpd processing offline.' },
      { day: 55, country: 'EU', text: 'Formal fuel rationing across Europe. Driving bans in Germany, France.' },
      { day: 73, country: 'Global', text: 'Brent passes $180. IEA declares "unprecedented energy emergency."' },
      { day: 85, country: 'USA', text: 'US gas above $6.50/gal. Recession deepens. Calls for withdrawal intensify.' },
    ],
  },
};

// ── Projection Math ──

// Seeded pseudo-random for deterministic noise (no flickering on re-render)
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

// Logistic S-curve: 0→1 over the transition period
function logistic(day: number, startDay: number, fullDay: number): number {
  const midpoint = (startDay + fullDay) / 2;
  const k = 8 / (fullDay - startDay);
  return 1 / (1 + Math.exp(-k * (day - midpoint)));
}

// ── Projection Engine ──

export function generateProjection(scenario: ScenarioParams): ScenarioProjection {
  const PROJ_DAYS = 55; // Days 36-90
  const days: ProjectedDay[] = [];

  // Initial conditions from Day 35 (index 34)
  const d35 = TOTAL_DAYS - 1;
  let prevBrent = BRENT_PRICES[d35];
  let prevDubai = DUBAI_PRICES[d35];
  let prevSpr = SPR_RELEASED[d35];
  let prevGas = EU_GAS_STORAGE[d35];
  let prevGold = GOLD_PRICES[d35];
  let prevVix = VIX[d35];

  // Initial fuel days per country
  const prevFuelDays: Record<string, number> = {};
  for (const [code, data] of Object.entries(FUEL_DAYS)) {
    prevFuelDays[code] = data.days[d35];
  }

  // Initial severity per country
  const prevSeverity: Record<string, number> = {};
  for (const [code, arr] of Object.entries(COUNTRY_STATUS)) {
    prevSeverity[code] = arr[d35];
  }

  // Pump price passthrough coefficients (inferred from real data)
  const pumpPassthrough: Record<string, number> = {};
  for (const [code, data] of Object.entries(PUMP_PRICES)) {
    const priceChange = data.prices[d35] / data.prices[0] - 1;
    const brentChange = BRENT_PRICES[d35] / BRENT_PRICES[0] - 1;
    pumpPassthrough[code] = brentChange > 0 ? priceChange / brentChange : 1;
  }

  for (let i = 0; i < PROJ_DAYS; i++) {
    const absDay = TOTAL_DAYS + 1 + i; // Day 36, 37, ... 90
    const projDay = i; // 0-indexed into projection

    // ── 1. Hormuz transits ──
    let hormuzTransits: number;
    if (scenario.hormuzReopenStartDay && scenario.hormuzReopenFullDay && absDay >= scenario.hormuzReopenStartDay) {
      const t = logistic(absDay, scenario.hormuzReopenStartDay, scenario.hormuzReopenFullDay);
      hormuzTransits = Math.round(scenario.hormuzFloorTransits + (scenario.hormuzCeilingTransits - scenario.hormuzFloorTransits) * t);
    } else if (!scenario.hormuzReopenStartDay) {
      // Slowly drift toward ceiling (tollbooth expansion) or floor (escalation tightening)
      const drift = (scenario.hormuzCeilingTransits - scenario.hormuzFloorTransits) * (projDay / PROJ_DAYS);
      hormuzTransits = Math.round(scenario.hormuzFloorTransits + drift);
    } else {
      hormuzTransits = scenario.hormuzFloorTransits;
    }
    hormuzTransits = Math.max(0, Math.min(138, hormuzTransits));

    // Hormuz flow (mbpd) scales with transits
    const hormuzFlow = (hormuzTransits / 138) * 20.9;

    // ── 2. Oil prices (incremental exponential mean-reversion + noise) ──
    // Single-step decay: each day decays from previous value by one day's worth
    const brentDecay = Math.exp(-1 / scenario.brentTauDays);
    const noise = (seededRandom(absDay * 7 + scenario.id.charCodeAt(0)) - 0.5) * 0.03;
    const brent = Math.round(scenario.brentTarget + (prevBrent - scenario.brentTarget) * brentDecay * (1 + noise));

    const prevSpread = prevDubai - prevBrent;
    const spreadDecay = Math.exp(-1 / (scenario.brentTauDays * 0.7));
    const dubaiSpread = scenario.dubaiSpreadTarget + (prevSpread - scenario.dubaiSpreadTarget) * spreadDecay;
    const dubai = Math.round(brent + dubaiSpread);

    const jetFuel = Math.round(brent * scenario.jetFuelBrentRatio);

    // ── 3. SPR ──
    // IEA coordinated release capped at ~400M bbl (not total reserves of 1485M)
    const IEA_RELEASE_CAP = 400;
    let sprReleased: number;
    if (scenario.sprStopDay && absDay > scenario.sprStopDay) {
      sprReleased = prevSpr;
    } else {
      sprReleased = Math.min(IEA_RELEASE_CAP, prevSpr + scenario.sprRateMbpd);
    }

    // ── 4. Supply offline ──
    const supplyOffline = Math.max(0, 20.9 - hormuzFlow - scenario.bypassSupplyMbpd);

    // ── 5. EU gas storage ──
    let gasStorage: number;
    if (scenario.gasRestockStartDay && absDay >= scenario.gasRestockStartDay) {
      gasStorage = Math.min(100, prevGas - scenario.gasDrawdownPerDay + scenario.gasRestockPerDay);
    } else {
      gasStorage = Math.max(scenario.gasFloorPct, prevGas - scenario.gasDrawdownPerDay);
    }

    // ── 6. Fuel days per country ──
    const fuelDays: Record<string, number> = {};
    // Short-run demand elasticity -0.06 (literature: -0.024 to -0.077, SocGen/Fed central: -0.05)
    const priceElasticity = 1 - 0.06 * ((brent - 72) / 72);

    for (const [code, data] of Object.entries(FUEL_DAYS)) {
      const prev = prevFuelDays[code];
      if (prev <= 0) {
        fuelDays[code] = 0;
        continue;
      }

      // Rationing factor: kicks in below threshold, gets stronger as reserves drop
      let rationingFactor = 1.0;
      if (prev < scenario.rationingThresholdDays) {
        rationingFactor = scenario.rationingMultiplier * (prev / scenario.rationingThresholdDays);
        rationingFactor = Math.max(0.1, rationingFactor); // never fully zero
      }

      // Supply recovery: Hormuz reopening restores imports, reducing net drain
      // Iran's tollbooth is SELECTIVE: approved nations (PAK, IND, CHN, THA, MYS, RUS, KOR via swap)
      // get disproportionate access. Western nations get almost nothing until full reopening.
      const globalHormuzBenefit = hormuzTransits / 138; // 0-1
      const countryAccess = HORMUZ_ACCESS_MULTIPLIER[code] ?? 1.0;
      const hormuzBenefit = Math.min(1, globalHormuzBenefit * countryAccess);
      const baseBurn = inferBaseBurn(code, data);

      // European supply chain stress: accelerates depletion as pre-closure inventories deplete
      const euStress = EU_SUPPLY_STRESS_COUNTRIES.has(code) ? getEuSupplyStress(absDay, scenario.id) : 1.0;

      // Consumption = base demand reduced by rationing and price elasticity, amplified by supply stress
      const consumption = baseBurn * rationingFactor * priceElasticity * euStress;
      // Resupply = proportion of normal supply restored via Hormuz
      // Damped by 0.7 to account for damaged infrastructure (refineries, ports, insurance)
      const resupply = baseBurn * hormuzBenefit * 0.7;
      // Net burn: positive = draining, negative = refilling
      const effectiveBurn = consumption - resupply;

      // Cap at [0, preWar] — can't go negative or exceed pre-war levels
      const newFuel = prev - effectiveBurn;
      fuelDays[code] = Math.max(0, Math.min(data.preWar, Math.round(newFuel * 10) / 10));
      prevFuelDays[code] = fuelDays[code];
    }

    // ── 7. Pump prices ──
    // Two components: (1) Brent passthrough (commodity cost), (2) scarcity premium
    // When a country approaches fuel depletion, prices decouple from Brent and spike
    // due to panic buying, hoarding, black market, and physical unavailability.
    const pumpPricesDay: Record<string, number> = {};
    for (const [code, data] of Object.entries(PUMP_PRICES)) {
      const passthrough = pumpPassthrough[code] || 1;
      const brentRatio = brent / BRENT_PRICES[0] - 1;
      let price = data.preWar * (1 + passthrough * brentRatio);

      // Scarcity premium: kicks in when country's fuel reserves drop below 20 days
      const countryFuel = fuelDays[code];
      if (countryFuel !== undefined && countryFuel < 20) {
        // Scarcity multiplier: 1.0 at 20 days, 1.5 at 10 days, 2.5 at 3 days, 3.0 at 0 days
        const scarcity = 1 + Math.max(0, (20 - countryFuel) / 20) * 2.0;
        price *= scarcity;
      }

      pumpPricesDay[code] = Math.round(price * 100) / 100;
    }

    // ── 8. Country severity ──
    // Per-country caps: beneficiary nations don't escalate to crisis
    // Per-country floors: war-zone countries don't de-escalate to normal
    const SEVERITY_CAPS: Record<string, number> = {
      RUS: 2, // net beneficiary ($151B extra revenue)
      CHN: 4, // major domestic producer, massive reserves
      SAU: 4, // profiting from bypass pipeline, but still under missile threat
    };
    const SEVERITY_FLOORS: Record<string, number> = {
      IRN: 4, // country being bombed, infrastructure destroyed
      ISR: 3, // active combatant, casualties
      QAT: 3, // LNG infrastructure physically damaged (3-5yr repair)
      YEM: 4, // active combatant (Houthis)
      LBN: 3, // 1,300+ killed, Hezbollah active
      IRQ: 3, // 70% Basra production cut, fiscal crisis
    };

    const countrySeverity: Record<string, number> = {};
    for (const [code, prev] of Object.entries(prevSeverity)) {
      let sev = prev;
      if (scenario.severityTrend === 'escalate' && projDay > 0 && projDay % scenario.severityIntervalDays === 0) {
        sev = Math.min(5, prev + 1);
      } else if (scenario.severityTrend === 'deescalate' && projDay > 0 && projDay % scenario.severityIntervalDays === 0) {
        sev = Math.max(0, prev - 1);
      }
      // Countries in fuel crisis escalate regardless
      const countryFuel = fuelDays[code];
      if (countryFuel !== undefined && countryFuel <= 5 && sev < 5) sev = 5;
      else if (countryFuel !== undefined && countryFuel <= 15 && sev < 4) sev = 4;

      // Apply per-country caps and floors
      const cap = SEVERITY_CAPS[code];
      if (cap !== undefined && sev > cap) sev = cap;
      const floor = SEVERITY_FLOORS[code];
      if (floor !== undefined && sev < floor) sev = floor;

      countrySeverity[code] = sev;
      prevSeverity[code] = sev;
    }

    // ── 9. Derived metrics ──
    // Gold: recovers toward pre-war in ceasefire (USD weakens, liquidation unwinds),
    // surges in escalation (safe haven). Pre-war was $5,278.
    const goldTarget = scenario.id === 'ceasefire' ? 5100 : scenario.id === 'escalation' ? 5500 : 4900;
    const goldDecay = Math.exp(-1 / 30); // single-step decay, tau=30 days
    const gold = Math.round(goldTarget + (prevGold - goldTarget) * goldDecay);

    // VIX: mean-reverts toward scenario-specific level
    const vixTarget = scenario.id === 'ceasefire' ? 18 : scenario.id === 'escalation' ? 40 : 28;
    const vixDecay = Math.exp(-1 / 15); // single-step decay, tau=15 days
    const vixNoise = (seededRandom(absDay * 13 + 7) - 0.5) * 3;
    const vixVal = Math.round((vixTarget + (prevVix - vixTarget) * vixDecay + vixNoise) * 10) / 10;

    // Count severity stats
    let affected = 0, rationing = 0, emergencies = 0;
    for (const sev of Object.values(countrySeverity)) {
      if (sev >= 2) affected++;
      if (sev >= 4) rationing++;
      if (sev >= 5) emergencies++;
    }

    // Generate date string
    const dateObj = new Date(2026, 1, 28 + absDay - 1); // Feb 28 = Day 1
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const date = `${months[dateObj.getMonth()]} ${dateObj.getDate()}`;

    days.push({
      day: absDay,
      date,
      isProjected: true,
      brent,
      dubai,
      spread: dubai - brent,
      jetFuel,
      jetFuelChange: Math.round((jetFuel / JET_FUEL_PRICES[0] - 1) * 100),
      hormuzTransits,
      hormuzFlow: Math.round(hormuzFlow * 10) / 10,
      supplyOffline: Math.round(supplyOffline * 10) / 10,
      sprReleased: Math.round(sprReleased * 10) / 10,
      sprRemaining: Math.round((IEA_RESERVES_TOTAL - sprReleased) * 10) / 10,
      euGasStorage: Math.round(gasStorage * 10) / 10,
      gold,
      vix: vixVal,
      forceMajeures: FORCE_MAJEURES[d35], // holds
      signalGaps: SIGNAL_ACTION_GAPS[d35], // holds
      unrest: Math.max(0, Math.min(5, UNREST_INDEX[d35] + (scenario.severityTrend === 'escalate' ? Math.floor(projDay / 15) : scenario.severityTrend === 'deescalate' ? -Math.floor(projDay / 15) : 0))),
      affected,
      rationing,
      emergencies,
      fuelDays,
      pumpPrices: pumpPricesDay,
      countrySeverity,
    });

    // Update prev state for next iteration
    prevBrent = brent;
    prevDubai = dubai;
    prevSpr = sprReleased;
    prevGas = gasStorage;
    prevGold = gold;
    prevVix = vixVal;
  }

  return { scenario, days };
}

// Daily burn rate based on country's pre-war reserves and consumption patterns.
// Countries with large reserves burn faster in absolute terms because they consume more.
// These rates represent "unrationed" daily consumption as a fraction of total reserves.
// Source: EIA, IEA country profiles, national energy agency data.
// Hormuz access multiplier: Iran's selective passage ("tollbooth") favors approved nations.
// Multiplier applied to global hormuzBenefit to get country-specific supply recovery.
// >1 = gets more than fair share (approved list), <1 = gets less (Western nations blocked).
// Source: UANI shipping data — 80%+ of March transits are shadow fleet / approved nations.
// Approved list: China, Russia, India, Pakistan, Iraq, Malaysia, Thailand, Philippines.
const HORMUZ_ACCESS_MULTIPLIER: Record<string, number> = {
  PAK: 5.0,   // Iran deal Day 30: 20 ships allowed through. Strong bilateral.
  IND: 4.0,   // Major buyer, negotiated passage. ~25% of Hormuz oil goes to India.
  CHN: 6.0,   // Largest buyer. China negotiating safe passage for all tankers. Yuan payments.
  KOR: 2.5,   // 20M barrel swap program, some tanker access
  JPN: 1.5,   // IEA ally but pragmatic — some access via intermediaries
  THA: 4.0,   // Added to approved list Day 29. Bilateral deal with Iran.
  PHL: 3.0,   // Added to approved list Day 35.
  IDN: 2.0,   // Non-aligned, some access but no formal deal
  USA: 0.2,   // Combatant — almost zero direct Hormuz access
  GBR: 0.15,  // "Expected to be worst hit major economy" (Shell CEO). 50% jet fuel from ME.
  DEU: 0.3,   // Neutral but losing bidding war. 5:1 tanker ratio heads East not West.
  FRA: 0.3,   // EU neutral; first French ship exited Day 35 but it's symbolic.
  ITA: 0.35,  // Libya/Algeria pipelines help. Qatar was 30% of gas — that's gone.
  AUT: 0.25,  // Landlocked, depends entirely on German/Italian refinery output.
  ESP: 0.4,   // Americas-sourced crude (Mexico, Nigeria). 60% renewables buffer. Best positioned in EU.
  AUS: 0.2,   // US ally, isolated, minimal Hormuz access
};

// European supply chain stress: Europe's crisis isn't about reserves draining linearly —
// it's about the inflow of refined products (diesel, jet fuel) collapsing as:
// 1. Last pre-closure cargoes are consumed (~4 weeks transit = Day ~32 arrival, consumed by Day ~47)
// 2. Asian buyers outbid Europe for every non-Gulf barrel (5:1 tanker ratio eastward)
// 3. Russia gasoline export ban (Apr 1) removes another source
// 4. Refinery closures (Shell Wesseling, BP Scholven, Grangemouth) reduce domestic capacity
//
// Shell CEO Sawan: "Europe by April." Germany's Reiche: "end of April." IEA: "April will be 2x worse."
// Timeline: Day ~42-47 price shock, Day ~55-62 stations dry at scale, Day ~65-70 formal rationing.
//
// This stress factor accelerates burn rate for European countries starting around Day 42.
// It's a multiplier on top of the base burn that models the supply chain cliff.
const EU_SUPPLY_STRESS_COUNTRIES = new Set(['GBR', 'DEU', 'FRA', 'ITA', 'AUT', 'ESP', 'NLD', 'POL']);

function getEuSupplyStress(absDay: number, scenarioId: ScenarioId): number {
  if (scenarioId === 'ceasefire' && absDay > 55) return 1.0; // stress eases after Hormuz reopens
  // Stress ramps up as pre-closure inventories deplete
  // Day 35: stress=1.0 (no additional stress yet — cargoes still arriving)
  // Day 42-47: stress=1.3-1.5 (last cargoes consumed, price shock begins)
  // Day 55-62: stress=1.8-2.0 (stations dry, bidding war intensifies)
  // Day 70+: stress=2.0-2.5 (full supply chain breakdown)
  if (absDay <= 42) return 1.0;
  if (absDay <= 55) return 1.0 + (absDay - 42) * 0.05; // 1.0 → 1.65
  if (absDay <= 70) return 1.65 + (absDay - 55) * 0.04; // 1.65 → 2.25
  return Math.min(2.5, 2.25 + (absDay - 70) * 0.01); // 2.25 → 2.5 cap
}

const BASE_BURN_RATES: Record<string, number> = {
  PAK: 1.2,   // ~26 days pre-war, high dependency, minimal domestic production
  IDN: 1.0,   // ~24 days, large population, import dependent
  IND: 0.8,   // ~40 days, large but diversified, some domestic production
  AUS: 0.9,   // ~53 days IEA basis, isolated, high per-capita consumption
  GBR: 1.3,   // ~90 days, but high consumption, no domestic buffer
  KOR: 1.5,   // ~208 days pre-war but extreme import dependency (97%)
  ITA: 1.0,   // ~90 days, moderate consumption
  FRA: 0.7,   // ~90 days, nuclear power reduces oil dependency for electricity
  DEU: 0.8,   // ~90 days, industrial economy but diversifying
  JPN: 1.2,   // ~254 days, massive reserves but high consumption
  USA: 1.5,   // ~125 days net-import basis, highest per-capita consumption
  PHL: 0.7,   // ~57 days, lower per-capita consumption
  AUT: 0.6,   // ~90 days, small landlocked, hydro power helps
  ESP: 0.5,   // ~90 days, 60% renewables buffer significantly reduces oil burn
};

function inferBaseBurn(code: string, _data: { preWar: number; days: number[] }): number {
  return BASE_BURN_RATES[code] ?? 0.8;
}

// ── Pre-generate all projections ──

export function generateAllProjections(): Record<ScenarioId, ScenarioProjection> {
  return {
    ceasefire: generateProjection(SCENARIOS.ceasefire),
    grind: generateProjection(SCENARIOS.grind),
    escalation: generateProjection(SCENARIOS.escalation),
  };
}

// ── Projection dates (Apr 4 - May 29) ──

export const PROJECTION_DAYS = 55;
export const MAX_DAY = TOTAL_DAYS + PROJECTION_DAYS; // 90
