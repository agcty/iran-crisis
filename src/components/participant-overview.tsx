import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  PARTICIPANTS,
  STATUS_META,
  TEAL,
  matchingStrength,
  matchingLabel,
  needsAction,
  attentionScore,
  type Participant,
  type ParticipantStatus,
} from "../data/participant-data";
import ParticipantBubble from "./participant-bubble";
import { useFeatureFlags } from "../feature-flags";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

type ViewMode = "list" | "bubbles";
type StatusFilter = ParticipantStatus | "all" | "attention";

const STATUS_ORDER: StatusFilter[] = [
  "all", "attention", "Neu", "Profil in Arbeit", "Im Matching", "Vermittelt",
];

const FILTER_LABELS: Record<string, string> = {
  all: "Alle",
  attention: "Aufmerksamkeit",
  Neu: "Neu",
  "Profil in Arbeit": "Profil",
  "Im Matching": "Matching",
  Vermittelt: "Vermittelt",
};

/* ------------------------------------------------------------------ */
/*  Matching strength bar                                              */
/* ------------------------------------------------------------------ */

function StrengthBar({ participant }: { participant: Participant }) {
  const { matchingEnabled } = useFeatureFlags();
  const strength = matchingStrength(participant);
  const { color } = matchingLabel(strength);

  if (!matchingEnabled) return null;
  if (participant.status === "Neu" || participant.status === "Vermittelt") return null;

  return (
    <div className="flex items-center gap-2 mt-[3px]">
      <div
        className="h-[3px] rounded-full flex-1 max-w-[72px]"
        style={{ background: "rgba(0,0,0,0.05)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.max(strength * 100, 8)}%`,
            background: color,
            opacity: 0.7,
          }}
        />
      </div>
      <span
        className="text-[10.5px] font-[450]"
        style={{ color, fontFamily: "'Satoshi', sans-serif" }}
      >
        {matchingLabel(strength).label}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  List row                                                           */
/* ------------------------------------------------------------------ */

interface ListRowProps {
  participant: Participant;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}

function ListRow({ participant: p, index, isHovered, onHover, onLeave, onClick }: ListRowProps) {
  const meta = STATUS_META[p.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.04 + index * 0.025 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      className="flex items-center gap-4 rounded-[14px] py-[14px] px-4 cursor-pointer overflow-hidden"
      style={{
        background: isHovered ? "rgba(255,255,252,0.92)" : "rgba(255,255,252,0.4)",
        border: `1px solid ${isHovered ? "rgba(46,125,111,0.15)" : "rgba(0,0,0,0.08)"}`,
        borderLeft: `3px solid ${meta.color}${isHovered ? "50" : "30"}`,
        boxShadow: isHovered ? "0 4px 16px -4px rgba(0,0,0,0.06)" : "none",
        transform: isHovered ? "translateY(-1px)" : "none",
        transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {/* Avatar */}
      <div
        className="size-[48px] rounded-full overflow-hidden shrink-0"
        style={{ border: `2px solid ${meta.color}20` }}
      >
        <img src={p.avatar} alt={p.name} className="size-full object-cover" draggable={false} />
      </div>

      {/* Name + message + strength */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2.5">
          <span
            className="text-[15px] font-[550] tracking-[-0.01em]"
            style={{ color: "#2C2A27", fontFamily: "'Satoshi', sans-serif" }}
          >
            {p.name}
          </span>
          <span
            className="inline-flex items-center gap-[4px] py-[2.5px] pr-[8px] pl-[6px] rounded-full text-[11.5px] font-[500] shrink-0"
            style={{
              background: meta.bg,
              color: meta.color,
              fontFamily: "'Satoshi', sans-serif",
            }}
          >
            <span className="size-[4px] rounded-full" style={{ background: meta.color }} />
            {p.status}
          </span>
        </div>
        <div
          className="text-[13.5px] font-[430] mt-[3px] truncate"
          style={{ color: "#918A82", fontFamily: "'Satoshi', sans-serif" }}
        >
          {p.chatBubble}
        </div>
        <StrengthBar participant={p} />
      </div>

      {/* Coach + Group + Notes */}
      <div className="hidden sm:flex flex-col items-end shrink-0">
        <span
          className="text-[12.5px] font-[460]"
          style={{ color: "#8A857E", fontFamily: "'Satoshi', sans-serif" }}
        >
          {p.coach}
        </span>
        <span
          className="text-[11.5px] font-[420] mt-0.5"
          style={{ color: "#B8B0A4", fontFamily: "'Satoshi', sans-serif" }}
        >
          {p.massnahme}
        </span>
        {p.notesCount > 0 && (
          <span
            className="text-[10.5px] font-[420] mt-1 inline-flex items-center gap-1"
            style={{ color: "#C8C0B4", fontFamily: "'Satoshi', sans-serif" }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            {p.notesCount} Notizen
          </span>
        )}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function ParticipantOverview() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    searchParams.get("filter") === "attention" ? "attention" : "all"
  );
  const [search, setSearch] = useState("");
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [prompt, setPrompt] = useState("");

  const handleFilterChange = (f: StatusFilter) => {
    setStatusFilter(f);
    if (f === "attention") {
      setSearchParams({ filter: "attention" });
    } else {
      setSearchParams({});
    }
  };

  const PIPELINE_ORDER: Record<ParticipantStatus, number> = {
    "Profil in Arbeit": 0,
    "Neu": 1,
    "Im Matching": 2,
    "Vermittelt": 3,
  };

  const filtered = PARTICIPANTS
    .filter(p => {
      if (statusFilter === "all") return true;
      if (statusFilter === "attention") return needsAction(p);
      return p.status === statusFilter;
    })
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (statusFilter === "attention") return attentionScore(b) - attentionScore(a);
      const orderDiff = PIPELINE_ORDER[a.status] - PIPELINE_ORDER[b.status];
      if (orderDiff !== 0) return orderDiff;
      if (a.status === "Im Matching") return matchingStrength(a) - matchingStrength(b);
      return 0;
    });

  const attentionCount = PARTICIPANTS.filter(p => needsAction(p)).length;

  const statusCounts = Object.fromEntries(
    STATUS_ORDER.map(s => [
      s,
      s === "all"
        ? PARTICIPANTS.length
        : s === "attention"
        ? attentionCount
        : PARTICIPANTS.filter(p => p.status === s).length,
    ]),
  ) as Record<StatusFilter, number>;

  return (
    <div
      className="relative h-full flex flex-col overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #FDFCFA 0%, #F9F7F4 40%, #F5F2ED 100%)",
      }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(80,60,40,0.07) 1.2px, transparent 1.2px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 50%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 50%, transparent 75%)",
        }}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="max-w-[920px] mx-auto px-8 pt-8 pb-32">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-end justify-between mb-6"
          >
            <div>
              <h1
                className="text-[32px] font-normal tracking-[-0.025em] leading-[1.1] mb-1.5"
                style={{ color: "#2C2A27", fontFamily: "'Source Serif 4', Georgia, serif" }}
              >
                Teilnehmer
              </h1>
              <p
                className="text-[13px] font-[430]"
                style={{ color: "#B0A99F", fontFamily: "'Satoshi', sans-serif" }}
              >
                {PARTICIPANTS.length} Personen{attentionCount > 0 && <span style={{ color: "#C49240" }}> · {attentionCount} brauchen Aufmerksamkeit</span>}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#B0A99F"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Suchen..."
                  className="pl-9 pr-3 py-[7px] rounded-[10px] text-[13px] font-[430] w-[180px] focus:outline-none transition-all duration-200"
                  style={{
                    background: "rgba(255,255,252,0.7)",
                    border: "1px solid rgba(0,0,0,0.06)",
                    color: "#2C2A27",
                    fontFamily: "'Satoshi', sans-serif",
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = `${TEAL.glow}0.25)`;
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${TEAL.glow}0.06)`;
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* View toggle */}
              <div
                className="flex p-[3px] rounded-[10px]"
                style={{ background: "rgba(0,0,0,0.04)" }}
              >
                <button
                  onClick={() => setViewMode("list")}
                  className="p-[7px] rounded-[7px] border-none cursor-pointer transition-all duration-200"
                  style={{
                    background: viewMode === "list" ? "rgba(255,255,252,0.9)" : "transparent",
                    boxShadow: viewMode === "list" ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                    color: viewMode === "list" ? TEAL[500] : "#B0A99F",
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("bubbles")}
                  className="p-[7px] rounded-[7px] border-none cursor-pointer transition-all duration-200"
                  style={{
                    background: viewMode === "bubbles" ? "rgba(255,255,252,0.9)" : "transparent",
                    boxShadow: viewMode === "bubbles" ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                    color: viewMode === "bubbles" ? TEAL[500] : "#B0A99F",
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="14" width="7" height="7" rx="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Status filters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex gap-2.5 mb-7 flex-wrap"
          >
            {STATUS_ORDER.map(s => {
              const isActive = statusFilter === s;
              const isAttention = s === "attention";
              const meta = (s !== "all" && s !== "attention") ? STATUS_META[s] : null;
              return (
                <button
                  key={s}
                  onClick={() => handleFilterChange(s)}
                  className="py-[7px] px-4 rounded-full border-none text-[13.5px] font-[480] cursor-pointer tracking-[-0.01em] transition-all duration-200"
                  style={{
                    background: isActive
                      ? isAttention ? "rgba(196,146,64,0.12)" : meta ? meta.bg : "rgba(0,0,0,0.07)"
                      : "rgba(0,0,0,0.025)",
                    color: isActive
                      ? isAttention ? "#C49240" : meta ? meta.color : "#2C2A27"
                      : isAttention ? "#C49240" : "#B0A99F",
                    fontFamily: "'Satoshi', sans-serif",
                  }}
                >
                  {isAttention && <span style={{ marginRight: 3 }}>●</span>}
                  {FILTER_LABELS[s]}
                  <span style={{ opacity: 0.6, marginLeft: 4 }}>{statusCounts[s]}</span>
                </button>
              );
            })}
          </motion.div>

          {/* Content area */}
          <AnimatePresence mode="wait">
            {viewMode === "list" ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-1.5"
              >
                {filtered.map((p, i) => (
                  <ListRow
                    key={p.id}
                    participant={p}
                    index={i}
                    isHovered={hoveredId === p.id}
                    onHover={() => setHoveredId(p.id)}
                    onLeave={() => setHoveredId(null)}
                    onClick={() => navigate(`/app/teilnehmer/${p.id}`)}
                  />
                ))}
                {filtered.length === 0 && (
                  <div
                    className="text-center py-20 text-[14px] font-[430]"
                    style={{ color: "#B0A99F", fontFamily: "'Satoshi', sans-serif" }}
                  >
                    Keine Teilnehmer gefunden
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="bubbles"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="grid gap-8 py-4"
                style={{
                  gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                }}
              >
                {filtered.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35, delay: i * 0.025 }}
                    className="flex justify-center"
                  >
                    <ParticipantBubble
                      participant={p}
                      size={84}
                      showName
                      showStatus
                      isHovered={hoveredId === p.id}
                      onMouseEnter={() => setHoveredId(p.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => navigate(`/app/teilnehmer/${p.id}`)}
                    />
                  </motion.div>
                ))}
                {filtered.length === 0 && (
                  <div
                    className="col-span-full text-center py-20 text-[14px] font-[430]"
                    style={{ color: "#B0A99F", fontFamily: "'Satoshi', sans-serif" }}
                  >
                    Keine Teilnehmer gefunden
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating chat bar */}
      <div
        className="absolute bottom-0 left-0 right-0 z-30 px-6 pb-5 pt-10 pointer-events-none"
        style={{
          background: "linear-gradient(to top, #F5F2ED 50%, transparent)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-[680px] mx-auto pointer-events-auto"
        >
          <div
            className="relative rounded-full flex items-center transition-[box-shadow,border-color] duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{
              background: "rgba(255,255,252,0.95)",
              border: "1px solid rgba(0,0,0,0.07)",
              padding: "5px 5px 5px 22px",
              boxShadow:
                "0 4px 24px -6px rgba(40,30,20,0.1), 0 1px 3px rgba(0,0,0,0.03)",
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = `${TEAL.glow}0.25)`;
              e.currentTarget.style.boxShadow = `0 0 0 4px ${TEAL.glow}0.06), 0 8px 40px -8px rgba(0,0,0,0.08)`;
            }}
            onBlur={e => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                e.currentTarget.style.borderColor = "rgba(0,0,0,0.07)";
                e.currentTarget.style.boxShadow =
                  "0 4px 24px -6px rgba(40,30,20,0.1), 0 1px 3px rgba(0,0,0,0.03)";
              }
            }}
          >
            <input
              type="text"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Frag etwas über deine Teilnehmer..."
              className="flex-1 bg-transparent border-none text-[15px] font-[450] py-3.5 tracking-[-0.005em] focus:outline-none placeholder-warm"
              style={{
                color: "#2C2A27",
                fontFamily: "'Satoshi', sans-serif",
              }}
            />
            <button
              className="size-[40px] rounded-full border-none cursor-pointer flex items-center justify-center shrink-0 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.06] active:scale-[0.97]"
              style={{
                background: TEAL[500],
                boxShadow: `0 2px 8px -2px ${TEAL.glow}0.22)`,
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
