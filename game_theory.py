"""
game_theory.py - Game Theory Engine Module
Game Theory Based Group Interview & Candidate Selection System
"""

from typing import Dict, Tuple, List, Any

# 1. STRATEGY DEFINITIONS
STRATEGIES = ["Cooperative", "Leader", "Balanced"]

STRATEGY_DESCRIPTIONS = {
    "Leader": "The candidate tries to lead the discussion and contribute frequently.",
    "Cooperative": "The candidate listens to others, supports useful ideas, and contributes constructively.",
    "Balanced": "The candidate participates regularly while also allowing others to contribute."
}

# 2. 2-PLAYER PAYOFF MATRIX (Predefined as per project specifications)
# Format: (Player A Strategy, Player B Strategy) -> (Player A Payoff, Player B Payoff)
# Candidate A / Candidate B | Cooperative | Leader | Balanced
# Cooperative               | (8, 8)      | (5, 9) | (8, 7)
# Leader                    | (9, 5)      | (4, 4) | (7, 6)
# Balanced                  | (7, 8)      | (6, 7) | (9, 9)

PAYOFF_MATRIX: Dict[Tuple[str, str], Tuple[int, int]] = {
    ("Cooperative", "Cooperative"): (8, 8),
    ("Cooperative", "Leader"): (5, 9),
    ("Cooperative", "Balanced"): (8, 7),
    ("Leader", "Cooperative"): (9, 5),
    ("Leader", "Leader"): (4, 4),
    ("Leader", "Balanced"): (7, 6),
    ("Balanced", "Cooperative"): (7, 8),
    ("Balanced", "Leader"): (6, 7),
    ("Balanced", "Balanced"): (9, 9),
}


def get_payoff(strategy_a: str, strategy_b: str) -> Tuple[int, int]:
    """Returns the payoff tuple (payoff_a, payoff_b) for a 2-player encounter."""
    return PAYOFF_MATRIX.get((strategy_a, strategy_b), (0, 0))


def find_2player_nash_equilibria() -> List[Dict[str, Any]]:
    """
    Computes pure-strategy Nash Equilibria for the 2-player payoff matrix.
    An outcome (sA*, sB*) is a Nash Equilibrium if:
    payoff_A(sA*, sB*) >= payoff_A(s, sB*) for all s in STRATEGIES, and
    payoff_B(sA*, sB*) >= payoff_B(sA*, s) for all s in STRATEGIES.
    """
    equilibria = []
    for s_a in STRATEGIES:
        for s_b in STRATEGIES:
            cur_a_payoff, cur_b_payoff = get_payoff(s_a, s_b)
            
            # Check if Player A has incentive to unilaterally deviate
            best_a = max(get_payoff(s, s_b)[0] for s in STRATEGIES)
            # Check if Player B has incentive to unilaterally deviate
            best_b = max(get_payoff(s_a, s)[1] for s in STRATEGIES)
            
            if cur_a_payoff >= best_a and cur_b_payoff >= best_b:
                equilibria.append({
                    "strategy_a": s_a,
                    "strategy_b": s_b,
                    "payoffs": (cur_a_payoff, cur_b_payoff),
                    "label": f"{s_a} / {s_b}"
                })
    return equilibria


def calculate_candidate_payoff(
    candidate_strategy: str,
    peer_strategies: List[str]
) -> float:
    """
    Calculates a candidate's strategy payoff within their group.
    Computed as the average payoff against each peer in the group.
    If solo (no peers), returns the self-encounter payoff.
    """
    if not peer_strategies:
        return float(get_payoff(candidate_strategy, candidate_strategy)[0])
    
    total_payoff = sum(get_payoff(candidate_strategy, p_strat)[0] for p_strat in peer_strategies)
    return round(total_payoff / len(peer_strategies), 2)


def calculate_best_response_for_candidate(
    candidate_strategy: str,
    peer_strategies: List[str]
) -> Dict[str, Any]:
    """
    Computes the Best Response for a candidate given the strategies chosen by peers.
    Tests all 3 potential strategies against the peers' chosen strategies,
    identifies which strategy yields the highest payoff, and checks if the candidate's
    current choice is already a best response.
    """
    current_payoff = calculate_candidate_payoff(candidate_strategy, peer_strategies)
    
    payoffs_by_strategy = {}
    for strat in STRATEGIES:
        payoffs_by_strategy[strat] = calculate_candidate_payoff(strat, peer_strategies)
        
    best_strategy = max(payoffs_by_strategy, key=payoffs_by_strategy.get)
    best_payoff = payoffs_by_strategy[best_strategy]
    
    is_best_response = (candidate_strategy == best_strategy) or (current_payoff >= best_payoff)

    return {
        "current_strategy": candidate_strategy,
        "current_payoff": current_payoff,
        "best_response": best_strategy,
        "best_payoff": best_payoff,
        "is_best_response": is_best_response,
        "all_payoffs": payoffs_by_strategy
    }
