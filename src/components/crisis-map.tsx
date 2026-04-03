import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  Sphere,
  Marker,
} from 'react-simple-maps';
// motion/react removed — CSS animations used instead for reliability with React 19
import {
  DATES,
  TOTAL_DAYS,
  BRENT_PRICES,
  DUBAI_PRICES,
  JET_FUEL_PRICES,
  COUNTRY_STATUS,
  COUNTRY_NAMES,
  SEVERITY_LEVELS,
  EVENT_TYPES,
  FUEL_DAYS,
  PUMP_PRICES,
  IEA_90_DAY_STANDARD,
  getDayStats,
  getEventsForDay,
  getSeverityColor,
  type CrisisEvent,
  type SeverityLevel,
} from '../data/crisis-data';
import { generateAllProjections, MAX_DAY, type ScenarioId, type ProjectedDay } from '../data/projections';
import ScenarioSelector from './scenario-selector';

// TopoJSON world map (50m resolution for small country coverage)
const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json';

// ISO 3166-1 numeric → alpha-3 for TopoJSON ↔ our data
const ISO_NUM_TO_ALPHA3: Record<string, string> = {
  '364': 'IRN', '840': 'USA', '826': 'GBR', '250': 'FRA', '724': 'ESP',
  '276': 'DEU', '380': 'ITA', '528': 'NLD', '578': 'NOR', '040': 'AUT',
  '705': 'SVN', '703': 'SVK', '348': 'HUN', '191': 'HRV', '682': 'SAU',
  '784': 'ARE', '634': 'QAT', '414': 'KWT', '368': 'IRQ', '818': 'EGY',
  '887': 'YEM', '422': 'LBN', '586': 'PAK', '356': 'IND', '144': 'LKA',
  '050': 'BGD', '156': 'CHN', '392': 'JPN', '410': 'KOR', '704': 'VNM',
  '764': 'THA', '608': 'PHL', '036': 'AUS', '643': 'RUS',
  '616': 'POL', '404': 'KEN', '566': 'NGA', '231': 'ETH',
  '642': 'ROU', '376': 'ISR',
};

function getCountryFill(geoId: string, dayIndex: number, projectedSeverity?: Record<string, number>): string {
  const alpha3 = ISO_NUM_TO_ALPHA3[geoId];
  if (!alpha3 || (!COUNTRY_STATUS[alpha3] && !projectedSeverity)) return '#151820';
  const sev = projectedSeverity ? (projectedSeverity[alpha3] ?? 0) : (COUNTRY_STATUS[alpha3]?.[dayIndex] ?? 0);
  return getSeverityColor(sev);
}

function getCountryInfo(geoId: string, dayIndex: number, projectedSeverity?: Record<string, number>) {
  const alpha3 = ISO_NUM_TO_ALPHA3[geoId];
  if (!alpha3 || !COUNTRY_NAMES[alpha3]) return null;
  const severity = projectedSeverity ? (projectedSeverity[alpha3] ?? 0) : (COUNTRY_STATUS[alpha3]?.[dayIndex] ?? 0);
  return {
    name: COUNTRY_NAMES[alpha3],
    severity,
    label: SEVERITY_LEVELS[severity as SeverityLevel]?.label ?? 'Normal',
  };
}

// ---------- Sub-components ----------

function StatBox({
  value,
  label,
  color,
  projected,
}: {
  value: string | number;
  label: string;
  color: string;
  projected?: boolean;
}) {
  return (
    <div className={`bg-[#0d1017] rounded-lg flex-1 min-w-[100px] px-3 py-2.5 ${projected ? 'border border-dashed border-[#2a2e38]' : 'border border-[#1a1e28]'}`}>
      <div
        className="font-mono text-xl font-bold leading-none"
        style={{ color }}
      >
        {value}
      </div>
      <div className="text-[10px] text-[#888] mt-1 leading-tight">{label}</div>
    </div>
  );
}

function HeroStat({
  value,
  label,
  sublabel,
  color,
  projected,
}: {
  value: string | number;
  label: string;
  sublabel?: string;
  color: string;
  projected?: boolean;
}) {
  return (
    <div className={`bg-[#0d1017] rounded-xl px-5 py-4 flex-1 min-w-[140px] ${projected ? 'border border-dashed border-[#2a2e38]' : 'border border-[#2a2e38]'}`}>
      <div
        className="font-mono text-[32px] font-bold leading-none tracking-tight"
        style={{ color }}
      >
        {value}
      </div>
      <div className="text-[11px] text-[#aaa] mt-1.5 leading-tight font-medium">{label}</div>
      {sublabel && <div className="text-[9px] text-[#555] mt-0.5 leading-tight">{sublabel}</div>}
    </div>
  );
}

// Max days across all countries (for absolute scale)
const FUEL_DAYS_MAX = Math.max(...Object.values(FUEL_DAYS).map(d => d.preWar));

function FuelBar({
  country,
  label,
  daysLeft,
  projected,
}: {
  country: string;
  label: string;
  daysLeft: number;
  projected?: boolean;
}) {
  // All bars on the same absolute scale so more days = longer bar
  const pct = Math.max(0, Math.min(100, (daysLeft / FUEL_DAYS_MAX) * 100));
  const iea90pct = (IEA_90_DAY_STANDARD / FUEL_DAYS_MAX) * 100;
  const barColor =
    daysLeft <= 7 ? '#ff1744' :
    daysLeft <= 30 ? '#ef5350' :
    daysLeft <= 60 ? '#ff9800' :
    daysLeft <= 90 ? '#ffab40' :
    '#66bb6a';
  const critical = daysLeft <= 7;

  return (
    <div className="flex items-center gap-2 text-[10px] font-mono">
      <div className="w-[52px] text-[#888] text-right shrink-0 truncate" title={label}>{country}</div>
      <div className="flex-1 h-[14px] bg-[#0a0c12] rounded-sm border border-[#1a1e28] relative overflow-hidden">
        {/* IEA 90-day marker */}
        <div
          className="absolute top-0 bottom-0 w-px bg-[#444] z-10"
          style={{ left: iea90pct + '%' }}
          title="IEA 90-day minimum"
        />
        <div
          className={`h-full rounded-sm transition-all duration-700 ${critical ? 'animate-pulse' : ''}`}
          style={{
            width: pct + '%',
            background: projected
              ? `repeating-linear-gradient(90deg, ${barColor} 0px, ${barColor} 4px, transparent 4px, transparent 6px)`
              : barColor,
          }}
        />
      </div>
      <div
        className="w-[38px] text-right font-bold shrink-0"
        style={{ color: barColor }}
      >
        {daysLeft}d
      </div>
    </div>
  );
}

function PumpPrice({
  code,
  dayIndex,
  projectedPrice,
}: {
  code: string;
  dayIndex: number;
  projectedPrice?: number;
}) {
  const data = PUMP_PRICES[code];
  if (!data) return null;
  const price = projectedPrice ?? data.prices[dayIndex];
  const pctChange = ((price - data.preWar) / data.preWar * 100);
  const aboveThreshold = price >= data.painThreshold;

  return (
    <div
      className={`flex items-baseline gap-1.5 text-[11px] font-mono px-2.5 py-1.5 rounded-md ${aboveThreshold ? 'bg-[#2a0a0a] border border-[#5a1a1a]' : 'bg-[#0d1017] border border-[#1a1e28]'}`}
      title={aboveThreshold
        ? `⚠ Above pain threshold (${data.currency}${data.painThreshold}${data.unit}): ${data.painNote}`
        : `Pain threshold: ${data.currency}${data.painThreshold}${data.unit} — ${data.painNote}`}
    >
      <span className="text-[#888] text-[10px]">{data.label}</span>
      <span
        className="font-bold text-[13px]"
        style={{ color: aboveThreshold ? '#ff4444' : '#e0e0e0' }}
      >
        {data.currency}{price.toFixed(2)}{data.unit}
      </span>
      <span className="text-[#ef5350] text-[9px]">+{pctChange.toFixed(0)}%</span>
      {aboveThreshold && (
        <span className="text-[#ff6b35] text-[8px]">&#9888;</span>
      )}
    </div>
  );
}

function EventCard({ event }: { event: CrisisEvent }) {
  const style = EVENT_TYPES[event.type];
  return (
    <div
      className={`p-3 rounded-lg border-l-[3px] text-[12px] leading-[1.5] ${style.bg} ${style.border}`}
    >
      <div className="font-mono text-[11px] font-bold uppercase tracking-[0.5px] text-white/90">
        {event.country}
      </div>
      <div className="font-mono text-[10px] text-white/45 mt-0.5">
        {event.who} &middot; {style.label}
      </div>
      <div className="mt-1 text-white/75">{event.text}</div>
      {event.gap && (
        <div className="text-[10px] text-[#ff6b35] italic mt-1.5 font-medium">
          &#9888; {event.gap}
        </div>
      )}
    </div>
  );
}

// ---------- Oil price chart (canvas) ----------

function drawOilChart(
  canvas: HTMLCanvasElement,
  dayIndex: number,
  projection: import('../data/projections').ScenarioProjection | null,
) {
  const container = canvas.parentElement;
  if (!container) return;

  const dpr = window.devicePixelRatio || 1;
  const W = container.clientWidth;
  const H = 110;

  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';

  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.scale(dpr, dpr);

  const PAD_L = 10;
  const PAD_R = 36;
  const PAD_T = 10;
  const PAD_B = 10;

  const totalDays = MAX_DAY; // 90 days total
  const bBase = BRENT_PRICES[0];
  const dBase = DUBAI_PRICES[0];
  const jBase = JET_FUEL_PRICES[0];

  const mn = 85;
  const mx = 320; // expanded for escalation scenario ($200+ = 278 indexed)

  function toIdx(val: number, base: number) {
    return (val / base) * 100;
  }
  function toY(idx: number) {
    return PAD_T + ((mx - idx) / (mx - mn)) * (H - PAD_T - PAD_B);
  }
  function toX(i: number) {
    return PAD_L + (i / (totalDays - 1)) * (W - PAD_L - PAD_R);
  }

  ctx.clearRect(0, 0, W, H);

  // Grid lines
  const gridLevels = [100, 150, 200, 250, 300];
  ctx.strokeStyle = '#1a1e28';
  ctx.lineWidth = 0.5;
  ctx.font = '8px JetBrains Mono, monospace';
  ctx.fillStyle = '#333';
  for (const lvl of gridLevels) {
    const y = toY(lvl);
    ctx.beginPath();
    ctx.moveTo(PAD_L, y);
    ctx.lineTo(W - PAD_R, y);
    ctx.stroke();
    ctx.fillText(lvl === 100 ? 'base' : '+' + (lvl - 100) + '%', W - PAD_R + 3, y + 3);
  }

  // NOW boundary line
  const nowX = toX(TOTAL_DAYS - 1);
  ctx.strokeStyle = '#ff6b35';
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.3;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(nowX, 0);
  ctx.lineTo(nowX, H);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;

  // Projected zone background
  if (projection) {
    ctx.fillStyle = 'rgba(255,255,255,0.015)';
    ctx.fillRect(nowX, 0, W - nowX, H);
  }

  // Current day highlight
  const cx = toX(dayIndex);
  ctx.fillStyle = 'rgba(255, 107, 53, 0.07)';
  ctx.fillRect(cx - 4, 0, 8, H);

  // Helper: get value for any day index (real or projected)
  function getVal(seriesKey: 'brent' | 'dubai' | 'jetFuel', i: number): number {
    if (i < TOTAL_DAYS) {
      if (seriesKey === 'brent') return BRENT_PRICES[i];
      if (seriesKey === 'dubai') return DUBAI_PRICES[i];
      return JET_FUEL_PRICES[i];
    }
    if (!projection) return 0;
    const proj = projection.days[i - TOTAL_DAYS];
    if (!proj) return 0;
    return proj[seriesKey];
  }

  // Gradient fill between jet fuel and Brent (real data only)
  const realEnd = Math.min(dayIndex, TOTAL_DAYS - 1);
  if (realEnd >= 1) {
    ctx.beginPath();
    for (let i = 0; i <= realEnd; i++) ctx.lineTo(toX(i), toY(toIdx(JET_FUEL_PRICES[i], jBase)));
    for (let i = realEnd; i >= 0; i--) ctx.lineTo(toX(i), toY(toIdx(BRENT_PRICES[i], bBase)));
    ctx.closePath();
    ctx.fillStyle = 'rgba(24, 255, 255, 0.04)';
    ctx.fill();
  }

  // Draw series
  const seriesConfig: [string, 'brent' | 'dubai' | 'jetFuel', number][] = [
    ['#ff6b35', 'brent', bBase],
    ['#ff3366', 'dubai', dBase],
    ['#18ffff', 'jetFuel', jBase],
  ];

  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  for (const [col, key, base] of seriesConfig) {
    // Real data (solid line)
    ctx.beginPath();
    ctx.strokeStyle = col;
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    for (let i = 0; i <= Math.min(dayIndex, TOTAL_DAYS - 1); i++) {
      const x = toX(i), y = toY(toIdx(getVal(key, i), base));
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Projected data (dashed line)
    if (projection && dayIndex >= TOTAL_DAYS) {
      ctx.beginPath();
      ctx.strokeStyle = col;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.globalAlpha = 0.7;
      for (let i = TOTAL_DAYS - 1; i <= dayIndex; i++) {
        const x = toX(i), y = toY(toIdx(getVal(key, i), base));
        i === TOTAL_DAYS - 1 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
    }
  }

  // Dots at current position
  for (const [col, key, base] of seriesConfig) {
    const x = toX(dayIndex);
    const val = getVal(key, dayIndex);
    const y = toY(toIdx(val, base));
    ctx.beginPath();
    ctx.fillStyle = col + '30';
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = col;
    ctx.arc(x, y, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ---------- Main component ----------

export default function CrisisMap() {
  const [day, setDay] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [scenario, setScenario] = useState<ScenarioId>('grind');
  const [tooltipContent, setTooltipContent] = useState('');
  const tooltipRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const playRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isProjected = day > TOTAL_DAYS;
  const dayIndex = day - 1;

  // Generate all projections once (memoized)
  const projections = useMemo(() => generateAllProjections(), []);
  const activeProjection = projections[scenario];

  // Unified stats: real data for days 1-35, projected for 36-90
  const stats = isProjected
    ? activeProjection.days[day - TOTAL_DAYS - 1]
    : getDayStats(dayIndex);
  const events = isProjected
    ? [] // no real events in projection
    : getEventsForDay(day);
  const projectedEvents = isProjected
    ? activeProjection.scenario.events.filter(e => e.day === day)
    : [];
  const displayDate = isProjected
    ? (stats as ProjectedDay).date
    : DATES[dayIndex];

  // Confidence level for projection
  const confidence = !isProjected ? null : day <= TOTAL_DAYS + 15 ? 'HIGH' : day <= TOTAL_DAYS + 35 ? 'MODERATE' : 'LOW';
  const confidenceColor = confidence === 'HIGH' ? '#66bb6a' : confidence === 'MODERATE' ? '#ffab40' : '#ef5350';

  // Play / pause
  useEffect(() => {
    if (playing) {
      playRef.current = setInterval(() => {
        setDay(d => {
          if (d >= MAX_DAY) {
            setPlaying(false);
            return d;
          }
          return d + 1;
        });
      }, 900);
    }
    return () => {
      if (playRef.current) clearInterval(playRef.current);
    };
  }, [playing]);

  // Draw chart on day change or resize
  const redrawChart = useCallback(() => {
    if (chartRef.current) drawOilChart(chartRef.current, dayIndex, isProjected ? activeProjection : null);
  }, [dayIndex, activeProjection, isProjected]);

  useEffect(() => {
    redrawChart();
    window.addEventListener('resize', redrawChart);
    return () => window.removeEventListener('resize', redrawChart);
  }, [redrawChart]);

  const togglePlay = useCallback(() => {
    if (playing) {
      setPlaying(false);
    } else {
      if (day >= MAX_DAY) setDay(1);
      setPlaying(true);
    }
  }, [playing, day]);

  return (
    <div
      className="min-h-screen text-[#e0e0e0] overflow-x-clip"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background:
          'radial-gradient(ellipse at 50% 25%, rgba(255,107,53,0.025) 0%, transparent 55%), ' +
          'radial-gradient(ellipse at 75% 55%, rgba(138,26,26,0.02) 0%, transparent 45%), ' +
          '#080a0f',
      }}
    >
      <div className="max-w-[1440px] mx-auto px-4 py-5 pb-28 md:pb-16">
        {/* Header */}
        <div className="animate-[fadeIn_0.5s_ease]">
          <h1
            className="text-[18px] font-bold tracking-[-0.5px] text-[#ff6b35] uppercase"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Iran War Crisis Propagation
          </h1>
          <p
            className="text-[11px] text-[#666] mb-4"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Government statements vs reality — Feb 28 to Apr 3, 2026
          </p>
        </div>

        {/* Day counter + play + slider — sticky top bar on desktop */}
        <div className="hidden md:block sticky top-0 z-50 -mx-4 px-4 py-3 backdrop-blur-md" style={{ background: 'rgba(8,10,15,0.85)' }}>
          <div className="flex items-center gap-3 flex-wrap mb-1.5">
            <span
              className="text-[42px] font-bold leading-none"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: isProjected ? activeProjection.scenario.color : 'white',
              }}
            >
              DAY {day}
            </span>
            <span
              className="text-[12px] text-[#888]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {displayDate}, 2026
            </span>
            {isProjected && (
              <>
                <span
                  className="text-[9px] px-1.5 py-0.5 rounded font-mono uppercase tracking-wider"
                  style={{ background: activeProjection.scenario.color + '15', color: activeProjection.scenario.color }}
                >
                  Projected
                </span>
                <span
                  className="text-[9px] font-mono uppercase tracking-wider"
                  style={{ color: confidenceColor }}
                >
                  {confidence} confidence
                </span>
              </>
            )}
            <button
              onClick={togglePlay}
              className="bg-[#ff6b35] hover:bg-[#ff8555] text-[#0a0c10] font-bold text-[11px] px-3 py-1.5 rounded-md cursor-pointer border-none transition-colors"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {playing ? '⏸ PAUSE' : '▶ PLAY'}
            </button>
            <div className="ml-auto">
              <ScenarioSelector active={scenario} onChange={setScenario} enabled={isProjected} />
            </div>
          </div>
          {/* Slider with NOW divider */}
          <div className="relative mb-0">
            <input
              type="range"
              min={1}
              max={MAX_DAY}
              value={day}
              onChange={e => {
                setPlaying(false);
                setDay(Number(e.target.value));
              }}
              className="crisis-slider w-full"
            />
            {/* NOW divider line */}
            <div
              className="absolute top-0 bottom-0 w-px pointer-events-none"
              style={{
                left: `${(TOTAL_DAYS / MAX_DAY) * 100}%`,
                background: '#ff6b35',
                opacity: 0.6,
              }}
            >
              <span
                className="absolute -top-3 -translate-x-1/2 text-[8px] font-mono text-[#ff6b35]"
              >
                NOW
              </span>
            </div>
          </div>
        </div>

        {/* Hero stats — the 3 numbers that tell the whole story */}
        <div className="flex gap-3 mb-3 flex-wrap">
          <HeroStat value={'$' + stats.brent} label="Brent crude" sublabel={'pre-war $72 · +' + Math.round((stats.brent / 72 - 1) * 100) + '%'} color="#ff6b35" projected={isProjected} />
          <HeroStat value={stats.hormuzTransits + ' / 138'} label="Hormuz transits/day" sublabel={'-' + Math.round((1 - stats.hormuzTransits / 138) * 100) + '% from pre-war'} color="#4dd0e1" projected={isProjected} />
          <HeroStat value={stats.signalGaps} label="Signal-action gaps" sublabel="Govts say calm while acting emergency" color="#ffd54f" projected={isProjected} />
          <HeroStat value={stats.emergencies} label="Countries in emergency" sublabel={stats.rationing + ' rationing · ' + stats.affected + ' with measures'} color="#ff3366" projected={isProjected} />
        </div>

        {/* Fuel depletion + pump prices side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
          {/* Fuel days remaining — the countdown clocks */}
          <div className="bg-[#0d1017] border border-[#1a1e28] rounded-lg px-3 py-3">
            <div className="text-[10px] text-[#888] font-mono uppercase tracking-wider mb-2">
              Fuel Reserves — Days Remaining
              <span className="text-[#444] ml-2">|</span>
              <span className="text-[#444] ml-2">line = IEA 90-day minimum</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {Object.entries(FUEL_DAYS)
                .sort((a, b) => {
                  const aVal = isProjected ? ((stats as ProjectedDay).fuelDays[a[0]] ?? a[1].days[TOTAL_DAYS - 1]) : a[1].days[dayIndex];
                  const bVal = isProjected ? ((stats as ProjectedDay).fuelDays[b[0]] ?? b[1].days[TOTAL_DAYS - 1]) : b[1].days[dayIndex];
                  return aVal - bVal;
                })
                .map(([code, data]) => {
                  const daysLeft = isProjected
                    ? ((stats as ProjectedDay).fuelDays[code] ?? data.days[TOTAL_DAYS - 1])
                    : data.days[dayIndex];
                  return (
                    <FuelBar
                      key={code}
                      country={code}
                      label={COUNTRY_NAMES[code] || code}
                      daysLeft={daysLeft}
                      projected={isProjected}
                    />
                  );
                })}
            </div>
          </div>

          {/* Pump prices — what people actually pay */}
          <div className="bg-[#0d1017] border border-[#1a1e28] rounded-lg px-3 py-3">
            <div
              className="text-[10px] text-[#888] font-mono uppercase tracking-wider mb-2"
              title="Pain threshold = the price point where surveys/research show a majority of people significantly change driving behavior, cut spending, or can no longer afford to commute. Based on AAA surveys, national transport studies, and historical precedents (e.g. France's Gilets Jaunes at €1.53/L in 2018). Hover each row for country-specific details."
            >
              Pump Prices — What People Pay
              <span className="text-[#444] ml-2">|</span>
              <span className="text-[#ff6b35] ml-2 cursor-help">&#9888;</span>
              <span className="text-[#555] ml-1 cursor-help">= above pain threshold</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {Object.entries(PUMP_PRICES).map(([code]) => (
                <PumpPrice key={code} code={code} dayIndex={dayIndex} projectedPrice={isProjected ? (stats as ProjectedDay).pumpPrices[code] : undefined} />
              ))}
            </div>
          </div>
        </div>

        {/* Secondary stats — two compact rows */}
        <div className="flex gap-2 mb-2 flex-wrap">
          <StatBox value={'$' + stats.dubai} label="Dubai physical" color="#ff3366" projected={isProjected} />
          <StatBox value={'$' + stats.spread} label="Paper-physical spread" color={stats.spread >= 20 ? '#ef5350' : stats.spread >= 10 ? '#ffab40' : '#66bb6a'} projected={isProjected} />
          <StatBox value={stats.supplyOffline.toFixed(1)} label="Supply offline (mbpd)" color="#ef5350" projected={isProjected} />
          <StatBox value={stats.sprReleased.toFixed(1) + 'M'} label="SPR released" color="#ffab40" projected={isProjected} />
          <StatBox value={stats.euGasStorage.toFixed(1) + '%'} label="EU gas storage" color="#26c6da" projected={isProjected} />
        </div>
        <div className="flex gap-2 mb-3 flex-wrap">
          <StatBox value={'$' + stats.gold.toLocaleString()} label="Gold ($/oz)" color="#ffd740" projected={isProjected} />
          <StatBox value={stats.vix.toFixed(1)} label="VIX" color="#e57373" projected={isProjected} />
          <StatBox value={stats.forceMajeures} label="Force majeures" color="#ff8a65" projected={isProjected} />
          <StatBox value={stats.unrest + '/5'} label="Unrest index" color={['#66bb6a','#66bb6a','#ffab40','#ff9800','#ef5350','#d32f2f'][stats.unrest]} projected={isProjected} />
        </div>

        {/* Legend */}
        <div
          className="flex gap-3 mb-3 flex-wrap text-[10px] text-[#888]"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {([1, 2, 3, 4, 5] as SeverityLevel[]).map(level => (
            <div key={level} className="flex items-center gap-1.5">
              <div
                className="w-[10px] h-[10px] rounded-sm border border-[#2a2e38]"
                style={{ background: SEVERITY_LEVELS[level].color }}
              />
              {SEVERITY_LEVELS[level].label}
            </div>
          ))}
        </div>

        {/* Map — full width */}
        <div className="relative bg-[#0d1017] rounded-xl border border-[#1a1e28] overflow-hidden mb-3">
          <ComposableMap
            projection="geoNaturalEarth1"
            projectionConfig={{
              rotate: [-20, 0, 0],
              scale: 155,
            }}
            width={900}
            height={460}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          >
            <Sphere
              id="sphere"
              fill="transparent"
              stroke="#111520"
              strokeWidth={0.5}
            />
            <Graticule stroke="#111520" strokeWidth={0.3} />
            <Geographies geography={GEO_URL}>
              {({ geographies }: { geographies: any[] }) =>
                geographies.map(geo => {
                  const projSev = isProjected ? (stats as ProjectedDay).countrySeverity : undefined;
                  const fill = getCountryFill(geo.id, dayIndex, projSev);
                  const info = getCountryInfo(geo.id, dayIndex, projSev);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => {
                        if (info) setTooltipContent(`${info.name} — ${info.label}`);
                      }}
                      onMouseMove={(e: React.MouseEvent) => {
                        if (tooltipRef.current) {
                          tooltipRef.current.style.left = e.clientX + 14 + 'px';
                          tooltipRef.current.style.top = e.clientY - 14 + 'px';
                        }
                      }}
                      onMouseLeave={() => setTooltipContent('')}
                      style={{
                        default: {
                          fill,
                          stroke: '#1a1e28',
                          strokeWidth: 0.4,
                          outline: 'none',
                          transition: 'fill 0.45s ease',
                        },
                        hover: {
                          fill,
                          stroke: '#ff6b35',
                          strokeWidth: 1,
                          outline: 'none',
                          filter: 'brightness(1.4)',
                          cursor: 'pointer',
                        },
                        pressed: { outline: 'none' },
                      }}
                    />
                  );
                })
              }
            </Geographies>

            {/* Strait of Hormuz indicator */}
            <Marker coordinates={[56.3, 26.6]}>
              <circle r={5} fill="#ff3366" opacity={0.7}>
                <animate
                  attributeName="r"
                  values="4;7;4"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.7;0.3;0.7"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle r={2.5} fill="#ff3366" />
              <text
                y={-10}
                textAnchor="middle"
                fill="#ff3366"
                fontSize={6}
                fontFamily="JetBrains Mono, monospace"
                fontWeight={700}
              >
                HORMUZ CLOSED
              </text>
            </Marker>
          </ComposableMap>

          {/* Tooltip */}
          <div
            ref={tooltipRef}
            className="fixed pointer-events-none z-50 transition-opacity duration-100"
            style={{ opacity: tooltipContent ? 1 : 0 }}
          >
            <div
              className="bg-[#181c24] border border-[#2a2e38] text-[11px] text-white/90 px-2.5 py-1.5 rounded-md shadow-lg whitespace-nowrap"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {tooltipContent}
            </div>
          </div>
        </div>

        {/* Energy chart + Events grid — below map */}
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-3">
          {/* Oil price chart */}
          <div className="bg-[#0d1017] rounded-xl border border-[#1a1e28] p-3">
            <div className="mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              <div className="text-[10px] text-[#666] mb-1">ENERGY PRICES (indexed, Day 1 = 100)</div>
              <div className="flex gap-2 flex-wrap text-[11px] font-bold">
                <span className="text-[#ff6b35]">Brent ${stats.brent}</span>
                <span className="text-[#ff3366]">Dubai ${stats.dubai}</span>
                <span className="text-[#18ffff]">Jet ${stats.jetFuel.toLocaleString()}/mt {stats.jetFuelChange > 0 ? '+' : ''}{stats.jetFuelChange}%</span>
              </div>
            </div>
            <div>
              <canvas ref={chartRef} />
            </div>
          </div>

          {/* Events panel — horizontal cards */}
          <div className={`bg-[#0d1017] rounded-xl p-3 ${isProjected ? 'border border-dashed border-[#2a2e38]' : 'border border-[#1a1e28]'}`}>
            <div
              className="text-[11px] text-[#888] mb-2"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {isProjected
                ? `SCENARIO ${activeProjection.scenario.shortLabel}: ${activeProjection.scenario.label.toUpperCase()} — ${displayDate.toUpperCase()}`
                : events.length > 0
                  ? `EVENTS — ${DATES[dayIndex].toUpperCase()}`
                  : `NO MAJOR EVENTS — ${DATES[dayIndex].toUpperCase()}`}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
              {!isProjected && events.map((event, i) => (
                <div key={`${event.day}-${i}`}>
                  <EventCard event={event} />
                </div>
              ))}
              {isProjected && projectedEvents.map((event, i) => (
                <div
                  key={`proj-${event.day}-${i}`}
                  className="p-3 rounded-lg border-l-[3px] border-dashed text-[12px] leading-[1.5] bg-[#1a1a1a]"
                  style={{ borderColor: activeProjection.scenario.color + '80' }}
                >
                  <div className="font-mono text-[11px] font-bold uppercase tracking-[0.5px] text-white/90">
                    {event.country}
                  </div>
                  <div
                    className="font-mono text-[10px] mt-0.5"
                    style={{ color: activeProjection.scenario.color }}
                  >
                    Scenario {activeProjection.scenario.shortLabel} · Projected
                  </div>
                  <div className="mt-1 text-white/75">{event.text}</div>
                </div>
              ))}
              {isProjected && projectedEvents.length === 0 && (
                <div className="text-[11px] text-[#555] italic col-span-full">
                  No scenario events for this day. Drag slider to see key projected milestones.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile fixed bottom slider */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 px-4 py-3 md:hidden border-t border-[#1a1a2e]"
        style={{ background: 'linear-gradient(to top, #080a0f 80%, rgba(8,10,15,0.95))' }}
      >
        <div className="flex items-baseline gap-3 flex-wrap mb-1.5">
          <span
            className="text-[32px] font-bold text-white leading-none"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            DAY {day}
          </span>
          <span
            className="text-[11px] text-[#888]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {displayDate}, 2026
          </span>
          {isProjected && (
            <span className="text-[8px] px-1 py-0.5 rounded font-mono uppercase" style={{ background: activeProjection.scenario.color + '15', color: activeProjection.scenario.color }}>
              {activeProjection.scenario.shortLabel}
            </span>
          )}
          <button
            onClick={togglePlay}
            className="bg-[#ff6b35] hover:bg-[#ff8555] text-[#0a0c10] font-bold text-[11px] px-3 py-1.5 rounded-md cursor-pointer border-none transition-colors"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {playing ? '⏸ PAUSE' : '▶ PLAY'}
          </button>
        </div>
        {isProjected && (
          <div className="mb-1.5">
            <ScenarioSelector active={scenario} onChange={setScenario} enabled={true} />
          </div>
        )}
        <input
          type="range"
          min={1}
          max={MAX_DAY}
          value={day}
          onChange={e => {
            setPlaying(false);
            setDay(Number(e.target.value));
          }}
          className="crisis-slider w-full"
        />
      </div>
    </div>
  );
}
