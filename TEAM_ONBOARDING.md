# Team Onboarding Guide

Welcome to the AI Job Hunter Agent project! This guide will help you get started quickly.

## 🎯 Project Overview

We're building an AI-powered system that helps freelancers find and apply to jobs on Upwork, Fiverr, and LinkedIn. The system:
1. Monitors platforms for new jobs (every 5-10 minutes)
2. Filters jobs based on smart criteria
3. Generates personalized proposals using AI
4. Notifies users via email/Telegram
5. Provides a Chrome extension for easy application

## 👥 Team Structure

### Backend Team (2 developers)
**Responsibilities**:
- Database and API development
- Job scrapers (Upwork, Fiverr, LinkedIn)
- Background tasks (Celery)
- AI integration (OpenAI)

**Tech Stack**: Python, FastAPI, PostgreSQL, Redis, Celery, Playwright

**First Issues**: #1, #2, #3, #4, #5

### Frontend Team (1 developer)
**Responsibilities**:
- Dashboard UI (Next.js)
- Authentication pages
- Job listing and filtering
- Analytics dashboard

**Tech Stack**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui

**First Issues**: #27, #28, #29

### Extension Team (1 developer)
**Responsibilities**:
- Chrome extension development
- Content scripts for job pages
- Proposal insertion logic
- Real-time notifications

**Tech Stack**: Plasmo, React, TypeScript

**First Issues**: #46, #47, #48

### AI/ML Team (1 developer)
**Responsibilities**:
- Embedding generation
- Skill matching algorithms
- Proposal generation
- Learning systems

**Tech Stack**: Python, OpenAI API, LangChain, Pinecone

**First Issues**: #15, #16, #17, #18

### DevOps Team (1 developer)
**Responsibilities**:
- Docker setup
- CI/CD pipelines
- Deployment
- Monitoring

**Tech Stack**: Docker, GitHub Actions, AWS/DigitalOcean

**First Issues**: #1, #31, #61

### QA Team (1 developer)
**Responsibilities**:
- Test automation
- Manual testing
- Bug reporting
- Performance testing

**Tech Stack**: Pytest, Jest, Playwright

**First Issues**: #32

## 🚀 Getting Started

### Day 1: Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/ai-job-hunter.git
   cd ai-job-hunter
   ```

2. **Read Documentation**
   - [ ] README.md
   - [ ] PROJECT_PLAN.md
   - [ ] DEVELOPMENT_SPEC.md
   - [ ] Your team's issues in `issues/` folder

3. **Set Up Development Environment**
   
   **Backend Developers**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   cp .env.example .env
   # Edit .env with your credentials
   ```
   
   **Frontend Developers**:
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   # Edit .env.local
   ```
   
   **Extension Developers**:
   ```bash
   cd extension
   npm install
   ```

4. **Join Communication Channels**
   - Slack/Discord workspace
   - GitHub notifications
   - Daily standup schedule

### Day 2-3: First Contribution

1. **Pick Your First Issue**
   - Look for issues labeled `good-first-issue`
   - Comment on the issue to claim it
   - Ask questions if anything is unclear

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/issue-123-description
   ```

3. **Make Your Changes**
   - Follow coding standards
   - Write tests
   - Update documentation

4. **Submit Pull Request**
   - Reference issue number: `[#123] Add feature`
   - Fill out PR template
   - Request review

### Week 1: Get Comfortable

- [ ] Complete at least 1 issue
- [ ] Review 2 other PRs
- [ ] Attend daily standups
- [ ] Ask questions in team chat
- [ ] Familiarize yourself with codebase

## 📋 Daily Workflow

### Morning (15 minutes)
1. Check GitHub notifications
2. Review assigned issues
3. Update issue status
4. Attend daily standup

### During Development
1. Pull latest changes: `git pull origin main`
2. Work on your feature branch
3. Commit frequently with clear messages
4. Push to remote regularly
5. Update issue with progress

### Before End of Day
1. Push your changes
2. Comment on issue with progress
3. Create PR if feature is complete
4. Review at least 1 other PR

## 🎯 Issue Workflow

### 1. Find an Issue
- Browse [GitHub Issues](../../issues)
- Filter by your team label (e.g., `backend`, `frontend`)
- Look for issues in current milestone
- Prefer `priority-high` issues

### 2. Claim the Issue
```
Comment: "I'll work on this. ETA: 2 days"
```

### 3. Understand Requirements
- Read issue description carefully
- Check acceptance criteria
- Review related issues
- Ask questions if unclear

### 4. Develop
- Create feature branch
- Write code
- Write tests
- Test locally

### 5. Submit PR
- Push to GitHub
- Create Pull Request
- Link to issue: `Closes #123`
- Fill out PR template
- Request review

### 6. Address Feedback
- Respond to review comments
- Make requested changes
- Push updates
- Re-request review

### 7. Celebrate! 🎉
- Issue closed
- PR merged
- Pick next issue

## 🧪 Testing Guidelines

### Backend Tests
```bash
# Run all tests
pytest

# Run specific test file
pytest tests/test_scraper.py

# Run with coverage
pytest --cov=app tests/

# Run specific test
pytest tests/test_scraper.py::test_upwork_scraper
```

### Frontend Tests
```bash
# Run all tests
npm test

# Run in watch mode
npm test -- --watch

# Run with coverage
npm run test:coverage
```

### Writing Tests
- Write tests for all new features
- Aim for >80% coverage
- Test edge cases
- Mock external APIs

## 📝 Code Standards

### Python (Backend)
```python
# Use type hints
def calculate_score(job: Job, user: User) -> float:
    pass

# Use docstrings
def scrape_jobs(platform: str) -> List[Job]:
    """
    Scrape jobs from specified platform.
    
    Args:
        platform: Platform name (upwork, fiverr, linkedin)
        
    Returns:
        List of Job objects
    """
    pass

# Follow PEP 8
# Use black for formatting
# Use pylint for linting
```

### TypeScript (Frontend/Extension)
```typescript
// Use interfaces
interface Job {
  id: string;
  title: string;
  description: string;
}

// Use async/await
async function fetchJobs(): Promise<Job[]> {
  const response = await fetch('/api/jobs');
  return response.json();
}

// Use proper typing
const [jobs, setJobs] = useState<Job[]>([]);
```

### Git Commits
```bash
# Good commit messages
git commit -m "[#123] Add Upwork scraper with stealth mode"
git commit -m "[#456] Fix proposal generation for long descriptions"
git commit -m "[#789] Update dashboard UI with new filters"

# Bad commit messages
git commit -m "fix bug"
git commit -m "update"
git commit -m "wip"
```

## 🤝 Communication

### Daily Standup (15 minutes)
**Format**:
- What did you do yesterday?
- What will you do today?
- Any blockers?

**Example**:
```
Yesterday: Completed Upwork scraper (#10), started filter pipeline (#14)
Today: Finish filter pipeline, write tests
Blockers: Need clarification on proposal count threshold
```

### Asking for Help
**Good**:
```
Issue #10: I'm stuck on extracting the Best Match badge. 
I've tried selectors X and Y but they're not working. 
Here's my code: [link to branch]
Can someone help?
```

**Bad**:
```
Help! Nothing works!
```

### Code Reviews
**As Reviewer**:
- Be constructive and kind
- Explain why changes are needed
- Approve if looks good
- Respond within 24 hours

**As Author**:
- Don't take feedback personally
- Ask questions if unclear
- Make requested changes
- Thank reviewers

## 📊 Progress Tracking

### GitHub Projects
We use GitHub Projects to track progress:
- **Backlog**: Issues not yet started
- **In Progress**: Currently being worked on
- **In Review**: PR submitted, awaiting review
- **Done**: Merged and deployed

### Update Your Issues
```
# When starting
Comment: "Started working on this"
Move to "In Progress"

# When stuck
Comment: "Blocked by X, need help with Y"
Add "blocked" label

# When submitting PR
Comment: "PR submitted: #456"
Move to "In Review"

# When complete
PR merged automatically closes issue
Moves to "Done"
```

## 🎓 Learning Resources

### Backend
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Tutorial](https://docs.sqlalchemy.org/en/14/tutorial/)
- [Celery Documentation](https://docs.celeryproject.org/)
- [Playwright Python](https://playwright.dev/python/)

### Frontend
- [Next.js 14 Docs](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query/latest)

### Extension
- [Plasmo Documentation](https://docs.plasmo.com/)
- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)

### AI/ML
- [OpenAI API Docs](https://platform.openai.com/docs)
- [LangChain Docs](https://python.langchain.com/)
- [Pinecone Docs](https://docs.pinecone.io/)

## ⚠️ Common Pitfalls

### 1. Not Reading the Issue
❌ Start coding without understanding requirements
✅ Read issue carefully, ask questions, then code

### 2. Working on Main Branch
❌ `git commit -m "changes" && git push origin main`
✅ Create feature branch, work there, submit PR

### 3. Large PRs
❌ 2000 lines changed across 50 files
✅ Small, focused PRs (< 500 lines)

### 4. No Tests
❌ Submit PR without tests
✅ Write tests for all new features

### 5. Ignoring Feedback
❌ Argue with reviewers, ignore comments
✅ Address feedback professionally

## 🎉 Success Metrics

### Individual
- Issues completed per week: 2-3
- PR review turnaround: < 24 hours
- Test coverage: > 80%
- Code quality: Passes linting

### Team
- Sprint velocity: 5-6 issues/week
- Bug rate: < 10%
- Deployment frequency: Daily
- Uptime: > 99%

## 📞 Getting Help

### Technical Questions
- Ask in team Slack channel
- Comment on GitHub issue
- Schedule pair programming session

### Process Questions
- Ask team lead
- Check DEVELOPMENT_SPEC.md
- Ask in #general channel

### Urgent Issues
- Tag team lead in Slack
- Use @mention in GitHub
- Send direct message

## 🚀 Next Steps

1. [ ] Complete environment setup
2. [ ] Read all documentation
3. [ ] Claim your first issue
4. [ ] Submit your first PR
5. [ ] Review someone else's PR
6. [ ] Attend first standup
7. [ ] Ask at least 3 questions

Welcome to the team! Let's build something amazing! 🎉
