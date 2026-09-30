import React, { useState } from 'react';
import { Users, Layers, Trophy, ArrowRight, Search, CheckCircle2, UserPlus } from 'lucide-react';
import { Candidate, CandidateGroup } from '../types';

interface AdminSetupViewProps {
  candidates: Candidate[];
  groups: CandidateGroup[];
  candidateCount: number;
  groupSize: number;
  selectCount: number;
  onStartInterview: () => void;
  onAddCandidate: (name: string) => void;
}

export const AdminSetupView: React.FC<AdminSetupViewProps> = ({
  candidates,
  groups,
  candidateCount,
  groupSize,
  selectCount,
  onStartInterview,
  onAddCandidate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newName, setNewName] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'groups'>('table');

  const filteredCandidates = candidates.filter(
    (c) =>
      c.candidate_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onAddCandidate(newName.trim());
      setNewName('');
    }
  };

  return (
    <div id="admin-setup-view" className="space-y-6">
      {/* Header & Explanation */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Game Theory Based Group Interview
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Candidate Evaluation &amp; Selection System • College Viva Demonstration Project
            </p>
          </div>
          <button
            id="btn-start-interview-top"
            onClick={onStartInterview}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm transition shadow-xs"
          >
            Start Interview
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Project Objective Box */}
        <div className="mt-5 p-4 bg-emerald-50/80 border border-emerald-200 rounded-lg text-emerald-950 text-sm leading-relaxed">
          <span className="font-semibold text-emerald-900">💡 Objective:</span> Simulate a group
          interview where candidates make strategic decisions. The system evaluates individual and
          group performance using Game Theory principles and automatically selects the{' '}
          <span className="font-semibold underline decoration-emerald-500">Top {selectCount} candidates</span>{' '}
          for the next round.
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Candidates</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900 font-mono">{candidateCount}</div>
          <p className="text-xs text-slate-500 mt-1">Registered for Round 1</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Group Size</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900 font-mono">{groupSize}</div>
          <p className="text-xs text-slate-500 mt-1">Candidates per interview group</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Formed Groups</span>
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900 font-mono">{groups.length}</div>
          <p className="text-xs text-slate-500 mt-1">Parallel discussion tables</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Round 2 Quota</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-bold text-slate-900 font-mono">{selectCount}</div>
          <p className="text-xs text-slate-500 mt-1">Top performers to qualify</p>
        </div>
      </div>

      {/* Candidate Registration & Allocation */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Candidate Registration &amp; Groups</h2>
            <p className="text-xs text-slate-500">
              Review candidates and their automatically assigned discussion groups
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-lg p-1 bg-slate-100 border border-slate-200 text-xs">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded font-medium transition ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                All List
              </button>
              <button
                onClick={() => setViewMode('groups')}
                className={`px-3 py-1 rounded font-medium transition ${
                  viewMode === 'groups' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Group Allocation
              </button>
            </div>
          </div>
        </div>

        {/* Quick Add and Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              id="search-candidates"
              type="text"
              placeholder="Search candidate by ID or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
            />
          </div>

          <form onSubmit={handleAdd} className="flex gap-2">
            <input
              id="input-new-candidate-name"
              type="text"
              placeholder="Add custom candidate..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-48 px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
            />
            <button
              id="btn-add-candidate"
              type="submit"
              className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Add
            </button>
          </form>
        </div>

        {/* View Mode: Table */}
        {viewMode === 'table' && (
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-4">Candidate ID</th>
                    <th className="py-2.5 px-4">Candidate Name</th>
                    <th className="py-2.5 px-4">Assigned Group</th>
                    <th className="py-2.5 px-4">Initial Strategy</th>
                    <th className="py-2.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCandidates.map((c, idx) => {
                    const groupIndex = Math.floor(idx / groupSize) + 1;
                    return (
                      <tr key={c.candidate_id} className="hover:bg-slate-50/80 transition">
                        <td className="py-2.5 px-4 font-mono font-bold text-slate-900">
                          {c.candidate_id}
                        </td>
                        <td className="py-2.5 px-4 font-medium text-slate-800">{c.name}</td>
                        <td className="py-2.5 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 font-medium">
                            Group {groupIndex}
                          </span>
                        </td>
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
                        <td className="py-2.5 px-4 text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Registered</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between">
              <span>Showing {filteredCandidates.length} of {candidates.length} candidates</span>
              <span>Sorted sequentially by Candidate ID</span>
            </div>
          </div>
        )}

        {/* View Mode: Group Allocation */}
        {viewMode === 'groups' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {groups.map((g) => (
              <div key={g.group_id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                  <span className="font-semibold text-xs text-slate-900">{g.group_name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded font-medium">
                    {g.size} members
                  </span>
                </div>
                <div className="space-y-1.5">
                  {g.candidates.map((mem) => (
                    <div
                      key={mem.candidate_id}
                      className="text-xs flex items-center justify-between bg-white px-2 py-1 rounded border border-slate-100 text-slate-700"
                    >
                      <span className="font-mono font-medium text-slate-900 text-[11px]">
                        {mem.candidate_id}
                      </span>
                      <span className="truncate max-w-[110px] text-slate-600">{mem.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            id="btn-start-interview-bottom"
            onClick={onStartInterview}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm flex items-center gap-2 transition shadow-xs"
          >
            Start Interview &amp; Assign Strategies
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
