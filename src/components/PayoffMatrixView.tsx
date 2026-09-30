import React, { useState } from 'react';
import { Grid3X3, Award, Sparkles, HelpCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Strategy } from '../types';
import { PAYOFF_MATRIX, STRATEGIES } from '../gameTheoryEngine';

export const PayoffMatrixView: React.FC = () => {
  const [hoveredCell, setHoveredCell] = useState<{ a: Strategy; b: Strategy } | null>(null);

  const getCellPayoff = (a: Strategy, b: Strategy) => {
    return PAYOFF_MATRIX[`${a}-${b}`] || [0, 0];
  };

  const isNash = (a: Strategy, b: Strategy) => {
    return a === 'Balanced' && b === 'Balanced';
  };

  return (
    <div id="payoff-matrix-view" className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Grid3X3 className="w-5 h-5 text-emerald-600" />
          Game Theory Payoff Matrix &amp; Nash Equilibrium
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Normal-form representation of pairwise strategic interactions between Candidate A and Candidate B
        </p>

        <div className="mt-4 p-3.5 bg-blue-50/80 border border-blue-200 rounded-lg text-xs text-blue-900 leading-relaxed">
          <span className="font-semibold text-blue-950">💡 Standard Matrix Convention:</span> &ldquo;The first
          value represents Candidate A&apos;s payoff and the second value represents Candidate B&apos;s
          payoff.&rdquo;
        </div>
      </div>

      {/* Interactive Payoff Matrix Grid */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            2-Player Strategic Normal Form Matrix
          </h3>
          <span className="text-xs text-slate-500">
            Hover over any outcome cell to inspect strategic incentives
          </span>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[500px]">
            {/* Top Label for Player B */}
            <div className="text-center font-bold text-xs text-slate-500 uppercase tracking-wider mb-2">
              Candidate B&apos;s Strategy
            </div>

            <table className="w-full border-collapse text-xs">
              <thead>
                <tr>
                  <th className="p-3 border border-slate-200 bg-slate-100 font-bold text-slate-700 w-1/4">
                    Candidate A \ B
                  </th>
                  {STRATEGIES.map((b) => (
                    <th
                      key={b}
                      className="p-3 border border-slate-200 bg-slate-50 font-bold text-slate-800 text-center w-1/4"
                    >
                      {b}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {STRATEGIES.map((a) => (
                  <tr key={a}>
                    {/* Row Label for Player A */}
                    <td className="p-3 border border-slate-200 bg-slate-50 font-bold text-slate-800">
                      {a}
                    </td>

                    {/* Matrix Cells */}
                    {STRATEGIES.map((b) => {
                      const [payA, payB] = getCellPayoff(a, b);
                      const nash = isNash(a, b);
                      const isHovered = hoveredCell?.a === a && hoveredCell?.b === b;

                      return (
                        <td
                          key={b}
                          onMouseEnter={() => setHoveredCell({ a, b })}
                          onMouseLeave={() => setHoveredCell(null)}
                          className={`p-4 border border-slate-200 text-center transition cursor-pointer relative ${
                            nash
                              ? 'bg-emerald-50/90 border-emerald-400 font-bold'
                              : isHovered
                              ? 'bg-slate-100'
                              : 'bg-white hover:bg-slate-50'
                          }`}
                        >
                          {nash && (
                            <span className="absolute top-1.5 right-1.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-600 text-white uppercase tracking-wider">
                              NASH
                            </span>
                          )}
                          <div className="flex items-center justify-center gap-2">
                            <span
                              className={`text-sm font-mono font-bold ${
                                nash ? 'text-emerald-700' : 'text-slate-900'
                              }`}
                            >
                              ({payA}, {payB})
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1">
                            A gets {payA} • B gets {payB}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hover Inspector Box */}
        {hoveredCell && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-900">
                Outcome ({hoveredCell.a}, {hoveredCell.b}):
              </span>{' '}
              Candidate A earns{' '}
              <strong className="text-emerald-700">
                {getCellPayoff(hoveredCell.a, hoveredCell.b)[0]} pts
              </strong>
              , Candidate B earns{' '}
              <strong className="text-emerald-700">
                {getCellPayoff(hoveredCell.a, hoveredCell.b)[1]} pts
              </strong>
              .
            </div>
            {isNash(hoveredCell.a, hoveredCell.b) && (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Pure Strategy Nash Equilibrium
              </span>
            )}
          </div>
        )}
      </div>

      {/* Nash Equilibrium Deep Dive */}
      <div className="bg-emerald-900 text-white rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
          <Award className="w-4 h-4" />
          Game Theory Solution Concept
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-white">
              Nash Equilibrium: Balanced / Balanced
            </h3>
            <p className="text-emerald-200 text-xs mt-1">
              Mutual Payoffs: (9, 9) • Stable under all unilateral deviations
            </p>
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-emerald-800 border border-emerald-700 text-xs font-mono font-bold text-emerald-100 flex items-center gap-1.5 self-start md:self-auto">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            Pareto &amp; Nash Optimal
          </div>
        </div>

        <blockquote className="p-3.5 bg-emerald-950/60 border-l-4 border-emerald-400 rounded text-xs text-emerald-100 italic leading-relaxed">
          &ldquo;At Nash Equilibrium, no player can improve their payoff by changing their strategy
          alone while the other player&apos;s strategy remains unchanged.&rdquo;
        </blockquote>

        {/* Viva Proof Box */}
        <div className="bg-emerald-950/40 p-4 rounded-lg border border-emerald-800 text-xs text-emerald-100 space-y-2">
          <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            Mathematical Proof for Viva Examination:
          </div>
          <ol className="list-decimal pl-5 space-y-1.5 text-emerald-100/90 leading-relaxed">
            <li>
              Assume <strong>Candidate B</strong> chooses <strong>Balanced</strong>:
              <ul className="list-disc pl-4 mt-0.5 space-y-0.5 text-emerald-200/80">
                <li>If Candidate A plays Cooperative: Payoff = <strong>8</strong></li>
                <li>If Candidate A plays Leader: Payoff = <strong>7</strong></li>
                <li>If Candidate A plays Balanced: Payoff = <strong>9</strong> (Highest!)</li>
              </ul>
              Hence, Candidate A&apos;s <em>Best Response</em> to Balanced is <strong>Balanced</strong>.
            </li>
            <li>
              By symmetry, if <strong>Candidate A</strong> plays <strong>Balanced</strong>, Candidate
              B&apos;s <em>Best Response</em> is also <strong>Balanced</strong> (payoff = 9).
            </li>
            <li>
              Because neither candidate can unilaterally deviate to gain a higher payoff (8 &lt; 9 and 7
              &lt; 9), <strong>(Balanced, Balanced)</strong> is mathematically stable and self-enforcing!
            </li>
          </ol>
        </div>
      </div>

      {/* Scoring Engine Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          Complete Mathematical Scoring Engine
        </h3>
        <p className="text-xs text-slate-500">
          Formula implemented in scoring engine:
          <code className="ml-2 font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
            Final Score = Base Score + Group Effect + Strategy Payoff
          </code>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-2">
              1. Base Individual Score
            </h4>
            <ul className="text-xs space-y-1 text-slate-600">
              <li className="flex justify-between">
                <span>Balanced:</span>
                <span className="font-mono font-bold text-emerald-600">85 pts</span>
              </li>
              <li className="flex justify-between">
                <span>Cooperative:</span>
                <span className="font-mono font-bold text-blue-600">80 pts</span>
              </li>
              <li className="flex justify-between">
                <span>Leader:</span>
                <span className="font-mono font-bold text-purple-600">75 pts</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-2">
              2. Group Synergy Effects
            </h4>
            <ul className="text-xs space-y-1.5 text-slate-600">
              <li>
                <strong className="text-emerald-700">+5 pts Cooperation Bonus:</strong> If most
                candidates choose Cooperative or Balanced.
              </li>
              <li>
                <strong className="text-red-700">-5 pts Clash Penalty:</strong> Deducted from each
                Leader if 2 or more candidates pick Leader.
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-2">
              3. Strategic Payoff &amp; Bonus
            </h4>
            <ul className="text-xs space-y-1.5 text-slate-600">
              <li>
                <strong className="text-indigo-700">Matrix Interaction (4–9 pts):</strong> Average
                pairwise payoff earned against fellow group members.
              </li>
              <li>
                <strong className="text-slate-700">Participation Bonus (0–5 pts):</strong> Reproducible
                micro-variation preserving tie-breaking integrity.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
