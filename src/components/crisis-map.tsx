import { useState, useEffect, useRef, useCallback } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  Sphere,
  Marker,
} from 'react-simple-maps';
import { motion, AnimatePresence } from 'motion/react';
import {
  DATES,
  TOTAL_DAYS,
  BRENT_PRICES,
  DUBAI_PRICES,
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

  const mn = 60;
  const mx = 160;

  function toY(price: number) {
    return PAD_T + ((mx - price) / (mx - mn)) * (H - PAD_T - PAD_B);
  }
  function toX(i: number) {
    return PAD_L + (i / (TOTAL_DAYS - 1)) * (W - PAD_L - PAD_R);
  }

  // Clear
  ctx.clearRect(0, 0, W, H);

  // Grid lines
  const gridPrices = [80, 100, 120, 140];
  ctx.strokeStyle = '#1a1e28';
  ctx.lineWidth = 0.5;
  ctx.font = '9px JetBrains Mono, monospace';
  ctx.fillStyle = '#333';
  for (const p of gridPrices) {
    const y = toY(p);
    ctx.beginPath();
    ctx.moveTo(PAD_L, y);
    ctx.lineTo(W - PAD_R, y);
    ctx.stroke();
    ctx.fillText('$' + p, W - PAD_R + 4, y + 3);
  }

  // Current day highlight
  const cx = toX(dayIndex);
  ctx.fillStyle = 'rgba(255, 107, 53, 0.07)';
  ctx.fillRect(cx - 4, 0, 8, H);

  // Gradient fill between Brent and Dubai
  if (dayIndex >= 1) {
    ctx.beginPath();
    for (let i = 0; i <= dayIndex; i++) ctx.lineTo(toX(i), toY(DUBAI_PRICES[i]));
    for (let i = dayIndex; i >= 0; i--) ctx.lineTo(toX(i), toY(BRENT_PRICES[i]));
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 51, 102, 0.06)';
    ctx.fill();
  }

  // Brent line (orange)
  ctx.beginPath();
  ctx.strokeStyle = '#ff6b35';
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  for (let i = 0; i <= dayIndex; i++) {
    const x = toX(i), y = toY(BRENT_PRICES[i]);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Dubai line (pink)
  ctx.beginPath();
  ctx.strokeStyle = '#ff3366';
  ctx.lineWidth = 2;
  for (let i = 0; i <= dayIndex; i++) {
    const x = toX(i), y = toY(DUBAI_PRICES[i]);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Dots at current position
  const dots: [string, number[]][] = [
    ['#ff6b35', BRENT_PRICES],
    ['#ff3366', DUBAI_PRICES],
  ];
  for (const [col, arr] of dots) {
    const x = toX(dayIndex);
    const y = toY(arr[dayIndex]);
    // Glow
    ctx.beginPath();
    ctx.fillStyle = col + '30';
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
    // Solid dot
    ctx.beginPath();
    ctx.fillStyle = col;
    ctx.arc(x, y, 4, 0, Math.PI * 2);
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
      <div className="max-w-[1440px] mx-auto px-4 py-5 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
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
        </motion.div>

        {/* Day counter + play */}
        <motion.div
          className="flex items-baseline gap-3 flex-wrap mb-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
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
        </motion.div>

        {/* Timeline slider */}
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

        {/* Stats row */}
        <motion.div
          className="flex gap-2.5 mb-3 flex-wrap"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <StatBox value={stats.affected} label="Countries w/ measures" color="#ff6b35" />
          <StatBox value={stats.rationing} label="Rationing" color="#cc2a2a" />
          <StatBox value={stats.emergencies} label="Emergencies" color="#ff3366" />
          <StatBox value={'$' + stats.brent} label="Brent (paper)" color="#ff6b35" />
          <StatBox value={'$' + stats.dubai} label="Dubai (physical)" color="#ff3366" />
        </motion.div>

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
          <motion.div
            className="relative bg-[#0d1017] rounded-xl border border-[#1a1e28] overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
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
          </motion.div>

          {/* Right sidebar: oil chart + events */}
          <div className="flex flex-col gap-3 min-h-0">
            {/* Oil price chart */}
            <motion.div
              className="bg-[#0d1017] rounded-xl border border-[#1a1e28] p-3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <div className="flex justify-between items-baseline mb-2">
                <div
                  className="text-[11px] text-[#888]"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  OIL PRICE ($/barrel)
                </div>
                <div className="flex gap-3">
                  <span
                    className="text-[13px] font-bold text-[#ff6b35]"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    Brent ${stats.brent}
                  </span>
                  <span
                    className="text-[13px] font-bold text-[#ff3366]"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    Dubai ${stats.dubai}
                  </span>
                </div>
              </div>
              <div>
                <canvas ref={chartRef} />
              </div>
            </motion.div>

            {/* Events panel */}
            <motion.div
              className="bg-[#0d1017] rounded-xl border border-[#1a1e28] p-3 crisis-events overflow-y-auto flex-1 min-h-0"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <div
                className="text-[11px] text-[#888] mb-2"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {events.length > 0
                  ? `EVENTS — ${DATES[dayIndex].toUpperCase()}`
                  : `NO MAJOR EVENTS — ${DATES[dayIndex].toUpperCase()}`}
              </div>
              <div className="flex flex-col gap-2">
                <AnimatePresence mode="popLayout">
                  {events.map((event, i) => (
                    <motion.div
                      key={`${event.day}-${event.country}-${event.type}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2, delay: i * 0.04 }}
                    >
                      <EventCard event={event} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
