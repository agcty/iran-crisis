import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import ParticipantBubble from "./participant-bubble";
import {
  PARTICIPANTS,
  TEAL,
  STATUS_META,
  matchingStrength,
  matchingLabel,
  type ParticipantStatus,
} from "../data/participant-data";
import { useFeatureFlags } from "../feature-flags";

const STORAGE_KEY = "vermittelbar-onboarding-complete";

/* ------------------------------------------------------------------ */
/*  Sample data for illustrations                                      */
/* ------------------------------------------------------------------ */

const SAMPLE_PARTICIPANTS = PARTICIPANTS.filter(p =>
  [1, 2, 3, 5, 10, 6].includes(p.id)
);

const MATCHED_PARTICIPANT = PARTICIPANTS.find(p => p.id === 2)!; // Sarah König, Vermittelt
const MATCHING_PARTICIPANT = PARTICIPANTS.find(p => p.id === 1)!; // Amina, Im Matching
const PROFILE_PARTICIPANT = PARTICIPANTS.find(p => p.id === 3)!; // Diana, Profil in Arbeit

/* ------------------------------------------------------------------ */
/*  Step definitions                                                   */
/* ------------------------------------------------------------------ */

const TOTAL_STEPS = 5;

/* ------------------------------------------------------------------ */
/*  Animated matching bar                                              */
/* ------------------------------------------------------------------ */

function MatchingBar({ strength, delay = 0 }: { strength: number; delay?: number }) {
  const { label, color } = matchingLabel(strength);
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center justify-between">
        <span
          className="text-[12px] font-[500]"
          style={{ color: "#8A857E", fontFamily: "'Satoshi', sans-serif" }}
        >
          Matching-Signale
        </span>
        <span
          className="text-[12px] font-[560]"
          style={{ color, fontFamily: "'Satoshi', sans-serif" }}
        >
          {label}
        </span>
      </div>
      <div
        className="h-[6px] rounded-full overflow-hidden"
        style={{ background: "rgba(0,0,0,0.06)" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${strength * 100}%` }}
          transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Status pill                                                        */
/* ------------------------------------------------------------------ */

function StatusPill({ status }: { status: ParticipantStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className="inline-flex items-center gap-[4px] text-[11px] font-[500] py-[3px] px-[8px] rounded-full whitespace-nowrap"
      style={{
        background: meta.bg,
        color: meta.color,
        fontFamily: "'Satoshi', sans-serif",
      }}
    >
      <span
        className="size-[4px] rounded-full"
        style={{ background: meta.color }}
      />
      {status}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Floating avatar cluster (used on welcome step)                     */
/* ------------------------------------------------------------------ */

function FloatingAvatars() {
  const positions = [
    { x: -80, y: -30, size: 54, delay: 0.1 },
    { x: 40, y: -50, size: 44, delay: 0.25 },
    { x: -50, y: 40, size: 48, delay: 0.4 },
    { x: 70, y: 20, size: 40, delay: 0.15 },
    { x: -10, y: -70, size: 36, delay: 0.35 },
    { x: 20, y: 60, size: 42, delay: 0.5 },
  ];

  return (
    <div className="relative w-[240px] h-[180px] mx-auto">
      {SAMPLE_PARTICIPANTS.map((p, i) => {
        const pos = positions[i];
        return (
          <motion.div
            key={p.id}
            className="absolute"
            style={{
              left: "50%",
              top: "50%",
            }}
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: pos.x,
              y: pos.y,
            }}
            transition={{
              delay: pos.delay,
              type: "spring",
              damping: 18,
              stiffness: 200,
              mass: 0.6,
            }}
          >
            <motion.div
              animate={{
                y: [0, -6, 0, 4, 0],
              }}
              transition={{
                duration: 4 + i * 0.7,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ParticipantBubble participant={p} size={pos.size} />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Animated notes illustration                                        */
/* ------------------------------------------------------------------ */

function NotesIllustration() {
  const notes = [
    { text: "Möchte im Einzelhandel arbeiten", delay: 0.2 },
    { text: "Sehr zuverlässig und pünktlich", delay: 0.5 },
    { text: "Deutsch gut, braucht Hilfe bei Bewerbungen", delay: 0.8 },
  ];

  return (
    <div className="flex flex-col gap-2 w-full max-w-[280px] mx-auto">
      {notes.map((note, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: note.delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-start gap-2 rounded-[10px] py-2 px-3"
          style={{
            background: "rgba(46,125,111,0.05)",
            border: "1px solid rgba(46,125,111,0.1)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={TEAL[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-[2px] shrink-0">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          <span
            className="text-[12.5px] font-[460] leading-[1.4]"
            style={{ color: "#4A4540", fontFamily: "'Satoshi', sans-serif" }}
          >
            {note.text}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Report status illustration                                         */
/* ------------------------------------------------------------------ */

function ReportIllustration() {
  const stages = [
    { label: "Nicht begonnen", color: "#8A8580", bg: "#F0EDEA", active: false },
    { label: "Entwurf", color: "#5A8BB8", bg: "#E8EFF6", active: false },
    { label: "Veröffentlicht", color: "#3A8F6E", bg: "#E8F3EE", active: true },
  ];

  return (
    <div className="flex flex-col gap-3 w-full max-w-[260px] mx-auto">
      {/* Document icon */}
      <motion.div
        className="flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: "spring", damping: 20, stiffness: 300 }}
      >
        <div
          className="size-[52px] rounded-[14px] flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(90,139,184,0.12), rgba(90,139,184,0.06))",
            border: "1px solid rgba(90,139,184,0.15)",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5A8BB8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>
      </motion.div>

      {/* Progress stages */}
      <div className="flex items-center justify-center gap-1.5">
        {stages.map((stage, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + i * 0.25, type: "spring", damping: 20, stiffness: 300 }}
            className="flex items-center gap-1.5"
          >
            <span
              className="text-[11px] font-[500] py-[3px] px-[8px] rounded-full whitespace-nowrap"
              style={{
                background: stage.bg,
                color: stage.color,
                fontFamily: "'Satoshi', sans-serif",
                border: stage.active ? `1.5px solid ${stage.color}40` : "1.5px solid transparent",
              }}
            >
              {stage.label}
            </span>
            {i < stages.length - 1 && (
              <motion.svg
                width="12" height="12" viewBox="0 0 24 24"
                fill="none" stroke="#C5BFB8" strokeWidth="2" strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.25 }}
              >
                <polyline points="9 18 15 12 9 6" />
              </motion.svg>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Matching illustration (avatar + bar + job suggestion)              */
/* ------------------------------------------------------------------ */

function MatchingIllustration() {
  const strength = matchingStrength(MATCHING_PARTICIPANT);

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-[280px] mx-auto">
      <div className="flex items-center gap-4 w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, type: "spring", damping: 18, stiffness: 260 }}
        >
          <ParticipantBubble participant={MATCHING_PARTICIPANT} size={52} />
        </motion.div>
        <div className="flex-1">
          <MatchingBar strength={strength} delay={0.3} />
        </div>
      </div>

      {/* Mock job match cards */}
      {[
        { title: "Verkäuferin", company: "REWE", score: "92%" },
        { title: "Kassierer/in", company: "dm-drogerie", score: "87%" },
      ].map((job, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 + i * 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-between w-full rounded-[10px] py-2.5 px-3"
          style={{
            background: "rgba(255,255,252,0.9)",
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
          }}
        >
          <div className="flex flex-col">
            <span
              className="text-[13px] font-[540]"
              style={{ color: "#2C2A27", fontFamily: "'Satoshi', sans-serif" }}
            >
              {job.title}
            </span>
            <span
              className="text-[11px] font-[420]"
              style={{ color: "#8A857E", fontFamily: "'Satoshi', sans-serif" }}
            >
              {job.company}
            </span>
          </div>
          <span
            className="text-[13px] font-[600] tabular-nums"
            style={{ color: TEAL[500], fontFamily: "'SF Mono', monospace" }}
          >
            {job.score}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Heart / people illustration for final step                         */
/* ------------------------------------------------------------------ */

function CoachHeart() {
  const featured = [MATCHED_PARTICIPANT, MATCHING_PARTICIPANT, PROFILE_PARTICIPANT];
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-[-8px]">
        {featured.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              delay: 0.15 + i * 0.15,
              type: "spring",
              damping: 16,
              stiffness: 200,
            }}
            style={{ marginLeft: i > 0 ? -10 : 0, zIndex: 3 - i }}
          >
            <ParticipantBubble participant={p} size={52} />
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, type: "spring", damping: 14, stiffness: 180 }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill={TEAL[500]} stroke="none">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step content renderer                                              */
/* ------------------------------------------------------------------ */

function StepContent({ step, matchingEnabled }: { step: number; matchingEnabled: boolean }) {
  switch (step) {
    case 0:
      return (
        <div className="flex flex-col items-center gap-5">
          <FloatingAvatars />
          <div className="flex flex-col items-center gap-2 text-center">
            <h2
              className="text-[24px] font-[640] tracking-[-0.03em] leading-[1.15]"
              style={{ color: "#2C2A27", fontFamily: "'Source Serif 4', Georgia, serif" }}
            >
              Willkommen bei Vermittelbar
            </h2>
            <p
              className="text-[14.5px] font-[440] leading-[1.55] max-w-[320px]"
              style={{ color: "#6B6660", fontFamily: "'Satoshi', sans-serif" }}
            >
              Ihr Werkzeug, um Teilnehmer effektiv zu begleiten — vom
              ersten Gespräch bis zum neuen Job.
            </p>
          </div>
        </div>
      );

    case 1:
      return (
        <div className="flex flex-col items-center gap-5">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <ParticipantBubble participant={PROFILE_PARTICIPANT} size={56} showName showStatus />
            </motion.div>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <h2
              className="text-[22px] font-[640] tracking-[-0.03em] leading-[1.15]"
              style={{ color: "#2C2A27", fontFamily: "'Source Serif 4', Georgia, serif" }}
            >
              Profile & Lebensläufe
            </h2>
            <p
              className="text-[14.5px] font-[440] leading-[1.55] max-w-[320px]"
              style={{ color: "#6B6660", fontFamily: "'Satoshi', sans-serif" }}
            >
              Ihre Notizen sind das Herzstück. Je besser Sie Ihre Teilnehmer
              kennen, desto stärker werden die Ergebnisse.
            </p>
          </div>
          <NotesIllustration />
        </div>
      );

    case 2:
      return (
        <div className="flex flex-col items-center gap-5">
          <ReportIllustration />
          <div className="flex flex-col items-center gap-2 text-center">
            <h2
              className="text-[22px] font-[640] tracking-[-0.03em] leading-[1.15]"
              style={{ color: "#2C2A27", fontFamily: "'Source Serif 4', Georgia, serif" }}
            >
              Berichte für das Jobcenter
            </h2>
            <p
              className="text-[14.5px] font-[440] leading-[1.55] max-w-[320px]"
              style={{ color: "#6B6660", fontFamily: "'Satoshi', sans-serif" }}
            >
              Vermittelbar hilft Ihnen, professionelle Berichte zu erstellen —
              strukturiert, klar, und bereit für das Jobcenter.
            </p>
          </div>
        </div>
      );

    case 3:
      return (
        <div className="flex flex-col items-center gap-5">
          <div className="flex flex-col items-center gap-2 text-center">
            <h2
              className="text-[22px] font-[640] tracking-[-0.03em] leading-[1.15]"
              style={{ color: "#2C2A27", fontFamily: "'Source Serif 4', Georgia, serif" }}
            >
              {matchingEnabled ? "Arbeit finden, die passt" : "Bald: passende Stellen finden"}
            </h2>
            <p
              className="text-[14.5px] font-[440] leading-[1.55] max-w-[320px]"
              style={{ color: "#6B6660", fontFamily: "'Satoshi', sans-serif" }}
            >
              {matchingEnabled
                ? "Vermittelbar sucht passende Stellen — basierend auf Ihren Notizen, Gesprächen und dem Profil jedes Teilnehmers."
                : "In Kürze wird Vermittelbar Ihre Notizen und Profile nutzen, um passende Stellen für Ihre Teilnehmer zu finden. Je mehr Sie jetzt dokumentieren, desto besser werden die Vorschläge."}
            </p>
          </div>
          {matchingEnabled ? (
            <MatchingIllustration />
          ) : (
            <motion.div
              className="flex items-center gap-3 rounded-[14px] py-4 px-5 w-full max-w-[300px]"
              style={{
                background: "rgba(46,125,111,0.06)",
                border: "1px solid rgba(46,125,111,0.12)",
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div
                className="size-[36px] rounded-full flex items-center justify-center shrink-0"
                style={{ background: "rgba(46,125,111,0.1)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={TEAL[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <p
                className="text-[13px] font-[460] leading-[1.45]"
                style={{ color: "#4A4540", fontFamily: "'Satoshi', sans-serif" }}
              >
                Jede Notiz, die Sie heute schreiben, macht das zukünftige Matching stärker.
              </p>
            </motion.div>
          )}
        </div>
      );

    case 4:
      return (
        <div className="flex flex-col items-center gap-5">
          <CoachHeart />
          <div className="flex flex-col items-center gap-2 text-center">
            <h2
              className="text-[22px] font-[640] tracking-[-0.03em] leading-[1.15]"
              style={{ color: "#2C2A27", fontFamily: "'Source Serif 4', Georgia, serif" }}
            >
              Sie machen den Unterschied
            </h2>
            <p
              className="text-[14.5px] font-[440] leading-[1.55] max-w-[320px]"
              style={{ color: "#6B6660", fontFamily: "'Satoshi', sans-serif" }}
            >
              Vermittelbar ist nur so gut wie Ihre Arbeit als Coach.
              Jedes Gespräch, jede Notiz, jeder Moment der Aufmerksamkeit —
              Sie geben diesen Menschen eine echte Chance auf einen neuen Anfang.
            </p>
          </div>

          {/* Success stats */}
          <motion.div
            className="flex items-center gap-4 mt-1"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            {(matchingEnabled
              ? [
                  { number: "4", label: "Vermittelt" },
                  { number: "18", label: "Teilnehmer" },
                  { number: "7", label: "Im Matching" },
                ]
              : [
                  { number: "4", label: "Vermittelt" },
                  { number: "18", label: "Teilnehmer" },
                  { number: "3", label: "Gruppen" },
                ]
            ).map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <span
                  className="text-[20px] font-[640] tabular-nums"
                  style={{ color: TEAL[500], fontFamily: "'Source Serif 4', Georgia, serif" }}
                >
                  {stat.number}
                </span>
                <span
                  className="text-[11px] font-[460]"
                  style={{ color: "#8A857E", fontFamily: "'Satoshi', sans-serif" }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      );

    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Main modal component                                               */
/* ------------------------------------------------------------------ */

export default function OnboardingModal() {
  const { matchingEnabled } = useFeatureFlags();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      // Small delay so the app renders first
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = useCallback(() => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, "true");
  }, []);

  const next = useCallback(() => {
    if (step === TOTAL_STEPS - 1) {
      dismiss();
    } else {
      setDirection(1);
      setStep(s => s + 1);
    }
  }, [step, dismiss]);

  const prev = useCallback(() => {
    if (step > 0) {
      setDirection(-1);
      setStep(s => s - 1);
    }
  }, [step]);

  if (!visible) return null;

  const isLast = step === TOTAL_STEPS - 1;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: "rgba(44,42,39,0.45)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
            onClick={dismiss}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal card */}
          <motion.div
            className="relative z-[201] flex flex-col overflow-hidden"
            style={{
              width: "min(440px, calc(100vw - 48px))",
              maxHeight: "calc(100vh - 80px)",
              borderRadius: 20,
              background: "linear-gradient(180deg, #FDFCFA 0%, #F9F7F4 60%, #F5F2ED 100%)",
              boxShadow:
                "0 24px 80px -12px rgba(0,0,0,0.25), 0 8px 24px -8px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.06)",
            }}
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: "spring", damping: 26, stiffness: 340, mass: 0.5 }}
          >
            {/* Close button */}
            <button
              onClick={dismiss}
              className="absolute top-3 right-3 z-10 size-[30px] rounded-full flex items-center justify-center border-none cursor-pointer transition-colors duration-200"
              style={{
                background: "rgba(0,0,0,0.04)",
                color: "#8A857E",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(0,0,0,0.08)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(0,0,0,0.04)";
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Content area with step transitions */}
            <div className="relative px-8 pt-8 pb-4 overflow-hidden" style={{ minHeight: 360 }}>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -60 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <StepContent step={step} matchingEnabled={matchingEnabled} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer: stepper dots + navigation */}
            <div className="px-8 pb-6 pt-2 flex items-center justify-between">
              {/* Stepper dots */}
              <div className="flex items-center gap-[6px]">
                {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => {
                      setDirection(i > step ? 1 : -1);
                      setStep(i);
                    }}
                    className="border-none cursor-pointer p-0"
                    style={{
                      width: i === step ? 20 : 6,
                      height: 6,
                      borderRadius: 3,
                      background: i === step ? TEAL[500] : "rgba(0,0,0,0.12)",
                      transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center gap-2">
                {step > 0 && (
                  <motion.button
                    onClick={prev}
                    className="flex items-center justify-center size-[36px] rounded-full border-none cursor-pointer"
                    style={{
                      background: "rgba(0,0,0,0.04)",
                      color: "#6B6660",
                    }}
                    whileHover={{ background: "rgba(0,0,0,0.07)" }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </motion.button>
                )}

                <motion.button
                  onClick={next}
                  className="flex items-center gap-2 rounded-full border-none cursor-pointer text-white"
                  style={{
                    background: `linear-gradient(135deg, ${TEAL[500]}, ${TEAL[600]})`,
                    padding: "8px 20px",
                    fontFamily: "'Satoshi', sans-serif",
                    fontSize: "13.5px",
                    fontWeight: 540,
                    letterSpacing: "-0.01em",
                    boxShadow: `0 2px 8px ${TEAL.glow}0.25), 0 1px 3px rgba(0,0,0,0.06)`,
                  }}
                  whileHover={{ scale: 1.03, boxShadow: `0 4px 16px ${TEAL.glow}0.35), 0 2px 6px rgba(0,0,0,0.08)` }}
                  whileTap={{ scale: 0.97 }}
                >
                  {isLast ? "Los geht's" : "Weiter"}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
