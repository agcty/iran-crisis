import { useState, useEffect, useRef, useCallback } from "react";
import type { CSSProperties } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import {
  forceSimulation,
  forceCollide,
  forceX,
  forceY,
  type SimulationNodeDatum,
} from "d3-force";
import { PARTICIPANTS, STATUS_META, TEAL, attentionScore, needsAction, urgentReason, type Participant } from "../data/participant-data";

/* ------------------------------------------------------------------ */
/*  Seeded random (for drift animation variety)                        */
/* ------------------------------------------------------------------ */

function sr(seed: number) {
  let x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

/* ------------------------------------------------------------------ */
/*  Bubble size helper                                                 */
/* ------------------------------------------------------------------ */

function bubbleSize(p: Participant) {
  const attention = attentionScore(p);
  return 50 + attention * 56; // 50–106px: more attention = bigger
}

/* ------------------------------------------------------------------ */
/*  Force simulation hook                                              */
/* ------------------------------------------------------------------ */

interface SimNode extends SimulationNodeDatum {
  id: number;
  radius: number;
  targetX: number;
  targetY: number;
}

function useForceLayout(
  participants: Participant[],
  width: number,
  height: number,
) {
  const [positions, setPositions] = useState<Map<number, { x: number; y: number }>>(new Map());
  const simRef = useRef<ReturnType<typeof forceSimulation<SimNode>> | null>(null);

  useEffect(() => {
    if (width === 0 || height === 0) return;

    function seeded(seed: number) {
      let s = Math.sin(seed * 9301 + 49297) * 49297;
      return s - Math.floor(s);
    }

    const cx = width / 2, cy = height * 0.46;
    const padX = 55, padY = 64;

    // Scale factor — avatars spread out more on larger screens
    // Baseline: 1440×900. On a 2560-wide screen this is ~1.25
    const scale = Math.sqrt((width * height) / (1440 * 900));

    // Exclusion ellipse — title + prompt + chips area (generous breathing room)
    const exW = Math.max(400, 500 * scale), exH = Math.max(220, 280 * scale);

    // Golden-angle placement with stratified radial distance
    // Produces an organic, sunflower-like scatter that avoids the center
    const n = participants.length;
    const minR = Math.max(240, 290 * scale);
    const maxR = Math.min(width / 2 - padX, height / 2 - padY);
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    // Stretch placement horizontally for widescreen viewports
    const aspectStretch = Math.min(1.35, (width / height) * 0.78);

    const nodes: SimNode[] = participants.map((p, i) => {
      const radius = bubbleSize(p) / 2;

      // Stratified radial — spread across the band, with jitter
      const t = (i + seeded(i * 73 + 11) * 0.55) / n;
      const r = minR + t * (maxR - minR);

      // Golden-angle for even angular coverage, small jitter for organicness
      const angle = i * goldenAngle + seeded(i * 137 + 29) * 0.2;

      const targetX = cx + r * aspectStretch * Math.cos(angle);
      const targetY = cy + r * Math.sin(angle);

      // Clamp to viewport
      const x = Math.max(padX + radius, Math.min(width - padX - radius, targetX));
      const y = Math.max(padY + radius, Math.min(height - padY - radius, targetY));

      return { id: p.id, radius, x, y, targetX: x, targetY: y };
    });

    // Push bubbles out of the center exclusion zone
    function centerRepulsion(alpha: number) {
      for (const node of nodes) {
        const dx = (node.x ?? cx) - cx;
        const dy = (node.y ?? cy) - cy;
        const nx = dx / exW;
        const ny = dy / exH;
        const dist = nx * nx + ny * ny;
        if (dist < 1.05) {
          // Inside or near exclusion — push outward
          const angle = Math.atan2(dy, dx);
          const push = (1.05 - dist) * 18 * Math.max(alpha, 0.1);
          node.vx = (node.vx ?? 0) + Math.cos(angle) * push;
          node.vy = (node.vy ?? 0) + Math.sin(angle) * push;
        }
      }
    }

    const sim = forceSimulation<SimNode>(nodes)
      .force("collide", forceCollide<SimNode>(d => d.radius + 12 + 16 * scale).strength(1).iterations(4))
      // Anchor each node toward its target position
      .force("x", forceX<SimNode>(d => d.targetX).strength(0.06))
      .force("y", forceY<SimNode>(d => d.targetY).strength(0.06))
      .force("centerRepel", Object.assign(
        (alpha: number) => centerRepulsion(alpha),
        { initialize: () => {} },
      ))
      .alphaDecay(0.03)
      .on("tick", () => {
        const map = new Map<number, { x: number; y: number }>();
        for (const node of nodes) {
          const r = node.radius + 2;
          const x = Math.max(r, Math.min(width - r, node.x ?? 0));
          const y = Math.max(r + 56, Math.min(height - r - 72, node.y ?? 0));
          node.x = x;
          node.y = y;
          map.set(node.id, { x, y });
        }
        setPositions(new Map(map));
      });

    simRef.current = sim;

    return () => { sim.stop(); };
  }, [participants, width, height]);

  return { positions };
}

/* ------------------------------------------------------------------ */
/*  Bubble                                                             */
/* ------------------------------------------------------------------ */

interface BubbleProps {
  p: Participant;
  index: number;
  x: number;
  y: number;
  hovered: number | null;
  featured: boolean;
  onHover: (id: number) => void;
  onLeave: () => void;
  onClick: (id: number) => void;
  loaded: boolean;
}

function Bubble({ p, index, x, y, hovered, featured, onHover, onLeave, onClick, loaded }: BubbleProps) {
  const size = bubbleSize(p);
  const isActive = hovered === p.id;
  const isDimmed = false;
  const showChat = isActive || (featured && hovered === null);
  const meta = STATUS_META[p.status];
  const isUrgent = TOP_URGENT_IDS.has(p.id);

  const dur = 7 + sr(index * 17) * 5;
  const del = sr(index * 23) * -12;
  const amp = 1.5 + sr(index * 31) * 2;
  const ang = sr(index * 41) * 360;
  const entryDelay = 0.5 + index * 0.035;

  return (
    <div
      onMouseEnter={() => onHover(p.id)}
      onMouseLeave={onLeave}
      onClick={() => onClick(p.id)}
      className="absolute cursor-pointer"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        zIndex: isActive ? 50 : (showChat ? 40 : 10),
        opacity: loaded ? (isDimmed ? 0.82 : 1) : 0,
        transform: `translate(-50%, -50%) scale(${loaded ? (isActive ? 1.12 : 1) : 0.4})`,
        transition: loaded
          ? "left 0.8s cubic-bezier(0.4,0,0.2,1), top 0.8s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1), filter 0.2s ease"
          : `opacity 0.6s cubic-bezier(0.4,0,0.2,1) ${entryDelay}s, transform 0.6s cubic-bezier(0.4,0,0.2,1) ${entryDelay}s`,
        animation: loaded ? `drift ${dur}s ease-in-out ${del}s infinite` : "none",
        "--dx": `${Math.cos(ang * Math.PI / 180) * amp}px`,
        "--dy": `${Math.sin(ang * Math.PI / 180) * amp}px`,
        filter: isDimmed ? "saturate(0.85) brightness(0.95)" : "none",
        willChange: "transform, opacity",
      } as CSSProperties}
    >
      {/* Soft shadow */}
      <div
        className="absolute inset-0 rounded-full transition-shadow duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          boxShadow: isActive
            ? "0 12px 32px -6px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.06)"
            : "0 4px 16px -4px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.04)",
        }}
      />

      {/* Avatar */}
      <div
        className="size-full rounded-full relative overflow-hidden transition-[border-color] duration-500"
        style={{
          border: `2px solid ${meta.color}${isActive ? '40' : '25'}`,
          boxShadow: `inset 0 0 0 0.5px rgba(0,0,0,0.03), 0 0 0 ${isActive ? '3px' : '0px'} ${meta.color}15`,
        }}
      >
        <img
          src={p.avatar}
          alt={p.name}
          className="absolute inset-0 size-full object-cover rounded-full"
          draggable={false}
        />
      </div>

      {/* Urgency dot badge — top-right */}
      {isUrgent && !isDimmed && (
        <div
          className="absolute rounded-full z-20"
          style={{
            width: Math.max(10, size * 0.13),
            height: Math.max(10, size * 0.13),
            top: "6%",
            right: "6%",
            background: "#C49240",
            border: "2px solid rgba(253,252,250,0.9)",
            boxShadow: "0 1px 4px rgba(196,146,64,0.3)",
          }}
        />
      )}

      {/* Chat bubble */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.92 }}
            animate={{ opacity: isActive ? 1 : 0.99, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.92 }}
            transition={{ type: "spring", damping: 22, stiffness: 380, mass: 0.5 }}
            className="absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 z-[60] whitespace-nowrap"
            style={{ pointerEvents: "none" }}
          >
            <div
              className="relative rounded-[14px] px-3.5 py-[8px] bg-[rgba(255,255,252,0.95)] backdrop-blur-[32px] backdrop-saturate-[1.6]"
              style={{
                boxShadow: "0 8px 32px -6px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.04), 0 0 0 1px rgba(255,255,255,0.5)",
              }}
            >
              <div
                className="font-bold text-[13px] tracking-[-0.02em]"
                style={{ color: "#2C2A27", fontFamily: "'Satoshi', sans-serif" }}
              >
                {p.name}
              </div>
              <div
                className="text-[11.5px] font-[500] tracking-[-0.005em] mt-[2px]"
                style={{
                  color: isUrgent ? "#C49240" : "#6B6660",
                  fontFamily: "'Satoshi', sans-serif",
                }}
              >
                {isUrgent ? urgentReason(p) : p.chatBubble}
              </div>
              {isActive && <div className="flex items-center gap-1.5 mt-[5px]">
                <span
                  className="inline-flex items-center gap-[4px] py-[2.5px] pr-[8px] pl-[6px] rounded-[7px] text-[10px] font-semibold"
                  style={{
                    background: `${meta.bg}cc`,
                    color: meta.color,
                    fontFamily: "'Satoshi', sans-serif",
                  }}
                >
                  <span className="size-1 rounded-full" style={{ background: meta.color }} />
                  {p.status}
                </span>
                <span
                  className="text-[10px] font-[450]"
                  style={{ color: "#B8B0A4", fontFamily: "'Satoshi', sans-serif" }}
                >
                  {p.coach}
                </span>
              </div>}
              <div
                className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-[10px] h-[10px] rotate-45 bg-[rgba(255,255,252,0.95)]"
                style={{ boxShadow: "2px 2px 4px rgba(0,0,0,0.03)" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

// Urgent participants sorted by attention — used for featured cycle + dot badge
const URGENT_PARTICIPANTS = [...PARTICIPANTS]
  .filter(p => needsAction(p))
  .sort((a, b) => attentionScore(b) - attentionScore(a));

const TOP_URGENT_IDS = new Set(URGENT_PARTICIPANTS.slice(0, 3).map(p => p.id));

// Featured cycle only rotates through urgent participants
const FEATURED_URGENT_INDICES = URGENT_PARTICIPANTS
  .map(up => PARTICIPANTS.findIndex(p => p.id === up.id))
  .filter(i => i >= 0);

export default function CoachApp() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionIndex, setMentionIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const [cyclePaused, setCyclePaused] = useState(false);
  const [cycleStarted, setCycleStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  // Measure container
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setDims({ w: containerRef.current.clientWidth, h: containerRef.current.clientHeight });
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Force layout
  const { positions } = useForceLayout(PARTICIPANTS, dims.w, dims.h);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Delay before the featured cycle starts — let bubbles settle first
  useEffect(() => {
    const t = setTimeout(() => setCycleStarted(true), 3500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!cycleStarted || cyclePaused || FEATURED_URGENT_INDICES.length === 0) return;
    const interval = setInterval(() => {
      setFeaturedIdx(prev => (prev + 1) % FEATURED_URGENT_INDICES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [cycleStarted, cyclePaused]);

  const handleLeave = useCallback(() => {
    setHovered(null);
    setCyclePaused(true);
  }, []);

  useEffect(() => {
    if (!cyclePaused) return;
    const t = setTimeout(() => setCyclePaused(false), 6000);
    return () => clearTimeout(t);
  }, [cyclePaused]);

  const featuredId = (loaded && cycleStarted && !cyclePaused && hovered === null && FEATURED_URGENT_INDICES.length > 0)
    ? PARTICIPANTS[FEATURED_URGENT_INDICES[featuredIdx % FEATURED_URGENT_INDICES.length]]?.id ?? null
    : null;

  // @-mention logic
  const mentionResults = mentionQuery !== null
    ? PARTICIPANTS.filter(p =>
        p.name.toLowerCase().includes(mentionQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handlePromptChange = (value: string) => {
    setPrompt(value);
    const cursorPos = inputRef.current?.selectionStart ?? value.length;
    const textBeforeCursor = value.slice(0, cursorPos);
    const atMatch = textBeforeCursor.match(/@(\w*)$/);
    if (atMatch) {
      setMentionQuery(atMatch[1]);
      setMentionIndex(0);
    } else {
      setMentionQuery(null);
    }
  };

  const insertMention = (name: string) => {
    const cursorPos = inputRef.current?.selectionStart ?? prompt.length;
    const textBeforeCursor = prompt.slice(0, cursorPos);
    const atIdx = textBeforeCursor.lastIndexOf("@");
    const newPrompt = prompt.slice(0, atIdx) + "@" + name + " " + prompt.slice(cursorPos);
    setPrompt(newPrompt);
    setMentionQuery(null);
    inputRef.current?.focus();
  };

  const handlePromptKeyDown = (e: React.KeyboardEvent) => {
    if (mentionQuery !== null && mentionResults.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setMentionIndex(prev => Math.min(prev + 1, mentionResults.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setMentionIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        insertMention(mentionResults[mentionIndex].name);
      } else if (e.key === "Escape") {
        setMentionQuery(null);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative h-full overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #FDFCFA 0%, #F9F7F4 40%, #F5F2ED 100%)",
      }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(80,60,40,0.07) 1.2px, transparent 1.2px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.25) 50%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.25) 50%, transparent 75%)",
        }}
      />

      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute rounded-full" style={{ top: "-12%", right: "-6%", width: 550, height: 550, background: `radial-gradient(circle, ${TEAL.glow}0.035) 0%, transparent 60%)` }} />
        <div className="absolute rounded-full" style={{ bottom: "-8%", left: "-4%", width: 450, height: 450, background: "radial-gradient(circle, rgba(180,140,90,0.03) 0%, transparent 55%)" }} />
        <div className="absolute rounded-full" style={{ top: "10%", left: "20%", width: 300, height: 300, background: `radial-gradient(circle, ${TEAL.glow}0.02) 0%, transparent 70%)`, filter: "blur(50px)" }} />
      </div>

      {/* Bubbles — d3-force positioned, behind content */}
      <div className="absolute inset-0 z-10">
        {PARTICIPANTS.map((p, i) => {
          const pos = positions.get(p.id);
          if (!pos) return null;
          return (
            <Bubble
              key={p.id} p={p} index={i}
              x={pos.x} y={pos.y}
              hovered={hovered} featured={p.id === featuredId}
              onHover={setHovered}
              onLeave={handleLeave}
              onClick={(id) => navigate(`/app/teilnehmer/${id}`)}
              loaded={loaded}
            />
          );
        })}
      </div>

      {/* Center content — floats above bubbles */}
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none" style={{ paddingBottom: "2vh" }}>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="relative text-center mb-5 pointer-events-auto"
        >
          <h1
            className="text-[42px] font-normal tracking-[-0.025em] leading-[1.1]"
            style={{ color: "#2C2A27", fontFamily: "'Source Serif 4', Georgia, serif" }}
          >
            Guten Morgen, Sabine.
          </h1>
          {URGENT_PARTICIPANTS.length > 0 && (
            <p
              className="text-[14px] font-[430] mt-2.5 tracking-[-0.005em] cursor-pointer transition-opacity duration-200 hover:opacity-80"
              style={{ color: "#B0A99F", fontFamily: "'Satoshi', sans-serif" }}
              onClick={() => navigate("/app/teilnehmer?filter=attention")}
            >
              <span style={{ color: "#C49240", fontWeight: 520 }}>{URGENT_PARTICIPANTS.length} Teilnehmer</span> brauchen deine Aufmerksamkeit
            </p>
          )}
        </motion.div>

        {/* Prompt bar */}
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="relative w-full max-w-[620px] px-6 pointer-events-auto"
        >
          <div
            className="relative rounded-full flex items-center transition-[box-shadow,border-color] duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{
              background: "rgba(255,255,252,0.92)",
              border: "1px solid rgba(0,0,0,0.07)",
              padding: "6px 6px 6px 22px",
              boxShadow: "0 4px 24px -6px rgba(40,30,20,0.08), 0 1px 3px rgba(0,0,0,0.02)",
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = `${TEAL.glow}0.25)`;
              e.currentTarget.style.boxShadow = `0 0 0 4px ${TEAL.glow}0.06), 0 8px 40px -8px rgba(0,0,0,0.08)`;
            }}
            onBlur={e => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                e.currentTarget.style.borderColor = "rgba(0,0,0,0.07)";
                e.currentTarget.style.boxShadow = "0 4px 24px -6px rgba(40,30,20,0.08), 0 1px 3px rgba(0,0,0,0.02)";
              }
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={prompt}
              onChange={e => handlePromptChange(e.target.value)}
              onKeyDown={handlePromptKeyDown}
              placeholder="Was möchtest du wissen?"
              className="flex-1 bg-transparent border-none text-[16px] font-[450] py-4 tracking-[-0.005em] focus:outline-none placeholder-warm"
              style={{
                color: "#2C2A27",
                fontFamily: "'Satoshi', sans-serif",
              }}
            />
            <button
              className="size-[42px] rounded-full border-none cursor-pointer flex items-center justify-center shrink-0 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.06] active:scale-[0.97]"
              style={{
                background: TEAL[500],
                boxShadow: `0 2px 8px -2px ${TEAL.glow}0.22)`,
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>

            {/* @-mention popover */}
            <AnimatePresence>
              {mentionQuery !== null && mentionResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.96 }}
                  transition={{ type: "spring", damping: 24, stiffness: 400, mass: 0.4 }}
                  className="absolute left-0 right-0 top-[calc(100%+6px)] z-[60]"
                >
                  <div
                    className="rounded-[14px] py-1.5 bg-[rgba(255,255,252,0.95)] backdrop-blur-[32px] backdrop-saturate-[1.6] overflow-hidden"
                    style={{
                      boxShadow: "0 8px 32px -6px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.04), 0 0 0 1px rgba(255,255,255,0.5)",
                    }}
                  >
                    {mentionResults.map((p, i) => (
                      <div
                        key={p.id}
                        onMouseEnter={() => setMentionIndex(i)}
                        className="flex items-center gap-3 px-3.5 py-2 transition-colors duration-100"
                        style={{
                          background: i === mentionIndex ? "rgba(0,0,0,0.04)" : "transparent",
                          fontFamily: "'Satoshi', sans-serif",
                        }}
                      >
                        <button
                          onMouseDown={e => { e.preventDefault(); insertMention(p.name); }}
                          className="flex items-center gap-3 flex-1 min-w-0 border-none bg-transparent cursor-pointer text-left p-0"
                        >
                          <img
                            src={p.avatar}
                            alt={p.name}
                            className="size-[28px] rounded-full object-cover shrink-0"
                          />
                          <div className="flex flex-col min-w-0">
                            <span
                              className="text-[13px] font-[550] tracking-[-0.01em]"
                              style={{ color: "#2C2A27" }}
                            >
                              {p.name}
                            </span>
                            <span
                              className="text-[11px] font-[430]"
                              style={{ color: "#B0A99F" }}
                            >
                              {p.status} · {p.coach}
                            </span>
                          </div>
                        </button>
                        <button
                          onMouseDown={e => {
                            e.preventDefault();
                            setMentionQuery(null);
                            navigate(`/app/teilnehmer/${p.id}`);
                          }}
                          className="shrink-0 flex items-center gap-0.5 border-none bg-transparent cursor-pointer py-1 px-2 rounded-lg transition-colors duration-150 hover:bg-[rgba(0,0,0,0.05)]"
                          style={{ color: "#B0A99F", fontFamily: "'Satoshi', sans-serif" }}
                        >
                          <span className="text-[11.5px] font-[460]">Profil</span>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 18l6-6-6-6"/>
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Suggestion chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.55, ease: "easeOut" }}
            className="flex gap-2 justify-center mt-3.5"
          >
            {["Wer ist bereit?", "Wie läuft MAT-031?", "Was steht heute an?"].map((c, i) => (
              <button
                key={i}
                className="py-[6px] px-3.5 rounded-full border-none text-[12px] font-[480] cursor-pointer tracking-[-0.01em] transition-all duration-250 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-px"
                style={{
                  background: "rgba(0,0,0,0.03)",
                  color: "#B0A99F",
                  fontFamily: "'Satoshi', sans-serif",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = `${TEAL.glow}0.05)`;
                  e.currentTarget.style.color = TEAL[700];
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(0,0,0,0.03)";
                  e.currentTarget.style.color = "#B0A99F";
                }}
              >
                {c}
              </button>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom tagline */}
      <div
        className="absolute bottom-0 left-0 right-0 z-30 flex items-center justify-center pb-5 px-8"
      >
        <span
          className="text-[12.5px] font-[450] tracking-[-0.01em] bg-clip-text text-transparent"
          style={{
            fontFamily: "'Satoshi', sans-serif",
            backgroundImage: "linear-gradient(to right, #BEB6AA, #C2BAB0, #C6BEB4, #CAC2B8, #CCC6BC, #CAC2B8, #C6BEB4, #C2BAB0, #BEB6AA)",
          }}
        >
          Deine Arbeit hilft Menschen.
        </span>
        <a
          href="/datenschutz"
          className="absolute right-8 text-[11.5px] font-[420] tracking-[-0.01em] no-underline transition-colors duration-200 hover:text-[#8A857E]"
          style={{ color: "#C8C0B4", fontFamily: "'Satoshi', sans-serif" }}
        >
          Datenschutz
        </a>
      </div>
    </div>
  );
}
