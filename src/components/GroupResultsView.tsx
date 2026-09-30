import React, { useState } from 'react';
import { BarChart3, CheckCircle2, AlertTriangle, ArrowRight, TrendingUp } from 'lucide-react';
import { EvaluatedGroup } from '../types';

interface GroupResultsViewProps {
  evaluatedGroups: EvaluatedGroup[];
  onProceedToRanking: () => void;
}

export const GroupResultsView: React.FC<GroupResultsViewProps> = ({
  evaluatedGroups,
  onProceedToRanking
}) => {
  const [selectedGroupIdx, setSelectedGroupIdx] = useState<number>(0);
  const currentGroup = evaluatedGroups[selectedGroupIdx] || evaluatedGroups[0];

  return (
    <div id="group-results-view" className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              Group-by-Group Interview Results
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Transparent breakdown of individual marks, peer payoffs, group effects, and final calculated scores
            </p>
          </div>
          <button
            id="btn-goto-final-ranking"
            onClick={onProceedToRanking}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition self-start sm:self-auto"
          >
            <span>Proceed to Final Rankings</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Group Selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-bold text-slate-900">
            {currentGroup ? currentGroup.group_name : 'Group'} Performance Report
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Select Group:</span>
            <select
              id="group-results-select"
              value={selectedGroupIdx}
              onChange={(e) => setSelectedGroupIdx(Number(e.target.value))}
              className="text-xs font-semibold py-1.5 px-3 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800"
            >
              {evaluatedGroups.map((g, idx) => (
                <option key={g.group_id} value={idx}>
                  {g.group_name} ({g.candidates.length} candidates)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Group Metric Cards */}
        {currentGroup && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                Average Score
              </span>
              <div className="text-2xl font-bold text-slate-900 font-mono">
                {currentGroup.avg_score}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Group benchmark</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                Highest Score
              </span>
              <div className="text-2xl font-bold text-emerald-600 font-mono">
                {currentGroup.highest_score}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Top performer in group</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                Lowest Score
              </span>
              <div className="text-2xl font-bold text-slate-700 font-mono">
                {currentGroup.lowest_score}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Floor score</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                Cooperation Level
              </span>
              <div className="text-2xl font-bold text-blue-600 font-mono">
                {currentGroup.cooperation_level_pct}%
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                <div
                  className="bg-blue-600 h-1.5 rounded-full transition-all"
                  style={{ width: `${currentGroup.cooperation_level_pct}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Group Synergy Status Badges */}
        {currentGroup && (
          <div className="flex flex-wrap gap-3">
            {currentGroup.cooperation_bonus_awarded ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  <strong>+5 Cooperation Bonus Awarded:</strong> Majority of group chose Cooperative
                  or Balanced strategies.
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
                <AlertTriangle className="w-4 h-4 text-slate-400" />
                <span>
                  <strong>No Cooperation Bonus:</strong> Group did not reach cooperation majority threshold.
                </span>
              </div>
            )}

            {currentGroup.competition_penalty_applied && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs font-medium">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>
                  <strong>-5 Leader Penalty Applied:</strong> 2 or more candidates chose Leader, causing
                  conflict in discussion.
                </span>
              </div>
            )}
          </div>
        )}

        {/* Candidate Results Table */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Candidate ID</th>
                <th className="py-3 px-4">Candidate Name</th>
                <th className="py-3 px-4">Strategy</th>
                <th className="py-3 px-4">Individual Score</th>
                <th className="py-3 px-4">Group Effect</th>
                <th className="py-3 px-4">Strategy Payoff</th>
                <th className="py-3 px-4">Final Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentGroup &&
                currentGroup.candidates.map((c) => (
                  <tr key={c.candidate_id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {c.candidate_id}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">{c.name}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                          c.strategy === 'Balanced'
                            ? 'bg-emerald-100 text-emerald-800'
                            : c.strategy === 'Cooperative'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {c.strategy}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">{c.individual_score}</td>
                    <td className="py-3 px-4 font-mono font-semibold">
                      <span className={c.group_effect >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                        {c.group_effect >= 0 ? `+${c.group_effect}` : c.group_effect}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">{c.strategy_payoff}</td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-sm text-slate-900 px-2 py-0.5 rounded bg-slate-100">
                        {c.final_score}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
