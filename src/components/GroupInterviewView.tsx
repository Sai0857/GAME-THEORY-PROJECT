import React, { useState } from 'react';
import {
  MessageSquare,
  Sparkles,
  Zap,
  Users,
  ShieldAlert,
  Handshake,
  Scale,
  Crown
} from 'lucide-react';
import { CandidateGroup, Strategy } from '../types';
import { STRATEGY_DESCRIPTIONS, STRATEGIES } from '../gameTheoryEngine';

interface GroupInterviewViewProps {
  groups: CandidateGroup[];
  onUpdateStrategy: (candidateId: string, strategy: Strategy) => void;
  onApplyPreset: (preset: 'balanced' | 'leader' | 'cooperative' | 'random') => void;
  onProceedToResults: () => void;
}

export const GroupInterviewView: React.FC<GroupInterviewViewProps> = ({
  groups,
  onUpdateStrategy,
  onApplyPreset,
  onProceedToResults
}) => {
  const [selectedGroupIdx, setSelectedGroupIdx] = useState<number>(0);
  const currentGroup = groups[selectedGroupIdx] || groups[0];

  const strategies = currentGroup ? currentGroup.candidates.map((c) => c.strategy) : [];
  const coopCount = strategies.filter((s) => s === 'Cooperative').length;
  const balCount = strategies.filter((s) => s === 'Balanced').length;
  const leaderCount = strategies.filter((s) => s === 'Leader').length;

  const isCoopBonus = coopCount + balCount > (currentGroup ? currentGroup.size / 2 : 2.5);
  const isLeaderPenalty = leaderCount >= 2;

  return (
    <div id="group-interview-view" className="space-y-6">
      {/* Topic Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-xl p-6 border border-slate-700 shadow-sm">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <MessageSquare className="w-4 h-4" />
          Uniform Interview Topic
        </div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
          &ldquo;Should Artificial Intelligence replace human employees?&rdquo;
        </h2>
        <p className="text-xs text-slate-300 mt-2 max-w-3xl leading-relaxed">
          All candidate groups receive the exact same prompt. Candidates choose a strategic behavioral
          posture. Their individual score and group bonus/penalty depend on how their strategy interacts
          with their peers&apos; choices.
        </p>
      </div>

      {/* Strategy Concept Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Leader */}
        <div className="bg-white rounded-xl border border-purple-200 p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
              <Crown className="w-4 h-4" />
            </span>
            <span className="font-bold text-sm text-slate-900">Strategy 1: LEADER</span>
            <span className="ml-auto text-xs font-mono font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-700">
              Base: 75
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed mb-2">
            {STRATEGY_DESCRIPTIONS.Leader}
          </p>
          <div className="text-[11px] text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200/60 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span>High rivalry: -5 penalty if ≥2 choose Leader</span>
          </div>
        </div>

        {/* Cooperative */}
        <div className="bg-white rounded-xl border border-blue-200 p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
              <Handshake className="w-4 h-4" />
            </span>
            <span className="font-bold text-sm text-slate-900">Strategy 2: COOPERATIVE</span>
            <span className="ml-auto text-xs font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
              Base: 80
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed mb-2">
            {STRATEGY_DESCRIPTIONS.Cooperative}
          </p>
          <div className="text-[11px] text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200/60 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>Synergistic: helps trigger +5 group bonus</span>
          </div>
        </div>

        {/* Balanced */}
        <div className="bg-white rounded-xl border border-emerald-200 p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
              <Scale className="w-4 h-4" />
            </span>
            <span className="font-bold text-sm text-slate-900">Strategy 3: BALANCED</span>
            <span className="ml-auto text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
              Base: 85
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed mb-2">
            {STRATEGY_DESCRIPTIONS.Balanced}
          </p>
          <div className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200/60 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 shrink-0" />
            <span>Equilibrium: highest payoff &amp; stable Nash</span>
          </div>
        </div>
      </div>

      {/* Presets Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs font-semibold text-slate-700 flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-600" />
          <span>Quick Strategy Presets (Batch Test):</span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            id="preset-balanced"
            onClick={() => onApplyPreset('balanced')}
            className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 font-medium transition"
          >
            All Balanced (Nash Eq)
          </button>
          <button
            id="preset-leader"
            onClick={() => onApplyPreset('leader')}
            className="px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-300 text-purple-800 hover:bg-purple-100 font-medium transition"
          >
            Leader Heavy (Clash)
          </button>
          <button
            id="preset-cooperative"
            onClick={() => onApplyPreset('cooperative')}
            className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-300 text-blue-800 hover:bg-blue-100 font-medium transition"
          >
            All Cooperative
          </button>
          <button
            id="preset-random"
            onClick={() => onApplyPreset('random')}
            className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-300 text-slate-700 hover:bg-slate-200 font-medium transition"
          >
            Randomize Strategies
          </button>
        </div>
      </div>

      {/* Group Navigation Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-600" />
              Group Discussion Simulator
            </h3>
            <p className="text-xs text-slate-500">
              Select a group to adjust candidate strategies and see live group dynamics
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Active Group:</span>
            <select
              id="select-active-group"
              value={selectedGroupIdx}
              onChange={(e) => setSelectedGroupIdx(Number(e.target.value))}
              className="text-xs font-semibold py-1.5 px-3 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800"
            >
              {groups.map((g, idx) => (
                <option key={g.group_id} value={idx}>
                  {g.group_name} ({g.size} Candidates)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Current Group Dynamic Alert */}
        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-slate-700">
              {currentGroup.group_name} Composition:
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              {leaderCount} Leaders
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {coopCount} Cooperative
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {balCount} Balanced
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isCoopBonus ? (
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium">
                ✅ +5 Cooperation Bonus Active
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-medium">
                ❌ No Cooperation Bonus
              </span>
            )}

            {isLeaderPenalty && (
              <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-medium">
                ⚠️ -5 Leader Penalty Active
              </span>
            )}
          </div>
        </div>

        {/* Candidates in Current Group */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
          {currentGroup.candidates.map((cand) => (
            <div
              key={cand.candidate_id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-3 hover:border-slate-300 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">
                    {cand.candidate_id}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Player</span>
                </div>
                <h4 className="text-xs font-semibold text-slate-800 truncate" title={cand.name}>
                  {cand.name}
                </h4>
              </div>

              {/* Strategy Choice */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                  Select Strategy
                </label>
                <div className="space-y-1">
                  {STRATEGIES.map((strat) => {
                    const isSelected = cand.strategy === strat;
                    return (
                      <button
                        key={strat}
                        id={`strat-btn-${cand.candidate_id}-${strat}`}
                        onClick={() => onUpdateStrategy(cand.candidate_id, strat)}
                        className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-medium transition flex items-center justify-between ${
                          isSelected
                            ? strat === 'Balanced'
                              ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                              : strat === 'Cooperative'
                              ? 'bg-blue-600 text-white font-semibold shadow-xs'
                              : 'bg-purple-600 text-white font-semibold shadow-xs'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span>{strat}</span>
                        <span className="text-[10px] opacity-80">
                          {strat === 'Balanced' ? '85p' : strat === 'Cooperative' ? '80p' : '75p'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Proceed CTA */}
        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            id="btn-proceed-results"
            onClick={onProceedToResults}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-xs flex items-center gap-2 transition"
          >
            Calculate Payoffs &amp; View Group Results
            <Zap className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
