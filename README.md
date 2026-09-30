# Game Theory Based Group Interview & Candidate Selection System

A complete, beginner-friendly Game Theory simulation and decision-making application built for college engineering and computer science students.

---

## 1. Project Title
**Game Theory Based Group Interview & Candidate Selection System**

## 2. Problem Statement
In traditional campus or corporate group interviews, candidate evaluation often treats each participant in isolation or relies on subjective impressions. However, in reality, a group discussion is an interactive, multi-agent environment where one candidate's performance, talk-time, and reception depend heavily on how their peers behave. 

If multiple candidates aggressively attempt to dominate as "Leaders", the group experiences friction, interruption, and diminished overall quality. Conversely, cooperative and balanced candidates facilitate mutual understanding and constructive debate. Evaluating candidates through this lens is a natural application of **Game Theory**.

## 3. Objective
- Model candidate behavioral choices as **Strategies** in a non-cooperative game.
- Evaluate individual contributions combined with group synergy and conflict penalties.
- Provide transparent, mathematically sound scoring to rank all participants.
- Automatically filter and select the **Top 30 candidates** for Round 2.
- Provide a clear, visual, and viva-ready explanation of foundational Game Theory concepts: **Players, Strategies, Payoffs, Best Response, and Nash Equilibrium**.

---

## 4. Game Theory Concepts Used
1. **Players**: The candidates participating in the group discussion ($N = 60$).
2. **Strategies**: The behavioral stances chosen by candidates:
   - **Leader**: Dominant, high participation, steering discussion.
   - **Cooperative**: Supportive, attentive, building upon peers' arguments.
   - **Balanced**: Moderated contribution while encouraging collaborative discussion.
3. **Payoffs**: Numerical utility reflecting performance, compatibility, and final interview scores (scaled from 0 to 100).
4. **Best Response**: The optimal strategy maximizing a candidate's payoff given the choices of peers.
5. **Nash Equilibrium**: A strategy profile where no candidate can unilaterally deviate to improve their score.
6. **Individual vs. Group Benefit**: Highlights how selfish dominance ("All Leaders") hurts everyone, whereas mutual moderation ("Balanced") creates optimal group and individual payoffs.

---

## 5. Payoff Matrix (2-Player Simplified Normal Form)

| Candidate A \ Candidate B | Cooperative | Leader | Balanced |
| :--- | :---: | :---: | :---: |
| **Cooperative** | (8, 8) | (5, 9) | (8, 7) |
| **Leader** | (9, 5) | (4, 4) | (7, 6) |
| **Balanced** | (7, 8) | (6, 7) | **(9, 9) ⭐ [NASH]** |

*Note: The first value represents Candidate A's payoff, and the second value represents Candidate B's payoff.*

---

## 6. Scoring Methodology

Each candidate's score is computed transparently:
$$\text{Final Score} = \min\big(100, \max\big(0, \text{Base Score} + \text{Group Effect} + \text{Strategy Payoff} + \text{Participation Bonus}\big)\big)$$

### 1. Base Individual Score
- **Leader**: 75 points
- **Cooperative**: 80 points
- **Balanced**: 85 points

### 2. Group Effects
- **Cooperation Bonus (+5 points)**: Awarded to all group members if the majority choose *Cooperative* or *Balanced*.
- **Competition Penalty (-5 points)**: Subtracted from *Leader* candidates if 2 or more candidates in the group choose *Leader*.

### 3. Strategy Payoff
- Computed as the candidate's average pairwise payoff against their group peers based on the Payoff Matrix (ranges between 4.0 and 9.0).

### 4. Participation Bonus
- Small deterministic variation between 0.5 and 4.8 points using a fixed random seed (`seed=42`) to differentiate candidates with identical strategies while maintaining reproducibility.

---

## 7. Nash Equilibrium Explanation

In the game matrix:
- If Candidate B chooses **Balanced**:
  - Candidate A playing Cooperative receives **8**
  - Candidate A playing Leader receives **7**
  - Candidate A playing Balanced receives **9** (Highest payoff)
- Symmetrically, if Candidate A chooses **Balanced**, Candidate B's highest payoff is also by choosing **Balanced** (receiving 9).

Therefore, **(Balanced, Balanced)** is the unique pure-strategy **Nash Equilibrium**. At this state, neither player has any incentive to unilaterally deviate.

---

## 8. Technologies Used
- **Language**: Python 3.10+
- **Framework**: Streamlit
- **Data Manipulation**: Pandas
- **Storage**: Lightweight CSV (`data/candidates.csv`)

---

## 9. Project Structure

```text
group_interview_game/
│
├── app.py                 # Streamlit web application & UI
├── game_theory.py         # Payoff matrix, Best Response, & Nash Equilibrium logic
├── scoring.py             # Base scores, group bonuses, penalties, & ranking engine
├── data.py                # Candidate loader, generator, & group partitioner
├── requirements.txt       # Python package dependencies
├── README.md              # Project documentation & Viva Guide
│
└── data/
    └── candidates.csv     # 60 sample candidate profiles
```

---

## 10. How to Install & Run Locally

### Prerequisites
- Python 3.8 or higher installed on your machine.

### Installation
```bash
# 1. Clone or open the project folder
cd group_interview_game

# 2. Install dependencies
pip install -r requirements.txt

# 3. Launch the Streamlit application
streamlit run app.py
```
The browser will automatically open at `http://localhost:8501`.

---

## 11. Example Workflow
1. **Admin Setup**: Set total candidates (60), group size (5), and qualifiers (30).
2. **Candidate Registration**: System auto-loads 60 candidates and distributes them into 12 groups.
3. **Group Interview**: All groups receive the discussion topic: *"Should Artificial Intelligence replace human employees?"*. Candidates select or are assigned strategies.
4. **Payoff & Best Response**: Inspect the 2-player matrix and check each candidate's Best Response.
5. **Group Results**: View each group's cooperation level, highest/lowest scores, and bonuses.
6. **Final Ranking & Top 30**: System sorts all 60 candidates. The top 30 receive the **"Selected for Round 2"** qualification badge.
7. **Dashboard**: Analyze strategy breakdowns, group score comparisons, and qualification counts.

---

## 12. Future Improvements
- Multi-round dynamic games with repeated interactions (Iterated Prisoner's Dilemma mechanics).
- Mixed-strategy Nash Equilibrium probability calculators.
- Real-time multiplayer voting mode where students submit strategies from mobile devices.

---

## 13. How to Explain This Project in Viva

### Q1: What is Game Theory?
**Answer**: Game Theory is the mathematical study of strategic decision-making where the outcome for any participant depends not only on their own choice, but also on the choices made by others.

### Q2: Who are the players?
**Answer**: Each candidate participating in the group interview is a player in the game.

### Q3: What are the strategies?
**Answer**: Three behavioral strategies:
1. **Leader**: Dominant, attempts to direct the conversation.
2. **Cooperative**: Supportive, builds on other people's ideas.
3. **Balanced**: Moderates participation, sharing discussion time equally.

### Q4: What is a payoff?
**Answer**: The payoff is the candidate's resulting interview score (0–100) calculated from individual base points, group bonuses or penalties, and strategic peer interaction.

### Q5: What is Nash Equilibrium?
**Answer**: A stable situation where no player can improve their score by unilaterally changing their strategy while all other players keep theirs unchanged. In our matrix, (Balanced, Balanced) is the unique Nash Equilibrium.

### Q6: Why is this a Game Theory problem?
**Answer**: In an interview discussion, a candidate's success is not isolated. If everyone tries to be a Leader, discussion collapses into conflict and scores drop. Success depends on strategic adaptation to others' behavior.

### Q7: How are candidates scored?
**Answer**:
$$\text{Final Score} = \text{Base Score (75/80/85)} + \text{Group Effect (+5 bonus / -5 penalty)} + \text{Matrix Payoff (4-9)} + \text{Participation Bonus (0-5)}$$

### Q8: Why does group behavior matter?
**Answer**: Collective collaboration rewards all members with a +5 bonus. In contrast, if multiple candidates greedily choose Leader, a -5 penalty is applied to each Leader due to clash and interrupted communication.

### Q9: How are the Top 30 selected?
**Answer**: All candidates across groups are merged into a global leaderboard sorted by Final Score descending. Ties are broken deterministically by Candidate ID. The top 30 automatically qualify for Round 2.

### Q10: What are the limitations of the project?
**Answer**: Real interviews have subjective human factors, tone, body language, and continuous variables, whereas this model simplifies behavior into three discrete strategies to demonstrate mathematical Game Theory principles clearly.
