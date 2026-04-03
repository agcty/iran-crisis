import { useState, useEffect, useMemo } from "react";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

interface Job {
  id: number;
  title: string;
  company: string;
  match: number;
  gradient: [string, string];
  initials: string;
  open: boolean;
}

const JOBS: Job[] = [
  { id: 1, title: "Lagerhelfer", company: "DHL Logistics", match: 92, gradient: ["#F5C542","#FBE08A"], initials: "DHL", open: true },
  { id: 2, title: "Verkäufer/in", company: "REWE Group", match: 88, gradient: ["#E85454","#F29A9A"], initials: "RE", open: true },
  { id: 3, title: "Pflegehilfskraft", company: "Charité Berlin", match: 76, gradient: ["#4DA8DA","#8DCAE8"], initials: "CH", open: true },
  { id: 4, title: "Bürokraft", company: "Siemens AG", match: 95, gradient: ["#00A5A8","#6DCBCD"], initials: "SI", open: true },
  { id: 5, title: "Koch/Köchin", company: "Block House", match: 61, gradient: ["#8B5E3C","#C4956A"], initials: "BH", open: false },
  { id: 6, title: "Reinigungskraft", company: "Gegenbauer", match: 84, gradient: ["#56C9A8","#A8EDCE"], initials: "GE", open: true },
  { id: 7, title: "Fahrer/in", company: "Amazon Flex", match: 71, gradient: ["#FF9900","#FFBF60"], initials: "AF", open: true },
  { id: 8, title: "Erzieher/in", company: "Kita Sonnenschein", match: 90, gradient: ["#FF7EB3","#FFB3D1"], initials: "KS", open: true },
  { id: 9, title: "Montagehelfer", company: "BMW Werk", match: 67, gradient: ["#1C69D4","#6BA3E8"], initials: "BM", open: false },
  { id: 10, title: "Empfangskraft", company: "Maritim Hotel", match: 82, gradient: ["#C47AFF","#E0B6FF"], initials: "MH", open: true },
  { id: 11, title: "Produktionsmitarbeiter", company: "Bosch GmbH", match: 58, gradient: ["#E07A5F","#F0AFA0"], initials: "BO", open: false },
  { id: 12, title: "Kundenberater/in", company: "Telekom", match: 79, gradient: ["#E20074","#F06DAD"], initials: "DT", open: true },
  { id: 13, title: "Gärtner/in", company: "Grün Berlin", match: 53, gradient: ["#5FAD56","#9DD396"], initials: "GB", open: false },
  { id: 14, title: "Kassierer/in", company: "Lidl", match: 93, gradient: ["#0050AA","#6B9FD4"], initials: "LI", open: true },
  { id: 15, title: "Küchenhilfe", company: "IKEA Restaurant", match: 69, gradient: ["#FFDA1A","#FFE97A"], initials: "IK", open: true },
  { id: 16, title: "Servicekraft", company: "Vapiano", match: 74, gradient: ["#34C68A","#7DDEAF"], initials: "VA", open: true },
  { id: 17, title: "Sachbearbeiter/in", company: "Allianz", match: 86, gradient: ["#003781","#5A7DB5"], initials: "AL", open: true },
  { id: 18, title: "Mechaniker/in", company: "ATU", match: 63, gradient: ["#D62828","#E87A7A"], initials: "AT", open: true },
  { id: 19, title: "Aushilfe Logistik", company: "Zalando", match: 77, gradient: ["#FF6900","#FFAB66"], initials: "ZA", open: true },
  { id: 20, title: "Altenpfleger/in", company: "AWO Berlin", match: 91, gradient: ["#E76F8A","#F4A8B8"], initials: "AW", open: true },
  { id: 21, title: "Haustechniker", company: "Wisag", match: 55, gradient: ["#7B93DB","#ADBCE8"], initials: "WI", open: false },
  { id: 22, title: "Rezeptionist/in", company: "NH Hotel", match: 80, gradient: ["#E8965A","#F2C49B"], initials: "NH", open: true },
  { id: 23, title: "Packer/in", company: "Hermes", match: 64, gradient: ["#9BAFC4","#BFD0DF"], initials: "HE", open: false },
  { id: 24, title: "Callcenter Agent", company: "Arvato", match: 85, gradient: ["#5E9ED6","#96C3E8"], initials: "AR", open: true },
];

function sr(seed: number) {
  let x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

interface BubbleProps {
  p: Job;
  index: number;
  total: number;
  hovered: number | null;
  onHover: (id: number) => void;
  onLeave: () => void;
  loaded: boolean;
}

function Bubble({ p, index, total, hovered, onHover, onLeave, loaded }: BubbleProps) {
  const baseSize = 52 + p.match * 0.45;
  const isActive = hovered === p.id;
  const isDimmed = hovered !== null && !isActive;

  const pos = useMemo(() => {
    const cols = 6;
    const row = Math.floor(index / cols);
    const col = index % cols;
    const totalRows = Math.ceil(total / cols);
    const xSpread = 78;
    const ySpread = Math.min(26, 80 / totalRows);
    const xOff = row % 2 === 0 ? 0 : xSpread / cols / 3;
    const bx = 11 + ((col + 0.5) / cols) * xSpread + xOff;
    const by = 8 + row * ySpread;
    const jx = (sr(index * 7 + 3) - 0.5) * 4;
    const jy = (sr(index * 13 + 7) - 0.5) * 3.5;
    return { x: bx + jx, y: by + jy };
  }, [index, total]);

  const dur = 7 + sr(index * 17) * 5;
  const del = sr(index * 23) * -12;
  const amp = 2 + sr(index * 31) * 2.5;
  const ang = sr(index * 41) * 360;
  const entryDelay = 0.6 + index * 0.04;
  const glowSize = baseSize * 1.8;

  return (
    <div
      onMouseEnter={() => onHover(p.id)}
      onMouseLeave={onLeave}
      className="absolute cursor-pointer"
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        width: baseSize,
        height: baseSize,
        zIndex: isActive ? 50 : 10,
        opacity: loaded ? (isDimmed ? 0.35 : 1) : 0,
        transform: `translate(-50%, -50%) scale(${loaded ? (isActive ? 1.18 : 1) : 0.4})`,
        transition: `opacity 0.6s cubic-bezier(0.4,0,0.2,1) ${entryDelay}s, transform 0.45s cubic-bezier(0.34,1.56,0.64,1), filter 0.5s ease`,
        animation: loaded ? `drift ${dur}s ease-in-out ${del}s infinite` : "none",
        "--dx": `${Math.cos(ang * Math.PI / 180) * amp}px`,
        "--dy": `${Math.sin(ang * Math.PI / 180) * amp}px`,
        filter: isDimmed ? "blur(1.5px) saturate(0.7)" : "none",
      } as CSSProperties}
    >
      {/* Outer glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-[background] duration-500 ease-in-out"
        style={{
          width: glowSize,
          height: glowSize,
          background: `radial-gradient(circle, ${p.gradient[0]}${isActive ? "30" : "18"} 0%, ${p.gradient[1]}08 50%, transparent 70%)`,
        }}
      />

      {/* Shadow ring */}
      <div
        className="absolute inset-0 rounded-full transition-[box-shadow] duration-500"
        style={{
          transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)",
          boxShadow: isActive
            ? `0 20px 50px -10px ${p.gradient[0]}50, 0 10px 25px -5px ${p.gradient[0]}25, 0 4px 10px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(255,255,255,0.2)`
            : `0 8px 32px -8px ${p.gradient[0]}28, 0 4px 14px -4px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)`,
        }}
      />

      {/* Main bubble */}
      <div
        className="w-full h-full rounded-full relative overflow-hidden border-2 border-white/60 shadow-[inset_0_-4px_12px_rgba(0,0,0,0.08),inset_0_2px_6px_rgba(255,255,255,0.25)]"
        style={{ background: `linear-gradient(145deg, ${p.gradient[0]}, ${p.gradient[1]})` }}
      >
        {/* Top highlight */}
        <div className="absolute -top-[8%] left-[8%] w-[84%] h-[55%] rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.55)_0%,rgba(255,255,255,0.15)_40%,rgba(255,255,255,0)_100%)]" />
        {/* Rim gradient */}
        <div className="absolute inset-0 rounded-full bg-[linear-gradient(160deg,rgba(255,255,255,0.15)_0%,transparent_40%,transparent_60%,rgba(0,0,0,0.06)_100%)]" />
        {/* Initials */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-body font-bold text-white/[0.97] tracking-[0.02em]"
            style={{
              fontSize: baseSize * 0.26,
              textShadow: "0 1px 4px rgba(0,0,0,0.15), 0 0px 1px rgba(0,0,0,0.1)",
            }}
          >
            {p.initials}
          </span>
        </div>
      </div>

      {/* Open status indicator */}
      <div
        className="absolute bottom-px right-px w-3.5 h-3.5 rounded-full z-[3]"
        style={{
          background: p.open ? "#2E8FE8" : "#8E99A4",
          border: "2.5px solid rgba(255,255,255,0.95)",
          boxShadow: p.open ? "0 0 8px rgba(46,143,232,0.5), 0 2px 4px rgba(0,0,0,0.1)" : "0 2px 4px rgba(0,0,0,0.1)",
        }}
      />

      {/* Hover tooltip */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.8 }}
            className="absolute bottom-[calc(100%+16px)] left-1/2 -translate-x-1/2 bg-white/[0.72] backdrop-blur-[40px] saturate-[1.8] rounded-[18px] px-5 pt-3.5 pb-[13px] whitespace-nowrap z-[100] shadow-[0_24px_80px_-16px_rgba(0,0,0,0.14),0_8px_24px_-8px_rgba(0,0,0,0.06),0_0_0_1px_rgba(255,255,255,0.5),inset_0_0_0_1px_rgba(255,255,255,0.3)]"
          >
            <div className="font-body font-bold text-[15px] text-dark tracking-[-0.02em]">
              {p.title}
            </div>
            <div className="text-[12.5px] font-medium text-gray-text font-body mt-[3px]">
              {p.company}
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <span
                className="inline-flex items-center gap-[5px] py-[3.5px] pr-2.5 pl-[7px] rounded-[9px] text-xs font-semibold font-body"
                style={{
                  background: p.open ? "#E6F1FCcc" : "#F0F2F4cc",
                  color: p.open ? "#2E8FE8" : "#8E99A4",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: p.open ? "#2E8FE8" : "#8E99A4" }}
                />
                {p.open ? "Offen" : "Besetzt"}
              </span>
              <span className="text-xs font-mono font-[550] text-subtle tracking-[-0.01em]">
                {p.match}% Match
              </span>
            </div>
            {/* Tooltip arrow */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 rotate-45 w-3 h-3 bg-white/[0.72] shadow-[2px_2px_6px_rgba(0,0,0,0.04),0_0_0_1px_rgba(255,255,255,0.3)]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function JobSeekerLanding() {
  const [prompt, setPrompt] = useState("");
  const [hovered, setHovered] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(t);
  }, []);

  const openCount = useMemo(
    () => JOBS.filter(j => j.open).length,
    [],
  );

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#FAFBFC_0%,#F5F7F9_40%,#F0F4F7_100%)] relative overflow-hidden">

      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.12) 1.2px, transparent 1.2px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 55%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 55%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 75%)",
        }}
      />

      {/* Bottom vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.025)_60%,rgba(0,0,0,0.05)_100%)] pointer-events-none" />

      {/* Ambient glow -- blue tinted for job seeker */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[12%] -right-[6%] w-[550px] h-[550px] rounded-full bg-[radial-gradient(circle,rgba(46,143,232,0.04)_0%,transparent_60%)]" />
        <div className="absolute -bottom-[8%] -left-[4%] w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(77,168,218,0.035)_0%,transparent_55%)]" />
      </div>

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
        className="relative z-30 flex justify-between items-center px-8 py-[18px]"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-[34px] h-[34px] rounded-[10px] bg-[linear-gradient(135deg,#2E8FE8,#1C69D4)] flex items-center justify-center shadow-[0_2px_10px_rgba(46,143,232,0.3)]">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" fillOpacity="0.9"/>
              <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6"/>
              <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.8"/>
            </svg>
          </div>
          <span className="font-body text-[17px] font-bold text-dark tracking-[-0.04em]">
            Vermittelbar
          </span>
        </div>

        <div className="flex items-center gap-6">
          <Link
            to="/app"
            className="font-body text-sm font-[550] text-muted no-underline tracking-[-0.01em] transition-colors duration-200 ease-in-out hover:text-blue-500"
          >
            Für Arbeitgeber
          </Link>
          <div className="flex items-center gap-[7px] px-3.5 py-1.5 rounded-[10px] bg-white border border-border shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <div className="w-[7px] h-[7px] rounded-full bg-blue-500 shadow-[0_0_6px_rgba(46,143,232,0.35)]" />
            <span className="text-[12.5px] font-[580] text-muted font-body tracking-[-0.01em]">
              {openCount} offene Stellen
            </span>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <div className="relative z-20 flex flex-col items-center pt-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-[30px]"
        >
          <h1 className="font-display text-[54px] font-normal text-dark tracking-[-0.03em] leading-[1.05] mb-2.5">
            Finde deinen nächsten Job
          </h1>
          <p className="font-body text-[16.5px] font-[450] text-muted tracking-[-0.01em]">
            Passende Stellen, auf dich zugeschnitten. Ohne Bewerbungsmarathon.
          </p>
        </motion.div>

        {/* Prompt bar */}
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-[620px] px-6"
        >
          <div className="relative bg-white border border-border-light rounded-[18px] py-[5px] pr-[5px] pb-[5px] pl-5 flex items-center shadow-[0_2px_20px_-4px_rgba(0,0,0,0.07),0_1px_3px_rgba(0,0,0,0.03)] transition-[box-shadow,border-color] duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] focus-within:border-[rgba(46,143,232,0.3)] focus-within:shadow-[0_0_0_4px_rgba(46,143,232,0.07),0_8px_40px_-8px_rgba(0,0,0,0.1)]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C0C4CA" strokeWidth="2" strokeLinecap="round" className="shrink-0 mr-2.5">
              <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ich suche einen Job als Lagerhelfer in Berlin"
              className="flex-1 bg-transparent border-none text-dark text-[15px] font-body font-[450] py-3.5 tracking-[-0.005em] placeholder:text-placeholder focus:outline-none"
            />
            <button className="w-[42px] h-[42px] rounded-[14px] border-none bg-[linear-gradient(135deg,#2E8FE8,#1C69D4)] cursor-pointer flex items-center justify-center shadow-[0_3px_14px_-3px_rgba(46,143,232,0.4)] shrink-0 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.06] hover:shadow-[0_6px_24px_-4px_rgba(46,143,232,0.45)] active:scale-[0.97]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.55, ease: "easeOut" }}
            className="flex gap-2 mt-3.5 flex-wrap justify-center"
          >
            {["Teilzeit in meiner Nähe","Ohne Ausbildung","Minijob ab sofort","Mit Deutsch B1"].map((c,i) => (
              <button
                key={i}
                className="py-[7px] px-3.5 rounded-[11px] border border-border-light bg-white text-muted text-[13px] font-[540] font-body cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)] tracking-[-0.01em] transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-[rgba(46,143,232,0.05)] hover:border-[rgba(46,143,232,0.18)] hover:text-blue-700 hover:-translate-y-px"
              >
                {c}
              </button>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bubble field */}
      <div className="relative w-full h-[calc(100vh-310px)] min-h-[400px] mt-6">
        <div
          className="absolute top-0 left-[5%] right-[5%] h-px"
          style={{ background: "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.04) 30%, rgba(0,0,0,0.06) 50%, rgba(0,0,0,0.04) 70%, transparent 100%)" }}
        />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[5%] left-[10%] w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(46,143,232,0.04)_0%,transparent_70%)] blur-[40px]" />
          <div className="absolute top-[20%] right-[15%] w-[250px] h-[250px] rounded-full bg-[radial-gradient(circle,rgba(245,197,66,0.035)_0%,transparent_70%)] blur-[40px]" />
          <div className="absolute bottom-[15%] left-[30%] w-[350px] h-[350px] rounded-full bg-[radial-gradient(circle,rgba(232,84,84,0.03)_0%,transparent_70%)] blur-[50px]" />
          <div className="absolute bottom-[10%] right-[25%] w-[200px] h-[200px] rounded-full bg-[radial-gradient(circle,rgba(0,165,168,0.03)_0%,transparent_70%)] blur-[35px]" />
        </div>

        {JOBS.map((p,i) => (
          <Bubble
            key={p.id} p={p} index={i} total={JOBS.length}
            hovered={hovered} onHover={setHovered}
            onLeave={() => setHovered(null)} loaded={loaded}
          />
        ))}

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-6 flex-wrap justify-center"
        >
          {[
            { label: "Offen", color: "#2E8FE8" },
            { label: "Besetzt", color: "#8E99A4" },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-[7px] h-[7px] rounded-full" style={{ background: color }} />
              <span className="text-xs font-[520] text-subtle font-body tracking-[-0.01em]">
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
