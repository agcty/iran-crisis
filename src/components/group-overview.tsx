import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  PARTICIPANTS,
  GROUPS,
  STATUS_META,
  TEAL,
  type ParticipantStatus,
} from "../data/participant-data";

/* ------------------------------------------------------------------ */
/*  Derived group data                                                 */
/* ------------------------------------------------------------------ */

function useGroupData() {
  return GROUPS.map(group => {
    const members = PARTICIPANTS.filter(p => p.massnahme === group.id);
    const coaches = [...new Set(members.map(p => p.coach))];
    const statusBreakdown = Object.keys(STATUS_META).map(s => ({
      status: s as ParticipantStatus,
      count: members.filter(p => p.status === s).length,
    })).filter(s => s.count > 0);

    return { ...group, members, coaches, statusBreakdown };
  });
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function GroupOverview() {
  const navigate = useNavigate();
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const allGroups = useGroupData();
  const groups = allGroups.filter(g =>
    !search || g.name.toLowerCase().includes(search.toLowerCase()) || g.id.toLowerCase().includes(search.toLowerCase())
  );

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
            className="flex items-end justify-between mb-8"
          >
            <div>
              <h1
                className="text-[32px] font-normal tracking-[-0.025em] leading-[1.1] mb-1.5"
                style={{ color: "#2C2A27", fontFamily: "'Source Serif 4', Georgia, serif" }}
              >
                Gruppen
              </h1>
              <p
                className="text-[13px] font-[430]"
                style={{ color: "#B0A99F", fontFamily: "'Satoshi', sans-serif" }}
              >
                {GROUPS.length} aktive Gruppen
              </p>
            </div>
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
          </motion.div>

          {/* Group cards */}
          <div className="flex flex-col gap-5">
            {groups.map((group, i) => {
              const isHovered = hoveredGroup === group.id;

              return (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                  onClick={() => navigate(`/app/gruppen/${group.id}`)}
                  onMouseEnter={() => setHoveredGroup(group.id)}
                  onMouseLeave={() => setHoveredGroup(null)}
                  className="rounded-[18px] cursor-pointer overflow-hidden"
                  style={{
                    background: isHovered ? "rgba(255,255,252,0.95)" : "rgba(255,255,252,0.6)",
                    border: `1px solid ${isHovered ? "rgba(46,125,111,0.12)" : "rgba(0,0,0,0.06)"}`,
                    boxShadow: isHovered
                      ? "0 8px 32px -8px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.03)"
                      : "0 1px 4px rgba(0,0,0,0.02)",
                    transform: isHovered ? "translateY(-2px)" : "none",
                    transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
                  }}
                >
                  <div className="p-6">
                    {/* Top row: name + meta */}
                    <div className="flex items-start justify-between mb-5">
                      <div>
                        <h2
                          className="text-[20px] font-normal tracking-[-0.02em] leading-[1.2] mb-1"
                          style={{ color: "#2C2A27", fontFamily: "'Source Serif 4', Georgia, serif" }}
                        >
                          {group.name}
                        </h2>
                        <div className="flex items-center gap-2">
                          <span
                            className="text-[12.5px] font-[430]"
                            style={{ color: "#B0A99F", fontFamily: "'Satoshi', sans-serif" }}
                          >
                            {group.id}
                          </span>
                          <span style={{ color: "#D4CEC6" }}>·</span>
                          <span
                            className="text-[12.5px] font-[430]"
                            style={{ color: "#B0A99F", fontFamily: "'Satoshi', sans-serif" }}
                          >
                            {group.startDate} – {group.endDate}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {group.coaches.map((coach, ci) => (
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

                    {/* Avatar stack with status rings */}
                    <div className="flex items-center">
                      <div className="flex -space-x-2">
                        {group.members.slice(0, 8).map((p, pi) => {
                          const sMeta = STATUS_META[p.status];
                          return (
                            <div
                              key={p.id}
                              className="size-[40px] rounded-full overflow-hidden"
                              style={{
                                zIndex: 10 - pi,
                                position: "relative",
                                border: `2.5px solid ${sMeta.color}50`,
                              }}
                            >
                              <img
                                src={p.avatar}
                                alt={p.name}
                                className="size-full object-cover"
                                draggable={false}
                              />
                            </div>
                          );
                        })}
                        {group.members.length > 8 && (
                          <div
                            className="size-[40px] rounded-full flex items-center justify-center relative text-[11px] font-[550]"
                            style={{
                              border: "2.5px solid rgba(0,0,0,0.08)",
                              background: "linear-gradient(135deg, #E8E4DE, #D8D2CA)",
                              color: "#8A857E",
                              fontFamily: "'Satoshi', sans-serif",
                            }}
                          >
                            +{group.members.length - 8}
                          </div>
                        )}
                      </div>
                      <span
                        className="text-[13px] font-[450] ml-3"
                        style={{ color: "#8A857E", fontFamily: "'Satoshi', sans-serif" }}
                      >
                        {group.members.length} Teilnehmer
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
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
              placeholder="Frag etwas über deine Gruppen..."
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
