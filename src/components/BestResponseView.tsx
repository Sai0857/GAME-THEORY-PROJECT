import React, { useState } from 'react';
import { Target, CheckCircle2, AlertTriangle, ArrowRight, UserCheck } from 'lucide-react';
import { EvaluatedGroup } from '../types';

interface BestResponseViewProps {
  evaluatedGroups: EvaluatedGroup[];
}

export const BestResponseView: React.FC<BestResponseViewProps> = ({ evaluatedGroups }) => {
  const [selectedGroupIdx, setSelectedGroupIdx] = useState(0);
  const currentGroup = evaluatedGroups[selectedGroupIdx] || evaluatedGroups[0];

  const optimalCount = currentGroup
    ? currentGroup.candidates.filter((c) => c.is_best_response).length
    : 0;

  return (
    <div id="best-response-view" className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-600" />
          Best Response Analysis
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Evaluating each candidate&apos;s decision against the exact strategy choices made by their group peers
        </p>

        <div className="mt-4 p-3.5 bg-indigo-50/80 border border-indigo-200 rounded-lg text-xs text-indigo-950 leading-relaxed">
          <span className="font-semibold text-indigo-900">Definition for Viva:</span> &ldquo;The Best
          Response is the strategy that gives a player the highest possible payoff given the choices
          already chosen by the other players in their group.&rdquo;
        </div>
      </div>

      {/* Group Selector & Metrics */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {currentGroup ? currentGroup.group_name : 'Group'} Strategic Response Breakdown
            </h3>
            <p className="text-xs text-slate-500">
              {optimalCount} of {currentGroup ? currentGroup.candidates.length : 0} candidates chose their
              mathematical Best Response
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Select Group:</span>
            <select
              id="best-response-group-select"
              value={selectedGroupIdx}
              onChange={(e) => setSelectedGroupIdx(Number(e.target.value))}
              className="text-xs font-semibold py-1.5 px-3 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-800"
            >
              {evaluatedGroups.map((g, idx) => (
                <option key={g.group_id} value={idx}>
                  {g.group_name} ({g.candidates.length} candidates)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Candidate Table */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Candidate ID</th>
                <th className="py-3 px-4">Candidate Name</th>
                <th className="py-3 px-4">Selected Strategy</th>
                <th className="py-3 px-4">Current Payoff</th>
                <th className="py-3 px-4">Best Response Strategy</th>
                <th className="py-3 px-4">Best Possible Payoff</th>
                <th className="py-3 px-4">Is Best Response?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentGroup &&
                currentGroup.candidates.map((cand) => (
                  <tr key={cand.candidate_id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {cand.candidate_id}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">{cand.name}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                          cand.strategy === 'Balanced'
                            ? 'bg-emerald-100 text-emerald-800'
                            : cand.strategy === 'Cooperative'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {cand.strategy}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {cand.strategy_payoff} pts
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded text-[11px]">
                        {cand.best_response}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {cand.best_payoff} pts
                    </td>
                    <td className="py-3 px-4">
                      {cand.is_best_response ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Yes (Optimal)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          Sub-optimal (Switch to {cand.best_response})
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Viva Spotlight Box */}
        {currentGroup && currentGroup.candidates.length > 0 && (
          <div className="mt-4 p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2 text-xs text-slate-700">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              Spotlight Case Study: {currentGroup.candidates[0].candidate_id} (
              {currentGroup.candidates[0].name})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                  Current Strategy
                </span>
                <span className="font-bold text-slate-900 text-sm">
                  {currentGroup.candidates[0].strategy}
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Earned Payoff: {currentGroup.candidates[0].strategy_payoff}
                </p>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                  Best Response
                </span>
                <span className="font-bold text-indigo-700 text-sm">
                  {currentGroup.candidates[0].best_response}
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Max Payoff: {currentGroup.candidates[0].best_payoff}
                </p>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                  Optimality Status
                </span>
                <span
                  className={`font-bold text-sm ${
                    currentGroup.candidates[0].is_best_response
                      ? 'text-emerald-700'
                      : 'text-amber-700'
                  }`}
                >
                  {currentGroup.candidates[0].is_best_response
                    ? 'Optimal Best Response'
                    : 'Can Deviate for Gain'}
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {currentGroup.candidates[0].is_best_response
                    ? 'No unilateral incentive to switch'
                    : `Could gain +${(
                        currentGroup.candidates[0].best_payoff -
                        currentGroup.candidates[0].strategy_payoff
                      ).toFixed(1)} pts`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
