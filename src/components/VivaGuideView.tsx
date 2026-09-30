import React, { useState } from 'react';
import { BookOpen, HelpCircle, ChevronDown, ChevronUp, Sparkles, Check } from 'lucide-react';

export const VivaGuideView: React.FC = () => {
  const [openIndexes, setOpenIndexes] = useState<number[]>([0, 1, 4]);

  const toggleIndex = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const concepts = [
    {
      title: '1. Player',
      definition: 'An autonomous decision-maker inside the strategic game model.',
      application:
        'In our system, each individual candidate participating in the group discussion is a Player (60 candidates in total).'
    },
    {
      title: '2. Strategy',
      definition: 'A complete plan of action or behavioral posture chosen by a player.',
      application:
        'Each candidate selects one of 3 strategies: Leader (assertive/dominating), Cooperative (supportive/active listener), or Balanced (moderate participation and equal sharing).'
    },
    {
      title: '3. Payoff',
      definition: 'The measurable reward, utility, or evaluation score received by a player.',
      application:
        'The candidate’s calculated interview score (0–100), composed of base strategy points, peer interaction payoffs, and group bonuses/penalties.'
    },
    {
      title: '4. Best Response',
      definition:
        'The strategy that yields the strictly highest payoff for a player given the strategies chosen by opponents.',
      application:
        'Given what peer candidates choose in the group, the system tests all 3 moves to see which yields maximum marks. If everyone plays Balanced, your Best Response is Balanced.'
    },
    {
      title: '5. Nash Equilibrium',
      definition:
        'A stable strategy profile where no player has any incentive to unilaterally change their strategy.',
      application:
        'In our 2-player matrix, (Balanced, Balanced) is the unique pure Nash Equilibrium with mutual payoffs of (9, 9). Neither candidate can gain points by deviating alone.'
    },
    {
      title: '6. Strategic Interaction',
      definition: 'A situation where one participant’s outcome depends on the actions of others.',
      application:
        'A candidate cannot succeed in isolation. Multiple candidates playing Leader create conflict and incur penalties (-5 pts), while cooperation grants everyone +5 pts.'
    }
  ];

  const vivaQuestions = [
    {
      q: 'Q1: What is Game Theory?',
      a: 'Game Theory is the mathematical study of strategic decision-making where multiple rational agents interact, and the outcome for each participant depends on the combined choices of all participants.'
    },
    {
      q: 'Q2: Who are the players in this application?',
      a: 'The candidates participating in the group interview are the players. Each candidate acts as an independent decision-maker attempting to maximize their final interview score.'
    },
    {
      q: 'Q3: What are the strategies available to each candidate?',
      a: 'Three strategies: 1) Leader (aims to dominate discussion), 2) Cooperative (listens and supports others), and 3) Balanced (regular participation while encouraging others).'
    },
    {
      q: 'Q4: What is a payoff in this context?',
      a: 'The payoff is the final interview score (0 to 100) received by the candidate, reflecting their base individual merit, group collaboration bonus, conflict penalties, and strategic peer compatibility.'
    },
    {
      q: 'Q5: What is Nash Equilibrium in this project?',
      a: 'Nash Equilibrium is the strategy combination (Balanced, Balanced) where no candidate can improve their score by unilaterally switching strategies. If Candidate B plays Balanced, Candidate A’s highest score is by also playing Balanced (payoff 9 vs 8 or 7).'
    },
    {
      q: 'Q6: Why is a group interview a Game Theory problem?',
      a: 'Because an interview is not an isolated test. Candidate performance is inherently interdependent: an aggressive candidate clashes with another aggressive candidate, reducing both scores, whereas constructive peers elevate the entire table.'
    },
    {
      q: 'Q7: How are candidates scored mathematically?',
      a: 'Final Score = Individual Base Score (Leader: 75, Cooperative: 80, Balanced: 85) + Group Effect (+5 Cooperation Bonus / -5 Leader Penalty + 0–5 Participation variation) + Strategy Payoff (4–9 pts from pairwise matrix). The final total is clamped between 0 and 100.'
    },
    {
      q: 'Q8: Why does group behavior matter?',
      a: 'If a group is mostly Cooperative or Balanced, everyone gets a +5 cooperation bonus. If two or more members try to be Leaders, every Leader is penalized -5 marks due to destructive competition and interrupted discussion.'
    },
    {
      q: 'Q9: How are the Top 30 selected?',
      a: 'All candidates from all groups are combined into a global leaderboard sorted by Final Score descending. Ties are broken deterministically by Candidate ID so exactly 30 candidates advance to Round 2.'
    },
    {
      q: 'Q10: What are the limitations of this project?',
      a: 'Real human interviews involve continuous body language, vocal nuance, and subjective interviewer bias, whereas this simulation models decisions as discrete strategies to demonstrate foundational mathematical Game Theory concepts cleanly.'
    }
  ];

  return (
    <div id="viva-guide-view" className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4" />
          Exam Preparation Module
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          Game Theory Concepts &amp; Viva Examination Guide
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Concise, academic explanations designed for college engineering students to confidently explain this project in viva voce.
        </p>
      </div>

      {/* Core Concept Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          1. Foundational Game Theory Concepts
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {concepts.map((c) => (
            <div key={c.title} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <h4 className="font-bold text-sm text-slate-900 text-emerald-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                {c.title}
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {c.definition}
              </p>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed">
                <strong className="text-slate-700">In This System:</strong> {c.application}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Viva Q&A Accordion */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              Top 10 Viva Voce Questions &amp; Answers
            </h3>
            <p className="text-xs text-slate-500">
              Click any question to view the crisp, examiners&apos; expected response
            </p>
          </div>
          <button
            onClick={() =>
              setOpenIndexes(
                openIndexes.length === vivaQuestions.length
                  ? []
                  : vivaQuestions.map((_, i) => i)
              )
            }
            className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold"
          >
            {openIndexes.length === vivaQuestions.length ? 'Collapse All' : 'Expand All'}
          </button>
        </div>

        <div className="space-y-2.5 pt-2">
          {vivaQuestions.map((item, idx) => {
            const isOpen = openIndexes.includes(idx);
            return (
              <div
                key={item.q}
                className="border border-slate-200 rounded-lg overflow-hidden transition"
              >
                <button
                  id={`viva-qa-btn-${idx}`}
                  onClick={() => toggleIndex(idx)}
                  className="w-full text-left p-3.5 bg-slate-50 hover:bg-slate-100/80 font-semibold text-xs text-slate-900 flex items-center justify-between transition"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    {item.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-4 bg-white text-xs text-slate-700 leading-relaxed border-t border-slate-200">
                    <div className="p-3 bg-emerald-50/50 rounded border border-emerald-100/80 text-emerald-950 font-medium">
                      <strong className="text-emerald-900 block mb-1">Recommended Viva Response:</strong>
                      {item.a}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
