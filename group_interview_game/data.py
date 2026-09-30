"""
data.py - Candidate Management & Group Formation Module
Game Theory Based Group Interview & Candidate Selection System
"""

import os
import csv
from typing import List, Dict, Any

DEFAULT_CSV_PATH = os.path.join(os.path.dirname(__file__), "data", "candidates.csv")

DEFAULT_NAMES = [
    "Rahul Sharma", "Priya Patel", "Amit Verma", "Sneha Kulkarni", "Rohan Iyer",
    "Ananya Roy", "Vikram Singh", "Pooja Nair", "Arjun Mehta", "Kavita Rao",
    "Siddharth Gupta", "Neha Joshi", "Karan Malhotra", "Divya Deshmukh", "Aditya Saxena",
    "Tanvi Bhatt", "Manish Tiwari", "Ritu Agarwal", "Gaurav Reddy", "Shweta Pandey",
    "Naveen Pillai", "Aishwarya Sen", "Varun Chopra", "Meera Nambiar", "Kunal Ghosh",
    "Deepika Jain", "Harsh Vardhan", "Simran Kaur", "Nikhil Bhatia", "Rashmi Mishra",
    "Abhishek Dubey", "Sunita Menon", "Prateek Shinde", "Ishita Das", "Saurabh Yadav",
    "Bhavna Sethi", "Tarun Kapoor", "Alka Choudhury", "Vivek Natarajan", "Monika Trivedi",
    "Rajat Bansal", "Komal Soni", "Sachin Hegde", "Pallavi Chatterjee", "Mayank Rawat",
    "Gayatri Prabhu", "Mohit Chauhan", "Swati Kaushik", "Deepak Varma", "Payal Goswami",
    "Chetan Saxena", "Anjali Pillai", "Lalit Thakur", "Madhuri Patil", "Hemant Kumar",
    "Vandana Shukla", "Jatin Mathur", "Richa Singhal", "Umesh Namboodiri", "Geeta Ramachandran"
]


def generate_default_candidates(num_candidates: int = 60) -> List[Dict[str, str]]:
    """Generates a list of candidate dictionaries with IDs and names."""
    candidates = []
    for i in range(1, num_candidates + 1):
        cid = f"C{i:03d}"
        if i <= len(DEFAULT_NAMES):
            name = DEFAULT_NAMES[i - 1]
        else:
            name = f"Candidate {i}"
        candidates.append({"candidate_id": cid, "name": name})
    return candidates


def load_candidates_from_csv(file_path: str = DEFAULT_CSV_PATH) -> List[Dict[str, str]]:
    """Loads candidates from CSV file if exists, fallback to default generator."""
    if not os.path.exists(file_path):
        return generate_default_candidates(60)
    
    candidates = []
    try:
        with open(file_path, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                cid = row.get("Candidate ID") or row.get("candidate_id") or ""
                name = row.get("Candidate Name") or row.get("name") or ""
                if cid and name:
                    candidates.append({"candidate_id": cid.strip(), "name": name.strip()})
        if not candidates:
            return generate_default_candidates(60)
        return candidates
    except Exception:
        return generate_default_candidates(60)


def save_candidates_to_csv(candidates: List[Dict[str, str]], file_path: str = DEFAULT_CSV_PATH) -> None:
    """Saves candidate list to CSV file."""
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["Candidate ID", "Candidate Name"])
        writer.writeheader()
        for c in candidates:
            writer.writerow({"Candidate ID": c["candidate_id"], "Candidate Name": c["name"]})


def create_groups(candidates: List[Dict[str, str]], group_size: int = 5) -> List[Dict[str, Any]]:
    """
    Divides candidates into sequential groups.
    Handles remainders by keeping the last group with the remaining candidates.
    For example: 60 candidates with size 5 -> 12 groups of 5.
    If 62 candidates with size 5 -> 12 groups of 5 + 1 group of 2.
    """
    if group_size <= 0:
        group_size = 5

    groups = []
    total = len(candidates)
    group_num = 1

    for i in range(0, total, group_size):
        chunk = candidates[i : i + group_size]
        groups.append({
            "group_id": group_num,
            "group_name": f"Group {group_num}",
            "candidates": chunk,
            "size": len(chunk)
        })
        group_num += 1

    return groups
