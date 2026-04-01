import { useState, useEffect, useRef, useCallback } from 'react';
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
  getDayStats,
  getEventsForDay,
  getSeverityColor,
  type CrisisEvent,
  type SeverityLevel,
} from '../data/crisis-data';

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
};

function getCountryFill(geoId: string, dayIndex: number): string {
  const alpha3 = ISO_NUM_TO_ALPHA3[geoId];
  if (!alpha3 || !COUNTRY_STATUS[alpha3]) return '#151820';
  return getSeverityColor(COUNTRY_STATUS[alpha3][dayIndex]);
}

function getCountryInfo(geoId: string, dayIndex: number) {
  const alpha3 = ISO_NUM_TO_ALPHA3[geoId];
  if (!alpha3 || !COUNTRY_NAMES[alpha3]) return null;
  const severity = COUNTRY_STATUS[alpha3]?.[dayIndex] ?? 0;
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
}: {
  value: string | number;
  label: string;
  color: string;
}) {
  return (
    <div className="bg-[#0d1017] border border-[#1a1e28] rounded-lg px-3 py-2.5 flex-1 min-w-[100px]">
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

  // Indexed chart: all series normalized to Day 1 = 100
  const bBase = BRENT_PRICES[0];
  const dBase = DUBAI_PRICES[0];
  const jBase = JET_FUEL_PRICES[0];

  const mn = 85;
  const mx = 220;

  function toIdx(val: number, base: number) {
    return (val / base) * 100;
  }
  function toY(idx: number) {
    return PAD_T + ((mx - idx) / (mx - mn)) * (H - PAD_T - PAD_B);
  }
  function toX(i: number) {
    return PAD_L + (i / (TOTAL_DAYS - 1)) * (W - PAD_L - PAD_R);
  }

  ctx.clearRect(0, 0, W, H);

  // Grid lines
  const gridLevels = [100, 125, 150, 175, 200];
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

  // Current day highlight
  const cx = toX(dayIndex);
  ctx.fillStyle = 'rgba(255, 107, 53, 0.07)';
  ctx.fillRect(cx - 4, 0, 8, H);

  // Gradient fill between jet fuel and Brent (refining margin amplification)
  if (dayIndex >= 1) {
    ctx.beginPath();
    for (let i = 0; i <= dayIndex; i++) ctx.lineTo(toX(i), toY(toIdx(JET_FUEL_PRICES[i], jBase)));
    for (let i = dayIndex; i >= 0; i--) ctx.lineTo(toX(i), toY(toIdx(BRENT_PRICES[i], bBase)));
    ctx.closePath();
    ctx.fillStyle = 'rgba(24, 255, 255, 0.04)';
    ctx.fill();
  }

  // Draw lines: Brent (orange), Dubai (pink), Jet fuel (cyan)
  const series: [string, number[], number][] = [
    ['#ff6b35', BRENT_PRICES, bBase],
    ['#ff3366', DUBAI_PRICES, dBase],
    ['#18ffff', JET_FUEL_PRICES, jBase],
  ];

  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  for (const [col, arr, base] of series) {
    ctx.beginPath();
    ctx.strokeStyle = col;
    ctx.lineWidth = 2;
    for (let i = 0; i <= dayIndex; i++) {
      const x = toX(i), y = toY(toIdx(arr[i], base));
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Dots at current position
  for (const [col, arr, base] of series) {
    const x = toX(dayIndex);
    const y = toY(toIdx(arr[dayIndex], base));
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
  const [tooltipContent, setTooltipContent] = useState('');
  const tooltipRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const playRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const dayIndex = day - 1;
  const stats = getDayStats(dayIndex);
  const events = getEventsForDay(day);

  // Play / pause
  useEffect(() => {
    if (playing) {
      playRef.current = setInterval(() => {
        setDay(d => {
          if (d >= TOTAL_DAYS) {
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
    if (chartRef.current) drawOilChart(chartRef.current, dayIndex);
  }, [dayIndex]);

  useEffect(() => {
    redrawChart();
    window.addEventListener('resize', redrawChart);
    return () => window.removeEventListener('resize', redrawChart);
  }, [redrawChart]);

  const togglePlay = useCallback(() => {
    if (playing) {
      setPlaying(false);
    } else {
      if (day >= TOTAL_DAYS) setDay(1);
      setPlaying(true);
    }
  }, [playing, day]);

  return (
    <div
      className="min-h-screen text-[#e0e0e0] overflow-x-hidden"
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
            Government statements vs reality — Feb 28 to Mar 30, 2026
          </p>
        </div>

        {/* Day counter + play + slider — fixed bottom bar on mobile */}
        <div className="hidden md:block">
          <div className="flex items-baseline gap-3 flex-wrap mb-1.5">
            <span
              className="text-[42px] font-bold text-white leading-none"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              DAY {day}
            </span>
            <span
              className="text-[12px] text-[#888]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {DATES[dayIndex]}, 2026
            </span>
            <button
              onClick={togglePlay}
              className="bg-[#ff6b35] hover:bg-[#ff8555] text-[#0a0c10] font-bold text-[11px] px-3 py-1.5 rounded-md cursor-pointer border-none transition-colors"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {playing ? '⏸ PAUSE' : '▶ PLAY'}
            </button>
          </div>
          <div className="mb-4">
            <input
              type="range"
              min={1}
              max={TOTAL_DAYS}
              value={day}
              onChange={e => {
                setPlaying(false);
                setDay(Number(e.target.value));
              }}
              className="crisis-slider w-full"
            />
          </div>
        </div>

        {/* Stats row 1: crisis metrics */}
        <div className="flex gap-2.5 mb-2 flex-wrap">
          <StatBox value={'$' + stats.brent} label="Brent (paper)" color="#ff6b35" />
          <StatBox value={'$' + stats.dubai} label="Dubai (physical)" color="#ff3366" />
          <StatBox value={'$' + stats.spread} label="Paper-physical spread" color={stats.spread >= 20 ? '#ef5350' : stats.spread >= 10 ? '#ffab40' : '#66bb6a'} />
          <StatBox value={'$' + stats.gold.toLocaleString()} label="Gold ($/oz)" color="#ffd740" />
          <StatBox value={stats.vix.toFixed(1)} label="VIX" color="#e57373" />
        </div>

        {/* Stats row 2: supply */}
        <div className="flex gap-2.5 mb-2 flex-wrap">
          <StatBox value={stats.hormuzTransits} label="Hormuz transits/day" color="#4dd0e1" />
          <StatBox value={stats.supplyOffline.toFixed(1)} label="Supply offline (mbpd)" color="#ef5350" />
          <StatBox value={stats.euGasStorage.toFixed(1) + '%'} label="EU gas storage" color="#26c6da" />
          <StatBox value={stats.sprReleased.toFixed(1) + 'M'} label="SPR released (of 400M)" color="#ffab40" />
          <StatBox value={stats.forceMajeures} label="Force majeures" color="#ff8a65" />
        </div>

        {/* Stats row 3: impact */}
        <div className="flex gap-2.5 mb-3 flex-wrap">
          <StatBox value={stats.affected} label="Countries w/ measures" color="#ff6b35" />
          <StatBox value={stats.rationing} label="Rationing" color="#cc2a2a" />
          <StatBox value={stats.emergencies} label="Emergencies" color="#ff3366" />
          <StatBox value={stats.signalGaps} label="Signal-action gaps" color="#ffd54f" />
          <StatBox value={stats.unrest + '/5'} label="Unrest index" color={['#66bb6a','#66bb6a','#ffab40','#ff9800','#ef5350','#d32f2f'][stats.unrest]} />
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

        {/* Map + sidebar layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-3">
          {/* Map */}
          <div className="relative bg-[#0d1017] rounded-xl border border-[#1a1e28] overflow-hidden">
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
                    const fill = getCountryFill(geo.id, dayIndex);
                    const info = getCountryInfo(geo.id, dayIndex);
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

          {/* Right sidebar: oil chart + events */}
          <div className="flex flex-col gap-3 min-h-0">
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

            {/* Events panel */}
            <div className="bg-[#0d1017] rounded-xl border border-[#1a1e28] p-3 crisis-events overflow-y-auto flex-1 min-h-0">
              <div
                className="text-[11px] text-[#888] mb-2"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {events.length > 0
                  ? `EVENTS — ${DATES[dayIndex].toUpperCase()}`
                  : `NO MAJOR EVENTS — ${DATES[dayIndex].toUpperCase()}`}
              </div>
              <div className="flex flex-col gap-2">
                {events.map((event, i) => (
                  <div key={`${event.day}-${event.country}-${event.type}`}>
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
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
            {DATES[dayIndex]}, 2026
          </span>
          <button
            onClick={togglePlay}
            className="bg-[#ff6b35] hover:bg-[#ff8555] text-[#0a0c10] font-bold text-[11px] px-3 py-1.5 rounded-md cursor-pointer border-none transition-colors"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {playing ? '⏸ PAUSE' : '▶ PLAY'}
          </button>
        </div>
        <input
          type="range"
          min={1}
          max={TOTAL_DAYS}
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
