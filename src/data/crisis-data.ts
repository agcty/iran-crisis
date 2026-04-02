// Iran War Crisis Propagation — Feb 28 to Apr 2, 2026 (34 days, 40 countries)
// Data extracted from crisis-propagation-map.html + multi-agent validation

export const DATES = [
  "Feb 28","Mar 1","Mar 2","Mar 3","Mar 4","Mar 5","Mar 6","Mar 7","Mar 8","Mar 9",
  "Mar 10","Mar 11","Mar 12","Mar 13","Mar 14","Mar 15","Mar 16","Mar 17","Mar 18","Mar 19",
  "Mar 20","Mar 21","Mar 22","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 28","Mar 29","Mar 30","Mar 31","Apr 1","Apr 2",
] as const;

export const TOTAL_DAYS = DATES.length; // 34

// Oil prices per day ($/barrel, settlement/close unless noted)
// Validated: Pre-war $72.48 spot (Wikipedia). Intraday peak $119 on Mar 19 (CNBC),
// but close that day was $108.65. Highest close: $118.35 on Mar 31 (CNBC).
// Day 33: Brent opened $105.27, plunged to $98.52 intraday (briefly below $100 for first
// time in a week), settled ~$102. War premium deflated on Trump exit rhetoric.
// WTI ~$102.92. Dubai physical at $128.51 — $26 spread screams physical shortage.
// Day 34: Brent surged 7.4% to $108.62 after Trump "stone ages" speech. WTI +6.9% to $107.05.
// Hope rally completely reversed. Macquarie: 40% chance of $200 if war lasts to June.
export const BRENT_PRICES = [72,85,92,98,105,110,115,112,108,105,100,100,103,106,110,108,112,109,109,108,110,113,108,106,110,113,110,113,115,114,115,118,102,109];
// Dubai physical crude: confirmed peak $166-170/bbl (Seeking Alpha, CNBC).
// Pre-war $71. Spread to Brent hit ~$65 intraday Mar 18-19 (Manila Times).
// Revised from original to reflect verified physical market dislocation.
// Day 33: Dubai futures $128.51 (significantly above Brent — Asian premium + physical crunch).
// UAE fuel prices up 30% for April. Brent-Dubai spread $26 = extreme dislocation.
// Day 34: Dubai physical likely ~$135+ as Asian markets react to speech. KOSPI -4%.
export const DUBAI_PRICES = [71,88,96,105,115,130,140,138,125,118,112,110,120,128,140,135,150,158,166,155,140,150,138,132,140,145,138,130,128,125,126,124,128,135];

// European jet fuel CIF NWE ($/metric tonne, S&P Global Platts assessments)
// Pre-war: $831/mt. Peak: $1,698/mt on Mar 16 (all-time Platts record).
// ~50% of EU jet imports came from Middle East in 2025. Kuwait alone ~25%.
// Kuwait refineries struck Mar 19 → 260K bpd of 1.77M global seaborne jet trade.
// Jet-to-LSGO spread hit $400/mt (record). Bid-offer $30/mt wide (vs $0.50 normal).
// By Day 31, major EU airports warning airlines "no fuel available" within 1 week.
// Jet fuel leads diesel by 2-4 weeks (Shell CEO Sawan, CERAWeek Mar 24).
// Day 33: $1,710/mt confirmed (City AM, AirLive). 130% above pre-war $742.
// Tanker Maetiga (last known UK-bound ME jet fuel cargo) arriving ~Apr 3.
// Two ships departed New York → England — historically unprecedented reroute (Bloomberg).
// UK imports 50% of jet fuel from ME (Kuwait 38%/4.1mt). Argus: "most exposed in Europe."
// Kerosene stocks exhaust in ~3 months without Gulf supply. May = danger zone.
// Day 34: Jet fuel likely pushed higher on escalation fears. Maetiga arrives ~Apr 3.
export const JET_FUEL_PRICES = [831,870,935,1000,1100,1150,1200,1250,1300,1370,1435,1501,1540,1580,1620,1660,1698,1660,1620,1580,1550,1560,1570,1580,1590,1600,1620,1650,1680,1700,1700,1710,1710,1730];

// Strait of Hormuz oil flow (million barrels per day)
// Pre-crisis baseline: 20.9 mbpd (EIA, 2025 H1 average)
// Day 1: war starts late day, full day of normal flow
// Day 2-4: ships in transit clear; no new entries; flow collapses
// Day 5: Qatar force majeure on all LNG, near-total shutdown
// Day 6+: effectively closed (~0.2 mbpd residual small-vessel traffic)
// Day 29: Houthis enter war, even less; Day 30: Pakistan ships negotiated through
export const HORMUZ_FLOW = [20.9,14.0,6.0,2.5,0.8,0.5,0.3,0.3,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.1,0.5,0.3,0.4,0.3,0.3];

// Net global supply offline (million barrels per day)
// = pre-crisis Hormuz exports (~20.9 mbpd) minus bypass pipeline ramp-up
// Bypass infrastructure (sources: Bloomberg, S&P Global, EIA):
//   Saudi Petroline (Abqaiq→Yanbu): 7 mbpd pipe capacity, ~4.5 mbpd Yanbu port
//     loading capacity; pre-crisis ~2.5 mbpd, ramped to ~5 mbpd crude + 0.8 mbpd
//     refined products by late March. Pipeline hit full capacity Mar 11 (Day 12).
//   UAE ADCOP (Habshan→Fujairah): 1.5 mbpd capacity, pre-crisis 71% utilization
//     (~1.06 mbpd); ramped to full 1.5 mbpd within days.
//   Iraq Kirkuk-Ceyhan: resumed Sep 2025 at ~200-250 kbpd, suspended during conflict.
// Day 29 uptick: Houthis threaten Bab al-Mandeb, some Red Sea route risk
export const SUPPLY_OFFLINE = [0.0,8.5,14.0,16.5,17.5,17.2,17.0,16.8,16.5,16.2,16.0,15.5,15.2,15.0,14.8,14.8,14.5,14.5,14.5,14.5,14.4,14.4,14.4,14.4,14.4,14.4,14.4,14.4,14.8,14.2,14.5,14.3,14.3,14.3];

// IEA emergency reserves released — cumulative (million barrels)
// IEA announced record 400M barrel release on Day 12 (Mar 11, 2026):
//   US: 172M over 120 days (~1.43M bbl/day, starting ~Day 19 per DOE lead time)
//   Japan: ~80M (immediate, starting Day 13; 470M total reserves = 254 days cover)
//   Other IEA Asia (Korea, Australia): ~23M starting Day 13
//   Europe (Germany, France, etc.): ~97M starting ~Day 28 ("end of March")
// Release rates: Asia ~1.1M/day, +US ~2.5M/day from Day 19, +Europe ~3.6M/day from Day 28
// Sources: IEA collective action decision Mar 11 2026, DOE SPR data, Nippon.com
export const SPR_RELEASED = [0,0,0,0,0,0,0,0,0,0,0,0,1.1,2.2,3.3,4.4,5.5,6.6,9.1,11.7,14.2,16.7,19.2,21.8,24.3,26.8,29.4,33.0,36.6,40.2,43.8,47.4,51.0,54.6];

// Pre-crisis IEA total emergency reserves: ~1,485M barrels
// (US 415M + Japan 470M + other IEA ~600M; source: DOE, JOGMEC, IEA Oil Security)
export const IEA_RESERVES_TOTAL = 1485;

// Strait of Hormuz ship transits per day (non-Iranian AIS-visible)
// Pre-war: ~138/day (UANI data, validated). Kpler: 201 commodity carrier crossings Mar 1-31.
// Note: Lloyd's List reported 142 transits Mar 1-25 which includes Iranian-flagged vessels;
// our daily array tracks non-Iranian AIS-visible only, so totals will be lower.
// Day 2-3: Near zero (IRGC closure). Day 4-10: 0-2/day, 150+ tankers anchored outside
// Day 12-13: ~3/day, 21 attacks on ships by Day 13. Day 14-18: ~5/day (IRGC tollbooth)
// Day 19: 8 (Windward/MarineTraffic). Day 20+: 5-8/day, selective passage
// 5 nations approved: CN, RU, IN, PK, IQ. Additional: MY, TH (bilateral deals)
// 80%+ March transits are shadow fleet (up from 15% in Feb).
// IRGC claims up to $2M/transit (Iranian officials via IRIB, not independently verified)
// Sources: Lloyd's List, Windward, UANI, MarineTraffic, Kpler
export const HORMUZ_TRANSITS = [138,0,0,1,0,1,1,1,2,1,2,3,3,5,5,5,5,5,8,6,5,7,5,5,6,5,6,7,5,6,7,9,7,6];

// EU aggregate gas storage (% full, AGSI data)
// Feb 28: ~42%. Mar 8: ~35%. Mar 17: 28.93% (AGSI exact). Mar 25: ~28.4%. Mar 30: ~27.5%
// EU regulation requires 90% full by Nov 1. Last year same date: 34.47%
// Netherlands critically low at ~5-6%. Refill season normally Mar-Apr but requires
// LNG imports now disrupted by QatarEnergy force majeure.
// TTF gas: ~€38/MWh pre-war → ~€55-56/MWh by Mar 30. Goldman Q2: €72, adverse €100+
// Interpolated linearly between AGSI data points.
export const EU_GAS_STORAGE = [42.0,41.1,40.3,39.4,38.5,37.6,36.8,35.9,35.0,34.3,33.7,33.0,32.3,31.6,31.0,30.3,29.6,28.9,28.8,28.8,28.7,28.7,28.6,28.5,28.5,28.4,28.2,28.0,27.9,27.7,27.5,27.3,27.1,26.9];

// Force majeure declarations (cumulative count)
// Day 3: QatarEnergy (all LNG, 20% global offline, ~90 cargoes)
// Day 5: Alba (aluminum). Day 6: KPC (Kuwait oil). Day 8: Shell (selected LNG)
// Day 10: Bapco (Bahrain refinery, 380K bpd). Day 11: Iraq SOMO (Basra)
// Day 13: OQ Trading Oman (LNG to Bangladesh). Day 15: India (domestic gas redirect)
// Day 19: Wave across Asian petrochemical firms (Gulf feedstock)
// Day 25: QatarEnergy extended through May
// Day 32: QatarEnergy extends existing force majeure through mid-June (not a new declaration)
export const FORCE_MAJEURES = [0,0,1,1,2,3,3,4,4,5,6,6,7,7,8,8,8,8,9,9,9,9,9,9,10,10,10,10,10,10,10,10,10,10];

// Signal-action gap tracker (cumulative count)
// Countries simultaneously saying "remain calm / no shortage" while implementing
// emergency measures. The editorial core of this visualization.
// Day 7: India (Puri: "no cause of worry" → later imposed tax cuts + export levies)
// Day 10: +UK (Starmer: "not there yet" → reviewed National Emergency Plan)
// Day 12: +Japan ("no disruption" → largest-ever reserve release), +USA (SPR, prices rose 17%)
// Day 14: +Pakistan ("adequate supply" → later 4-day workweek + school closures)
// Day 23: +Slovenia ("no shortages" → army deployed), +Germany (downplays → warns of imminent crisis)
// Day 26: +Philippines (shift to national emergency after calm messaging)
// Day 28: +India (third "remain calm" amid visible pump lines)
// Day 30: +Australia ("supply secure" → 500+ stations ran dry)
// Day 31: +Japan ("remain calm" → emergency task force for medical supplies)
// Day 32: UK Ed.Sec. Phillipson "fill up as normal" while reviewing rationing powers
// Day 33: Albanese "enjoy Easter" (400+ stations dry) + Starmer "weather the storm" (diesel £100/tank)
//   + Peter Kyle "no supply chain issues at all" while last jet fuel tanker (Maetiga) en route
//   + Romania Energy Min. Ivan "rationing not being considered" while 3 of 4 refineries offline
// Day 34: Trump "nearing completion" + "stone ages" in same speech = gap 17
export const SIGNAL_ACTION_GAPS = [0,0,0,0,0,0,1,1,1,2,2,4,4,5,5,5,5,5,5,5,5,5,7,7,7,8,8,9,9,10,11,12,16,17];

// Protest / unrest escalation index (1-5 scale)
// 1=isolated, 2=scattered protests, 3=organized demonstrations,
// 4=mass events, 5=critical (millions mobilized / government stability at risk)
// Day 1-7: Pakistan protests (26-35 killed). Day 8-14: India fuel protests, PH tensions.
// Day 15-21: PH transport strike, BD military at depots, EG restrictions.
// Day 22-25: Fuel queue confrontations TH/BD/PH, EU border fuel tourism tensions.
// Day 26-28: PH nationwide strike. US "No Kings Day" Mar 28: 8-9M, 3300 events, 50 states.
//   Tel Aviv anti-war protest (18 arrests). Day 29-31: Sustained. Trump 36% approval.
export const UNREST_INDEX = [1,1,1,1,1,1,1,2,2,2,2,2,2,2,3,3,3,3,3,3,3,4,4,4,4,5,5,5,5,5,5,5,5,5];

// Gold price ($/oz, approximate daily close)
// Pre-war: $5,278 (Feb 28, confirmed StatMuse/TradingEconomics/goldprice.org).
// Gold hit ATH $5,595 on Jan 28-29 2026.
// COUNTERINTUITIVELY FELL during Iran war (~-17%), not the expected safe-haven rally.
// Reasons: USD strength (DXY multi-year highs), forced liquidations from overleveraged
// Jan rally positions, rising yields from oil-driven inflation fears, profit-taking.
// Validated low: ~$4,348 on Mar 23 (pricegold.net daily close), NOT $4,150.
// Day 33: Gold UP to ~$4,700 even on risk-on day — smart money not buying peace story
// Day 34: Gold likely higher as escalation confirmed — safe haven bid returns
export const GOLD_PRICES = [5278,5400,5350,5250,5150,5050,4950,4900,4850,4780,4700,4650,4600,4550,4500,4480,4450,4380,4350,4300,4250,4200,4200,4350,4380,4400,4430,4450,4460,4470,4480,4560,4700,4750];

// VIX (CBOE Volatility Index, approximate daily close)
// Pre-war: ~17 (Feb avg 16.1, Investing.com). Validated: highest close 31.05 on Mar 27.
// Monthly intraday high: 35.30 (Investing.com) — date uncertain, NOT Mar 18 (close was 25.09).
// Mar 18 close: 25.09. Monthly low close: 20.28.
// Sources: Investing.com historical, FinancialContent, CNBC, FRED VIXCLS.
// Day 33: VIX crashed to ~25 on hope rally (S&P +2.91%, best day since May)
// Day 34: VIX spikes back as hope rally reverses. Futures -1%+, Asian markets hammered.
export const VIX = [17,25,28,30,32,34,33,31,29,28,25,22,20,25,28,27,29,28,25,27,28,29,28,27,28,29,28,31,30,29,30,30,25,29];

// Severity levels for map coloring
export const SEVERITY_LEVELS = {
  0: { label: "Normal", color: "#151820" },
  1: { label: "Monitoring", color: "#1a2e1a" },
  2: { label: "Reassurance / price controls", color: "#3a3a1a" },
  3: { label: "Reserves / emergency measures", color: "#6a3a0a" },
  4: { label: "Rationing / shortages", color: "#8a1a1a" },
  5: { label: "Crisis / emergency", color: "#6a0a0a" },
} as const;

export type SeverityLevel = keyof typeof SEVERITY_LEVELS;

// Country status per day (31 values each, severity 0-5)
// Key = ISO 3166-1 alpha-3 code for react-simple-maps compatibility
export const COUNTRY_STATUS: Record<string, number[]> = {
  IRN: [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
  USA: [1,1,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  GBR: [1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4],
  FRA: [1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  ESP: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  DEU: [1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3],
  ITA: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  NLD: [1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3],
  NOR: [1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3],
  AUT: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  SVN: [1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,4,4,4,4,4,4,4,4,4,4,4,4],
  SVK: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  HUN: [1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  HRV: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  POL: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3],
  SAU: [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  ARE: [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,5,5,5],
  QAT: [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
  KWT: [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,5],
  IRQ: [3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  EGY: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  YEM: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,5],
  LBN: [1,1,1,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,5,5],
  PAK: [1,1,1,1,1,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  IND: [1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3],
  LKA: [1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  BGD: [1,1,1,1,1,1,1,1,1,2,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  CHN: [1,1,1,1,1,1,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  JPN: [1,1,1,1,1,1,1,1,1,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  KOR: [1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4],
  VNM: [1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4],
  THA: [1,1,1,1,1,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  PHL: [1,1,1,1,1,1,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,5,5,5,5,5,5,5,5,5],
  AUS: [1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,5,5],
  RUS: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3],
  KEN: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,3,3,3,3,3,3,4,4,4,4,4,4],
  NGA: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3],
  ETH: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,3,3,3,3,3,4,4,4,4,4,4],
  // Romania: crisis declared Mar 23 (Day 24). Emergency ordinance Apr 1.
  // 3 of 4 refineries offline (Petromidia maintenance, Petrotel sanctions, Vega maintenance).
  // Structural diesel deficit. Pump protests. Fuel tourism to Bulgaria. 90 days reserves.
  ROU: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,3,3,3,3,3,3,3,3,4,4,4],
  // Israel: primary combatant. 24 killed, 6,239+ wounded as of Apr 1.
  // Largest Iranian salvo Day 33 (10 BMs, cluster warheads, Passover eve).
  // Hezbollah rockets into central Israel. Multi-front war (Lebanon, Yemen, Iran).
  ISR: [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
};

// Human-readable country names
export const COUNTRY_NAMES: Record<string, string> = {
  IRN: "Iran",
  USA: "United States",
  GBR: "United Kingdom",
  FRA: "France",
  ESP: "Spain",
  DEU: "Germany",
  ITA: "Italy",
  NLD: "Netherlands",
  NOR: "Norway",
  AUT: "Austria",
  SVN: "Slovenia",
  SVK: "Slovakia",
  HUN: "Hungary",
  HRV: "Croatia",
  SAU: "Saudi Arabia",
  ARE: "UAE",
  QAT: "Qatar",
  KWT: "Kuwait",
  IRQ: "Iraq",
  EGY: "Egypt",
  YEM: "Yemen",
  LBN: "Lebanon",
  PAK: "Pakistan",
  IND: "India",
  LKA: "Sri Lanka",
  BGD: "Bangladesh",
  CHN: "China",
  JPN: "Japan",
  KOR: "South Korea",
  VNM: "Vietnam",
  THA: "Thailand",
  PHL: "Philippines",
  AUS: "Australia",
  RUS: "Russia",
  POL: "Poland",
  KEN: "Kenya",
  NGA: "Nigeria",
  ETH: "Ethiopia",
  ROU: "Romania",
  ISR: "Israel",
};

// Event types and their visual styles
export const EVENT_TYPES = {
  reassurance:     { label: "Reassurance",        bg: "bg-[#1a2a1a]", border: "border-[#3a6a3a]" },
  price_controls:  { label: "Price Controls",     bg: "bg-[#2a2a1a]", border: "border-[#6a6a2a]" },
  reserve_release: { label: "Reserve Release",    bg: "bg-[#1a2a3a]", border: "border-[#2a5a8a]" },
  rationing:       { label: "Rationing",          bg: "bg-[#3a1a1a]", border: "border-[#8a3a2a]" },
  emergency:       { label: "Emergency",          bg: "bg-[#3a0a0a]", border: "border-[#cc2a2a]" },
  warning:         { label: "Warning",            bg: "bg-[#2a1a0a]", border: "border-[#8a5a2a]" },
  diplomatic:      { label: "Diplomatic",         bg: "bg-[#1a1a2a]", border: "border-[#4a4a8a]" },
  military_fuel:   { label: "Military for Fuel",  bg: "bg-[#2a0a1a]", border: "border-[#8a2a4a]" },
  export_ban:      { label: "Export Ban",         bg: "bg-[#2a1a2a]", border: "border-[#6a3a6a]" },
  medical_warning: { label: "Medical/Food Warning", bg: "bg-[#1a0a2a]", border: "border-[#6a2a8a]" },
  political:       { label: "Political",          bg: "bg-[#1a1a1a]", border: "border-[#5a5a5a]" },
} as const;

export type EventType = keyof typeof EVENT_TYPES;

export interface CrisisEvent {
  day: number;
  country: string;
  who: string;
  type: EventType;
  text: string;
  gap: string | null; // Government statement vs reality gap
}

export const EVENTS: CrisisEvent[] = [
  { day: 1, country: "Iran/Gulf", who: "US/Israel", type: "emergency", text: "Operation Epic Fury launched. Khamenei killed. Strait of Hormuz closed.", gap: null },
  { day: 2, country: "OPEC+", who: "Secretariat", type: "diplomatic", text: "Modest 206K bpd output boost for April.", gap: null },
  { day: 5, country: "Qatar", who: "QatarEnergy", type: "emergency", text: "Force majeure on all LNG after Ras Laffan strikes. 20% of global LNG offline.", gap: null },
  { day: 7, country: "India", who: "Min. H.S. Puri", type: "reassurance", text: "\"No shortage of energy in India. No cause of worry.\"", gap: "Later imposed tax cuts + export levies" },
  { day: 7, country: "China", who: "Foreign Ministry", type: "diplomatic", text: "\"Will do what is necessary to protect energy security.\"", gap: "Quietly banned diesel/gasoline exports" },
  { day: 10, country: "South Korea", who: "Pres. Lee Jae-myung", type: "price_controls", text: "Fuel price caps — first time in 30 years. 100 trillion won stabilization.", gap: null },
  { day: 10, country: "Hungary", who: "PM Orbán", type: "price_controls", text: "Fuel caps for Hungarian plates. Excise cuts. Fuel export ban.", gap: null },
  { day: 10, country: "UK / G7", who: "PM Starmer", type: "reassurance", text: "\"The longer this goes on, the more likely the impact. We're not there yet.\"", gap: "Later reviewed National Emergency Plan for Fuel" },
  { day: 12, country: "IEA", who: "Dir. Fatih Birol", type: "reserve_release", text: "Record 400M barrel release. \"Largest supply disruption in history.\"", gap: null },
  { day: 12, country: "USA", who: "President Trump", type: "reserve_release", text: "172M barrels from SPR. \"Will substantially reduce oil prices.\"", gap: "Prices rose 17% after announcement" },
  { day: 12, country: "Japan", who: "PM Takaichi", type: "reserve_release", text: "~80M barrel release — largest ever. \"Absolutely no disruption to gasoline.\"", gap: "'No disruption' while tapping largest-ever reserves" },
  { day: 13, country: "Australia", who: "Min. Bowen", type: "reserve_release", text: "Suspended fuel quality standards for 60 days to expand supply.", gap: null },
  { day: 14, country: "Austria", who: "OMV stations", type: "warning", text: "First Austrian stations exhaust fuel reserves amid panic buying.", gap: null },
  { day: 14, country: "Pakistan", who: "PM Sharif", type: "reassurance", text: "Held prices steady. \"Adequate crude oil available.\"", gap: "Later: 4-day workweek + school closures" },
  { day: 14, country: "Thailand", who: "Retailers", type: "rationing", text: "Station-level rationing begins. Major retailer caps purchases.", gap: null },
  { day: 17, country: "Sri Lanka", who: "Pres. Dissanayake", type: "rationing", text: "4-day workweek to preserve fuel. \"Prepare for worst, hope for best.\"", gap: null },
  { day: 17, country: "Egypt", who: "PM Madbouly", type: "rationing", text: "\"We need to begin to ration.\" Shops close 9pm. State vehicle fuel -30%.", gap: null },
  { day: 18, country: "WFP", who: "Dep.Dir. Skau", type: "medical_warning", text: "45M additional people could face acute hunger if war continues.", gap: null },
  { day: 19, country: "Slovakia", who: "Government", type: "rationing", text: "Stations authorized to limit diesel + higher prices for foreign plates.", gap: null },
  { day: 19, country: "Austria", who: "Government", type: "price_controls", text: "\"Fuel Price Brake\": 5c/L tax cut + margin caps announced.", gap: null },
  { day: 19, country: "Italy", who: "PM Meloni", type: "price_controls", text: "€417M for excise cuts ~25c/L on petrol and diesel.", gap: null },
  { day: 20, country: "IEA", who: "IEA", type: "warning", text: "Urged COVID-style measures: work from home, skip flights.", gap: null },
  { day: 20, country: "Spain", who: "PM Sánchez", type: "price_controls", text: "€5B package: energy VAT to 10%, 20c/L fuel subsidy.", gap: null },
  { day: 21, country: "Croatia", who: "PM Plenković", type: "price_controls", text: "Extended fuel price caps for tourism season.", gap: null },
  { day: 21, country: "United Airlines", who: "CEO Kirby", type: "warning", text: "Planning for $175/bbl. Cutting 5% capacity. May hike fares 20%.", gap: null },
  { day: 23, country: "Slovenia", who: "PM Golob", type: "military_fuel", text: "50L/day cap. Army deployed. \"Warehouses full, no shortages.\"", gap: "Army deployed while saying 'no shortages'" },
  { day: 24, country: "Germany", who: "Econ.Min. Reiche", type: "warning", text: "\"Not yet seeing shortages... expect end of April or May.\" BASF +30%.", gap: "Downplays while warning of imminent crisis" },
  { day: 24, country: "Chevron", who: "CEO Wirth", type: "warning", text: "\"Very real physical manifestations working around the world.\"", gap: null },
  { day: 25, country: "Shell", who: "CEO Sawan", type: "warning", text: "\"South Asia first... SE Asia... NE Asia... then Europe in April.\"", gap: null },
  { day: 25, country: "TotalEnergies", who: "CEO Pouyanné", type: "warning", text: "Market is \"dislocated.\" People \"very unhappy\" about fuel prices.", gap: null },
  { day: 25, country: "OMV", who: "CEO Stern", type: "warning", text: "Could reduce supply \"more than Ukraine\" — physical, not rerouting.", gap: null },
  { day: 26, country: "Philippines", who: "Pres. Marcos Jr.", type: "emergency", text: "National energy emergency: \"imminent danger of critically low supply.\"", gap: null },
  { day: 26, country: "Austria", who: "Parliament", type: "price_controls", text: "Fuel Price Brake passed into law. Effective April 1.", gap: null },
  { day: 26, country: "India", who: "PM Modi", type: "reassurance", text: "\"Economic fundamentals strong... ample petrol available.\"", gap: "Visible pump lines forming" },
  { day: 27, country: "Germany", who: "Econ.Min. Reiche", type: "warning", text: "Reiterated: fuel shortages expected by end of April.", gap: null },
  { day: 28, country: "Russia", who: "DPM Novak", type: "export_ban", text: "Gasoline export ban April 1 – July 31.", gap: null },
  { day: 28, country: "India", who: "Min. Puri + Shah", type: "reassurance", text: "\"No shortage. Rumours of lockdown false. Remain calm.\"", gap: "Repeated 'remain calm' amid tax cuts and levies" },
  { day: 29, country: "Yemen", who: "Houthi leadership", type: "emergency", text: "Houthis enter war. Missiles at Israel. Bab al-Mandeb threatened.", gap: null },
  { day: 29, country: "Thailand", who: "PM Anutin", type: "rationing", text: "PM Order No. 3/2026: emergency fuel measures citing depletion.", gap: null },
  { day: 30, country: "Pakistan", who: "Hosted talks", type: "diplomatic", text: "4-nation mediation. Iran allows 20 Pakistani ships through Hormuz.", gap: null },
  { day: 30, country: "Australia", who: "PM Albanese", type: "price_controls", text: "50% fuel excise cut. \"Supply secure.\" 500+ stations ran dry.", gap: "'Secure' while 500+ stations dry" },
  { day: 31, country: "Japan", who: "PM Takaichi", type: "medical_warning", text: "Dialysis tubing, surgical containers at risk. \"Remain calm.\"", gap: "Emergency task force while saying 'calm'" },
  { day: 31, country: "USA", who: "President Trump", type: "political", text: "Considering seizing Kharg Island. \"We have a lot of options.\"", gap: null },

  // ── Additional verified events (research round 2) ──

  // Day 2: Pakistan protests after Khamenei killing
  { day: 2, country: "Pakistan", who: "Shia communities", type: "emergency", text: "Nationwide protests; 26-35 killed, 120+ injured. US Consulate Karachi stormed; Marines open fire.", gap: null },

  // Day 3: Shipping insurance collapses
  { day: 3, country: "Global shipping", who: "Marine insurers", type: "warning", text: "War risk cover cancelled for Gulf. Premiums 0.2% → 1% of vessel value. Strait effectively uninsurable.", gap: null },
  { day: 3, country: "Maersk", who: "A.P. Moller-Maersk", type: "warning", text: "Emergency freight increase: +$1,800/20ft, +$3,000/40ft for all Gulf cargo.", gap: null },

  // Day 5: South Korea market crash
  { day: 5, country: "South Korea", who: "KOSPI", type: "warning", text: "Circuit breaker triggered. Biggest crash since 2008 — down up to 12%.", gap: null },

  // Day 6: China export ban + Bangladesh rationing
  { day: 6, country: "China", who: "NDRC", type: "export_ban", text: "Orders PetroChina, Sinopec, CNOOC to halt all diesel, gasoline, jet fuel exports immediately.", gap: "Deepened Asia's fuel crisis while calling for 'stable supply'" },
  { day: 6, country: "Bangladesh", who: "BPC", type: "rationing", text: "Fuel rationing: motorcycles 2L/day, cars 10L, SUVs 20L, trucks 200L. \"To prevent hoarding.\"", gap: null },

  // Day 7: Thailand export ban
  { day: 7, country: "Thailand", who: "PM Anutin", type: "export_ban", text: "PM Order 2/2026: bans exports of gasoline, diesel, Jet A1, LPG. Exceptions only for Myanmar/Laos.", gap: null },

  // Day 9: Bangladesh escalation + France inspections
  { day: 9, country: "Bangladesh", who: "Government", type: "emergency", text: "All universities closed. Military takes charge of oil depots. 4 of 5 fertilizer factories halted. Power cuts doubled to 5hr/day.", gap: null },
  { day: 9, country: "France", who: "PM Lecornu", type: "price_controls", text: "Orders 500 fuel station inspections for abusive pricing. Diesel +16% in one week.", gap: null },

  // Day 10: Pakistan austerity
  { day: 10, country: "Pakistan", who: "PM Sharif", type: "rationing", text: "Televised address: 4-day workweek, 50% WFH, schools closed, weddings capped at 200 guests. Navy deploys Operation Muhafiz-ul-Bahr.", gap: "'Adequate supply' while shutting down half the economy" },

  // Day 11: Croatia
  { day: 11, country: "Croatia", who: "PM Plenković", type: "price_controls", text: "Fuel price caps: Eurosuper €1.50/L, diesel €1.55/L. €450M support package.", gap: null },

  // Day 12: UNSC
  { day: 12, country: "UN Security Council", who: "Resolution 2817", type: "diplomatic", text: "Condemns Iran's attacks on Gulf states. 13-0-2 (China, Russia abstain). 135 co-sponsors.", gap: null },

  // Day 14: TotalEnergies France caps
  { day: 14, country: "France", who: "TotalEnergies", type: "price_controls", text: "Caps prices at 3,300 French stations: petrol €1.99/L, diesel €2.09/L through March 31.", gap: null },

  // Day 15: Sri Lanka QR rationing
  { day: 15, country: "Sri Lanka", who: "Government", type: "rationing", text: "QR-based National Fuel Pass reactivated. Motorcycles 8L/wk, cars 25L/wk, buses 100L/wk.", gap: null },

  // Day 19: ECB + BASF
  { day: 19, country: "ECB", who: "Governing Council", type: "warning", text: "Holds rates at 2.0%. Inflation forecast raised to 2.6%. Gas futures surge 30% to €74/MWh on same day.", gap: null },
  { day: 19, country: "Germany", who: "BASF SE", type: "warning", text: "Price increases up to 30% across European product portfolio citing energy costs.", gap: null },

  // Day 20: IMF
  { day: 20, country: "IMF", who: "Julie Kozack", type: "warning", text: "Every 10% sustained oil rise = +0.4pp global inflation, -0.1-0.2% output. Fertilizer disruptions \"substantial\" food price risk.", gap: null },

  // Day 22: Trump ultimatum + Taiwan nuclear
  { day: 22, country: "USA", who: "President Trump", type: "political", text: "48-hour ultimatum to Iran: reopen Hormuz or face escalation. Posted 23:44 GMT on Truth Social.", gap: null },
  { day: 23, country: "Taiwan", who: "President Lai", type: "warning", text: "Announces restart of 2 nuclear plants — reversing DPP's \"nuclear-free\" policy. 70% of crude from Middle East.", gap: null },

  // Day 24: IEA Birol
  { day: 24, country: "IEA", who: "Dir. Fatih Birol", type: "warning", text: "\"Worse than the 1970s oil shocks combined.\" 11 mbpd lost vs 10 mbpd in '73 + '79 together. 40+ energy assets damaged.", gap: null },

  // Day 25: Lagarde
  { day: 25, country: "ECB", who: "Pres. Lagarde", type: "warning", text: "\"We will not be paralyzed by hesitation.\" Warns firms/workers may pass costs faster than 2022.", gap: null },

  // Day 26: OECD
  { day: 26, country: "OECD", who: "Interim Outlook", type: "warning", text: "Global inflation to 4.0% (+1.2pp). Eurozone growth slashed to 0.8%. US inflation 4.2%.", gap: null },

  // Day 27: Malaysia + Vietnam + Japan
  { day: 27, country: "Malaysia", who: "PM Anwar", type: "diplomatic", text: "Secures Hormuz passage from Iran. \"Countries whose impacts are far worse than ours.\" Non-aligned policy pays off.", gap: null },
  { day: 27, country: "Vietnam", who: "Vietnam Airlines", type: "warning", text: "Suspends 23 weekly domestic flights from April 1. VietJet cuts 18%. Jet fuel only guaranteed through March.", gap: null },
  { day: 28, country: "Japan", who: "METI", type: "warning", text: "Orders wholesalers to switch from Dubai to Brent pricing. Dubai at $170 vs Brent $110 — Japanese firms paying $140-200/bbl.", gap: null },

  // Day 29: Thailand Hormuz deal + US protests
  { day: 29, country: "Thailand", who: "PM Anutin", type: "diplomatic", text: "Secures Hormuz transit deal with Iran. Thailand added to \"friendly\" list alongside CN, RU, IN, PK.", gap: null },
  { day: 29, country: "USA", who: "\"No Kings Day\"", type: "political", text: "8-9M protesters in 3,300 events across 50 states — largest single-day protest in US history. Trump at 36% approval.", gap: null },

  // Day 4: Poland PM dismisses concerns
  { day: 4, country: "Poland", who: "PM Tusk", type: "reassurance", text: "Accuses opposition of \"destabilising\" country with \"false fuel shortage claims.\"", gap: "Diesel hit all-time record 3 weeks later" },

  // Day 27: Poland record diesel + VAT slash
  { day: 27, country: "Poland", who: "PM Tusk", type: "price_controls", text: "Diesel hits all-time record 8.69 PLN/L (€2.04). VAT slashed 23% → 8%, excise to EU minimum. Fuel panic reported.", gap: null },

  // ── Round 3: human impact, IRGC tollbooth, Africa/global reach ──

  // IRGC tollbooth — first time a nation imposes unilateral transit tolls on an international strait
  { day: 14, country: "Iran", who: "IRGC Navy", type: "emergency", text: "First ships transit via IRGC \"tollbooth\" — pre-approved route through Iranian waters north of Larak Island. AIS disabled.", gap: null },
  { day: 25, country: "Iran", who: "MP Boroujerdi", type: "political", text: "Confirms $2M/transit toll on IRIB: \"Collecting fees reflects Iran's strength.\" Payments accepted in Chinese yuan. Parliament drafting legislation.", gap: null },

  // Nepal migrant worker — humanizes the Gulf crisis
  { day: 8, country: "Nepal/Qatar", who: "Kuna Khuntia, 25", type: "emergency", text: "Pipe fitter from Odisha dies of heart attack in Doha during missile sounds. Father: \"He came back in a coffin.\" 21M South Asian migrants in Gulf.", gap: null },

  // Thailand fishing industry collapse
  { day: 27, country: "Thailand", who: "Samut Sakhon port", type: "rationing", text: "~40% of 9,000 fishing vessels docked; industry warns 50% imminent. \"Worse than COVID-19.\" \"After April 1, there may be no fish sold.\" $7B export industry at risk.", gap: null },

  // Kenya / global fertilizer — Africa representation
  { day: 28, country: "Kenya/Global", who: "PBS / farmers", type: "medical_warning", text: "\"The planting season is now. The fertilizer isn't there.\" Ethiopia imports 90%+ of nitrogen from Gulf. Kenya's 25M smallholders at risk.", gap: null },

  // Qatar helium — unexpected cascading effect
  { day: 19, country: "Qatar", who: "Helium production", type: "emergency", text: "Iran strikes helium facility. Qatar produces 1/3 of global supply. MRI machines worldwide at risk — helium needed for superconducting magnets.", gap: null },

  // Nepal bodies stranded — the human cost of closed airspace
  { day: 21, country: "Nepal", who: "Families", type: "emergency", text: "21+ bodies of migrant workers stranded in Gulf — flights cancelled, repatriation impossible. 1.7M Nepalis work in the Gulf; remittances = 25% of GDP.", gap: null },

  // Day 31: G7 finance + energy ministers call
  { day: 31, country: "G7", who: "Finance + Energy ministers", type: "diplomatic", text: "\"Stand ready to take all necessary measures.\" Call on all countries to refrain from \"unjustified export restrictions on hydrocarbons.\"", gap: "Targeting CN/TH/RU/IN export bans but offering no enforcement" },
  { day: 31, country: "UK", who: "Chancellor Reeves", type: "diplomatic", text: "Warns G7 against \"unilateral trade moves\" — \"act together, not in ways that shift pressure onto partners.\" Protectionism would \"drive up costs.\"", gap: null },

  // Day 31: Ethiopia + South Korea
  { day: 31, country: "Ethiopia", who: "Government", type: "rationing", text: "Diesel \"all but disappeared\" in Addis Ababa. Civil servants sent on mandatory leave. Fuel prioritized for security and essential industries.", gap: null },
  { day: 31, country: "South Korea", who: "Pres. Lee Jae-myung", type: "warning", text: "\"So serious I can't fall asleep.\" \"Worse than you think.\" Weighing first driving restrictions in 35 years (odd/even plates) if oil stays above $120.", gap: null },

  // ── Day 32 (Mar 31) events ──

  // Military: Iran's missile capacity degrading but cluster bombs now in play
  { day: 32, country: "Israel", who: "IDF / Iran", type: "emergency", text: "Iran cluster bomb warhead hits Bnei Brak/Ramat Gan. 8 injured, fires. Missile rate down to 10-15/day (from ~90 at start) — infrastructure \"severely strained.\"", gap: null },

  // Escalation: Pentagon ground ops + UNIFIL casualties
  { day: 32, country: "Lebanon", who: "UNIFIL", type: "emergency", text: "3 Indonesian peacekeepers killed in 2 separate explosions. France and Italy condemn \"grave crisis.\" 1,200+ killed in Lebanon this month incl. 124 children.", gap: null },
  { day: 32, country: "USA", who: "Pentagon", type: "military_fuel", text: "Preparing ground raids on Kharg Island + Hormuz coastal sites. 7,700 troops arriving: Marines (USS Tripoli), 82nd Airborne. Iran fortifying Kharg.", gap: null },

  // Trump April 6 deadline — major escalation risk
  { day: 32, country: "USA", who: "President Trump", type: "political", text: "Extends deadline to April 6 for strikes on all Iranian power plants, oil wells, Kharg Island, and desalination plants. Says he's \"pretty sure\" of a deal.", gap: null },

  // Diplomacy: Pakistan mediation
  { day: 32, country: "Pakistan", who: "FM talks", type: "diplomatic", text: "Turkey, Saudi, Egypt, Pakistan FMs in Islamabad preparing \"meaningful talks.\" Iran rejected US 15-point plan; demands reparations + Hormuz sovereignty.", gap: null },

  // Hormuz: Cosco transit — first major Chinese company ships through
  { day: 32, country: "China", who: "Cosco Shipping", type: "diplomatic", text: "2 ultra-large container ships (CSCL Indian Ocean + Arctic Ocean) transit Hormuz outbound — first major Beijing-backed company vessels since war started.", gap: null },

  // UK signal-action gap
  { day: 32, country: "UK", who: "Ed.Sec. Phillipson", type: "reassurance", text: "\"Fill up as normal.\" \"Supply chains remain stable.\" Diesel up 27% to 181p/L.", gap: "Reviewing Energy Act 1976 rationing powers (£30/visit cap)" },

  // QatarEnergy FM extension (not new — extends existing Day 3 declaration)
  { day: 32, country: "Qatar", who: "QatarEnergy", type: "warning", text: "Extends existing force majeure through mid-June (was through May). Ras Laffan damage est. $20B/yr lost revenue, up to 5 years to repair.", gap: null },

  // Gulf market wipeout
  { day: 32, country: "UAE", who: "Dubai/Abu Dhabi markets", type: "warning", text: "$120 billion wiped from Dubai and Abu Dhabi stock markets since Feb 28.", gap: null },

  // Humanitarian: medical supplies stuck globally
  { day: 32, country: "Global", who: "IRC / NPR", type: "medical_warning", text: "Medical goods stuck worldwide. Somalia: 668 boxes of therapeutic food stranded in India. Sudan: $130K of pharmaceuticals stuck in Dubai. Kenya clinics cutting services.", gap: null },

  // HRW child recruitment
  { day: 32, country: "Iran", who: "HRW", type: "emergency", text: "IRGC recruiting children as young as 12 as \"Homeland Defending Combatants.\" HRW calls it potential war crime.", gap: null },

  // Australia escalation
  { day: 32, country: "Australia", who: "Min. Bowen", type: "rationing", text: "Considering petrol rationing. Only 26 days diesel, 29 days petrol remain — well below IEA 90-day minimum. Stage 2 of 4-point fuel security plan.", gap: null },

  // Kenya rationing
  { day: 32, country: "Kenya", who: "Government", type: "rationing", text: "Active fuel rationing. Nairobi stations along Langata Road ran dry. North Rift region in worse shape. Negotiating with Nigeria's Dangote refinery.", gap: null },

  // Houthis — Red Sea threat
  { day: 32, country: "Yemen", who: "Houthi leadership", type: "warning", text: "\"Closing Bab al-Mandeb is among our options.\" Would threaten Saudi Yanbu bypass — the main buffer keeping Brent below $150.", gap: null },

  // ── Day 33 (Apr 1) events ──

  // Iran missile hits QatarEnergy tanker — escalation: Iran now targeting Qatar directly
  { day: 33, country: "Qatar", who: "Iran / QatarEnergy", type: "emergency", text: "Iranian cruise missile hits Aqua 1 tanker 31km north of Ras Laffan. Qatar intercepted 2 of 3 missiles. No casualties. Damage above waterline.", gap: null },

  // IRGC threatens 18 US tech companies — unprecedented expansion of war to corporate targets
  { day: 33, country: "Iran", who: "IRGC", type: "emergency", text: "Threatens Apple, Microsoft, Google, Meta, Tesla, Boeing, Nvidia, JP Morgan + 10 others. Deadline 8PM Tehran time. Employees told to evacuate within 1km of Gulf offices.", gap: null },

  // Trump "go get your own oil" + war could end in 2-3 weeks
  { day: 33, country: "USA", who: "President Trump", type: "political", text: "\"Go get your own oil.\" Tells UK and allies to secure Hormuz themselves. Says war could end in 2-3 weeks, no deal necessary. US gas hits $4/gal.", gap: null },

  // Hope rally — S&P surges on peace signals (contrast with underlying escalation)
  { day: 33, country: "USA", who: "S&P 500", type: "warning", text: "S&P 500 surges 2.91% to 6,528 — best day since May. VIX crashes to 25. Triggered by unconfirmed report Pezeshkian open to peace with guarantees.", gap: "Markets rallying while Iran hits Qatar tanker and IRGC threatens tech cos" },

  // Iran FM: no negotiations happening
  { day: 33, country: "Iran", who: "FM Araghchi", type: "diplomatic", text: "\"No negotiations are going on with Washington.\" Iran prepared for \"at least six months\" of war. Rejects US 15-point plan.", gap: null },

  // China-Pakistan peace proposal
  { day: 33, country: "China/Pakistan", who: "Joint proposal", type: "diplomatic", text: "New initiative: immediate ceasefire + reopening Hormuz + safe passage for civilian ships. Presented to both sides.", gap: null },

  // Gold divergence — smart money signal
  { day: 33, country: "Global", who: "Gold market", type: "warning", text: "Gold rises to ~$4,700 even on risk-on day when equities surge. Bond market and gold not buying the peace narrative.", gap: null },

  // Russia gasoline export ban takes effect
  { day: 33, country: "Russia", who: "Government", type: "export_ban", text: "Gasoline export ban now in effect (Apr 1 – Jul 31). Tightens European product market further. Austria Fuel Price Brake also takes effect today.", gap: null },

  // Three national addresses in one day — unprecedented

  // Albanese COVID-style national address — signal-action gap
  { day: 33, country: "Australia", who: "PM Albanese", type: "reassurance", text: "Rare national address: \"Go about your business and your life, as normal. Enjoy your Easter.\" Halved fuel excise (26.3c/L). Asked public to use transit to save fuel.", gap: "400+ stations dry (247 NSW, 82 VIC, 77 QLD). Stage 2 of 4-point emergency." },

  // Starmer address — "not our war" but convenes 35-nation coalition + military planners
  { day: 33, country: "UK", who: "PM Starmer", type: "diplomatic", text: "National address: \"Impact of this war will affect the future of our country.\" Convenes 35-nation coalition via Cooper. Military planners tasked with Hormuz options. \"I have to level with people — this will not be easy.\"", gap: "Says 'not our war' in same speech as ordering military planners to draw up Hormuz options" },

  // Trump primetime address scheduled — 9pm ET
  { day: 33, country: "USA", who: "President Trump", type: "political", text: "Primetime address to nation at 9pm ET — \"important update on Iran.\" Earlier: \"When we feel they're put into the stone ages, we'll leave. Whether we have a deal or not.\"", gap: null },

  // Kuwait airport drone strike — Iran expanding attacks on Gulf civilian infrastructure
  { day: 33, country: "Kuwait", who: "Iran / KAFCO", type: "emergency", text: "Iranian drones hit fuel storage tanks at Kuwait International Airport. Large fire at KAFCO depot. No casualties. Part of escalating strikes on Gulf civilian infrastructure.", gap: null },

  // ── Day 33 additions (Apr 1, research round 4) ──

  // Iran's largest missile salvo on Israel — Passover eve, cluster warheads
  { day: 33, country: "Israel", who: "Iran → IDF", type: "emergency", text: "Iran's largest salvo of war: ~10 BMs at central Israel on Passover eve. Cluster warhead hits Bnei Brak/Rosh HaAyin. 15 wounded incl. 11-year-old girl (critical). 6,239+ total wounded since Feb 28.", gap: null },

  // Hezbollah rockets into central Israel during Passover seders
  { day: 33, country: "Israel/Lebanon", who: "Hezbollah", type: "emergency", text: "2 rockets from Lebanon into central Israel during Passover seders. No injuries. Israel kills Hezbollah southern front commander Haj Youssef in Beirut strike (7 dead).", gap: null },

  // UAE cumulative interceptions — most attacked non-combatant
  { day: 33, country: "UAE", who: "Air defense", type: "emergency", text: "Intercepted 5 BMs + 35 drones today. Cumulative since Feb 28: 433 ballistic missiles, 1,977 drones, 19 cruise missiles. Fuel prices up 30% for April.", gap: null },

  // UAE preparing to join war — first Gulf state
  { day: 33, country: "UAE", who: "Government", type: "military_fuel", text: "Poised to be first Gulf state to directly join US operations. Lobbying UN Security Council for Hormuz reopening by force. Floating US seizure of Abu Musa island. Froze Iranian-linked institutions in Dubai.", gap: null },

  // US/Israel strikes on Iranian steel + infrastructure
  { day: 33, country: "Iran", who: "US/Israel strikes", type: "emergency", text: "Isfahan Mobarakeh Steel hit 2nd time. Sefid Dasht Steel struck. Qeshm Island desalination plant destroyed. Explosions in Ahvaz, Shiraz, Karaj, Kermanshah, Bandar Abbas. Drug factory hit (fentanyl/CW claim).", gap: null },

  // Trump NATO withdrawal threat
  { day: 33, country: "USA", who: "President Trump", type: "diplomatic", text: "\"Strongly considering\" pulling US from NATO — calls it \"paper tiger\" after allies refused to join war. Threatens to stop Ukraine aid unless Europe joins Hormuz coalition.", gap: null },

  // Pakistan indirect talks — 15 US points, 5 Iran conditions
  { day: 33, country: "Pakistan", who: "FM mediation", type: "diplomatic", text: "Facilitating indirect US-Iran talks. 15-point US proposal being deliberated. Iran countered with 5 conditions: war reparations, Hormuz sovereignty. No direct negotiations.", gap: null },

  // Iran ceasefire denial — contradicts Trump
  { day: 33, country: "Iran", who: "Pres. Pezeshkian", type: "diplomatic", text: "Open letter to Americans: questions whether Washington is truly 'America First' or 'proxy for Israel.' Iran denies requesting ceasefire (contradicting Trump's Truth Social claim).", gap: null },

  // UK last jet fuel tanker — Maetiga
  { day: 33, country: "UK", who: "Fuel supply", type: "warning", text: "Tanker Maetiga (Libyan-flagged, Saudi-loaded) arriving ~Apr 3 — last known UK-bound ME jet fuel cargo. No other cargoes visible. Two ships departed New York → England (unprecedented reroute).", gap: null },

  // UK Peter Kyle signal-action gap
  { day: 33, country: "UK", who: "Bus.Sec. Peter Kyle", type: "reassurance", text: "\"We have no fuel supply chain issues at this moment at all.\" Airlines UK: \"not seeing disruption.\"", gap: "Last jet fuel tanker arriving Apr 3. Argus: 'most exposed in Europe.' Industry warns 'weeks from rationing.'" },

  // Romania emergency ordinance takes effect
  { day: 33, country: "Romania", who: "PM Bolojan", type: "price_controls", text: "Emergency ordinance effective today (Apr 1 – Jun 30): commercial margin caps, diesel/crude exports require ministry approval, biofuel content reduced 8%→2%. Diesel 9.99 RON/L.", gap: null },

  // Romania refinery crisis
  { day: 33, country: "Romania", who: "Energy sector", type: "warning", text: "3 of 4 refineries offline or just restarting. Petromidia (46% capacity) restarting after March overhaul. Petrotel-Lukoil (21%) shut by US sanctions. Only Petrobrazi running = 35% of national demand.", gap: null },

  // Romania signal-action gap
  { day: 33, country: "Romania", who: "Min. Bogdan Ivan", type: "reassurance", text: "\"Rationing is not being considered. Romania has sufficient reserves.\" Reserves secured only through June.", gap: "3 of 4 refineries offline. Structural diesel deficit. Pump protests. Fuel tourism to Bulgaria." },

  // Brent briefly below $100
  { day: 33, country: "Global", who: "Oil markets", type: "warning", text: "Brent plunged to $98.52 intraday — first time below $100 in a week. War premium deflated on Trump exit talk. But Dubai physical at $128 — $26 spread = paper vs physical disconnect.", gap: null },

  // Houthis — Bloomberg $140 warning
  { day: 33, country: "Yemen", who: "Houthis / Bloomberg", type: "warning", text: "Second missile at Eilat (intercepted). Al-Bukhaiti: considering naval blockade, will target 'aggressor country' vessels. Bloomberg Economics: Houthi Red Sea attacks could drive oil to $140/bbl.", gap: null },

  // UK Starmer — COBRA + Hormuz conference
  { day: 33, country: "UK", who: "PM Starmer", type: "diplomatic", text: "Chaired emergency COBRA meeting. Diesel hit 182.77p/L — £100 for a 55L fill (first time since Dec 2022). UK drivers paying £544M extra since war began. Hosting 35-nation Hormuz conference this week.", gap: null },

  // Casualty summary — Day 33
  { day: 33, country: "Global", who: "Cumulative", type: "emergency", text: "Iran ~1,900+ killed. Israel 24 killed / 6,239 wounded. Lebanon 1,318 killed (124 children). Iraq 106. US military 13. Gulf states 27. Hormuz transits: 6/day (down from 138).", gap: null },

  // ── Day 34 (Apr 2) events ──

  // Trump primetime address — "stone ages"
  { day: 34, country: "USA", who: "President Trump", type: "political", text: "Primetime address: \"We're going to bring them back to the stone ages.\" Threatens to hit every Iranian power plant simultaneously. Claims war \"nearing completion\" in 2-3 weeks. No deal terms. No exit plan.", gap: "Claims 'nearing completion' while threatening to destroy all civilian power infrastructure" },

  // Trump victory claims vs reality
  { day: 34, country: "USA", who: "President Trump", type: "political", text: "Claims Iran's navy \"destroyed,\" air force \"in ruins,\" IRGC \"decimated.\" Says regime change occurred. 13 US servicemembers killed acknowledged. Told allies to \"get your own oil.\"", gap: "Iran fired missiles at Israel, Dubai, and Bahrain during and immediately after the speech" },

  // Iran fires missiles during/after speech
  { day: 34, country: "Iran", who: "IRGC", type: "emergency", text: "Explosions in Dubai just before speech. Missiles at Israel within 30 min of speech ending. Sirens in Bahrain (US 5th Fleet HQ). Iran: \"Absolutely determined to continue defense... no choice but to fight back fiercely.\"", gap: null },

  // Market reaction — hope rally completely reversed
  { day: 34, country: "Global", who: "Markets", type: "warning", text: "Brent surges 7.4% to $108.62. WTI +6.9% to $107.05. Nikkei -2%, KOSPI -4%, Hang Seng -1%, US futures -1%+. Markets expected ceasefire or escalation — got escalation.", gap: null },

  // $200 oil warnings
  { day: 34, country: "Global", who: "Macquarie / analysts", type: "warning", text: "Macquarie: $200/bbl if war lasts to June (40% probability). Saudi energy leaders: $180 if conflict persists past late April. Bloomberg Economics: $140 from Houthi attacks alone. Inflation-adjusted ATH: ~$211.", gap: null },

  // Trump NATO threat formalized
  { day: 34, country: "USA", who: "Sec. Rubio", type: "diplomatic", text: "Rubio: US will \"re-examine\" relationship with NATO after allies refused to join war. Starmer defends NATO as \"most effective military alliance ever.\" Spain bars US aircraft from its airspace/bases.", gap: null },

  // Spain bars US aircraft — NATO fracturing
  { day: 34, country: "Spain", who: "Government", type: "diplomatic", text: "Bars US aircraft involved in Iran war from Spanish airspace and bases (except humanitarian). First NATO ally to formally restrict US military operations over its territory.", gap: null },

  // April 6 deadline confirmed — 4 days away
  { day: 34, country: "USA", who: "White House", type: "warning", text: "April 6 deadline (8PM ET) for strikes on Iran's entire power grid confirmed. Trump in speech: \"If there is no deal, we are going to hit each and every one of their electric generating plants.\"", gap: null },
];

// Helper: get stats for a given day index (0-based)
export function getDayStats(dayIndex: number) {
  let affected = 0;
  let rationing = 0;
  let emergencies = 0;

  for (const code in COUNTRY_STATUS) {
    const severity = COUNTRY_STATUS[code][dayIndex];
    if (severity >= 2) affected++;
    if (severity >= 4) rationing++;
    if (severity >= 5) emergencies++;
  }

  const brent = BRENT_PRICES[dayIndex];
  const dubai = DUBAI_PRICES[dayIndex];

  return {
    affected,
    rationing,
    emergencies,
    brent,
    dubai,
    spread: dubai - brent,
    jetFuel: JET_FUEL_PRICES[dayIndex],
    jetFuelChange: Math.round((JET_FUEL_PRICES[dayIndex] / JET_FUEL_PRICES[0] - 1) * 100),
    hormuzFlow: HORMUZ_FLOW[dayIndex],
    hormuzTransits: HORMUZ_TRANSITS[dayIndex],
    supplyOffline: SUPPLY_OFFLINE[dayIndex],
    sprReleased: SPR_RELEASED[dayIndex],
    sprRemaining: IEA_RESERVES_TOTAL - SPR_RELEASED[dayIndex],
    euGasStorage: EU_GAS_STORAGE[dayIndex],
    forceMajeures: FORCE_MAJEURES[dayIndex],
    signalGaps: SIGNAL_ACTION_GAPS[dayIndex],
    unrest: UNREST_INDEX[dayIndex],
    gold: GOLD_PRICES[dayIndex],
    vix: VIX[dayIndex],
  };
}

// Helper: get events for a given day (1-based)
export function getEventsForDay(day: number): CrisisEvent[] {
  return EVENTS.filter(e => e.day === day);
}

// Helper: get severity color for a value
export function getSeverityColor(level: number): string {
  return SEVERITY_LEVELS[level as SeverityLevel]?.color ?? SEVERITY_LEVELS[0].color;
}
