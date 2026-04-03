import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { TEAL } from "../data/participant-data";
import OnboardingModal from "./onboarding-modal";
import { useFeatureFlags } from "../feature-flags";

/* ------------------------------------------------------------------ */
/*  Nav items                                                          */
/* ------------------------------------------------------------------ */

const NAV_ITEMS = [
  { label: "Dashboard", path: "/app" },
  { label: "Teilnehmer", path: "/app/teilnehmer" },
  { label: "Gruppen", path: "/app/gruppen" },
];

/* ------------------------------------------------------------------ */
/*  Top bar                                                            */
/* ------------------------------------------------------------------ */

function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isActive = (path: string) => {
    if (path === "/app") return location.pathname === "/app";
    return location.pathname.startsWith(path);
  };

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="relative z-50 shrink-0 flex items-center justify-between px-5 h-[52px]"
      style={{
        background: "rgba(255,255,252,0.85)",
        backdropFilter: "blur(12px) saturate(1.4)",
        WebkitBackdropFilter: "blur(12px) saturate(1.4)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {/* Left: Logo + nav */}
      <div className="flex items-center gap-6">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/app")}
        >
          <div
            className="size-[26px] rounded-[7px] flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${TEAL[500]}, ${TEAL[600]})`,
              boxShadow: `0 1px 4px ${TEAL.glow}0.18)`,
            }}
          >
            <span
              className="text-[14px] font-bold text-white/95 leading-none"
              style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
            >
              V
            </span>
          </div>
          <span
            className="text-[15px] font-bold tracking-[-0.03em]"
            style={{ color: "#2C2A27", fontFamily: "'Satoshi', sans-serif" }}
          >
            Vermittelbar
          </span>
        </div>

        {/* Nav items */}
        <nav className="flex items-center gap-0.5">
          {NAV_ITEMS.map(item => {
            const active = isActive(item.path);

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="px-2.5 py-[5px] rounded-lg border-none cursor-pointer transition-all duration-200 hover:bg-[rgba(0,0,0,0.04)]"
                style={{
                  background: active ? `${TEAL.glow}0.06)` : "transparent",
                  color: active ? TEAL[700] : "#8A857E",
                  fontFamily: "'Satoshi', sans-serif",
                  fontWeight: active ? 520 : 450,
                  fontSize: "13.5px",
                  letterSpacing: "-0.01em",
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right: User avatar */}
      <div className="relative">
        <div
          onClick={() => setShowUserMenu(prev => !prev)}
          className="size-[32px] rounded-full flex items-center justify-center text-[12px] font-semibold cursor-pointer transition-shadow duration-200 hover:shadow-sm"
          style={{
            background: "linear-gradient(135deg, #E8E4DE, #D8D2CA)",
            color: "#8A857E",
            fontFamily: "'Satoshi', sans-serif",
          }}
        >
          SK
        </div>
        <AnimatePresence>
          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-[59]"
                onClick={() => setShowUserMenu(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.96 }}
                transition={{ type: "spring", damping: 24, stiffness: 400, mass: 0.4 }}
                className="absolute top-[calc(100%+8px)] right-0 z-[60]"
              >
                <div
                  className="rounded-[14px] py-1.5 min-w-[170px] bg-[rgba(255,255,252,0.97)] backdrop-blur-[32px] backdrop-saturate-[1.6]"
                  style={{
                    boxShadow: "0 8px 32px -6px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.06)",
                  }}
                >
                  {/* User info */}
                  <div
                    className="px-3.5 py-2.5 mb-0.5"
                    style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
                  >
                    <div
                      className="text-[13px] font-[540] tracking-[-0.01em]"
                      style={{ color: "#2C2A27", fontFamily: "'Satoshi', sans-serif" }}
                    >
                      Sabine Krüger
                    </div>
                    <div
                      className="text-[11px] font-[420] mt-0.5"
                      style={{ color: "#B0A99F", fontFamily: "'Satoshi', sans-serif" }}
                    >
                      Coach
                    </div>
                  </div>
                  <button
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 border-none bg-transparent text-[13px] font-[460] cursor-pointer tracking-[-0.01em] transition-colors duration-150 hover:bg-[rgba(0,0,0,0.03)] text-left"
                    style={{ color: "#6B6660", fontFamily: "'Satoshi', sans-serif" }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    Verlauf
                  </button>
                  <button
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 border-none bg-transparent text-[13px] font-[460] cursor-pointer tracking-[-0.01em] transition-colors duration-150 hover:bg-[rgba(0,0,0,0.03)] text-left"
                    style={{ color: "#6B6660", fontFamily: "'Satoshi', sans-serif" }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                    Account
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}

/* ------------------------------------------------------------------ */
/*  Layout                                                             */
/* ------------------------------------------------------------------ */

export default function AppLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar />
      <main className="flex-1 min-h-0 overflow-hidden">
        <Outlet />
      </main>
      <OnboardingModal />
    </div>
  );
}
