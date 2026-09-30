/**
 * Game Theory Based Group Interview & Candidate Selection System
 * React + Vite Web Application & Streamlit Demonstration Suite
 */

import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { AdminSetupView } from './components/AdminSetupView';
import { GroupInterviewView } from './components/GroupInterviewView';
import { PayoffMatrixView } from './components/PayoffMatrixView';
import { BestResponseView } from './components/BestResponseView';
import { GroupResultsView } from './components/GroupResultsView';
import { FinalRankingView } from './components/FinalRankingView';
import { DashboardView } from './components/DashboardView';
import { VivaGuideView } from './components/VivaGuideView';
import { CodeExportView } from './components/CodeExportView';
import { ActiveTab, Candidate, Strategy } from './types';
import {
  generateCandidates,
  partitionIntoGroups,
  evaluateGroup,
  rankCandidates,
  STRATEGIES
} from './gameTheoryEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('admin');
  const [candidateCount, setCandidateCount] = useState<number>(60);
  const [groupSize, setGroupSize] = useState<number>(5);
  const [selectCount, setSelectCount] = useState<number>(30);

  // Candidates state
  const [candidates, setCandidates] = useState<Candidate[]>(() => generateCandidates(60));

  // Sync candidates when candidateCount changes
  const handleCandidateCountChange = (newCount: number) => {
    setCandidateCount(newCount);
    setCandidates(generateCandidates(newCount));
  };

  // Reset to default
  const handleReset = () => {
    setCandidateCount(60);
    setGroupSize(5);
    setSelectCount(30);
    setCandidates(generateCandidates(60));
  };

  // Group partition
  const groups = useMemo(() => {
    return partitionIntoGroups(candidates, groupSize);
  }, [candidates, groupSize]);

  // Evaluated groups
  const evaluatedGroups = useMemo(() => {
    return groups.map((g) => evaluateGroup(g, 42));
  }, [groups]);

  // Flatten evaluated candidates & rank them
  const rankedCandidates = useMemo(() => {
    const allEvaluated = evaluatedGroups.flatMap((g) => g.candidates);
    return rankCandidates(allEvaluated, selectCount);
  }, [evaluatedGroups, selectCount]);

  // Update candidate strategy
  const handleUpdateStrategy = (candidateId: string, strategy: Strategy) => {
    setCandidates((prev) =>
      prev.map((c) => (c.candidate_id === candidateId ? { ...c, strategy } : c))
    );
  };

  // Bulk strategy presets
  const handleApplyPreset = (preset: 'balanced' | 'leader' | 'cooperative' | 'random') => {
    setCandidates((prev) =>
      prev.map((c) => {
        let newStrat: Strategy = 'Balanced';
        if (preset === 'balanced') newStrat = 'Balanced';
        else if (preset === 'leader') newStrat = 'Leader';
        else if (preset === 'cooperative') newStrat = 'Cooperative';
        else if (preset === 'random') {
          newStrat = STRATEGIES[Math.floor(Math.random() * STRATEGIES.length)];
        }
        return { ...c, strategy: newStrat };
      })
    );
  };

  // Add custom candidate
  const handleAddCandidate = (name: string) => {
    const nextNum = candidates.length + 1;
    const cid = `C${String(nextNum).padStart(3, '0')}`;
    const newCand: Candidate = {
      candidate_id: cid,
      name,
      strategy: 'Balanced'
    };
    setCandidates((prev) => [...prev, newCand]);
    setCandidateCount((prev) => prev + 1);
  };

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900 font-sans antialiased overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        candidateCount={candidateCount}
        setCandidateCount={handleCandidateCountChange}
        groupSize={groupSize}
        setGroupSize={setGroupSize}
        selectCount={selectCount}
        setSelectCount={setSelectCount}
        totalGroups={groups.length}
        onReset={handleReset}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
        {activeTab === 'admin' && (
          <AdminSetupView
            candidates={candidates}
            groups={groups}
            candidateCount={candidateCount}
            groupSize={groupSize}
            selectCount={selectCount}
            onStartInterview={() => setActiveTab('interview')}
            onAddCandidate={handleAddCandidate}
          />
        )}

        {activeTab === 'interview' && (
          <GroupInterviewView
            groups={groups}
            onUpdateStrategy={handleUpdateStrategy}
            onApplyPreset={handleApplyPreset}
            onProceedToResults={() => setActiveTab('group_results')}
          />
        )}

        {activeTab === 'matrix' && <PayoffMatrixView />}

        {activeTab === 'best_response' && (
          <BestResponseView evaluatedGroups={evaluatedGroups} />
        )}

        {activeTab === 'group_results' && (
          <GroupResultsView
            evaluatedGroups={evaluatedGroups}
            onProceedToRanking={() => setActiveTab('ranking')}
          />
        )}

        {activeTab === 'ranking' && (
          <FinalRankingView
            rankedCandidates={rankedCandidates}
            selectCount={selectCount}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            rankedCandidates={rankedCandidates}
            evaluatedGroups={evaluatedGroups}
            selectCount={selectCount}
          />
        )}

        {activeTab === 'viva' && <VivaGuideView />}

        {activeTab === 'code' && <CodeExportView />}
      </main>
    </div>
  );
}
