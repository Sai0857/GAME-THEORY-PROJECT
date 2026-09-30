export type Strategy = 'Leader' | 'Cooperative' | 'Balanced';

export interface Candidate {
  candidate_id: string;
  name: string;
  strategy: Strategy;
}

export interface CandidateGroup {
  group_id: number;
  group_name: string;
  candidates: Candidate[];
  size: number;
}

export interface EvaluatedCandidate {
  candidate_id: string;
  name: string;
  group_id: number;
  group_name: string;
  strategy: Strategy;
  individual_score: number;
  cooperation_bonus: number;
  competition_penalty: number;
  participation_bonus: number;
  group_effect: number;
  strategy_payoff: number;
  final_score: number;
  best_response: Strategy;
  is_best_response: boolean;
  best_payoff: number;
  rank?: number;
  selected_round_2?: boolean;
  status?: string;
}

export interface EvaluatedGroup {
  group_id: number;
  group_name: string;
  candidates: EvaluatedCandidate[];
  coop_count: number;
  bal_count: number;
  leader_count: number;
  cooperation_bonus_awarded: boolean;
  competition_penalty_applied: boolean;
  avg_score: number;
  highest_score: number;
  lowest_score: number;
  cooperation_level_pct: number;
}

export type ActiveTab =
  | 'admin'
  | 'interview'
  | 'matrix'
  | 'best_response'
  | 'group_results'
  | 'ranking'
  | 'dashboard'
  | 'viva'
  | 'code';
