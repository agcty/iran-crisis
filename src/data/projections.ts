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

    brentTarget: 82,
    brentTauDays: 20,
    dubaiSpreadTarget: 4,
    jetFuelBrentRatio: 15.5, // $/mt per $/bbl (jet ~15.5x brent in $/mt terms)

    bypassSupplyMbpd: 6.5,
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
      { day: 55, country: 'Qatar', text: 'Force majeure partially lifted. First LNG cargoes resume.' },
      { day: 65, country: 'Global shipping', text: 'Hormuz transits above 100/day. Insurance premiums falling.' },
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

    brentTarget: 135,
    brentTauDays: 35,
    dubaiSpreadTarget: 18,
    jetFuelBrentRatio: 16.5,

    bypassSupplyMbpd: 6.5,
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

    bypassSupplyMbpd: 4.0, // Yanbu threatened by Houthis
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
      { day: 65, country: 'Global', text: 'Brent passes $180. IEA declares "unprecedented energy emergency."' },
      { day: 80, country: 'USA', text: 'US gas above $7/gal. Recession deepens. Calls for withdrawal intensify.' },
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

    // ── 2. Oil prices (exponential mean-reversion + noise) ──
    const t = projDay + 1;
    const decay = Math.exp(-t / scenario.brentTauDays);
    const noise = (seededRandom(absDay * 7 + scenario.id.charCodeAt(0)) - 0.5) * 0.03;
    const brent = Math.round(scenario.brentTarget + (prevBrent - scenario.brentTarget) * decay * (1 + noise));

    const spreadDay35 = prevDubai - prevBrent;
    const spreadDecay = Math.exp(-t / (scenario.brentTauDays * 0.7));
    const dubaiSpread = scenario.dubaiSpreadTarget + (spreadDay35 - scenario.dubaiSpreadTarget) * spreadDecay;
    const dubai = Math.round(brent + dubaiSpread);

    const jetFuel = Math.round(brent * scenario.jetFuelBrentRatio);

    // ── 3. SPR ──
    let sprReleased: number;
    if (scenario.sprStopDay && absDay > scenario.sprStopDay) {
      sprReleased = prevSpr;
    } else {
      sprReleased = Math.min(IEA_RESERVES_TOTAL, prevSpr + scenario.sprRateMbpd);
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
    const priceElasticity = 1 - 0.07 * ((brent - 72) / 72);

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

      // Supply recovery factor: how much Hormuz reopening helps this country
      // Countries closer to Gulf (PAK, IND, KOR, JPN) benefit more from Hormuz
      const hormuzBenefit = hormuzTransits / 138; // 0-1
      const supplyRecovery = hormuzBenefit * 0.5; // up to 50% burn reduction from restored supply

      // Daily burn rate
      const baseBurn = inferBaseBurn(code, data);
      const effectiveBurn = baseBurn * rationingFactor * priceElasticity * (1 - supplyRecovery);

      fuelDays[code] = Math.max(0, Math.round((prev - effectiveBurn) * 10) / 10);
      prevFuelDays[code] = fuelDays[code];
    }

    // ── 7. Pump prices ──
    const pumpPricesDay: Record<string, number> = {};
    for (const [code, data] of Object.entries(PUMP_PRICES)) {
      const passthrough = pumpPassthrough[code] || 1;
      const brentRatio = brent / BRENT_PRICES[0] - 1;
      pumpPricesDay[code] = Math.round(data.preWar * (1 + passthrough * brentRatio) * 100) / 100;
    }

    // ── 8. Country severity ──
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

      countrySeverity[code] = sev;
      prevSeverity[code] = sev;
    }

    // ── 9. Derived metrics ──
    // Gold: inversely correlated with ceasefire hopes, positively with escalation
    const goldTarget = scenario.id === 'ceasefire' ? 4400 : scenario.id === 'escalation' ? 5500 : 4900;
    const goldDecay = Math.exp(-t / 30);
    const gold = Math.round(goldTarget + (prevGold - goldTarget) * goldDecay);

    // VIX: mean-reverts toward scenario-specific level
    const vixTarget = scenario.id === 'ceasefire' ? 18 : scenario.id === 'escalation' ? 40 : 28;
    const vixDecay = Math.exp(-t / 15);
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
      unrest: Math.min(5, UNREST_INDEX[d35] + (scenario.severityTrend === 'escalate' ? Math.floor(projDay / 15) : scenario.severityTrend === 'deescalate' ? -Math.floor(projDay / 15) : 0)),
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
