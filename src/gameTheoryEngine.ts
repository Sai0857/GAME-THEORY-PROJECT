import { Candidate, CandidateGroup, EvaluatedCandidate, EvaluatedGroup, Strategy } from './types';

export const STRATEGIES: Strategy[] = ['Cooperative', 'Leader', 'Balanced'];

export const STRATEGY_DESCRIPTIONS: Record<Strategy, string> = {
  Leader: 'The candidate tries to lead the discussion and contribute frequently.',
  Cooperative: 'The candidate listens to others, supports useful ideas, and contributes constructively.',
  Balanced: 'The candidate participates regularly while also allowing others to contribute.'
};

export const BASE_SCORES: Record<Strategy, number> = {
  Leader: 75,
  Cooperative: 80,
  Balanced: 85
};

// 2-Player Simplified Payoff Matrix
// (Strategy A, Strategy B) -> [Payoff A, Payoff B]
export const PAYOFF_MATRIX: Record<string, [number, number]> = {
  'Cooperative-Cooperative': [8, 8],
  'Cooperative-Leader': [5, 9],
  'Cooperative-Balanced': [8, 7],
  'Leader-Cooperative': [9, 5],
  'Leader-Leader': [4, 4],
  'Leader-Balanced': [7, 6],
  'Balanced-Cooperative': [7, 8],
  'Balanced-Leader': [6, 7],
  'Balanced-Balanced': [9, 9]
};

export function get2PlayerPayoff(stratA: Strategy, stratB: Strategy): [number, number] {
  const key = `${stratA}-${stratB}`;
  return PAYOFF_MATRIX[key] || [0, 0];
}

export function calculateCandidatePayoff(candidateStrategy: Strategy, peerStrategies: Strategy[]): number {
  if (!peerStrategies || peerStrategies.length === 0) {
    return get2PlayerPayoff(candidateStrategy, candidateStrategy)[0];
  }
  const total = peerStrategies.reduce((sum, pStrat) => {
    return sum + get2PlayerPayoff(candidateStrategy, pStrat)[0];
  }, 0);
  return Number((total / peerStrategies.length).toFixed(2));
}

export function calculateBestResponse(candidateStrategy: Strategy, peerStrategies: Strategy[]) {
  const payoffsByStrategy: Record<Strategy, number> = {
    Cooperative: calculateCandidatePayoff('Cooperative', peerStrategies),
    Leader: calculateCandidatePayoff('Leader', peerStrategies),
    Balanced: calculateCandidatePayoff('Balanced', peerStrategies)
  };

  let bestStrat: Strategy = 'Balanced';
  let bestVal = -Infinity;

  for (const s of STRATEGIES) {
    if (payoffsByStrategy[s] > bestVal) {
      bestVal = payoffsByStrategy[s];
      bestStrat = s;
    }
  }

  const currentPayoff = payoffsByStrategy[candidateStrategy];
  const isBest = currentPayoff >= bestVal || candidateStrategy === bestStrat;

  return {
    bestResponse: bestStrat,
    bestPayoff: bestVal,
    isBestResponse: isBest,
    currentPayoff
  };
}

// Pseudo-random deterministic generator for participation bonus
function seededRandom(seed: number): number {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function evaluateGroup(group: CandidateGroup, globalSeed: number = 42): EvaluatedGroup {
  const { candidates } = group;
  const groupSize = candidates.length;
  const strategies = candidates.map((c) => c.strategy);

  const coopCount = strategies.filter((s) => s === 'Cooperative').length;
  const balCount = strategies.filter((s) => s === 'Balanced').length;
  const leaderCount = strategies.filter((s) => s === 'Leader').length;

  // Cooperation Bonus: If most candidates choose Cooperative or Balanced
  const cooperationBonus = coopCount + balCount > groupSize / 2 ? 5 : 0;
  // Competition Penalty: If 2 or more choose Leader
  const hasCompetitionPenalty = leaderCount >= 2;

  const evaluatedCandidates: EvaluatedCandidate[] = candidates.map((c, idx) => {
    const peerStrats = strategies.filter((_, i) => i !== idx);
    const strategyPayoff = calculateCandidatePayoff(c.strategy, peerStrats);
    const bestRespInfo = calculateBestResponse(c.strategy, peerStrats);

    const baseScore = BASE_SCORES[c.strategy];
    const penalty = c.strategy === 'Leader' && hasCompetitionPenalty ? -5 : 0;

    // Deterministic participation bonus between 0.5 and 4.8
    let charCodeSum = 0;
    for (let i = 0; i < c.candidate_id.length; i++) {
      charCodeSum += c.candidate_id.charCodeAt(i);
    }
    const randVal = seededRandom(globalSeed + charCodeSum);
    const participationBonus = Number((0.5 + randVal * 4.3).toFixed(2));

    const totalGroupEffect = Number((cooperationBonus + penalty + participationBonus).toFixed(2));
    const rawFinalScore = baseScore + totalGroupEffect + strategyPayoff;
    const finalScore = Number(Math.min(100, Math.max(0, rawFinalScore)).toFixed(2));

    return {
      candidate_id: c.candidate_id,
      name: c.name,
      group_id: group.group_id,
      group_name: group.group_name,
      strategy: c.strategy,
      individual_score: baseScore,
      cooperation_bonus: cooperationBonus,
      competition_penalty: penalty,
      participation_bonus: participationBonus,
      group_effect: totalGroupEffect,
      strategy_payoff: strategyPayoff,
      final_score: finalScore,
      best_response: bestRespInfo.bestResponse,
      is_best_response: bestRespInfo.isBestResponse,
      best_payoff: bestRespInfo.bestPayoff
    };
  });

  const scores = evaluatedCandidates.map((c) => c.final_score);
  const avgScore = Number((scores.reduce((a, b) => a + b, 0) / (scores.length || 1)).toFixed(2));
  const highestScore = Math.max(...scores, 0);
  const lowestScore = Math.min(...scores, 100);
  const cooperationLevelPct = Number((((coopCount + balCount) / (groupSize || 1)) * 100).toFixed(1));

  return {
    group_id: group.group_id,
    group_name: group.group_name,
    candidates: evaluatedCandidates,
    coop_count: coopCount,
    bal_count: balCount,
    leader_count: leaderCount,
    cooperation_bonus_awarded: cooperationBonus > 0,
    competition_penalty_applied: hasCompetitionPenalty,
    avg_score: avgScore,
    highest_score: highestScore,
    lowest_score: lowestScore,
    cooperation_level_pct: cooperationLevelPct
  };
}

export function rankCandidates(
  allCandidates: EvaluatedCandidate[],
  numToSelect: number = 30
): EvaluatedCandidate[] {
  // Sort descending by final_score, then ascending by candidate_id for deterministic ties
  const sorted = [...allCandidates].sort((a, b) => {
    if (b.final_score !== a.final_score) {
      return b.final_score - a.final_score;
    }
    return a.candidate_id.localeCompare(b.candidate_id);
  });

  return sorted.map((cand, idx) => {
    const rank = idx + 1;
    const isSelected = rank <= numToSelect;
    return {
      ...cand,
      rank,
      selected_round_2: isSelected,
      status: isSelected ? 'Selected for Round 2' : 'Not Selected'
    };
  });
}

export const SAMPLE_CANDIDATE_NAMES = [
  'Rahul Sharma', 'Priya Patel', 'Amit Verma', 'Sneha Kulkarni', 'Rohan Iyer',
  'Ananya Roy', 'Vikram Singh', 'Pooja Nair', 'Arjun Mehta', 'Kavita Rao',
  'Siddharth Gupta', 'Neha Joshi', 'Karan Malhotra', 'Divya Deshmukh', 'Aditya Saxena',
  'Tanvi Bhatt', 'Manish Tiwari', 'Ritu Agarwal', 'Gaurav Reddy', 'Shweta Pandey',
  'Naveen Pillai', 'Aishwarya Sen', 'Varun Chopra', 'Meera Nambiar', 'Kunal Ghosh',
  'Deepika Jain', 'Harsh Vardhan', 'Simran Kaur', 'Nikhil Bhatia', 'Rashmi Mishra',
  'Abhishek Dubey', 'Sunita Menon', 'Prateek Shinde', 'Ishita Das', 'Saurabh Yadav',
  'Bhavna Sethi', 'Tarun Kapoor', 'Alka Choudhury', 'Vivek Natarajan', 'Monika Trivedi',
  'Rajat Bansal', 'Komal Soni', 'Sachin Hegde', 'Pallavi Chatterjee', 'Mayank Rawat',
  'Gayatri Prabhu', 'Mohit Chauhan', 'Swati Kaushik', 'Deepak Varma', 'Payal Goswami',
  'Chetan Saxena', 'Anjali Pillai', 'Lalit Thakur', 'Madhuri Patil', 'Hemant Kumar',
  'Vandana Shukla', 'Jatin Mathur', 'Richa Singhal', 'Umesh Namboodiri', 'Geeta Ramachandran'
];

export function generateCandidates(count: number): Candidate[] {
  const result: Candidate[] = [];
  const defaultStrategies: Strategy[] = ['Balanced', 'Cooperative', 'Balanced', 'Leader', 'Balanced'];

  for (let i = 1; i <= count; i++) {
    const idNum = String(i).padStart(3, '0');
    const cid = `C${idNum}`;
    const name = i <= SAMPLE_CANDIDATE_NAMES.length ? SAMPLE_CANDIDATE_NAMES[i - 1] : `Candidate ${i}`;
    const strat = defaultStrategies[(i - 1) % defaultStrategies.length];
    result.push({
      candidate_id: cid,
      name,
      strategy: strat
    });
  }
  return result;
}

export function partitionIntoGroups(candidates: Candidate[], groupSize: number): CandidateGroup[] {
  const gSize = Math.max(2, groupSize);
  const groups: CandidateGroup[] = [];
  let groupNum = 1;

  for (let i = 0; i < candidates.length; i += gSize) {
    const chunk = candidates.slice(i, i + gSize);
    groups.push({
      group_id: groupNum,
      group_name: `Group ${groupNum}`,
      candidates: chunk,
      size: chunk.length
    });
    groupNum++;
  }

  return groups;
}
