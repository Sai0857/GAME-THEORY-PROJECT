import React, { useState } from 'react';
import { Trophy, CheckCircle2, Search, Filter, ArrowDownUp, UserCheck, XCircle } from 'lucide-react';
import { EvaluatedCandidate } from '../types';

interface FinalRankingViewProps {
  rankedCandidates: EvaluatedCandidate[];
  selectCount: number;
}

export const FinalRankingView: React.FC<FinalRankingViewProps> = ({
  rankedCandidates,
  selectCount
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'selected' | 'unselected'>('all');

  const selectedCandidates = rankedCandidates.filter((c) => c.selected_round_2);
  const unselectedCandidates = rankedCandidates.filter((c) => !c.selected_round_2);

  const filteredList = rankedCandidates.filter((c) => {
    const matchesSearch =
      c.candidate_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterMode === 'selected') return matchesSearch && c.selected_round_2;
    if (filterMode === 'unselected') return matchesSearch && !c.selected_round_2;
    return matchesSearch;
  });

  return (
    <div id="final-ranking-view" className="space-y-6">
      {/* 🏆 Top 30 Selected Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-950 text-white rounded-xl p-6 border-2 border-emerald-500 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">
              <Trophy className="w-4 h-4 text-amber-400" />
              Round 1 Elimination Result
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              🏆 SELECTED FOR ROUND 2
            </h2>
            <p className="text-sm text-emerald-100 mt-2 font-medium">
              <strong className="text-amber-300 font-bold">{selectedCandidates.length} candidates</strong>{' '}
              automatically selected out of{' '}
              <strong className="text-white">{rankedCandidates.length} total candidates</strong> based
              on Game Theory evaluation.
            </p>
          </div>

          <div className="bg-emerald-950/60 border border-emerald-400/40 rounded-xl p-4 text-center shrink-0">
            <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider block">
              Round 2 Quota
            </span>
            <span className="text-3xl font-black text-amber-300 font-mono">
              {selectedCandidates.length} / {selectCount}
            </span>
            <span className="text-[10px] text-emerald-200 block mt-0.5">100% Filled</span>
          </div>
        </div>
      </div>

      {/* Selected Candidates Quick Grid / Wall of Fame */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              Top {selectCount} Qualifiers (Round 2 Roster)
            </h3>
            <p className="text-xs text-slate-500">
              Ranked in descending order of performance; ties broken deterministically by Candidate ID
            </p>
          </div>
          <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
            Top {selectCount}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2.5 max-h-72 overflow-y-auto pr-1">
          {selectedCandidates.map((c) => (
            <div
              key={c.candidate_id}
              className="p-2.5 rounded-lg border border-emerald-200/80 bg-emerald-50/40 hover:bg-emerald-50 transition flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                  {c.rank}
                </span>
                <div className="truncate">
                  <span className="font-mono font-bold text-slate-900">{c.candidate_id}</span>
                  <p className="text-[11px] text-slate-600 truncate">{c.name}</p>
                </div>
              </div>
              <span className="font-mono font-bold text-emerald-800 text-xs shrink-0 ml-1">
                {c.final_score}p
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Complete Leaderboard */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ArrowDownUp className="w-4 h-4 text-slate-600" />
              FINAL CANDIDATE RANKING
            </h3>
            <p className="text-xs text-slate-500">
              Complete leaderboard with qualification markers for all candidates
            </p>
          </div>

          {/* Filter Pills */}
          <div className="inline-flex rounded-lg p-1 bg-slate-100 border border-slate-200 text-xs">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 rounded font-medium transition ${
                filterMode === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              All ({rankedCandidates.length})
            </button>
            <button
              onClick={() => setFilterMode('selected')}
              className={`px-3 py-1 rounded font-medium transition ${
                filterMode === 'selected' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
              }`}
            >
              Selected ({selectedCandidates.length})
            </button>
            <button
              onClick={() => setFilterMode('unselected')}
              className={`px-3 py-1 rounded font-medium transition ${
                filterMode === 'unselected' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-600'
              }`}
            >
              Not Selected ({unselectedCandidates.length})
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            id="search-ranking-table"
            type="text"
            placeholder="Search candidate in leaderboard..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
          />
        </div>

        {/* Leaderboard Table */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Candidate ID</th>
                  <th className="py-3 px-4">Candidate Name</th>
                  <th className="py-3 px-4">Group</th>
                  <th className="py-3 px-4">Strategy</th>
                  <th className="py-3 px-4">Final Score</th>
                  <th className="py-3 px-4">Round 2 Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.map((c) => (
                  <tr
                    key={c.candidate_id}
                    className={`transition ${
                      c.selected_round_2
                        ? 'bg-emerald-50/40 hover:bg-emerald-50'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-900">
                      {c.rank && c.rank <= 3 ? (
                        <span className="inline-flex items-center gap-1 text-amber-600 font-bold">
                          #{c.rank} 🏅
                        </span>
                      ) : (
                        `#${c.rank}`
                      )}
                    </td>
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-900">
                      {c.candidate_id}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-slate-800">{c.name}</td>
                    <td className="py-2.5 px-4 text-slate-600">{c.group_name}</td>
                    <td className="py-2.5 px-4">
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
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-900">
                      {c.final_score}
                    </td>
                    <td className="py-2.5 px-4">
                      {c.selected_round_2 ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Selected for Round 2
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium text-slate-500 bg-slate-100">
                          <XCircle className="w-3.5 h-3.5 text-slate-400" />
                          Not Selected
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between">
            <span>Showing {filteredList.length} of {rankedCandidates.length} candidates</span>
            <span>Tie-break rule: Secondary sort by Candidate ID Ascending</span>
          </div>
        </div>
      </div>
    </div>
  );
};
