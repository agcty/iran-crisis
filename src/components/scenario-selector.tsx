import { SCENARIOS, type ScenarioId } from '../data/projections';

const SCENARIO_ORDER: ScenarioId[] = ['ceasefire', 'grind', 'escalation'];

export default function ScenarioSelector({
  active,
  onChange,
  enabled,
}: {
  active: ScenarioId;
  onChange: (id: ScenarioId) => void;
  enabled: boolean;
}) {
  return (
    <div
      className={`flex gap-0.5 bg-[#0d1017] rounded-lg p-0.5 border border-[#1a1e28] transition-opacity ${enabled ? '' : 'opacity-30 pointer-events-none'}`}
      title={enabled ? undefined : 'Drag past Day 35 to explore projections'}
    >
      {SCENARIO_ORDER.map(id => {
        const s = SCENARIOS[id];
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-md transition-all cursor-pointer border ${
              isActive
                ? 'border-current'
                : 'border-transparent text-[#555] hover:text-[#888]'
            }`}
            style={isActive ? { color: s.color, background: s.color + '15', borderColor: s.color + '40' } : undefined}
            title={`${s.label} (${Math.round(s.probability * 100)}%) — ${s.description}`}
          >
            {s.shortLabel}: {s.label}
          </button>
        );
      })}
    </div>
  );
}
