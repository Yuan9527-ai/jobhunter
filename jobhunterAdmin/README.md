# AI Job Hunter Agent

An AI-powered system that automatically monitors freelance platforms (Upwork, Fiverr, LinkedIn), detects relevant job postings, generates personalized proposals, and assists users through a Chrome extension.

## 🎯 Features

### Core Features
- **Automated Job Monitoring**: Scrapes Upwork, Fiverr, and LinkedIn every 5-10 minutes
- **Smart Filtering**: 
  - Best Match prioritization
  - Proposal count limits
  - Connect budget management
  - Client rating filters
  - Budget range filters
- **AI Proposal Generation**: Creates personalized proposals using GPT-4
- **GitHub Integration**: Automatically matches relevant repositories to jobs
- **Portfolio Matching**: Selects relevant portfolio projects
- **Multi-Channel Notifications**: Email, Telegram, Discord
- **Chrome Extension**: One-click proposal insertion on job pages
- **Analytics Dashboard**: Track applications, response rates, and success metrics

### Smart Job Scoring
Jobs are scored 0-100 based on:
- Skill match (30%)
- Best Match status (25%)
- Client quality (20%)
- Proposal count (15%)
- Budget alignment (10%)

## 🏗️ Architecture

```
Job Scrapers → Filter Pipeline → AI Matching → Proposal Generator → Notifications
                                                                    ↓
                                                            Chrome Extension
                                                                    ↓
                                                            User Reviews & Submits
```

## 🛠️ Tech Stack

### Backend
- **Framework**: Python FastAPI
- **Database**: PostgreSQL with pgvector
- **Cache**: Redis
- **Task Queue**: Celery
- **Scraping**: Playwright + BeautifulSoup
- **AI**: OpenAI API (GPT-4, Embeddings)
- **Vector DB**: Pinecone

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI**: shadcn/ui + Tailwind CSS
- **State**: Zustand
- **API Client**: TanStack Query

### Extension
- **Framework**: Plasmo (React-based)
- **Build**: Vite

### DevOps
- **Containers**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Hosting**: AWS / DigitalOcean / Render

## 📋 Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (optional)
- OpenAI API key
- GitHub personal access token

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/ai-job-hunter.git
cd ai-job-hunter
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Edit .env with your credentials
# - DATABASE_URL
# - REDIS_URL
# - OPENAI_API_KEY
# - GITHUB_TOKEN

# Run migrations
alembic upgrade head

# Start backend
uvicorn app.main:app --reload
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Edit .env.local with API URL

# Start frontend
npm run dev
```

### 4. Extension Setup

```bash
cd extension

# Install dependencies
npm install

# Build extension
npm run build

# Load in Chrome:
# 1. Go to chrome://extensions/
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select the extension/build folder
```

### 5. Using Docker (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services will be available at:
- Backend API: http://localhost:8000
- Frontend: http://localhost:3000
- PostgreSQL: localhost:5432
- Redis: localhost:6379

## 📚 Documentation

- [Project Plan](PROJECT_PLAN.md) - Complete project overview
- [Technical Specification](TECHNICAL_SPEC.md) - Detailed technical docs
- [Development Spec](DEVELOPMENT_SPEC.md) - Team workflow and guidelines
- [Issues Summary](ISSUES_SUMMARY.md) - All GitHub issues organized

## 🎯 Development Roadmap

### Phase 1: MVP (Weeks 1-4) ✅
- [x] Backend foundation
- [x] Upwork scraper
- [x] AI proposal generation
- [x] Email notifications
- [x] Basic dashboard

### Phase 2: Advanced Features (Weeks 5-7) 🚧
- [ ] Smart filters (Best Match, proposal count, etc.)
- [ ] Enhanced AI matching
- [ ] Advanced analytics
- [ ] Filter customization UI

### Phase 3: Extension & Multi-Platform (Weeks 8-12) 📅
- [ ] Chrome extension
- [ ] Fiverr scraper
- [ ] LinkedIn scraper
- [ ] Production deployment
- [ ] Chrome Web Store submission

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Pick an Issue**: Browse [GitHub Issues](../../issues) and find one labeled `good-first-issue`
2. **Claim It**: Comment on the issue to let others know you're working on it
3. **Create Branch**: `git checkout -b feature/issue-123-description`
4. **Make Changes**: Follow our coding standards
5. **Write Tests**: Ensure tests pass
6. **Submit PR**: Reference the issue number in your PR

### Branch Naming Convention
```
feature/issue-123-job-scraper
bugfix/issue-456-filter-error
enhancement/issue-789-ui-improvement
```

### Commit Message Format
```
[#123] Add Upwork job scraper

- Implement base scraper class
- Add Playwright stealth mode
- Extract job details from DOM
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
pytest --cov=app tests/  # With coverage
```

### Frontend Tests
```bash
cd frontend
npm test
npm run test:coverage
```

### Extension Tests
```bash
cd extension
npm test
```

## 📊 Project Structure

```
ai-job-hunter/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── api/         # API endpoints
│   │   ├── models/      # Database models
│   │   ├── services/    # Business logic
│   │   ├── tasks/       # Celery tasks
│   │   └── utils/       # Utilities
│   └── tests/
├── frontend/            # Next.js dashboard
│   ├── app/            # App router pages
│   ├── components/     # React components
│   └── lib/            # Utilities
├── extension/          # Chrome extension
│   ├── background/     # Service worker
│   ├── content/        # Content scripts
│   ├── popup/          # Popup UI
│   └── components/     # React components
├── issues/             # GitHub issues (markdown)
├── scripts/            # Utility scripts
└── docs/               # Documentation
```

## 🔐 Security

- Never commit `.env` files
- Use environment variables for secrets
- Rotate API keys regularly
- Follow platform ToS
- Don't auto-submit applications (manual review required)

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- OpenAI for GPT-4 and embeddings API
- Playwright for web scraping capabilities
- All contributors and team members

## 📞 Support

- **Issues**: [GitHub Issues](../../issues)
- **Discussions**: [GitHub Discussions](../../discussions)
- **Email**: support@example.com

## 🎉 Team

- **Backend Team**: 2 developers
- **Frontend Team**: 1 developer
- **Extension Team**: 1 developer
- **AI/ML Team**: 1 developer
- **DevOps Team**: 1 developer
- **QA Team**: 1 developer

---

**Note**: This system is designed for personal use to assist freelancers. Always review proposals before submitting and respect platform terms of service.
