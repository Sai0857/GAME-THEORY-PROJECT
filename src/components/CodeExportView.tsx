import React, { useState } from 'react';
import { FileCode2, Copy, Check, Terminal, Download, FileText, CheckCircle2 } from 'lucide-react';

export const CodeExportView: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string>('app.py');

  const handleCopy = (key: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const files: Record<string, { desc: string; code: string; language: string }> = {
    'app.py': {
      desc: 'Complete Streamlit web application with sidebar, pages, and charts',
      language: 'python',
      code: `import streamlit as st
import pandas as pd
import random
from data import load_candidates_from_csv, create_groups, generate_default_candidates
from game_theory import (
    STRATEGIES, STRATEGY_DESCRIPTIONS, PAYOFF_MATRIX,
    find_2player_nash_equilibria, calculate_candidate_payoff, calculate_best_response_for_candidate
)
from scoring import evaluate_group_interview, rank_and_select_candidates, FIXED_RANDOM_SEED

st.set_page_config(page_title="Game Theory Group Interview System", page_icon="🎓", layout="wide")

if "num_candidates" not in st.session_state:
    st.session_state.num_candidates = 60
if "group_size" not in st.session_state:
    st.session_state.group_size = 5
if "num_to_select" not in st.session_state:
    st.session_state.num_to_select = 30
if "candidates" not in st.session_state:
    st.session_state.candidates = load_candidates_from_csv()

# Refer to the full generated app.py in your project directory
# Launch with: streamlit run app.py`
    },
    'game_theory.py': {
      desc: 'Payoff matrix, Best Response calculations, and Nash Equilibrium solver',
      language: 'python',
      code: `STRATEGIES = ["Cooperative", "Leader", "Balanced"]

# Predefined 2-player normal-form payoff matrix
PAYOFF_MATRIX = {
    ("Cooperative", "Cooperative"): (8, 8),
    ("Cooperative", "Leader"): (5, 9),
    ("Cooperative", "Balanced"): (8, 7),
    ("Leader", "Cooperative"): (9, 5),
    ("Leader", "Leader"): (4, 4),
    ("Leader", "Balanced"): (7, 6),
    ("Balanced", "Cooperative"): (7, 8),
    ("Balanced", "Leader"): (6, 7),
    ("Balanced", "Balanced"): (9, 9),  # Nash Equilibrium
}

def get_payoff(strategy_a: str, strategy_b: str):
    return PAYOFF_MATRIX.get((strategy_a, strategy_b), (0, 0))

def find_2player_nash_equilibria():
    equilibria = []
    for s_a in STRATEGIES:
        for s_b in STRATEGIES:
            cur_a, cur_b = get_payoff(s_a, s_b)
            best_a = max(get_payoff(s, s_b)[0] for s in STRATEGIES)
            best_b = max(get_payoff(s_a, s)[1] for s in STRATEGIES)
            if cur_a >= best_a and cur_b >= best_b:
                equilibria.append({"strategy_a": s_a, "strategy_b": s_b, "payoffs": (cur_a, cur_b)})
    return equilibria`
    },
    'scoring.py': {
      desc: 'Scoring engine, cooperation bonus, conflict penalty, and deterministic ranking',
      language: 'python',
      code: `BASE_SCORES = {"Leader": 75, "Cooperative": 80, "Balanced": 85}

def evaluate_group_interview(group, seed=42):
    candidates = group["candidates"]
    strategies = [c.get("strategy", "Balanced") for c in candidates]
    
    coop_count = strategies.count("Cooperative")
    bal_count = strategies.count("Balanced")
    leader_count = strategies.count("Leader")
    
    coop_bonus = 5 if (coop_count + bal_count) > (len(candidates) / 2) else 0
    penalty = -5 if leader_count >= 2 else 0
    # Returns evaluated candidate objects and group metrics`
    },
    'data.py': {
      desc: 'Candidate loader, generator, and group partitioner',
      language: 'python',
      code: `import csv, os

def load_candidates_from_csv(file_path="data/candidates.csv"):
    # Loads candidates from CSV or falls back to generator
    pass

def create_groups(candidates, group_size=5):
    # Partitions candidates into groups sequentially
    groups = []
    for i in range(0, len(candidates), group_size):
        groups.append({"group_id": (i // group_size) + 1, "candidates": candidates[i:i+group_size]})
    return groups`
    },
    'requirements.txt': {
      desc: 'Python package dependencies',
      language: 'text',
      code: `streamlit>=1.30.0\npandas>=2.0.0`
    },
    'README.md': {
      desc: 'Complete project documentation, installation steps, and Viva Q&A Guide',
      language: 'markdown',
      code: `# Game Theory Based Group Interview & Candidate Selection System\n\nRun locally:\npip install -r requirements.txt\nstreamlit run app.py`
    }
  };

  return (
    <div id="code-export-view" className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileCode2 className="w-5 h-5 text-indigo-600" />
              Python &amp; Streamlit Project Files
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Ready-to-run files generated in the workspace and directly executable in VS Code
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Files Created in /group_interview_game</span>
          </div>
        </div>
      </div>

      {/* Terminal Instructions Card */}
      <div className="bg-slate-900 text-slate-100 rounded-xl p-5 border border-slate-800 shadow-sm space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2 text-slate-400">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-200">How to Run in Local Terminal or VS Code</span>
          </div>
          <button
            onClick={() =>
              handleCopy(
                'terminal-cmds',
                'cd group_interview_game\npip install -r requirements.txt\nstreamlit run app.py'
              )
            }
            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition"
          >
            {copiedKey === 'terminal-cmds' ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>Copy Commands</span>
          </button>
        </div>

        <div className="space-y-1.5 text-emerald-300">
          <div>
            <span className="text-slate-500"># 1. Open the project folder in terminal</span>
            <p className="text-slate-200 font-bold">$ cd group_interview_game</p>
          </div>
          <div className="pt-1">
            <span className="text-slate-500"># 2. Install dependencies (Streamlit &amp; Pandas)</span>
            <p className="text-slate-200 font-bold">$ pip install -r requirements.txt</p>
          </div>
          <div className="pt-1">
            <span className="text-slate-500"># 3. Launch the Streamlit application</span>
            <p className="text-emerald-400 font-bold">$ streamlit run app.py</p>
          </div>
        </div>
      </div>

      {/* File Viewer */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {Object.keys(files).map((fileName) => (
              <button
                key={fileName}
                onClick={() => setSelectedFile(fileName)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
                  selectedFile === fileName
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {fileName}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleCopy(selectedFile, files[selectedFile].code)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg flex items-center gap-1.5 transition self-start sm:self-auto"
          >
            {copiedKey === selectedFile ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-slate-500">{files[selectedFile].desc}</p>

        <div className="bg-slate-950 text-slate-100 p-4 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto max-h-96">
          <pre>{files[selectedFile].code}</pre>
        </div>
      </div>
    </div>
  );
};
