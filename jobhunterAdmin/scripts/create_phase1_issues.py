#!/usr/bin/env python3
"""Create Phase 1 GitHub issues using requests library."""
import requests
import json
import os

# Configuration
REPO_OWNER = "adenueltech"
REPO_NAME = "jobhunter"
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN", "")

if not GITHUB_TOKEN:
    print("Please set GITHUB_TOKEN environment variable")
    print("Get token from: https://github.com/settings/tokens")
    exit(1)

BASE_URL = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}"
HEADERS = {
    "Authorization": f"token {GITHUB_TOKEN}",
    "Accept": "application/vnd.github.v3+json"
}

# Labels to create
LABELS = [
    {"name": "phase-1-mvp", "color": "0E8A16", "description": "MVP features"},
    {"name": "backend", "color": "D93F0B", "description": "Backend tasks"},
    {"name": "frontend", "color": "FBCA04", "description": "Frontend tasks"},
    {"name": "devops", "color": "0052CC", "description": "DevOps tasks"},
    {"name": "priority-high", "color": "B60205", "description": "High priority"},
    {"name": "priority-medium", "color": "FFA500", "description": "Medium priority"},
    {"name": "good-first-issue", "color": "7057FF", "description": "Good for newcomers"},
]

# Milestones to create
MILESTONES = [
    {"title": "MVP - Week 1: Foundation", "description": "Project setup, database, authentication"},
    {"title": "MVP - Week 2: Job Scraping", "description": "Upwork scraper, job detection"},
    {"title": "MVP - Week 3: AI Integration", "description": "OpenAI, embeddings, proposal generation"},
    {"title": "MVP - Week 4: Notifications", "description": "Email, Telegram, frontend, deployment"},
]


# Phase 1 Issues
PHASE1_ISSUES = [
    # Week 1
    {
        "title": "Project Setup and Repository Structure",
        "body": """## Description
Set up the monorepo structure with backend, frontend, and extension folders. Initialize Git repository with proper .gitignore and README.

## Tasks
- [ ] Create monorepo structure
- [ ] Initialize backend (Python/FastAPI)
- [ ] Initialize frontend (Next.js)
- [ ] Initialize extension (Plasmo)
- [ ] Create .gitignore files
- [ ] Create README.md with setup instructions
- [ ] Set up .env.example files

## Acceptance Criteria
- [ ] Repository structure matches DEVELOPMENT_SPEC.md
- [ ] All folders initialized with package managers
- [ ] README has clear setup instructions
- [ ] .gitignore excludes node_modules, venv, .env""",
        "labels": ["phase-1-mvp", "devops", "priority-high", "good-first-issue"],
        "milestone": "MVP - Week 1: Foundation"
    },
