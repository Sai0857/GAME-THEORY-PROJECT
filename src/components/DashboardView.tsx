import React from 'react';
import { PieChart, Users, Award, TrendingUp, BarChart2, Layers } from 'lucide-react';
import { EvaluatedCandidate, EvaluatedGroup } from '../types';

interface DashboardViewProps {
  rankedCandidates: EvaluatedCandidate[];
  evaluatedGroups: EvaluatedGroup[];
  selectCount: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  rankedCandidates,
  evaluatedGroups,
  selectCount
}) => {
  const allScores = rankedCandidates.map((c) => c.final_score);
  const avgScore =
    allScores.length > 0
      ? (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(2)
      : '0.00';
  const highestScore = allScores.length > 0 ? Math.max(...allScores).toFixed(2) : '0.00';

  // Strategy distribution counts
  const leaderCount = rankedCandidates.filter((c) => c.strategy === 'Leader').length;
  const coopCount = rankedCandidates.filter((c) => c.strategy === 'Cooperative').length;
  const balCount = rankedCandidates.filter((c) => c.strategy === 'Balanced').length;
  const maxStratCount = Math.max(leaderCount, coopCount, balCount, 1);

  // Group selection distribution
  const selectionsPerGroup = evaluatedGroups.map((g) => {
    const count = g.candidates.filter((c) => c.selected_round_2).length;
    return {
      group_name: g.group_name,
      count,
      avg_score: g.avg_score
    };
  });
  const maxGroupAvg = Math.max(...evaluatedGroups.map((g) => g.avg_score), 100);
  const maxSelectionCount = Math.max(...selectionsPerGroup.map((g) => g.count), 5);

  return (
    <div id="dashboard-view" className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-emerald-600" />
          Game Theory Analytics Dashboard
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          High-level visual summary of strategic distributions, group dynamics, and Round 2 qualification spread
        </p>
      </div>

      {/* Overall Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Total Candidates
          </span>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {rankedCandidates.length}
          </div>
          <span className="text-[10px] text-slate-500">Evaluated in Round 1</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Total Groups
          </span>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {evaluatedGroups.length}
          </div>
          <span className="text-[10px] text-slate-500">Interview tables</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Average Score
          </span>
          <div className="text-2xl font-bold text-indigo-600 font-mono">{avgScore}</div>
          <span className="text-[10px] text-slate-500">Scale of 0 to 100</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Highest Score
          </span>
          <div className="text-2xl font-bold text-emerald-600 font-mono">{highestScore}</div>
          <span className="text-[10px] text-slate-500">Rank #1 Performer</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs col-span-2 md:col-span-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Top Selected
          </span>
          <div className="text-2xl font-bold text-amber-600 font-mono">{selectCount}</div>
          <span className="text-[10px] text-slate-500">Advancing to Round 2</span>
        </div>
      </div>

      {/* Chart Row 1: Strategy Distribution & Group Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strategy Distribution Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-emerald-600" />
              1. Candidate Strategy Distribution
            </h3>
            <span className="text-xs text-slate-400">{rankedCandidates.length} Total</span>
          </div>

          <div className="space-y-4 pt-2">
            {/* Balanced */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
                  Balanced (Nash Equilibrium)
                </span>
                <span className="font-mono font-bold text-slate-800">
                  {balCount} candidates (
                  {((balCount / (rankedCandidates.length || 1)) * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(balCount / maxStratCount) * 100}%` }}
                />
              </div>
            </div>

            {/* Cooperative */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-blue-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block" />
                  Cooperative (Synergy)
                </span>
                <span className="font-mono font-bold text-slate-800">
                  {coopCount} candidates (
                  {((coopCount / (rankedCandidates.length || 1)) * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(coopCount / maxStratCount) * 100}%` }}
                />
              </div>
            </div>

            {/* Leader */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-purple-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-purple-500 inline-block" />
                  Leader (Aggressive)
                </span>
                <span className="font-mono font-bold text-slate-800">
                  {leaderCount} candidates (
                  {((leaderCount / (rankedCandidates.length || 1)) * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(leaderCount / maxStratCount) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            Game theory predicts candidates converge to <strong>Balanced</strong> due to maximum expected
            individual and peer payoffs.
          </p>
        </div>

        {/* Group Performance Comparison Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              2. Group Performance Comparison (Average Score)
            </h3>
            <span className="text-xs text-slate-400">Scale: 0–100</span>
          </div>

          {/* Bar chart */}
          <div className="space-y-2 pt-1 max-h-56 overflow-y-auto pr-1">
            {evaluatedGroups.map((g) => (
              <div key={g.group_id} className="flex items-center gap-3 text-xs">
                <span className="w-16 font-semibold text-slate-700 shrink-0">
                  {g.group_name}
                </span>
                <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      g.cooperation_bonus_awarded ? 'bg-emerald-500' : 'bg-slate-400'
                    }`}
                    style={{ width: `${(g.avg_score / maxGroupAvg) * 100}%` }}
                  />
                </div>
                <span className="font-mono font-bold text-slate-900 w-12 text-right shrink-0">
                  {g.avg_score}
                </span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            Green bars indicate groups that earned the <strong>+5 Cooperation Bonus</strong>.
          </p>
        </div>
      </div>

      {/* Chart Row 2: Selection Distribution Across Groups */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              3. Round 2 Selection Distribution by Group
            </h3>
            <p className="text-xs text-slate-500">
              Shows how many qualified Round 2 candidates originated from each group
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
            {selectCount} Total Qualifiers
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
          {selectionsPerGroup.map((item) => (
            <div
              key={item.group_name}
              className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 text-center space-y-1"
            >
              <span className="text-xs font-semibold text-slate-700 block">
                {item.group_name}
              </span>
              <div className="text-2xl font-black text-slate-900 font-mono">
                {item.count}
              </div>
              <span className="text-[10px] text-slate-500 block">
                Avg: {item.avg_score} pts
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
