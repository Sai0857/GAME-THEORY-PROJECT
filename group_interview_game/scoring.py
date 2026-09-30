"""
scoring.py - Scoring and Ranking Engine
Game Theory Based Group Interview & Candidate Selection System
"""

import random
from typing import List, Dict, Any
from game_theory import (
    calculate_candidate_payoff,
    calculate_best_response_for_candidate
)

BASE_SCORES = {
    "Leader": 75,
    "Cooperative": 80,
    "Balanced": 85
}

FIXED_RANDOM_SEED = 42


def evaluate_group_interview(
    group: Dict[str, Any],
    seed: int = FIXED_RANDOM_SEED
) -> Dict[str, Any]:
    """
    Evaluates candidates in a single group interview based on Game Theory scoring rules:
    1. Base Individual Score:
       Leader = 75, Cooperative = 80, Balanced = 85
    2. Group Effect:
       - Cooperation Bonus: +5 to all candidates if majority chose Cooperative or Balanced
       - Competition Penalty: -5 to Leader candidates if 2 or more chose Leader
       - Participation Bonus: pseudo-random variation between 0.0 and 5.0 with fixed seed
    3. Strategy Payoff:
       Average payoff earned from peer interactions according to the 2-player matrix
    4. Final Score = Base Score + Group Effect + Strategy Payoff (clamped to [0, 100])
    """
    candidates = group["candidates"]
    group_size = len(candidates)
    
    strategies = [c.get("strategy", "Balanced") for c in candidates]
    
    coop_count = strategies.count("Cooperative")
    bal_count = strategies.count("Balanced")
    leader_count = strategies.count("Leader")
    
    # Cooperation Bonus: If most candidates choose Cooperative or Balanced
    # i.e., (coop_count + bal_count) > group_size / 2
    cooperation_bonus = 5 if (coop_count + bal_count) > (group_size / 2) else 0
    
    # Competition Penalty: If too many candidates choose Leader (2 or more)
    has_competition_penalty = leader_count >= 2

    evaluated_candidates = []
    
    for idx, c in enumerate(candidates):
        cid = c["candidate_id"]
        cname = c["name"]
        strategy = c.get("strategy", "Balanced")
        
        base_score = BASE_SCORES.get(strategy, 80)
        
        # Peer strategies for game theory payoff calculation
        peer_strategies = [s for i, s in enumerate(strategies) if i != idx]
        strategy_payoff = calculate_candidate_payoff(strategy, peer_strategies)
        best_resp_info = calculate_best_response_for_candidate(strategy, peer_strategies)
        
        # Candidate specific group effect
        penalty = -5 if (strategy == "Leader" and has_competition_penalty) else 0
        
        # Reproducible participation bonus using seeded RNG keyed on seed + candidate ID
        char_hash = sum(ord(ch) for ch in cid)
        rng = random.Random(seed + char_hash)
        participation_bonus = round(rng.uniform(0.5, 4.8), 2)
        
        total_group_effect = round(cooperation_bonus + penalty + participation_bonus, 2)
        
        # Final Score = Individual Score + Group Effect + Strategy Payoff
        raw_final_score = base_score + total_group_effect + strategy_payoff
        final_score = round(min(100.0, max(0.0, raw_final_score)), 2)
        
        evaluated_candidates.append({
            "candidate_id": cid,
            "name": cname,
            "group_id": group["group_id"],
            "group_name": group["group_name"],
            "strategy": strategy,
            "individual_score": base_score,
            "cooperation_bonus": cooperation_bonus,
            "competition_penalty": penalty,
            "participation_bonus": participation_bonus,
            "group_effect": total_group_effect,
            "strategy_payoff": strategy_payoff,
            "final_score": final_score,
            "best_response": best_resp_info["best_response"],
            "is_best_response": best_resp_info["is_best_response"],
            "best_payoff": best_resp_info["best_payoff"]
        })
        
    scores = [c["final_score"] for c in evaluated_candidates]
    avg_score = round(sum(scores) / len(scores), 2) if scores else 0
    highest_score = max(scores) if scores else 0
    lowest_score = min(scores) if scores else 0
    cooperation_level_pct = round(((coop_count + bal_count) / group_size) * 100, 1) if group_size else 0

    return {
        "group_id": group["group_id"],
        "group_name": group["group_name"],
        "candidates": evaluated_candidates,
        "coop_count": coop_count,
        "bal_count": bal_count,
        "leader_count": leader_count,
        "cooperation_bonus_awarded": cooperation_bonus > 0,
        "competition_penalty_applied": has_competition_penalty,
        "avg_score": avg_score,
        "highest_score": highest_score,
        "lowest_score": lowest_score,
        "cooperation_level_pct": cooperation_level_pct
    }


def rank_and_select_candidates(
    all_evaluated_candidates: List[Dict[str, Any]],
    num_to_select: int = 30
) -> List[Dict[str, Any]]:
    """
    Ranks all candidates from highest final score to lowest.
    Ties are broken deterministically by candidate_id ascending.
    Flags the top `num_to_select` candidates as Selected for Round 2.
    """
    # Deterministic sorting: final_score DESC, candidate_id ASC
    sorted_candidates = sorted(
        all_evaluated_candidates,
        key=lambda c: (-c["final_score"], c["candidate_id"])
    )
    
    ranked_list = []
    for rank_idx, c in enumerate(sorted_candidates, start=1):
        c_copy = dict(c)
        c_copy["rank"] = rank_idx
        is_selected = rank_idx <= num_to_select
        c_copy["selected_round_2"] = is_selected
        c_copy["status"] = "Selected for Round 2" if is_selected else "Not Selected"
        ranked_list.append(c_copy)
        
    return ranked_list
