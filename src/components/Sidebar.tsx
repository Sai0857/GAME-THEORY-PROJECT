import React from 'react';
import {
  Users,
  MessageSquare,
  Grid3X3,
  Target,
  BarChart3,
  Award,
  PieChart,
  BookOpen,
  FileCode2,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  candidateCount: number;
  setCandidateCount: (val: number) => void;
  groupSize: number;
  setGroupSize: (val: number) => void;
  selectCount: number;
  setSelectCount: (val: number) => void;
  totalGroups: number;
  onReset: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  candidateCount,
  setCandidateCount,
  groupSize,
  setGroupSize,
  selectCount,
  setSelectCount,
  totalGroups,
  onReset
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'admin', label: '1. Admin Setup', icon: <Users className="w-4 h-4" /> },
    { id: 'interview', label: '2. Group Interview & Strategies', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'matrix', label: '3. Payoff Matrix & Nash Eq.', icon: <Grid3X3 className="w-4 h-4" />, badge: 'Core' },
    { id: 'best_response', label: '4. Best Response Analysis', icon: <Target className="w-4 h-4" /> },
    { id: 'group_results', label: '5. Group Results', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'ranking', label: '6. Final Ranking & Top 30', icon: <Award className="w-4 h-4" />, badge: 'Round 2' },
    { id: 'dashboard', label: '7. Analytical Dashboard', icon: <PieChart className="w-4 h-4" /> },
    { id: 'viva', label: '8. Game Theory Viva Guide', icon: <BookOpen className="w-4 h-4" />, badge: 'Q&A' },
    { id: 'code', label: '9. Python & Streamlit Files', icon: <FileCode2 className="w-4 h-4" /> }
  ];

  return (
    <aside
      id="app-sidebar"
      className="w-80 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 shrink-0 h-screen sticky top-0 overflow-y-auto"
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-semibold text-sm tracking-tight text-white leading-tight">
              Game Theory Interview
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Candidate Selection System</p>
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] bg-slate-800 border border-slate-700 text-emerald-300 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          College Viva Project • Streamlit Ready
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Workflow Navigation
        </div>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/30'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                    isActive ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Simulation Controls in Sidebar */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 space-y-3.5 text-xs">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Simulation Parameters
        </div>

        <div>
          <div className="flex justify-between text-slate-300 mb-1">
            <span>Candidates:</span>
            <span className="font-mono font-semibold text-emerald-400">{candidateCount}</span>
          </div>
          <input
            id="candidate-count-slider"
            type="range"
            min={10}
            max={100}
            step={5}
            value={candidateCount}
            onChange={(e) => setCandidateCount(Number(e.target.value))}
            className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-slate-300 mb-1">
            <span>Group Size:</span>
            <span className="font-mono font-semibold text-emerald-400">{groupSize}</span>
          </div>
          <input
            id="group-size-slider"
            type="range"
            min={3}
            max={8}
            step={1}
            value={groupSize}
            onChange={(e) => setGroupSize(Number(e.target.value))}
            className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-slate-300 mb-1">
            <span>Round 2 Qualifiers:</span>
            <span className="font-mono font-semibold text-emerald-400">{selectCount}</span>
          </div>
          <input
            id="select-count-slider"
            type="range"
            min={5}
            max={Math.min(60, candidateCount)}
            step={5}
            value={selectCount}
            onChange={(e) => setSelectCount(Number(e.target.value))}
            className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded cursor-pointer"
          />
        </div>

        <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80">
          <span>Formed Groups:</span>
          <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
            {totalGroups} groups
          </span>
        </div>

        <button
          id="btn-reset-simulation"
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset Default (60 cands / 5 size)
        </button>
      </div>
    </aside>
  );
};
