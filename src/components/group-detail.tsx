import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useFeatureFlags } from "../feature-flags";
import {
  PARTICIPANTS,
  GROUPS,
  STATUS_META,
  TEAL,
  matchingStrength,
  matchingLabel,
  needsAction,
  urgentReason,
  attentionScore,
  type ParticipantStatus,
  type Participant,
} from "../data/participant-data";

/* ------------------------------------------------------------------ */
/*  German date parser                                                 */
/* ------------------------------------------------------------------ */

const MONTHS: Record<string, number> = {
  Jan: 0, Feb: 1, Mär: 2, Apr: 3, Mai: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Okt: 9, Nov: 10, Dez: 11,
};

function parseGermanDate(s: string): Date {
  const parts = s.replace(".", "").split(" ");
  return new Date(Number(parts[2]), MONTHS[parts[1]] ?? 0, Number(parts[0]));
}

/* ------------------------------------------------------------------ */
/*  Status pipeline order                                              */
/* ------------------------------------------------------------------ */

const STATUS_ORDER: ParticipantStatus[] = [
  "Neu",
  "Profil in Arbeit",
  "Im Matching",
  "Vermittelt",
];

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function GroupDetail() {
  const { id } = useParams<{ id: string }>();
  const { matchingEnabled } = useFeatureFlags();
  const navigate = useNavigate();
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);
  const [dismissedIds, setDismissedIds] = useState<Set<number>>(new Set());

  const group = GROUPS.find(g => g.id === id);
  if (!group) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ color: "#8A857E", fontFamily: "'Satoshi', sans-serif" }}>
        Gruppe nicht gefunden.
      </div>
    );
  }

  const members = PARTICIPANTS.filter(p => p.massnahme === group.id);
  const coaches = [...new Set(members.map(p => p.coach))];
  const statusBreakdown = STATUS_ORDER
    .map(s => ({ status: s, count: members.filter(p => p.status === s).length }))
    .filter(s => s.count > 0);
  const attentionMembers = members
    .filter(p => needsAction(p))
    .sort((a, b) => attentionScore(b) - attentionScore(a));
  const vermitteltCount = members.filter(p => p.status === "Vermittelt").length;

  // Timeline progress
  const start = parseGermanDate(group.startDate);
  const end = parseGermanDate(group.endDate);
  const now = new Date();
  const totalDays = Math.max(1, (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const elapsedDays = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  const progress = Math.max(0, Math.min(1, elapsedDays / totalDays));
  const daysLeft = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  const isFinished = now > end;

  // Average matching strength (exclude Neu and Vermittelt for meaningful average)
  const activeMembers = members.filter(p => p.status !== "Neu" && p.status !== "Vermittelt");
  const avgStrength = activeMembers.length
    ? activeMembers.reduce((sum, p) => sum + matchingStrength(p), 0) / activeMembers.length
    : 0;
  const avgLabel = matchingLabel(avgStrength);

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
        <div className="max-w-[920px] mx-auto px-8 pt-6 pb-32">

          {/* Back button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={() => navigate("/app/gruppen")}
            className="flex items-center gap-1.5 mb-5 cursor-pointer border-none bg-transparent group"
            style={{ fontFamily: "'Satoshi', sans-serif" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B0A99F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span className="text-[13px] font-[450] transition-colors duration-200" style={{ color: "#B0A99F" }}>
              Gruppen
            </span>
          </motion.button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mb-8"
          >
            <div className="flex items-start justify-between">
              <div>
                <h1
                  className="text-[32px] font-normal tracking-[-0.025em] leading-[1.1] mb-1.5"
                  style={{ color: "#2C2A27", fontFamily: "'Source Serif 4', Georgia, serif" }}
                >
                  {group.name}
                </h1>
                <div className="flex items-center gap-2">
                  <span className="text-[12.5px] font-[430]" style={{ color: "#B0A99F", fontFamily: "'Satoshi', sans-serif" }}>
                    {group.id}
                  </span>
                  <span style={{ color: "#D4CEC6" }}>·</span>
                  <span className="text-[12.5px] font-[430]" style={{ color: "#B0A99F", fontFamily: "'Satoshi', sans-serif" }}>
                    {group.startDate} – {group.endDate}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 pt-2">
                {coaches.map((coach, ci) => (
                  <span
                    key={ci}
                    className="text-[12.5px] font-[460] py-[3px] px-[10px] rounded-full"
                    style={{
                      background: "rgba(0,0,0,0.03)",
                      color: "#8A857E",
                      fontFamily: "'Satoshi', sans-serif",
                    }}
                  >
                    {coach}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="grid grid-cols-3 gap-4 mb-6"
          >
            {/* Timeline card */}
            <div
              className="rounded-[16px] p-5"
              style={{
                background: "rgba(255,255,252,0.7)",
                border: "1px solid rgba(0,0,0,0.05)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] font-[480] uppercase tracking-[0.05em]" style={{ color: "#B0A99F", fontFamily: "'Satoshi', sans-serif" }}>
                  Zeitraum
                </span>
                <span className="text-[12px] font-[460]" style={{ color: isFinished ? "#3A8F6E" : "#8A857E", fontFamily: "'Satoshi', sans-serif" }}>
                  {isFinished ? "Abgeschlossen" : `${daysLeft} Tage übrig`}
                </span>
              </div>
              <div className="h-[6px] rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.04)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="h-full rounded-full"
                  style={{
                    background: isFinished
                      ? "#3A8F6E"
                      : `linear-gradient(90deg, ${TEAL[500]}, ${TEAL[600]})`,
                  }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[11px] font-[420]" style={{ color: "#C8C0B4", fontFamily: "'Satoshi', sans-serif" }}>
                  {group.startDate}
                </span>
                <span className="text-[11px] font-[420]" style={{ color: "#C8C0B4", fontFamily: "'Satoshi', sans-serif" }}>
                  {group.endDate}
                </span>
              </div>
            </div>

            {/* Vermittlung rate card */}
            <div
              className="rounded-[16px] p-5"
              style={{
                background: "rgba(255,255,252,0.7)",
                border: "1px solid rgba(0,0,0,0.05)",
              }}
            >
              <span className="text-[12px] font-[480] uppercase tracking-[0.05em] block mb-3" style={{ color: "#B0A99F", fontFamily: "'Satoshi', sans-serif" }}>
                Vermittelt
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[28px] font-normal tracking-[-0.025em]" style={{ color: "#2C2A27", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                  {vermitteltCount}
                </span>
                <span className="text-[14px] font-[430]" style={{ color: "#B0A99F", fontFamily: "'Satoshi', sans-serif" }}>
                  / {members.length}
                </span>
              </div>
              <div className="h-[6px] rounded-full overflow-hidden mt-2" style={{ background: "rgba(0,0,0,0.04)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${members.length ? (vermitteltCount / members.length) * 100 : 0}%` }}
                  transition={{ duration: 0.8, delay: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  className="h-full rounded-full"
                  style={{ background: "#3A8F6E" }}
                />
              </div>
            </div>

            {/* Average matching strength card — only when matching is enabled */}
            {matchingEnabled && (
              <div
                className="rounded-[16px] p-5"
                style={{
                  background: "rgba(255,255,252,0.7)",
                  border: "1px solid rgba(0,0,0,0.05)",
                }}
              >
                <span className="text-[12px] font-[480] uppercase tracking-[0.05em] block mb-3" style={{ color: "#B0A99F", fontFamily: "'Satoshi', sans-serif" }}>
                  Ø Matching-Signale
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-[28px] font-normal tracking-[-0.025em]" style={{ color: "#2C2A27", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                    {Math.round(avgStrength * 100)}%
                  </span>
                  <span
                    className="text-[12.5px] font-[480] py-[2px] px-[8px] rounded-full"
                    style={{ background: `${avgLabel.color}14`, color: avgLabel.color, fontFamily: "'Satoshi', sans-serif" }}
                  >
                    {avgLabel.label}
                  </span>
                </div>
                <div className="h-[6px] rounded-full overflow-hidden mt-2" style={{ background: "rgba(0,0,0,0.04)" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${avgStrength * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    className="h-full rounded-full"
                    style={{ background: avgLabel.color }}
                  />
                </div>
              </div>
            )}
          </motion.div>

          {/* Status breakdown bar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="rounded-[16px] p-5 mb-6"
            style={{
              background: "rgba(255,255,252,0.7)",
              border: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <span className="text-[12px] font-[480] uppercase tracking-[0.05em] block mb-4" style={{ color: "#B0A99F", fontFamily: "'Satoshi', sans-serif" }}>
              Status-Verteilung
            </span>
            {/* Stacked bar */}
            <div className="flex rounded-full h-[10px] overflow-hidden gap-[2px]">
              {statusBreakdown.map((s, i) => {
                const meta = STATUS_META[s.status];
                return (
                  <motion.div
                    key={s.status}
                    initial={{ width: 0 }}
                    animate={{ width: `${(s.count / members.length) * 100}%` }}
                    transition={{ duration: 0.6, delay: 0.3 + i * 0.08, ease: [0.4, 0, 0.2, 1] }}
                    style={{
                      background: meta.color,
                      opacity: 0.7,
                      borderRadius: i === 0 ? "999px 0 0 999px" : i === statusBreakdown.length - 1 ? "0 999px 999px 0" : "0",
                    }}
                  />
                );
              })}
            </div>
            {/* Legend */}
            <div className="flex items-center gap-5 mt-3">
              {statusBreakdown.map(s => {
                const meta = STATUS_META[s.status];
                return (
                  <div key={s.status} className="flex items-center gap-1.5">
                    <div className="size-[8px] rounded-full" style={{ background: meta.color, opacity: 0.7 }} />
                    <span className="text-[12px] font-[450]" style={{ color: "#8A857E", fontFamily: "'Satoshi', sans-serif" }}>
                      {s.status}
                    </span>
                    <span className="text-[12px] font-[520]" style={{ color: "#6B6660", fontFamily: "'Satoshi', sans-serif" }}>
                      {s.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Attention section */}
          {attentionMembers.length > 0 && (() => {
            const visibleAttention = attentionMembers.filter(p => !dismissedIds.has(p.id));
            const dismissedAttention = attentionMembers.filter(p => dismissedIds.has(p.id));
            return (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.2 }}
                className="rounded-[16px] p-5 mb-6"
                style={{
                  background: visibleAttention.length > 0 ? "rgba(196,146,64,0.04)" : "rgba(0,0,0,0.015)",
                  border: `1px solid ${visibleAttention.length > 0 ? "rgba(196,146,64,0.12)" : "rgba(0,0,0,0.04)"}`,
                  transition: "all 0.3s ease",
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  {visibleAttention.length > 0 ? (
                    <div className="size-[7px] rounded-full" style={{ background: "#C49240" }} />
                  ) : (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#B0A99F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                  <span className="text-[12px] font-[480] uppercase tracking-[0.05em]" style={{ color: visibleAttention.length > 0 ? "#C49240" : "#B0A99F", fontFamily: "'Satoshi', sans-serif" }}>
                    {visibleAttention.length > 0 ? "Brauchen Aufmerksamkeit" : "Alle gesehen"}
                  </span>
                  <span className="text-[12px] font-[520] ml-auto" style={{ color: visibleAttention.length > 0 ? "#C49240" : "#B0A99F", fontFamily: "'Satoshi', sans-serif" }}>
                    {visibleAttention.length > 0 ? visibleAttention.length : `${dismissedAttention.length} bestätigt`}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {visibleAttention.map((p, i) => {
                    const meta = STATUS_META[p.status];
                    return (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 + i * 0.06 }}
                        className="flex items-center gap-3 py-2.5 px-3 rounded-[12px] transition-all duration-200"
                        style={{ background: "rgba(255,255,252,0.6)" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,252,0.95)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,252,0.6)"; }}
                      >
                        <div
                          className="size-[36px] rounded-full overflow-hidden shrink-0 cursor-pointer"
                          style={{ border: `2px solid ${meta.color}50` }}
                          onClick={() => navigate(`/app/teilnehmer/${p.id}`)}
                        >
                          <img src={p.avatar} alt={p.name} className="size-full object-cover" draggable={false} />
                        </div>
                        <div
                          className="flex-1 min-w-0 cursor-pointer"
                          onClick={() => navigate(`/app/teilnehmer/${p.id}`)}
                        >
                          <span className="text-[13.5px] font-[480] block" style={{ color: "#2C2A27", fontFamily: "'Satoshi', sans-serif" }}>
                            {p.name}
                          </span>
                          <span className="text-[12px] font-[420] block truncate" style={{ color: "#B0A99F", fontFamily: "'Satoshi', sans-serif" }}>
                            {urgentReason(p)}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDismissedIds(prev => new Set([...prev, p.id]));
                          }}
                          className="text-[11px] font-[460] py-[3px] px-[8px] rounded-[6px] border-none cursor-pointer transition-all duration-200 shrink-0 hover:bg-[rgba(196,146,64,0.08)]"
                          style={{
                            background: "rgba(196,146,64,0.04)",
                            color: "#96793A",
                            fontFamily: "'Satoshi', sans-serif",
                          }}
                        >
                          Gesehen
                        </button>
                      </motion.div>
                    );
                  })}
                  {dismissedAttention.length > 0 && visibleAttention.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-1">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#C8C0B4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      <span className="text-[11.5px] font-[420]" style={{ color: "#C8C0B4", fontFamily: "'Satoshi', sans-serif" }}>
                        {dismissedAttention.length} gesehen
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })()}

          {/* Members section */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.25 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-[20px] font-normal tracking-[-0.02em]"
                style={{ color: "#2C2A27", fontFamily: "'Source Serif 4', Georgia, serif" }}
              >
                Teilnehmer
              </h2>
              <span className="text-[12.5px] font-[430]" style={{ color: "#B0A99F", fontFamily: "'Satoshi', sans-serif" }}>
                {members.length} Personen
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {members
                .sort((a, b) => {
                  const aIdx = STATUS_ORDER.indexOf(a.status);
                  const bIdx = STATUS_ORDER.indexOf(b.status);
                  if (aIdx !== bIdx) return aIdx - bIdx;
                  return attentionScore(b) - attentionScore(a);
                })
                .map((p, i) => (
                  <MemberCard
                    key={p.id}
                    participant={p}
                    index={i}
                    isHovered={hoveredMember === p.id}
                    onHover={setHoveredMember}
                    onClick={() => navigate(`/app/teilnehmer/${p.id}`)}
                  />
                ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating chat bar */}
      <div
        className="absolute bottom-0 left-0 right-0 z-30 px-6 pb-5 pt-10 pointer-events-none"
        style={{ background: "linear-gradient(to top, #F5F2ED 50%, transparent)" }}
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
              boxShadow: "0 4px 24px -6px rgba(40,30,20,0.1), 0 1px 3px rgba(0,0,0,0.03)",
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = `${TEAL.glow}0.25)`;
              e.currentTarget.style.boxShadow = `0 0 0 4px ${TEAL.glow}0.06), 0 8px 40px -8px rgba(0,0,0,0.08)`;
            }}
            onBlur={e => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                e.currentTarget.style.borderColor = "rgba(0,0,0,0.07)";
                e.currentTarget.style.boxShadow = "0 4px 24px -6px rgba(40,30,20,0.1), 0 1px 3px rgba(0,0,0,0.03)";
              }
            }}
          >
            <input
              type="text"
              placeholder={`Frag etwas über ${group.name}...`}
              className="flex-1 bg-transparent border-none text-[15px] font-[450] py-3.5 tracking-[-0.005em] focus:outline-none placeholder-warm"
              style={{ color: "#2C2A27", fontFamily: "'Satoshi', sans-serif" }}
            />
            <button
              className="size-[40px] rounded-full border-none cursor-pointer flex items-center justify-center shrink-0 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.06] active:scale-[0.97]"
              style={{
                background: TEAL[500],
                boxShadow: `0 2px 8px -2px ${TEAL.glow}0.22)`,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Member card                                                        */
/* ------------------------------------------------------------------ */

function MemberCard({
  participant: p,
  index,
  isHovered,
  onHover,
  onClick,
}: {
  participant: Participant;
  index: number;
  isHovered: boolean;
  onHover: (id: number | null) => void;
  onClick: () => void;
}) {
  const { matchingEnabled } = useFeatureFlags();
  const meta = STATUS_META[p.status];
  const strength = matchingStrength(p);
  const label = matchingLabel(strength);
  const showStrength = matchingEnabled && p.status !== "Neu" && p.status !== "Vermittelt";
  const urgent = needsAction(p);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.3 + index * 0.04 }}
      onMouseEnter={() => onHover(p.id)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
      className="rounded-[14px] p-4 cursor-pointer"
      style={{
        background: isHovered ? "rgba(255,255,252,0.95)" : "rgba(255,255,252,0.6)",
        border: `1px solid ${isHovered ? "rgba(46,125,111,0.12)" : "rgba(0,0,0,0.05)"}`,
        boxShadow: isHovered ? "0 4px 16px -4px rgba(0,0,0,0.06)" : "0 1px 4px rgba(0,0,0,0.02)",
        transform: isHovered ? "translateY(-1px)" : "none",
        transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div
            className="size-[44px] rounded-full overflow-hidden"
            style={{ border: `2.5px solid ${meta.color}50` }}
          >
            <img src={p.avatar} alt={p.name} className="size-full object-cover" draggable={false} />
          </div>
          {urgent && (
            <div
              className="absolute -top-0.5 -right-0.5 size-[10px] rounded-full"
              style={{
                background: "#C49240",
                border: "2px solid rgba(255,255,252,0.95)",
              }}
            />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[14px] font-[500] truncate" style={{ color: "#2C2A27", fontFamily: "'Satoshi', sans-serif" }}>
              {p.name}
            </span>
            <span
              className="text-[11px] font-[460] py-[2px] px-[7px] rounded-full shrink-0 ml-2"
              style={{ background: meta.bg, color: meta.color, fontFamily: "'Satoshi', sans-serif" }}
            >
              {p.status}
            </span>
          </div>

          {/* Chat bubble / AI summary snippet */}
          <p className="text-[12.5px] font-[420] leading-[1.4] truncate mb-2" style={{ color: "#8A857E", fontFamily: "'Satoshi', sans-serif" }}>
            {p.chatBubble}
          </p>

          {/* Matching strength bar */}
          {showStrength && (
            <div className="flex items-center gap-2">
              <div className="flex-1 h-[4px] rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.04)" }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${strength * 100}%`, background: label.color }}
                />
              </div>
              <span className="text-[11px] font-[460] shrink-0" style={{ color: label.color, fontFamily: "'Satoshi', sans-serif" }}>
                {label.label}
              </span>
            </div>
          )}

          {/* Vermittelt indicator */}
          {p.status === "Vermittelt" && (
            <div className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3A8F6E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <span className="text-[12px] font-[460]" style={{ color: "#3A8F6E", fontFamily: "'Satoshi', sans-serif" }}>
                Erfolgreich vermittelt
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
