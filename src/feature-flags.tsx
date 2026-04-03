import { createContext, useContext, useState, type ReactNode } from "react";

interface FeatureFlags {
  matchingEnabled: boolean;
  setMatchingEnabled: (v: boolean) => void;
}

const FeatureFlagContext = createContext<FeatureFlags>({
  matchingEnabled: false,
  setMatchingEnabled: () => {},
});

export function FeatureFlagProvider({ children }: { children: ReactNode }) {
  const [matchingEnabled, setMatchingEnabled] = useState(false);

  return (
    <FeatureFlagContext.Provider value={{ matchingEnabled, setMatchingEnabled }}>
      {children}
      {/* Dev toggles — floating pills in bottom-left */}
      <div className="fixed bottom-5 left-5 z-50 flex items-center gap-2">
        <button
          onClick={() => setMatchingEnabled(v => !v)}
          className="flex items-center gap-2 py-2 px-3.5 rounded-full border-none cursor-pointer transition-all duration-200 hover:scale-[1.03]"
          style={{
            background: matchingEnabled ? "rgba(46,125,111,0.9)" : "rgba(44,42,39,0.75)",
            backdropFilter: "blur(8px)",
            boxShadow: "0 2px 12px -3px rgba(0,0,0,0.2)",
            fontFamily: "'Satoshi', sans-serif",
          }}
        >
          <div
            className="size-[8px] rounded-full transition-colors duration-200"
            style={{ background: matchingEnabled ? "#A8E6CF" : "#8A857E" }}
          />
          <span className="text-[11.5px] font-[520] text-white tracking-[-0.01em]">
            Matching {matchingEnabled ? "an" : "aus"}
          </span>
        </button>
        <button
          onClick={() => {
            localStorage.removeItem("vermittelbar-onboarding-complete");
            window.location.reload();
          }}
          className="flex items-center gap-2 py-2 px-3.5 rounded-full border-none cursor-pointer transition-all duration-200 hover:scale-[1.03]"
          style={{
            background: "rgba(44,42,39,0.75)",
            backdropFilter: "blur(8px)",
            boxShadow: "0 2px 12px -3px rgba(0,0,0,0.2)",
            fontFamily: "'Satoshi', sans-serif",
          }}
        >
          <span className="text-[11.5px] font-[520] text-white tracking-[-0.01em]">
            Onboarding reset
          </span>
        </button>
      </div>
    </FeatureFlagContext.Provider>
  );
}

export function useFeatureFlags() {
  return useContext(FeatureFlagContext);
}
