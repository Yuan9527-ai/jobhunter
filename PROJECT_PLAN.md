# AI Job Hunter Agent - Complete Project Plan

## Project Overview
An AI-powered system that monitors freelance platforms, filters relevant jobs, generates personalized proposals, and assists users in applying through a browser extension.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Job Monitoring Layer                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │  Upwork  │  │  Fiverr  │  │ LinkedIn │                  │
│  │ Scraper  │  │ Scraper  │  │ Scraper  │                  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘                  │
└───────┼─────────────┼─────────────┼────────────────────────┘
        │             │             │
        └─────────────┴─────────────┘
                      │
        ┌─────────────▼──────────────┐
        │     Job Queue (Redis)      │
        └─────────────┬──────────────┘
                      │
        ┌─────────────▼──────────────┐
        │    Filter Pipeline         │
        │  • Best Match Check        │
        │  • Proposal Count Filter   │
        │  • Connect Budget Filter   │
        │  • Client Rating Filter    │
        │  • Skill Matching (AI)     │
        │  • Budget Range Filter     │
        └─────────────┬──────────────┘
                      │
        ┌─────────────▼──────────────┐
        │   AI Proposal Generator    │
        │  • GitHub Repo Matcher     │
        │  • Portfolio Matcher       │
        │  • CV Parser               │
        │  • Proposal Writer         │
        └─────────────┬──────────────┘
                      │
        ┌─────────────▼──────────────┐
        │   Notification Service     │
        │  • Email                   │
        │  • Telegram                │
        │  • Discord                 │
        │  • Push (Extension)        │
        └─────────────┬──────────────┘
                      │
        ┌─────────────▼──────────────┐
        │    PostgreSQL Database     │
        │    + Pinecone (Vectors)    │
        └─────────────┬──────────────┘
                      │
        ┌─────────────▼──────────────┐
        │      Backend API           │
        │      (FastAPI)             │
        └─────────────┬──────────────┘
                      │
        ┌─────────────┴──────────────┐
        │                            │
┌───────▼────────┐         ┌─────────▼──────────┐
│ Chrome         │         │  Dashboard         │
│ Extension      │         │  (Next.js)         │
│                │         │                    │
│ • Job Page UI  │         │ • Analytics        │
│ • Proposal     │         │ • Job Tracking     │
│   Insert       │         │ • Settings         │
│ • Match Score  │         │ • Profile Mgmt     │
└────────────────┘         └────────────────────┘
```

---

## Tech Stack

### Backend
- **Framework**: Python FastAPI
- **Task Queue**: Celery + Redis
- **Web Scraping**: Playwright + BeautifulSoup
- **AI/ML**: OpenAI API, LangChain
- **Vector DB**: Pinecone (embeddings)
- **Database**: PostgreSQL
- **Caching**: Redis
- **Authentication**: JWT

### Frontend
- **Dashboard**: Next.js 14 (App Router)
- **UI Library**: shadcn/ui + Tailwind CSS
- **State Management**: Zustand
- **API Client**: TanStack Query

### Browser Extension
- **Framework**: Plasmo (React-based)
- **Build Tool**: Vite
- **Storage**: Chrome Storage API
- **Communication**: WebSocket + REST API

### DevOps
- **Containerization**: Docker + Docker Compose
- **Orchestration**: Kubernetes (optional for scale)
- **CI/CD**: GitHub Actions
- **Hosting**: AWS / DigitalOcean / Render
- **Monitoring**: Sentry + Grafana

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    github_username VARCHAR(255),
    portfolio_url VARCHAR(500),
    cv_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### User Skills Table
```sql
CREATE TABLE user_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    proficiency_level VARCHAR(50), -- beginner, intermediate, expert
    embedding VECTOR(1536), -- OpenAI embedding
    created_at TIMESTAMP DEFAULT NOW()
);
```

### User Preferences Table
```sql
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    max_connects_per_job INTEGER DEFAULT 16,
    max_proposal_count INTEGER DEFAULT 20,
    min_client_rating DECIMAL(2,1) DEFAULT 4.0,
    min_budget DECIMAL(10,2),
    max_budget DECIMAL(10,2),
    preferred_platforms TEXT[], -- ['upwork', 'fiverr']
    notification_channels TEXT[], -- ['email', 'telegram', 'discord']
    auto_filter_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Jobs Table
```sql
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform VARCHAR(50) NOT NULL, -- upwork, fiverr, linkedin
    platform_job_id VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    budget_min DECIMAL(10,2),
    budget_max DECIMAL(10,2),
    budget_type VARCHAR(50), -- fixed, hourly
    client_name VARCHAR(255),
    client_rating DECIMAL(2,1),
    client_total_spent DECIMAL(12,2),
    client_location VARCHAR(255),
    proposal_count INTEGER DEFAULT 0,
    connects_required INTEGER,
    is_best_match BOOLEAN DEFAULT FALSE,
    skills_required TEXT[],
    job_url VARCHAR(1000) NOT NULL,
    posted_at TIMESTAMP NOT NULL,
    detected_at TIMESTAMP DEFAULT NOW(),
    embedding VECTOR(1536), -- job description embedding
    status VARCHAR(50) DEFAULT 'active', -- active, closed, filled
    created_at TIMESTAMP DEFAULT NOW()
);
```

### GitHub Repositories Table
```sql
CREATE TABLE github_repositories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    repo_name VARCHAR(255) NOT NULL,
    repo_url VARCHAR(500) NOT NULL,
    description TEXT,
    readme_content TEXT,
    tech_stack TEXT[],
    stars INTEGER DEFAULT 0,
    embedding VECTOR(1536), -- README embedding
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, repo_url)
);
```

### Portfolio Projects Table
```sql
CREATE TABLE portfolio_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    project_name VARCHAR(255) NOT NULL,
    project_url VARCHAR(500),
    description TEXT,
    tech_stack TEXT[],
    thumbnail_url VARCHAR(500),
    embedding VECTOR(1536),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Applications Table
```sql
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    proposal_text TEXT NOT NULL,
    attached_repos UUID[], -- array of github_repositories.id
    attached_portfolio UUID[], -- array of portfolio_projects.id
    match_score DECIMAL(3,2), -- 0.00 to 1.00
    status VARCHAR(50) DEFAULT 'pending', -- pending, submitted, viewed, replied, interview, hired, rejected
    submitted_at TIMESTAMP,
    client_response TEXT,
    client_responded_at TIMESTAMP,
    connects_spent INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Notifications Table
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- new_job, proposal_generated, client_response
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    channels TEXT[], -- ['email', 'telegram']
    sent_at TIMESTAMP,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Scraper Logs Table
```sql
CREATE TABLE scraper_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform VARCHAR(50) NOT NULL,
    jobs_found INTEGER DEFAULT 0,
    jobs_new INTEGER DEFAULT 0,
    jobs_updated INTEGER DEFAULT 0,
    errors TEXT,
    duration_seconds INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## API Endpoints

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/me
```

### User Profile
```
GET    /api/users/profile
PUT    /api/users/profile
POST   /api/users/upload-cv
GET    /api/users/skills
POST   /api/users/skills
DELETE /api/users/skills/{id}
```

### User Preferences
```
GET    /api/preferences
PUT    /api/preferences
```

### GitHub Integration
```
POST   /api/github/sync          # Sync repos from GitHub
GET    /api/github/repositories
PUT    /api/github/repositories/{id}
DELETE /api/github/repositories/{id}
```

### Portfolio
```
GET    /api/portfolio/projects
POST   /api/portfolio/projects
PUT    /api/portfolio/projects/{id}
DELETE /api/portfolio/projects/{id}
```

### Jobs
```
GET    /api/jobs                 # List all detected jobs
GET    /api/jobs/{id}
GET    /api/jobs/matching        # Jobs matching user skills
POST   /api/jobs/refresh         # Trigger manual scrape
```

### Applications
```
GET    /api/applications
GET    /api/applications/{id}
POST   /api/applications         # Generate proposal
PUT    /api/applications/{id}    # Update status
DELETE /api/applications/{id}
POST   /api/applications/{id}/submit  # Mark as submitted
```

### Proposals
```
POST   /api/proposals/generate   # Generate proposal for job
POST   /api/proposals/regenerate # Regenerate with different style
```

### Notifications
```
GET    /api/notifications
PUT    /api/notifications/{id}/read
DELETE /api/notifications/{id}
```

### Analytics
```
GET    /api/analytics/dashboard  # Overview stats
GET    /api/analytics/jobs       # Job detection stats
GET    /api/analytics/applications  # Application performance
GET    /api/analytics/proposals  # Proposal success rate
```

### Extension API
```
POST   /api/extension/auth       # Extension authentication
GET    /api/extension/job-info   # Get job info by URL
POST   /api/extension/track-application  # Track manual application
```

---

## Core Services

### 1. Job Scraper Service
**File**: `backend/services/scrapers/base_scraper.py`

```python
class BaseScraper:
    async def scrape_jobs(self) -> List[Job]
    async def get_job_details(self, job_url: str) -> JobDetails
    async def check_best_match(self, job_id: str) -> bool
    async def get_proposal_count(self, job_id: str) -> int
```

**Platform-specific scrapers**:
- `upwork_scraper.py`
- `fiverr_scraper.py`
- `linkedin_scraper.py`

### 2. Filter Pipeline Service
**File**: `backend/services/filter_pipeline.py`

```python
class FilterPipeline:
    async def filter_job(self, job: Job, user: User) -> FilterResult
    
    # Individual filters
    async def check_best_match(self, job: Job) -> bool
    async def check_proposal_count(self, job: Job, max_count: int) -> bool
    async def check_connect_budget(self, job: Job, max_connects: int) -> bool
    async def check_client_rating(self, job: Job, min_rating: float) -> bool
    async def check_budget_range(self, job: Job, min_budget: float, max_budget: float) -> bool
    async def calculate_skill_match(self, job: Job, user_skills: List[Skill]) -> float
```

### 3. AI Proposal Generator
**File**: `backend/services/proposal_generator.py`

```python
class ProposalGenerator:
    async def generate_proposal(
        self, 
        job: Job, 
        user: User, 
        repos: List[Repository],
        portfolio: List[Project]
    ) -> Proposal
    
    async def match_repositories(self, job: Job, repos: List[Repository]) -> List[Repository]
    async def match_portfolio(self, job: Job, projects: List[Project]) -> List[Project]
    async def create_embeddings(self, text: str) -> List[float]
    async def calculate_similarity(self, embedding1: List[float], embedding2: List[float]) -> float
```

### 4. Notification Service
**File**: `backend/services/notification_service.py`

```python
class NotificationService:
    async def send_notification(self, user: User, notification: Notification)
    async def send_email(self, to: str, subject: str, body: str)
    async def send_telegram(self, chat_id: str, message: str)
    async def send_discord(self, webhook_url: str, message: str)
    async def send_push(self, user_id: str, message: dict)
```

### 5. GitHub Service
**File**: `backend/services/github_service.py`

```python
class GitHubService:
    async def fetch_user_repos(self, username: str) -> List[Repository]
    async def get_repo_readme(self, repo_url: str) -> str
    async def extract_tech_stack(self, repo: Repository) -> List[str]
```

---

## Background Jobs (Celery Tasks)

### Periodic Tasks
```python
# backend/tasks/scraper_tasks.py

@celery.task
def scrape_upwork_jobs():
    """Run every 5 minutes"""
    
@celery.task
def scrape_fiverr_jobs():
    """Run every 5 minutes"""
    
@celery.task
def scrape_linkedin_jobs():
    """Run every 10 minutes"""

@celery.task
def process_new_jobs():
    """Process jobs in queue, run filters, generate proposals"""
    
@celery.task
def cleanup_old_jobs():
    """Archive jobs older than 30 days"""
    
@celery.task
def sync_github_repos():
    """Sync GitHub repos for all users daily"""
```

---

## Chrome Extension Structure

```
extension/
├── manifest.json
├── background/
│   ├── service-worker.ts       # Background script
│   └── websocket-client.ts     # Real-time updates
├── content/
│   ├── upwork-content.tsx      # Upwork page injection
│   ├── fiverr-content.tsx      # Fiverr page injection
│   └── linkedin-content.tsx    # LinkedIn page injection
├── popup/
│   ├── index.tsx               # Extension popup
│   └── components/
│       ├── JobList.tsx
│       ├── ProposalPreview.tsx
│       └── Settings.tsx
├── components/
│   ├── ProposalPanel.tsx       # Injected sidebar
│   ├── MatchScore.tsx
│   └── RepoCard.tsx
└── utils/
    ├── api-client.ts
    ├── dom-parser.ts
    └── storage.ts
```

### Extension Features

**Content Script Injection**:
- Detects job page URL
- Extracts job details from DOM
- Injects proposal panel sidebar
- Pre-fills proposal textarea
- Shows match score and relevant repos

**Background Service Worker**:
- Maintains WebSocket connection to backend
- Receives real-time job notifications
- Syncs application status
- Handles authentication

**Popup UI**:
- Quick view of recent matching jobs
- Application tracking
- Settings shortcut

---

## Dashboard Features

### Pages

1. **Dashboard** (`/dashboard`)
   - Jobs detected today
   - Applications sent
   - Client response rate
   - Interview rate
   - Recent matching jobs

2. **Jobs** (`/jobs`)
   - List of all detected jobs
   - Filters: platform, budget, best match, proposal count
   - Sort: newest, best match, highest budget
   - Quick actions: generate proposal, view details

3. **Applications** (`/applications`)
   - All applications with status
   - Filter by status: pending, submitted, replied, interview, hired
   - Track client responses
   - View proposal history

4. **Profile** (`/profile`)
   - Personal info
   - CV upload
   - Skills management
   - GitHub integration
   - Portfolio projects

5. **Preferences** (`/preferences`)
   - Filter settings
   - Connect budget limits
   - Notification preferences
   - Platform selection

6. **Analytics** (`/analytics`)
   - Job detection trends
   - Application success rate
   - Best performing proposal styles
   - Platform comparison
   - Earnings tracking

---

## Development Phases

### Phase 1: MVP (Weeks 1-4)

**Week 1: Foundation**
- [ ] Project setup (monorepo structure)
- [ ] Database schema implementation
- [ ] FastAPI backend skeleton
- [ ] Authentication system
- [ ] User profile CRUD

**Week 2: Job Scraping**
- [ ] Upwork scraper with Playwright
- [ ] Job detection and storage
- [ ] Basic filter pipeline
- [ ] Celery task queue setup
- [ ] Redis integration

**Week 3: AI Integration**
- [ ] OpenAI API integration
- [ ] Embedding generation
- [ ] Skill matching algorithm
- [ ] Basic proposal generator
- [ ] GitHub repo fetching

**Week 4: Notifications & Testing**
- [ ] Email notification service
- [ ] Telegram bot integration
- [ ] End-to-end testing
- [ ] Bug fixes
- [ ] MVP deployment

**MVP Deliverables**:
- Upwork job scraping every 5 minutes
- Basic skill matching
- AI proposal generation
- Email notifications
- Simple dashboard

---

### Phase 2: V2 - Advanced Filters (Weeks 5-7)

**Week 5: Smart Filters**
- [ ] Best Match detection
- [ ] Proposal count filter
- [ ] Connect budget system
- [ ] Client rating filter
- [ ] Budget range filter
- [ ] Job age filter

**Week 6: Enhanced AI**
- [ ] GitHub repo matching with embeddings
- [ ] Portfolio project matching
- [ ] Improved proposal templates
- [ ] Multi-style proposals (formal, casual, technical)
- [ ] Proposal A/B testing framework

**Week 7: Dashboard V2**
- [ ] Advanced analytics
- [ ] Job scoring system
- [ ] Filter customization UI
- [ ] Application tracking improvements
- [ ] Performance optimization

**V2 Deliverables**:
- Complete filter pipeline
- Smart job scoring
- Enhanced proposal quality
- Advanced dashboard

---

### Phase 3: V3 - Chrome Extension & Multi-Platform (Weeks 8-12)

**Week 8: Extension Foundation**
- [ ] Plasmo setup
- [ ] Content script for Upwork
- [ ] Proposal panel UI
- [ ] DOM parsing for job details
- [ ] Extension authentication

**Week 9: Extension Features**
- [ ] One-click proposal insertion
- [ ] Match score display
- [ ] Relevant repo cards
- [ ] Application tracking from extension
- [ ] Real-time notifications

**Week 10: Multi-Platform**
- [ ] Fiverr scraper
- [ ] LinkedIn scraper
- [ ] Platform-specific proposal styles
- [ ] Extension support for Fiverr
- [ ] Extension support for LinkedIn

**Week 11: Advanced Features**
- [ ] Proposal learning system
- [ ] Success rate tracking
- [ ] Auto-optimization based on results
- [ ] Follow-up message generator
- [ ] Interview scheduler integration

**Week 12: Polish & Launch**
- [ ] Comprehensive testing
- [ ] Performance optimization
- [ ] Security audit
- [ ] Documentation
- [ ] Production deployment
- [ ] Chrome Web Store submission

**V3 Deliverables**:
- Full Chrome extension
- Multi-platform support (Upwork, Fiverr, LinkedIn)
- AI learning from success rates
- Complete analytics dashboard
- Production-ready system

---

## Deployment Architecture

### Development Environment
```yaml
services:
  backend:
    image: ai-job-hunter-backend:dev
    ports: ["8000:8000"]
    
  postgres:
    image: postgres:15
    
  redis:
    image: redis:7
    
  celery-worker:
    image: ai-job-hunter-backend:dev
    command: celery -A app.celery worker
    
  celery-beat:
    image: ai-job-hunter-backend:dev
    command: celery -A app.celery beat
    
  frontend:
    image: ai-job-hunter-frontend:dev
    ports: ["3000:3000"]
```

### Production Environment
- **Backend**: AWS ECS / DigitalOcean App Platform
- **Database**: AWS RDS PostgreSQL / Managed PostgreSQL
- **Redis**: AWS ElastiCache / Managed Redis
- **Vector DB**: Pinecone (managed)
- **Frontend**: Vercel / Netlify
- **Storage**: AWS S3 (for CVs, images)
- **CDN**: CloudFlare

---

## Security Considerations

1. **Scraping Safety**
   - Rotating proxies
   - Random delays between requests
   - User-agent rotation
   - Respect robots.txt
   - Rate limiting

2. **Data Protection**
   - Encrypt sensitive data at rest
   - HTTPS only
   - JWT with short expiration
   - Secure password hashing (bcrypt)
   - API rate limiting

3. **Extension Security**
   - Content Security Policy
   - Secure message passing
   - Token storage in chrome.storage
   - CORS configuration

---

## Performance Targets

- Job detection: < 10 minutes
- Proposal generation: < 5 seconds
- API response time: < 200ms (p95)
- Dashboard load time: < 2 seconds
- Extension injection: < 500ms
- Notification delivery: < 3 seconds

---

## Success Metrics

### Technical Metrics
- Uptime: > 99.5%
- Jobs detected per day: > 100
- False positive rate: < 10%
- Proposal generation success: > 95%

### Business Metrics
- Applications sent per user per day: 10-30
- Client response rate: > 15%
- Interview rate: > 5%
- Hire rate: > 2%

---

## Cost Estimation

### Monthly Costs (Estimated)
- **OpenAI API**: $100-300 (depending on usage)
- **Pinecone**: $70 (Starter plan)
- **Server Hosting**: $50-200 (DigitalOcean/AWS)
- **Database**: $25-100 (Managed PostgreSQL)
- **Redis**: $10-50 (Managed Redis)
- **Proxies**: $50-150 (for scraping)
- **Total**: ~$305-870/month

### Scaling Costs
- Per 1000 users: +$200-400/month
- Per 10,000 jobs/day: +$100-200/month

---

## Risk Mitigation

### Technical Risks
1. **Platform blocking scrapers**
   - Mitigation: Rotating proxies, stealth mode, fallback to manual monitoring
   
2. **AI API rate limits**
   - Mitigation: Caching, batch processing, fallback to templates
   
3. **Extension store rejection**
   - Mitigation: Clear ToS compliance, privacy policy, manual submission option

### Business Risks
1. **Platform ToS violations**
   - Mitigation: Personal use only, no auto-submission, user consent
   
2. **Low adoption**
   - Mitigation: Free tier, referral program, content marketing

---

## Next Steps

1. **Immediate**: Set up project repository structure
2. **Day 1**: Initialize backend and database
3. **Day 2**: Build first Upwork scraper
4. **Week 1**: Complete MVP foundation
5. **Week 4**: Launch MVP to beta users
6. **Week 8**: Release V2 with advanced filters
7. **Week 12**: Launch V3 with Chrome extension

---

## Team Roles Recommendation

- **Backend Developer** (2): FastAPI, Celery, scrapers
- **Frontend Developer** (1): Next.js dashboard
- **Extension Developer** (1): Chrome extension
- **AI/ML Engineer** (1): Proposal generation, embeddings
- **DevOps Engineer** (1): Deployment, monitoring
- **QA Engineer** (1): Testing, automation
- **Product Manager** (1): Coordination, requirements

**Total Team Size**: 8 people for 12-week timeline

---

## Repository Structure

```
ai-job-hunter/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── services/
│   │   ├── tasks/
│   │   └── utils/
│   ├── tests/
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   └── package.json
├── extension/
│   ├── background/
│   ├── content/
│   ├── popup/
│   ├── manifest.json
│   └── package.json
├── docker-compose.yml
├── .github/
│   └── workflows/
└── docs/
```
