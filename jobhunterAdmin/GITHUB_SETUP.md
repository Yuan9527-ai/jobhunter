# GitHub Repository Setup Guide

This guide will help you set up your GitHub repository with all the issues, labels, and milestones.

## Option 1: Automated Setup (Recommended)

### Prerequisites
```bash
pip install PyGithub
```

### Steps

1. **Create GitHub Personal Access Token**
   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Select scopes: `repo` (all), `workflow`
   - Copy the token

2. **Run the Script**
   ```bash
   python scripts/create_github_issues.py \
     --repo yourusername/ai-job-hunter \
     --token YOUR_GITHUB_TOKEN
   ```

3. **Dry Run First (Optional)**
   ```bash
   python scripts/create_github_issues.py \
     --repo yourusername/ai-job-hunter \
     --token YOUR_GITHUB_TOKEN \
     --dry-run
   ```

This will automatically create:
- ✅ All 64 issues
- ✅ All labels with colors
- ✅ All milestones
- ✅ Proper issue assignments

---

## Option 2: Manual Setup

If you prefer to create issues manually or want more control:

### Step 1: Create Labels

Go to your repository → Issues → Labels → New label

Create these labels with suggested colors:

| Label | Color | Description |
|-------|-------|-------------|
| `phase-1-mvp` | `#0E8A16` | MVP features |
| `phase-2-advanced` | `#1D76DB` | Advanced features |
| `phase-3-extension` | `#5319E7` | Extension features |
| `backend` | `#D93F0B` | Backend tasks |
| `frontend` | `#FBCA04` | Frontend tasks |
| `extension` | `#C5DEF5` | Extension tasks |
| `devops` | `#0052CC` | DevOps tasks |
| `priority-high` | `#B60205` | High priority |
| `priority-medium` | `#FFA500` | Medium priority |
| `priority-low` | `#CCCCCC` | Low priority |
| `good-first-issue` | `#7057FF` | Good for newcomers |
| `bug` | `#D73A4A` | Bug reports |
| `enhancement` | `#A2EEEF` | Enhancements |
| `documentation` | `#0075CA` | Documentation |

### Step 2: Create Milestones

Go to your repository → Issues → Milestones → New milestone

Create these milestones:

1. **MVP - Week 1: Foundation**
   - Due date: 1 week from start
   - Description: Project setup, database, authentication

2. **MVP - Week 2: Job Scraping**
   - Due date: 2 weeks from start
   - Description: Upwork scraper, job detection

3. **MVP - Week 3: AI Integration**
   - Due date: 3 weeks from start
   - Description: OpenAI, embeddings, proposal generation

4. **MVP - Week 4: Notifications**
   - Due date: 4 weeks from start
   - Description: Email, Telegram, frontend, deployment

5. **V2 - Week 5: Smart Filters**
   - Due date: 5 weeks from start
   - Description: Best Match, proposal count, connect budget

6. **V2 - Week 6: Enhanced AI**
   - Due date: 6 weeks from start
   - Description: Multi-style proposals, better matching

7. **V2 - Week 7: Dashboard V2**
   - Due date: 7 weeks from start
   - Description: Analytics, filter UI, improvements

8. **V3 - Week 8-9: Extension**
   - Due date: 9 weeks from start
   - Description: Chrome extension development

9. **V3 - Week 10: Multi-Platform**
   - Due date: 10 weeks from start
   - Description: Fiverr, LinkedIn scrapers

10. **V3 - Week 11: Advanced Features**
    - Due date: 11 weeks from start
    - Description: Learning system, follow-ups

11. **V3 - Week 12: Production Launch**
    - Due date: 12 weeks from start
    - Description: CI/CD, deployment, Chrome Web Store

### Step 3: Create Issues

Copy issues from the markdown files in `issues/` folder:

- `issues/phase-1-week-1.md` → Issues #1-7
- `issues/phase-1-week-2.md` → Issues #8-14
- `issues/phase-1-week-3.md` → Issues #15-22
- `issues/phase-1-week-4.md` → Issues #23-33
- `issues/phase-2-advanced.md` → Issues #34-45
- `issues/phase-3-extension.md` → Issues #46-64

For each issue:
1. Click "New issue"
2. Copy title from markdown
3. Copy description (everything under the issue header)
4. Add labels
5. Assign milestone
6. Optionally assign to team member
7. Click "Submit new issue"

---

## Option 3: GitHub CLI

If you have GitHub CLI installed:

```bash
# Install GitHub CLI
# macOS: brew install gh
# Windows: winget install GitHub.cli
# Linux: See https://github.com/cli/cli#installation

# Login
gh auth login

# Create labels
gh label create "phase-1-mvp" --color "0E8A16" --description "MVP features"
gh label create "backend" --color "D93F0B" --description "Backend tasks"
# ... repeat for all labels

# Create milestones
gh api repos/:owner/:repo/milestones -f title="MVP - Week 1: Foundation"
# ... repeat for all milestones

# Create issues (example)
gh issue create \
  --title "Project Setup and Repository Structure" \
  --body "$(cat issues/phase-1-week-1.md | sed -n '/## Issue #1:/,/## Issue #2:/p')" \
  --label "phase-1-mvp,devops,priority-high,good-first-issue" \
  --milestone "MVP - Week 1: Foundation"
```

---

## Step 4: Set Up GitHub Projects (Optional)

1. Go to your repository → Projects → New project
2. Choose "Board" template
3. Name it "AI Job Hunter Development"
4. Create columns:
   - 📋 Backlog
   - 🏗️ In Progress
   - 👀 In Review
   - ✅ Done

5. Add automation:
   - Move to "In Progress" when issue is assigned
   - Move to "In Review" when PR is created
   - Move to "Done" when PR is merged

---

## Step 5: Configure Repository Settings

### Branch Protection

Go to Settings → Branches → Add rule

**Branch name pattern**: `main`

Enable:
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Include administrators

### Collaborators

Go to Settings → Collaborators → Add people

Add your team members with appropriate permissions:
- **Maintainers**: Full access
- **Developers**: Write access
- **QA**: Triage access

---

## Step 6: Set Up Issue Templates

The issue templates are already in `.github/ISSUE_TEMPLATE/`:
- `feature.md` - For new features
- `bug.md` - For bug reports

These will automatically appear when creating new issues.

---

## Step 7: Verify Setup

Check that you have:
- [ ] 14 labels created
- [ ] 11 milestones created
- [ ] 64 issues created
- [ ] Issues properly labeled
- [ ] Issues assigned to milestones
- [ ] Branch protection enabled
- [ ] Team members added

---

## Troubleshooting

### Script Fails with Authentication Error
- Verify your GitHub token has `repo` scope
- Check token hasn't expired
- Ensure repository name is correct format: `owner/repo`

### Issues Not Created
- Check you have write access to repository
- Verify milestone names match exactly
- Check label names match exactly

### Rate Limiting
- GitHub API has rate limits
- If you hit limits, wait an hour or use authenticated requests
- Script automatically handles rate limiting

---

## Next Steps

After setup:

1. **Assign Issues**: Assign issues to team members based on their roles
2. **Set Priorities**: Review and adjust issue priorities
3. **Create Project Board**: Set up GitHub Projects for visual tracking
4. **Schedule Kickoff**: Have a team meeting to review issues
5. **Start Development**: Team members can start claiming issues!

---

## Quick Commands Reference

```bash
# View all issues
gh issue list

# View issues by label
gh issue list --label "backend"

# View issues by milestone
gh issue list --milestone "MVP - Week 1: Foundation"

# Assign issue
gh issue edit 1 --add-assignee username

# Close issue
gh issue close 1

# View project boards
gh project list
```

---

## Support

If you encounter any issues:
1. Check the [PyGithub documentation](https://pygithub.readthedocs.io/)
2. Check the [GitHub CLI documentation](https://cli.github.com/manual/)
3. Open an issue in this repository
4. Contact the project maintainer

---

**Ready to start?** Run the automated script or follow the manual steps above. Good luck! 🚀
