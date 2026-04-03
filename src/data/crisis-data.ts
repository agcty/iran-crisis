// Iran War Crisis Propagation — Feb 28 to Mar 30, 2026
// Data extracted from crisis-propagation-map.html

export const DATES = [
  "Feb 28","Mar 1","Mar 2","Mar 3","Mar 4","Mar 5","Mar 6","Mar 7","Mar 8","Mar 9",
  "Mar 10","Mar 11","Mar 12","Mar 13","Mar 14","Mar 15","Mar 16","Mar 17","Mar 18","Mar 19",
  "Mar 20","Mar 21","Mar 22","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 28","Mar 29","Mar 30",
] as const;

export const TOTAL_DAYS = DATES.length; // 31

// Oil prices per day ($/barrel)
export const BRENT_PRICES = [72,85,92,98,105,110,115,112,108,105,100,100,103,106,110,108,112,115,118,114,110,113,108,106,110,113,110,113,115,114,115];
export const DUBAI_PRICES = [71,88,96,105,115,125,130,128,120,115,110,108,115,120,128,125,135,140,145,140,132,138,130,126,132,136,130,126,128,125,126];

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
  IRN: [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
  USA: [1,1,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  GBR: [1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3],
  FRA: [1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3],
  ESP: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,3,3,3,3,3],
  DEU: [1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3],
  ITA: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,3,3,3,3,3,3],
  NLD: [1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3],
  NOR: [1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3],
  AUT: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3],
  SVN: [1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,4,4,4,4,4,4,4,4,4],
  SVK: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4,4,4,4,4,4,4,4,4,4,4,4,4],
  HUN: [1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  HRV: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2],
  SAU: [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  ARE: [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  QAT: [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
  KWT: [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  IRQ: [3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  EGY: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  YEM: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,5,5],
  LBN: [1,1,1,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  PAK: [1,1,1,1,1,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4],
  IND: [1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3],
  LKA: [1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  BGD: [1,1,1,1,1,1,1,1,1,2,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  CHN: [1,1,1,1,1,1,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  JPN: [1,1,1,1,1,1,1,1,1,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  KOR: [1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  VNM: [1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,3,3,3,4,4,4,4,4,4,4,4,4],
  THA: [1,1,1,1,1,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  PHL: [1,1,1,1,1,1,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,5,5,5,5,5,5],
  AUS: [1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  RUS: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3],
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

  return {
    affected,
    rationing,
    emergencies,
    brent: BRENT_PRICES[dayIndex],
    dubai: DUBAI_PRICES[dayIndex],
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
