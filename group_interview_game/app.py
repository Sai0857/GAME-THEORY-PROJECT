"""
app.py - Main Streamlit Application
Game Theory Based Group Interview & Candidate Selection System
College Viva-Ready Demonstration System
"""

import streamlit as st
import pandas as pd
import random
from typing import List, Dict, Any

from data import (
    load_candidates_from_csv,
    generate_default_candidates,
    create_groups,
    save_candidates_to_csv
)
from game_theory import (
    STRATEGIES,
    STRATEGY_DESCRIPTIONS,
    PAYOFF_MATRIX,
    get_payoff,
    find_2player_nash_equilibria,
    calculate_candidate_payoff,
    calculate_best_response_for_candidate
)
from scoring import (
    evaluate_group_interview,
    rank_and_select_candidates,
    BASE_SCORES,
    FIXED_RANDOM_SEED
)

# Page configuration
st.set_page_config(
    page_title="Game Theory Group Interview System",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Session state initialization
if "num_candidates" not in st.session_state:
    st.session_state.num_candidates = 60
if "group_size" not in st.session_state:
    st.session_state.group_size = 5
if "num_to_select" not in st.session_state:
    st.session_state.num_to_select = 30
if "random_seed" not in st.session_state:
    st.session_state.random_seed = FIXED_RANDOM_SEED
if "candidates" not in st.session_state:
    st.session_state.candidates = load_candidates_from_csv()
if "candidate_strategies" not in st.session_state:
    # Default strategy is Balanced or realistic distribution
    rng = random.Random(42)
    default_strats = {}
    for c in st.session_state.candidates:
        # 50% Balanced, 30% Cooperative, 20% Leader for initial sensible baseline
        default_strats[c["candidate_id"]] = rng.choices(
            ["Balanced", "Cooperative", "Leader"], weights=[0.5, 0.3, 0.2]
        )[0]
    st.session_state.candidate_strategies = default_strats
if "interview_started" not in st.session_state:
    st.session_state.interview_started = True

INTERVIEW_TOPIC = "Should Artificial Intelligence replace human employees?"

# ----------------- SIDEBAR -----------------
with st.sidebar:
    st.title("🎓 Navigation")
    menu = st.radio(
        "Go to Step:",
        [
            "1. Admin Setup & Registration",
            "2. Group Interview & Strategies",
            "3. Payoff Matrix & Nash Equilibrium",
            "4. Best Response Analysis",
            "5. Group Results",
            "6. Final Ranking & Top 30",
            "7. Analytical Dashboard",
            "8. Game Theory Concepts (Viva Guide)"
        ]
    )

    st.markdown("---")
    st.subheader("⚙️ Simulation Settings")
    new_n = st.number_input("Number of Candidates", min_value=5, max_value=120, value=st.session_state.num_candidates, step=5)
    new_g = st.number_input("Group Size", min_value=2, max_value=10, value=st.session_state.group_size, step=1)
    new_sel = st.number_input("Candidates to Select (Round 2)", min_value=1, max_value=120, value=st.session_state.num_to_select, step=1)
    
    if st.button("Apply Settings / Reset Data", use_container_width=True):
        st.session_state.num_candidates = new_n
        st.session_state.group_size = new_g
        st.session_state.num_to_select = new_sel
        st.session_state.candidates = generate_default_candidates(new_n)
        
        # Reset strategies
        rng = random.Random(st.session_state.random_seed)
        st.session_state.candidate_strategies = {
            c["candidate_id"]: rng.choices(
                ["Balanced", "Cooperative", "Leader"], weights=[0.5, 0.3, 0.2]
            )[0] for c in st.session_state.candidates
        }
        st.success("Settings applied and candidates regenerated!")

# Synchronize candidates with strategies
for c in st.session_state.candidates:
    cid = c["candidate_id"]
    if cid not in st.session_state.candidate_strategies:
        st.session_state.candidate_strategies[cid] = "Balanced"
    c["strategy"] = st.session_state.candidate_strategies[cid]

# Form groups
groups = create_groups(st.session_state.candidates, st.session_state.group_size)

# Evaluate all groups
evaluated_groups = [
    evaluate_group_interview(g, seed=st.session_state.random_seed)
    for g in groups
]

# Flatten evaluated candidates
all_evaluated = []
for eg in evaluated_groups:
    all_evaluated.extend(eg["candidates"])

# Rank candidates
ranked_candidates = rank_and_select_candidates(
    all_evaluated,
    num_to_select=st.session_state.num_to_select
)

# ----------------- PAGE 1: ADMIN SETUP -----------------
if menu == "1. Admin Setup & Registration":
    st.title("Game Theory Based Group Interview")
    st.caption("College Project for Game Theory Subject")
    
    st.info(
        "💡 **Explanation**: Simulate a group interview where candidates make strategic decisions. "
        "The system evaluates individual and group performance using Game Theory principles and selects the "
        f"Top {st.session_state.num_to_select} candidates for the next round."
    )
    
    col1, col2, col3 = st.columns(3)
    col1.metric("Candidates", len(st.session_state.candidates), "Default: 60")
    col2.metric("Group Size", st.session_state.group_size, f"{len(groups)} Total Groups")
    col3.metric("Selected for Round 2", st.session_state.num_to_select, "Top performers")
    
    st.markdown("### 📋 Candidate Registration & Group Allocation")
    st.write(f"Displaying all **{len(st.session_state.candidates)}** registered candidates divided into **{len(groups)}** groups:")
    
    tab_list, tab_groups = st.tabs(["All Candidates Table", "Group-by-Group View"])
    
    with tab_list:
        df_c = pd.DataFrame([
            {
                "Candidate ID": c["candidate_id"],
                "Candidate Name": c["name"],
                "Assigned Group": f"Group {((i // st.session_state.group_size) + 1)}",
                "Assigned Strategy": c["strategy"]
            }
            for i, c in enumerate(st.session_state.candidates)
        ])
        st.dataframe(df_c, use_container_width=True, height=400)
    
    with tab_groups:
        cols = st.columns(3)
        for idx, g in enumerate(groups):
            col = cols[idx % 3]
            with col:
                st.markdown(f"**🏢 {g['group_name']}** ({g['size']} candidates)")
                for mem in g["candidates"]:
                    st.text(f"• {mem['candidate_id']} — {mem['name']}")
                st.markdown("---")

    if st.button("Start Interview 🚀", type="primary", use_container_width=True):
        st.session_state.interview_started = True
        st.success("Group interview session is active! Navigate to '2. Group Interview & Strategies' to observe or change decisions.")

# ----------------- PAGE 2: GROUP INTERVIEW -----------------
elif menu == "2. Group Interview & Strategies":
    st.title("🎙️ Group Interview & Strategy Selection")
    st.markdown(f"**Interview Topic**: *\"{INTERVIEW_TOPIC}\"*")
    st.caption("Each candidate chooses exactly one strategic stance during the group discussion.")
    
    st.markdown("#### Available Strategies:")
    s_col1, s_col2, s_col3 = st.columns(3)
    with s_col1:
        st.markdown("**1. LEADER** (Base: 75 pts)")
        st.caption(STRATEGY_DESCRIPTIONS["Leader"])
        st.write("⚠️ *High risk*: Penaltized if multiple leaders clash.")
    with s_col2:
        st.markdown("**2. COOPERATIVE** (Base: 80 pts)")
        st.caption(STRATEGY_DESCRIPTIONS["Cooperative"])
        st.write("🤝 *High synergy*: Fosters cooperation bonus.")
    with s_col3:
        st.markdown("**3. BALANCED** (Base: 85 pts)")
        st.caption(STRATEGY_DESCRIPTIONS["Balanced"])
        st.write("⚖️ *Equilibrium strategy*: Balances self & group.")

    st.markdown("---")
    st.subheader("⚡ Bulk Strategy Presets for Quick Testing")
    bcol1, bcol2, bcol3, bcol4 = st.columns(4)
    if bcol1.button("All Balanced (Nash Equilibrium)", use_container_width=True):
        for cid in st.session_state.candidate_strategies:
            st.session_state.candidate_strategies[cid] = "Balanced"
        st.rerun()
    if bcol2.button("Leader Conflict (All Leaders)", use_container_width=True):
        for cid in st.session_state.candidate_strategies:
            st.session_state.candidate_strategies[cid] = "Leader"
        st.rerun()
    if bcol3.button("All Cooperative", use_container_width=True):
        for cid in st.session_state.candidate_strategies:
            st.session_state.candidate_strategies[cid] = "Cooperative"
        st.rerun()
    if bcol4.button("Randomized Mix", use_container_width=True):
        for cid in st.session_state.candidate_strategies:
            st.session_state.candidate_strategies[cid] = random.choice(STRATEGIES)
        st.rerun()

    st.markdown("---")
    st.subheader("Interactive Strategy Selector by Group")
    selected_grp_idx = st.selectbox(
        "Select Group to Inspect or Edit Strategies:",
        options=range(len(groups)),
        format_func=lambda i: f"{groups[i]['group_name']} ({groups[i]['size']} members)"
    )
    
    curr_grp = groups[selected_grp_idx]
    st.markdown(f"### {curr_grp['group_name']} Discussion Table")
    
    col_cands = st.columns(curr_grp["size"])
    for i, member in enumerate(curr_grp["candidates"]):
        cid = member["candidate_id"]
        with col_cands[i]:
            st.info(f"**{cid}**\n\n{member['name']}")
            current_s = st.session_state.candidate_strategies[cid]
            new_strat = st.selectbox(
                f"Strategy for {cid}",
                options=STRATEGIES,
                index=STRATEGIES.index(current_s),
                key=f"strat_{cid}"
            )
            if new_strat != current_s:
                st.session_state.candidate_strategies[cid] = new_strat
                st.rerun()

# ----------------- PAGE 3: PAYOFF MATRIX & NASH -----------------
elif menu == "3. Payoff Matrix & Nash Equilibrium":
    st.title("📊 Game Theory Model & Payoff Matrix")
    st.markdown(
        "In Game Theory, decisions are modeled using **Players**, **Strategies**, and **Payoffs**. "
        "Below is the predefined 2-player normal-form payoff matrix that governs pairwise strategic interaction in the interview."
    )
    
    st.subheader("Two-Player Normal Form Payoff Matrix")
    st.caption("Format: (Candidate A Payoff, Candidate B Payoff)")
    
    matrix_data = {
        "Candidate A Strategy": ["Cooperative", "Leader", "Balanced"],
        "Cooperative (B)": [
            f"({PAYOFF_MATRIX[('Cooperative', 'Cooperative')][0]}, {PAYOFF_MATRIX[('Cooperative', 'Cooperative')][1]})",
            f"({PAYOFF_MATRIX[('Leader', 'Cooperative')][0]}, {PAYOFF_MATRIX[('Leader', 'Cooperative')][1]})",
            f"({PAYOFF_MATRIX[('Balanced', 'Cooperative')][0]}, {PAYOFF_MATRIX[('Balanced', 'Cooperative')][1]})"
        ],
        "Leader (B)": [
            f"({PAYOFF_MATRIX[('Cooperative', 'Leader')][0]}, {PAYOFF_MATRIX[('Cooperative', 'Leader')][1]})",
            f"({PAYOFF_MATRIX[('Leader', 'Leader')][0]}, {PAYOFF_MATRIX[('Leader', 'Leader')][1]})",
            f"({PAYOFF_MATRIX[('Balanced', 'Leader')][0]}, {PAYOFF_MATRIX[('Balanced', 'Leader')][1]})"
        ],
        "Balanced (B)": [
            f"({PAYOFF_MATRIX[('Cooperative', 'Balanced')][0]}, {PAYOFF_MATRIX[('Cooperative', 'Balanced')][1]})",
            f"({PAYOFF_MATRIX[('Leader', 'Balanced')][0]}, {PAYOFF_MATRIX[('Leader', 'Balanced')][1]})",
            f"({PAYOFF_MATRIX[('Balanced', 'Balanced')][0]}, {PAYOFF_MATRIX[('Balanced', 'Balanced')][1]})  ⭐ [NASH]"
        ]
    }
    df_matrix = pd.DataFrame(matrix_data)
    st.table(df_matrix.set_index("Candidate A Strategy"))
    
    st.info("💡 **Explanation**: The first value represents Candidate A's payoff and the second value represents Candidate B's payoff.")
    
    st.markdown("---")
    st.subheader("🎯 Mathematical Scoring Engine Breakdown")
    
    mcol1, mcol2, mcol3 = st.columns(3)
    with mcol1:
        st.markdown("**1. Base Individual Score**")
        st.markdown("• Leader: **75 pts**")
        st.markdown("• Cooperative: **80 pts**")
        st.markdown("• Balanced: **85 pts**")
    with mcol2:
        st.markdown("**2. Group Cooperation Bonus**")
        st.markdown("• If majority choose Cooperative or Balanced:")
        st.markdown("• **+5 pts** awarded to **every candidate** in the group.")
    with mcol3:
        st.markdown("**3. Competition Penalty**")
        st.markdown("• If 2 or more candidates choose Leader:")
        st.markdown("• **-5 pts** subtracted from **each Leader**.")

    st.markdown("---")
    st.subheader("⚖️ Nash Equilibrium Verification")
    nash_list = find_2player_nash_equilibria()
    
    for eq in nash_list:
        st.success(
            f"✅ **Pure Strategy Nash Equilibrium**: **{eq['label']}** with Payoffs **{eq['payoffs']}**"
        )
    
    st.markdown(
        """
        > **Definition**: *"At Nash Equilibrium, no player can improve their payoff by changing their strategy alone while the other player's strategy remains unchanged."*
        
        **Viva Proof:**
        1. If Candidate B plays **Balanced**:
           - Candidate A playing Cooperative gets **8**
           - Candidate A playing Leader gets **7**
           - Candidate A playing Balanced gets **9** (Highest! Maximum payoff = 9)
        2. By symmetry, if Candidate A plays **Balanced**, Candidate B's highest payoff is also by playing **Balanced** (getting 9).
        3. Neither candidate has any unilateral incentive to deviate. Thus, **(Balanced, Balanced)** is mathematically stable!
        """
    )

# ----------------- PAGE 4: BEST RESPONSE -----------------
elif menu == "4. Best Response Analysis":
    st.title("🎯 Candidate Best Response Analysis")
    st.markdown(
        "A **Best Response** is the strategic choice that produces the highest possible payoff for a player, "
        "given the exact choices selected by the other players in their group."
    )
    
    sel_g_id = st.selectbox(
        "Select Group to Analyze Best Response:",
        options=[eg["group_id"] for eg in evaluated_groups],
        format_func=lambda gid: f"Group {gid}"
    )
    
    target_eg = next(eg for eg in evaluated_groups if eg["group_id"] == sel_g_id)
    
    st.subheader(f"Strategy & Best Response Breakdown for Group {sel_g_id}")
    
    records = []
    for cand in target_eg["candidates"]:
        records.append({
            "Candidate ID": cand["candidate_id"],
            "Candidate Name": cand["name"],
            "Selected Strategy": cand["strategy"],
            "Payoff Earned": cand["strategy_payoff"],
            "Best Response Strategy": cand["best_response"],
            "Best Possible Payoff": cand["best_payoff"],
            "Is Best Response?": "✅ Yes (Optimal)" if cand["is_best_response"] else "⚠️ No (Sub-optimal)"
        })
    st.dataframe(pd.DataFrame(records), use_container_width=True)
    
    st.markdown("---")
    st.subheader("Candidate Spotlight Example")
    sample_cand = target_eg["candidates"][0]
    st.markdown(
        f"""
        **Candidate**: `{sample_cand['candidate_id']} — {sample_cand['name']}`  
        - **Current strategy**: `{sample_cand['strategy']}`  
        - **Current payoff**: `{sample_cand['strategy_payoff']}`  
        - **Best response**: `{sample_cand['best_response']}` (Yields: `{sample_cand['best_payoff']}`)  
        - **Result**: `{"Optimal Best Response Selected" if sample_cand['is_best_response'] else "Can improve payoff by switching to " + sample_cand['best_response']}`
        """
    )

# ----------------- PAGE 5: GROUP RESULTS -----------------
elif menu == "5. Group Results":
    st.title("📈 Group-by-Group Interview Results")
    st.caption("Inspect individual scores, group synergy effects, and final calculated marks.")
    
    sel_g_idx = st.selectbox(
        "Choose Group:",
        options=range(len(evaluated_groups)),
        format_func=lambda i: f"{evaluated_groups[i]['group_name']}"
    )
    
    g_data = evaluated_groups[sel_g_idx]
    
    # Metrics
    m1, m2, m3, m4 = st.columns(4)
    m1.metric("Average Score", f"{g_data['avg_score']:.1f}")
    m2.metric("Highest Score", f"{g_data['highest_score']:.1f}")
    m3.metric("Lowest Score", f"{g_data['lowest_score']:.1f}")
    m4.metric("Cooperation Level", f"{g_data['cooperation_level_pct']}%")
    
    st.progress(g_data["cooperation_level_pct"] / 100.0)
    
    if g_data["cooperation_bonus_awarded"]:
        st.success("🤝 **Cooperation Bonus Awarded (+5 pts)**: Most candidates chose Cooperative or Balanced strategies!")
    else:
        st.warning("⚠️ **No Cooperation Bonus**: Excessive rivalry or lack of cooperative consensus.")
        
    if g_data["competition_penalty_applied"]:
        st.error("⚔️ **Competition Penalty Applied (-5 pts to Leaders)**: Two or more candidates chose the Leader strategy, causing conflict!")

    st.markdown(f"#### {g_data['group_name']} Results Table")
    df_grp_res = pd.DataFrame([
        {
            "Candidate ID": c["candidate_id"],
            "Candidate Name": c["name"],
            "Strategy": c["strategy"],
            "Individual Score": c["individual_score"],
            "Group Effect": f"{c['group_effect']:+0.2f}",
            "Strategy Payoff": c["strategy_payoff"],
            "Final Score": c["final_score"]
        }
        for c in g_data["candidates"]
    ])
    st.dataframe(df_grp_res, use_container_width=True)

# ----------------- PAGE 6: FINAL RANKING & TOP 30 -----------------
elif menu == "6. Final Ranking & Top 30":
    st.title("🏆 Final Candidate Ranking & Selection")
    
    num_sel = st.session_state.num_to_select
    selected_candidates = [c for c in ranked_candidates if c["selected_round_2"]]
    unselected_candidates = [c for c in ranked_candidates if not c["selected_round_2"]]
    
    st.markdown(
        f"""
        <div style="background-color: #f0fdf4; border: 2px solid #22c55e; border-radius: 10px; padding: 18px; margin-bottom: 20px;">
            <h2 style="color: #15803d; margin: 0 0 10px 0;">🏆 SELECTED FOR ROUND 2</h2>
            <p style="font-size: 16px; color: #166534; margin: 0;">
                <b>{len(selected_candidates)}</b> candidates automatically selected out of <b>{len(ranked_candidates)}</b> total candidates based on Game Theory scoring.
            </p>
        </div>
        """,
        unsafe_allow_html=True
    )
    
    st.subheader(f"Top {num_sel} Candidates (Round 2 Qualifiers)")
    top_cols = st.columns(3)
    for idx, c in enumerate(selected_candidates):
        with top_cols[idx % 3]:
            st.markdown(
                f"**Rank {c['rank']}. {c['candidate_id']}** — {c['name']}  \n"
                f"Score: `{c['final_score']}` | Strat: `{c['strategy']}` | `{c['group_name']}`"
            )
            
    st.markdown("---")
    st.subheader("📊 Complete Candidate Leaderboard")
    st.caption("Sorted primarily by Final Score DESC, with Candidate ID ASC as deterministic tie-breaker.")
    
    df_all_ranked = pd.DataFrame([
        {
            "Rank": c["rank"],
            "Candidate ID": c["candidate_id"],
            "Candidate Name": c["name"],
            "Group": c["group_name"],
            "Strategy": c["strategy"],
            "Final Score": c["final_score"],
            "Status": c["status"]
        }
        for c in ranked_candidates
    ])
    st.dataframe(df_all_ranked, use_container_width=True, height=500)

# ----------------- PAGE 7: DASHBOARD -----------------
elif menu == "7. Analytical Dashboard":
    st.title("📊 Game Theory Analytics Dashboard")
    
    # Overall statistics
    all_scores = [c["final_score"] for c in ranked_candidates]
    c1, c2, c3, c4, c5 = st.columns(5)
    c1.metric("Total Candidates", len(ranked_candidates))
    c2.metric("Total Groups", len(groups))
    c3.metric("Average Score", f"{sum(all_scores)/len(all_scores):.2f}" if all_scores else "0")
    c4.metric("Highest Score", f"{max(all_scores):.2f}" if all_scores else "0")
    c5.metric("Round 2 Selected", st.session_state.num_to_select)
    
    st.markdown("---")
    
    col_chart1, col_chart2 = st.columns(2)
    
    with col_chart1:
        st.subheader("1. Strategy Distribution")
        strat_series = pd.Series([c["strategy"] for c in ranked_candidates]).value_counts()
        st.bar_chart(strat_series)
        st.caption("Count of candidates adopting Leader, Cooperative, and Balanced stances.")

    with col_chart2:
        st.subheader("2. Group Performance Comparison")
        grp_names = [eg["group_name"] for eg in evaluated_groups]
        grp_avgs = [eg["avg_score"] for eg in evaluated_groups]
        df_grp_chart = pd.DataFrame({"Average Score": grp_avgs}, index=grp_names)
        st.bar_chart(df_grp_chart)
        st.caption("Average final score achieved by each candidate group.")

    st.markdown("---")
    st.subheader("3. Round 2 Selection Distribution by Group")
    sel_by_grp = {}
    for eg in evaluated_groups:
        sel_by_grp[eg["group_name"]] = 0
    for c in ranked_candidates:
        if c["selected_round_2"]:
            sel_by_grp[c["group_name"]] = sel_by_grp.get(c["group_name"], 0) + 1
            
    df_sel_grp = pd.DataFrame({"Selected Count": list(sel_by_grp.values())}, index=list(sel_by_grp.keys()))
    st.bar_chart(df_sel_grp)
    st.caption("Number of candidates advancing to Round 2 from each interview group.")

# ----------------- PAGE 8: GAME THEORY CONCEPTS (VIVA GUIDE) -----------------
elif menu == "8. Game Theory Concepts (Viva Guide)":
    st.title("📖 Game Theory Concepts & Viva Preparation Guide")
    st.caption("Easy-to-understand reference designed for college project viva examinations.")
    
    st.markdown("### 🎓 Core Game Theory Fundamentals")
    
    col_v1, col_v2 = st.columns(2)
    with col_v1:
        st.markdown(
            """
            #### 1. Player
            **Definition**: An autonomous decision-maker within the game.  
            **In This System**: Each individual candidate attending the group interview is a player.
            
            #### 2. Strategy
            **Definition**: A complete plan of action chosen by a player.  
            **In This System**: The candidate's behavioral posture:
            - **Leader**: Dominating discussions and volunteering solutions.
            - **Cooperative**: Listening, supporting, and facilitating synergy.
            - **Balanced**: Moderating between speaking and encouraging peers.
            
            #### 3. Payoff
            **Definition**: The numerical reward or outcome received by a player.  
            **In This System**: The interview score (0 to 100) combining individual merit, peer interaction payoffs, and group bonuses.
            """
        )
    with col_v2:
        st.markdown(
            """
            #### 4. Strategic Interaction
            **Definition**: A situation where one player's optimal choice depends on the choices made by others.  
            **In This System**: A candidate cannot score in isolation; multiple Leaders trigger a clash penalty, while collective cooperation triggers a group bonus.
            
            #### 5. Best Response
            **Definition**: The strategy producing the highest payoff against a specific set of opponent moves.  
            **In This System**: If your peers choose aggressive postures, playing Balanced protects your score and yields the highest response payoff.
            
            #### 6. Nash Equilibrium
            **Definition**: A state where no player can benefit by unilaterally changing their strategy.  
            **In This System**: **(Balanced, Balanced)** is the unique pure-strategy Nash Equilibrium with mutual payoffs of (9, 9).
            """
        )
        
    st.markdown("---")
    st.subheader("💡 Top 10 Viva Questions & Short Answers")
    
    viva_qa = [
        ("Q1: What is Game Theory?", "Game Theory is the mathematical study of strategic interaction where the outcome for each participant depends on the choices of all participants."),
        ("Q2: Who are the players in this application?", "The candidates appearing in the group interview are the players."),
        ("Q3: What strategies are available to each candidate?", "Three strategies: Leader (assertive), Cooperative (supportive), and Balanced (moderate)."),
        ("Q4: What is a payoff in this context?", "The payoff is the interview score earned by a candidate, reflecting their strategy, peer compatibility, and group performance."),
        ("Q5: What is Nash Equilibrium?", "A state in which no candidate can achieve a higher score by changing their strategy alone while everyone else keeps theirs."),
        ("Q6: Why is a group interview a Game Theory problem?", "Because an individual's evaluation depends not only on their own speech but also on whether peers collaborate or clash with them."),
        ("Q7: How are candidates scored mathematically?", "Final Score = Individual Base Score (75/80/85) + Group Effects (+5 cooperation / -5 leader conflict) + Pairwise Payoff Matrix (4-9 pts) + Small Participation Variation (0-5 pts)."),
        ("Q8: Why does group behavior matter?", "If the group is collaborative, all members receive a +5 cooperation bonus. If multiple candidates fight to be Leader, each Leader loses 5 points due to conflict penalty."),
        ("Q9: How are the Top 30 selected?", "All candidates across all groups are pooled and ranked by Final Score in descending order, with Candidate ID used for deterministic tie-breaking."),
        ("Q10: What are the limitations of this model?", "It assumes discrete strategies and rational utility-maximizing behaviors, whereas real human interviews involve continuous behavioral nuances and subjective interviewer perception.")
    ]
    
    for q, a in viva_qa:
        with st.expander(q):
            st.write(f"**Answer**: {a}")
