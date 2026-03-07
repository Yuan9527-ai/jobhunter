#!/usr/bin/env node
/**
 * Create Phase 1 GitHub issues
 * Usage: GITHUB_TOKEN=your_token node scripts/create-issues.js
 */

const https = require('https');

const REPO_OWNER = 'adenueltech';
const REPO_NAME = 'jobhunter';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  console.error('❌ Please set GITHUB_TOKEN environment variable');
  console.error('Get token from: https://github.com/settings/tokens');
  console.error('\nUsage: GITHUB_TOKEN=your_token node scripts/create-issues.js');
  process.exit(1);
}

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      port: 443,
      path: `/repos/${REPO_OWNER}/${REPO_NAME}${path}`,
      method: method,
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'User-Agent': 'Node.js',
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(body || '{}'));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}


// Labels
const LABELS = [
  { name: 'phase-1-mvp', color: '0E8A16', description: 'MVP features' },
  { name: 'backend', color: 'D93F0B', description: 'Backend tasks' },
  { name: 'frontend', color: 'FBCA04', description: 'Frontend tasks' },
  { name: 'devops', color: '0052CC', description: 'DevOps tasks' },
  { name: 'priority-high', color: 'B60205', description: 'High priority' },
  { name: 'priority-medium', color: 'FFA500', description: 'Medium priority' },
  { name: 'good-first-issue', color: '7057FF', description: 'Good for newcomers' }
];

// Milestones
const MILESTONES = [
  { title: 'MVP - Week 1: Foundation', description: 'Project setup, database, authentication' },
  { title: 'MVP - Week 2: Job Scraping', description: 'Upwork scraper, job detection' },
  { title: 'MVP - Week 3: AI Integration', description: 'OpenAI, embeddings, proposal generation' },
  { title: 'MVP - Week 4: Notifications', description: 'Email, Telegram, frontend, deployment' }
];

async function createLabels() {
  console.log('\n📝 Creating labels...');
  for (const label of LABELS) {
    try {
      await makeRequest('POST', '/labels', label);
      console.log(`✅ Created label: ${label.name}`);
    } catch (error) {
      if (error.message.includes('422')) {
        console.log(`⏭️  Label already exists: ${label.name}`);
      } else {
        console.error(`❌ Error creating label ${label.name}:`, error.message);
      }
    }
  }
}

async function createMilestones() {
  console.log('\n🎯 Creating milestones...');
  const createdMilestones = {};
  
  for (const milestone of MILESTONES) {
    try {
      const result = await makeRequest('POST', '/milestones', milestone);
      createdMilestones[milestone.title] = result.number;
      console.log(`✅ Created milestone: ${milestone.title}`);
    } catch (error) {
      if (error.message.includes('422')) {
        console.log(`⏭️  Milestone already exists: ${milestone.title}`);
        // Get existing milestone
        const milestones = await makeRequest('GET', '/milestones');
        const existing = milestones.find(m => m.title === milestone.title);
        if (existing) createdMilestones[milestone.title] = existing.number;
      } else {
        console.error(`❌ Error creating milestone ${milestone.title}:`, error.message);
      }
    }
  }
  
  return createdMilestones;
}


// Phase 1 Issues (Week 1-4)
const PHASE1_ISSUES = [
  // Week 1
  {
    title: 'Project Setup and Repository Structure',
    labels: ['phase-1-mvp', 'devops', 'priority-high', 'good-first-issue'],
    milestone: 'MVP - Week 1: Foundation',
    body: `## Description
Set up the monorepo structure with backend, frontend, and extension folders.

## Tasks
- [ ] Create monorepo structure
- [ ] Initialize backend (Python/FastAPI)
- [ ] Initialize frontend (Next.js)
- [ ] Initialize extension (Plasmo)
- [ ] Create .gitignore files
- [ ] Set up .env.example files

## Acceptance Criteria
- [ ] Repository structure matches DEVELOPMENT_SPEC.md
- [ ] All folders initialized with package managers
- [ ] README has clear setup instructions`
  },
  {
    title: 'Database Schema Implementation',
    labels: ['phase-1-mvp', 'backend', 'priority-high'],
    milestone: 'MVP - Week 1: Foundation',
    body: `## Description
Implement PostgreSQL database schema with all required tables.

## Tasks
- [ ] Set up PostgreSQL with Docker
- [ ] Install pgvector extension
- [ ] Create all tables (users, jobs, applications, etc.)
- [ ] Add indexes for performance
- [ ] Set up Alembic for migrations

## Acceptance Criteria
- [ ] All tables created with proper relationships
- [ ] Foreign keys and constraints in place
- [ ] Migration scripts work correctly`
  },
  {
    title: 'FastAPI Backend Skeleton',
    labels: ['phase-1-mvp', 'backend', 'priority-high'],
    milestone: 'MVP - Week 1: Foundation',
    body: `## Description
Create FastAPI application structure with basic configuration.

## Tasks
- [ ] Install FastAPI and dependencies
- [ ] Create main.py with FastAPI app
- [ ] Set up database connection with SQLAlchemy
- [ ] Create config.py for environment variables
- [ ] Add CORS middleware
- [ ] Create health check endpoint
- [ ] Create Docker container for backend

## Acceptance Criteria
- [ ] FastAPI server runs on port 8000
- [ ] Health check endpoint returns 200
- [ ] Database connection works
- [ ] Docker container builds and runs`
  },
  {
    title: 'Authentication System',
    labels: ['phase-1-mvp', 'backend', 'priority-high'],
    milestone: 'MVP - Week 1: Foundation',
    body: `## Description
Implement JWT-based authentication with register, login, and token refresh.

## Tasks
- [ ] Create User model
- [ ] Implement password hashing
- [ ] Create JWT token generation
- [ ] Implement /api/auth/register endpoint
- [ ] Implement /api/auth/login endpoint
- [ ] Implement /api/auth/refresh endpoint
- [ ] Add authentication dependency for protected routes
- [ ] Write unit tests

## Acceptance Criteria
- [ ] Users can register with email/password
- [ ] Users can login and receive JWT token
- [ ] Protected routes require valid token
- [ ] All tests pass`
  },
  {
    title: 'User Profile CRUD API',
    labels: ['phase-1-mvp', 'backend', 'priority-medium'],
    milestone: 'MVP - Week 1: Foundation',
    body: `## Description
Create API endpoints for managing user profiles, skills, and preferences.

## Tasks
- [ ] Implement GET /api/users/profile
- [ ] Implement PUT /api/users/profile
- [ ] Implement POST /api/users/upload-cv
- [ ] Implement GET /api/users/skills
- [ ] Implement POST /api/users/skills
- [ ] Implement DELETE /api/users/skills/{id}
- [ ] Write unit tests

## Acceptance Criteria
- [ ] All endpoints work correctly
- [ ] CV upload saves file to storage
- [ ] Skills can be added/removed
- [ ] All tests pass`
  },
  {
    title: 'Redis Setup and Cache Service',
    labels: ['phase-1-mvp', 'backend', 'priority-medium'],
    milestone: 'MVP - Week 1: Foundation',
    body: `## Description
Set up Redis for caching and create cache service.

## Tasks
- [ ] Add Redis to docker-compose.yml
- [ ] Install redis-py
- [ ] Create CacheService class
- [ ] Implement cache methods (get, set, delete)
- [ ] Add TTL configuration
- [ ] Write unit tests

## Acceptance Criteria
- [ ] Redis container runs successfully
- [ ] CacheService can store and retrieve data
- [ ] TTL works correctly
- [ ] All tests pass`
  },
  {
    title: 'Celery Task Queue Setup',
    labels: ['phase-1-mvp', 'backend', 'priority-high'],
    milestone: 'MVP - Week 1: Foundation',
    body: `## Description
Set up Celery with Redis as broker for background task processing.

## Tasks
- [ ] Install Celery
- [ ] Configure Celery with Redis broker
- [ ] Create celery.py configuration
- [ ] Add Celery worker to docker-compose
- [ ] Add Celery beat for periodic tasks
- [ ] Create sample task for testing
- [ ] Write unit tests

## Acceptance Criteria
- [ ] Celery worker starts successfully
- [ ] Celery beat schedules tasks
- [ ] Sample task executes correctly
- [ ] All tests pass`
  },
  // Week 2
  {
    title: 'Base Scraper Class',
    labels: ['phase-1-mvp', 'backend', 'priority-high'],
    milestone: 'MVP - Week 2: Job Scraping',
    body: `## Description
Create abstract base scraper class that all platform scrapers will inherit from.

## Tasks
- [ ] Create services/scrapers/base_scraper.py
- [ ] Define abstract methods
- [ ] Implement proxy rotation logic
- [ ] Implement user-agent rotation
- [ ] Add random delay functionality
- [ ] Add error handling and retry logic
- [ ] Write unit tests

## Acceptance Criteria
- [ ] BaseScraper class is abstract
- [ ] Proxy rotation works
- [ ] Random delays between requests
- [ ] All tests pass`
  },
  {
    title: 'Playwright Setup and Stealth Mode',
    labels: ['phase-1-mvp', 'backend', 'priority-high'],
    milestone: 'MVP - Week 2: Job Scraping',
    body: `## Description
Set up Playwright with stealth mode to avoid bot detection.

## Tasks
- [ ] Install Playwright
- [ ] Install browser binaries
- [ ] Create stealth configuration
- [ ] Implement anti-detection measures
- [ ] Add headless browser setup
- [ ] Test on Upwork (without scraping)
- [ ] Document stealth techniques

## Acceptance Criteria
- [ ] Playwright launches successfully
- [ ] Stealth mode bypasses basic detection
- [ ] Browser context can be reused
- [ ] Documentation complete`
  },
  {
    title: 'Upwork Job Scraper',
    labels: ['phase-1-mvp', 'backend', 'priority-high'],
    milestone: 'MVP - Week 2: Job Scraping',
    body: `## Description
Implement Upwork scraper to detect new job postings.

## Tasks
- [ ] Create services/scrapers/upwork_scraper.py
- [ ] Implement job search page navigation
- [ ] Extract job cards from search results
- [ ] Parse job title, description, budget
- [ ] Detect "Best Match" badge
- [ ] Extract proposal count
- [ ] Extract connects required
- [ ] Extract client information
- [ ] Store jobs in database
- [ ] Handle pagination
- [ ] Write unit tests

## Acceptance Criteria
- [ ] Scraper detects new jobs
- [ ] All job fields extracted correctly
- [ ] Best Match detection works
- [ ] Jobs saved to database
- [ ] All tests pass`
  },
  {
    title: 'Job Model and Database Operations',
    labels: ['phase-1-mvp', 'backend', 'priority-high'],
    milestone: 'MVP - Week 2: Job Scraping',
    body: `## Description
Create Job model and database operations for storing and querying jobs.

## Tasks
- [ ] Create models/job.py
- [ ] Implement Job SQLAlchemy model
- [ ] Create job CRUD operations
- [ ] Implement duplicate detection
- [ ] Add job status management
- [ ] Write unit tests

## Acceptance Criteria
- [ ] Job model matches database schema
- [ ] CRUD operations work correctly
- [ ] Duplicate jobs not inserted
- [ ] All tests pass`
  },
  {
    title: 'Scraper Celery Task',
    labels: ['phase-1-mvp', 'backend', 'priority-high'],
    milestone: 'MVP - Week 2: Job Scraping',
    body: `## Description
Create Celery task to run Upwork scraper every 5 minutes.

## Tasks
- [ ] Create tasks/scraper_tasks.py
- [ ] Implement scrape_upwork_jobs task
- [ ] Configure periodic task (every 5 minutes)
- [ ] Add task logging
- [ ] Implement error handling
- [ ] Write unit tests

## Acceptance Criteria
- [ ] Task runs every 5 minutes
- [ ] Jobs are detected and stored
- [ ] Errors are logged
- [ ] All tests pass`
  },
  {
    title: 'Job Detection API Endpoints',
    labels: ['phase-1-mvp', 'backend', 'priority-medium'],
    milestone: 'MVP - Week 2: Job Scraping',
    body: `## Description
Create API endpoints for viewing detected jobs.

## Tasks
- [ ] Create api/jobs.py
- [ ] Implement GET /api/jobs (list all jobs)
- [ ] Implement GET /api/jobs/{id} (job details)
- [ ] Add pagination support
- [ ] Add filtering (platform, budget, date)
- [ ] Add sorting options
- [ ] Write unit tests

## Acceptance Criteria
- [ ] All endpoints work correctly
- [ ] Pagination works
- [ ] Filters work correctly
- [ ] All tests pass`
  },
  {
    title: 'Basic Filter Pipeline',
    labels: ['phase-1-mvp', 'backend', 'priority-medium'],
    milestone: 'MVP - Week 2: Job Scraping',
    body: `## Description
Create basic filter pipeline to filter jobs based on simple criteria.

## Tasks
- [ ] Create services/filter_pipeline.py
- [ ] Implement FilterPipeline class
- [ ] Add budget range filter
- [ ] Add platform filter
- [ ] Add job age filter
- [ ] Write unit tests

## Acceptance Criteria
- [ ] Filters work correctly
- [ ] Multiple filters can be combined
- [ ] Filter results are accurate
- [ ] All tests pass`
  },
  // Week 3
  {
    title: 'OpenAI API Integration',
    labels: ['phase-1-mvp', 'backend', 'priority-high'],
    milestone: 'MVP - Week 3: AI Integration',
    body: `## Description
Set up OpenAI API integration for embeddings and text generation.

## Tasks
- [ ] Install openai package
- [ ] Configure API key in environment
- [ ] Create OpenAI client wrapper
- [ ] Implement rate limiting
- [ ] Add error handling
- [ ] Write unit tests

## Acceptance Criteria
- [ ] OpenAI API calls work
- [ ] Rate limiting prevents overuse
- [ ] Errors handled gracefully
- [ ] All tests pass`
  },
  {
    title: 'Embedding Service',
    labels: ['phase-1-mvp', 'backend', 'priority-high'],
    milestone: 'MVP - Week 3: AI Integration',
    body: `## Description
Create service for generating and managing embeddings using OpenAI.

## Tasks
- [ ] Create services/embedding_service.py
- [ ] Implement generate_embedding method
- [ ] Implement batch embedding generation
- [ ] Add embedding caching
- [ ] Create similarity calculation methods
- [ ] Write unit tests

## Acceptance Criteria
- [ ] Embeddings generated correctly
- [ ] Batch processing works
- [ ] Caching reduces API calls
- [ ] All tests pass`
  },
  {
    title: 'Skill Matching Algorithm',
    labels: ['phase-1-mvp', 'backend', 'priority-high'],
    milestone: 'MVP - Week 3: AI Integration',
    body: `## Description
Implement semantic skill matching using embeddings.

## Tasks
- [ ] Generate embeddings for user skills
- [ ] Generate embeddings for job descriptions
- [ ] Implement similarity scoring
- [ ] Create match threshold logic
- [ ] Optimize for performance
- [ ] Write unit tests

## Acceptance Criteria
- [ ] Skill matching works accurately
- [ ] Match scores between 0-1
- [ ] Threshold filtering works
- [ ] Performance is acceptable (<1s)
- [ ] All tests pass`
  },
  {
    title: 'Basic Proposal Generator',
    labels: ['phase-1-mvp', 'backend', 'priority-high'],
    milestone: 'MVP - Week 3: AI Integration',
    body: `## Description
Create AI-powered proposal generator using GPT-4.

## Tasks
- [ ] Create services/proposal_generator.py
- [ ] Design proposal template structure
- [ ] Implement greeting generation
- [ ] Implement solution approach generation
- [ ] Implement question generation
- [ ] Add proposal caching
- [ ] Write unit tests

## Acceptance Criteria
- [ ] Proposals generated successfully
- [ ] Proposals are coherent and relevant
- [ ] Generation takes <5 seconds
- [ ] All tests pass`
  },
  {
    title: 'GitHub Service Integration',
    labels: ['phase-1-mvp', 'backend', 'priority-medium'],
    milestone: 'MVP - Week 3: AI Integration',
    body: `## Description
Create service to fetch and manage GitHub repositories.

## Tasks
- [ ] Install PyGithub
- [ ] Create services/github_service.py
- [ ] Implement fetch_user_repos method
- [ ] Implement get_repo_readme method
- [ ] Extract tech stack from repo
- [ ] Store repos in database
- [ ] Write unit tests

## Acceptance Criteria
- [ ] Can fetch user repositories
- [ ] README content extracted
- [ ] Tech stack detected
- [ ] Repos stored in database
- [ ] All tests pass`
  },
  {
    title: 'Repository Matching',
    labels: ['phase-1-mvp', 'backend', 'priority-medium'],
    milestone: 'MVP - Week 3: AI Integration',
    body: `## Description
Match GitHub repositories to job descriptions using embeddings.

## Tasks
- [ ] Generate embeddings for repositories
- [ ] Implement repo-to-job matching
- [ ] Rank repositories by relevance
- [ ] Return top 2 most relevant repos
- [ ] Write unit tests

## Acceptance Criteria
- [ ] Repo matching works accurately
- [ ] Top repos are relevant
- [ ] Matching is fast (<2s)
- [ ] All tests pass`
  },
  {
    title: 'Proposal Generation API',
    labels: ['phase-1-mvp', 'backend', 'priority-high'],
    milestone: 'MVP - Week 3: AI Integration',
    body: `## Description
Create API endpoints for proposal generation.

## Tasks
- [ ] Create api/proposals.py
- [ ] Implement POST /api/proposals/generate
- [ ] Implement POST /api/proposals/regenerate
- [ ] Add proposal validation
- [ ] Store generated proposals
- [ ] Write unit tests

## Acceptance Criteria
- [ ] Proposals can be generated via API
- [ ] Regeneration works
- [ ] Proposals stored correctly
- [ ] All tests pass`
  },
  {
    title: 'Application Model and CRUD',
    labels: ['phase-1-mvp', 'backend', 'priority-medium'],
    milestone: 'MVP - Week 3: AI Integration',
    body: `## Description
Create Application model and CRUD operations.

## Tasks
- [ ] Create models/application.py
- [ ] Implement Application SQLAlchemy model
- [ ] Create application CRUD operations
- [ ] Implement status management
- [ ] Create GET /api/applications endpoint
- [ ] Create POST /api/applications endpoint
- [ ] Write unit tests

## Acceptance Criteria
- [ ] Application model works
- [ ] CRUD operations functional
- [ ] Status tracking works
- [ ] All tests pass`
  },
  // Week 4
  {
    title: 'Email Notification Service',
    labels: ['phase-1-mvp', 'backend', 'priority-high'],
    milestone: 'MVP - Week 4: Notifications',
    body: `## Description
Implement email notification service for job alerts.

## Tasks
- [ ] Install email library
- [ ] Create services/notification_service.py
- [ ] Configure SMTP settings
- [ ] Create email templates
- [ ] Implement send_email method
- [ ] Create notification for new matching jobs
- [ ] Write unit tests

## Acceptance Criteria
- [ ] Emails send successfully
- [ ] Templates render correctly
- [ ] All tests pass`
  },
  {
    title: 'Telegram Bot Integration',
    labels: ['phase-1-mvp', 'backend', 'priority-medium'],
    milestone: 'MVP - Week 4: Notifications',
    body: `## Description
Create Telegram bot for instant job notifications.

## Tasks
- [ ] Install python-telegram-bot
- [ ] Create Telegram bot via BotFather
- [ ] Implement send_telegram method
- [ ] Create bot command handlers
- [ ] Implement user registration flow
- [ ] Store Telegram chat IDs
- [ ] Write unit tests

## Acceptance Criteria
- [ ] Bot sends messages successfully
- [ ] Users can register with bot
- [ ] Job notifications formatted well
- [ ] All tests pass`
  },
  {
    title: 'Notification Model and Storage',
    labels: ['phase-1-mvp', 'backend', 'priority-medium'],
    milestone: 'MVP - Week 4: Notifications',
    body: `## Description
Create notification model and storage system.

## Tasks
- [ ] Create models/notification.py
- [ ] Implement Notification SQLAlchemy model
- [ ] Create notification CRUD operations
- [ ] Add read/unread functionality
- [ ] Create GET /api/notifications endpoint
- [ ] Write unit tests

## Acceptance Criteria
- [ ] Notifications stored in database
- [ ] Status tracking works
- [ ] API endpoints functional
- [ ] All tests pass`
  },
  {
    title: 'Job Processing Pipeline',
    labels: ['phase-1-mvp', 'backend', 'priority-high'],
    milestone: 'MVP - Week 4: Notifications',
    body: `## Description
Create end-to-end pipeline: scrape → filter → match → generate → notify.

## Tasks
- [ ] Create process_new_jobs Celery task
- [ ] Integrate scraper with filter pipeline
- [ ] Integrate filter with skill matching
- [ ] Integrate matching with proposal generation
- [ ] Integrate generation with notifications
- [ ] Add pipeline logging
- [ ] Write integration tests

## Acceptance Criteria
- [ ] Pipeline runs end-to-end
- [ ] Each stage works correctly
- [ ] Errors handled gracefully
- [ ] All tests pass`
  },
  {
    title: 'Frontend Project Setup',
    labels: ['phase-1-mvp', 'frontend', 'priority-high', 'good-first-issue'],
    milestone: 'MVP - Week 4: Notifications',
    body: `## Description
Initialize Next.js project with TypeScript and Tailwind CSS.

## Tasks
- [ ] Create Next.js 14 app with App Router
- [ ] Install TypeScript
- [ ] Install and configure Tailwind CSS
- [ ] Install shadcn/ui
- [ ] Set up folder structure
- [ ] Configure API client
- [ ] Write basic tests

## Acceptance Criteria
- [ ] Next.js app runs on port 3000
- [ ] TypeScript configured
- [ ] Tailwind CSS works
- [ ] All tests pass`
  },
  {
    title: 'Authentication Pages (Login/Register)',
    labels: ['phase-1-mvp', 'frontend', 'priority-high'],
    milestone: 'MVP - Week 4: Notifications',
    body: `## Description
Create login and registration pages with form validation.

## Tasks
- [ ] Create app/(auth)/login/page.tsx
- [ ] Create app/(auth)/register/page.tsx
- [ ] Install react-hook-form and zod
- [ ] Create login form with validation
- [ ] Create register form with validation
- [ ] Implement API calls to backend
- [ ] Store JWT token in localStorage
- [ ] Write component tests

## Acceptance Criteria
- [ ] Users can register
- [ ] Users can login
- [ ] Form validation works
- [ ] Tokens stored correctly
- [ ] All tests pass`
  },
  {
    title: 'Dashboard Layout and Navigation',
    labels: ['phase-1-mvp', 'frontend', 'priority-high'],
    milestone: 'MVP - Week 4: Notifications',
    body: `## Description
Create dashboard layout with sidebar navigation.

## Tasks
- [ ] Create app/(dashboard)/layout.tsx
- [ ] Create sidebar component
- [ ] Add navigation links
- [ ] Implement protected route logic
- [ ] Add user menu/profile dropdown
- [ ] Make responsive for mobile
- [ ] Write component tests

## Acceptance Criteria
- [ ] Dashboard layout renders
- [ ] Navigation works
- [ ] Protected routes redirect to login
- [ ] Responsive on mobile
- [ ] All tests pass`
  },
  {
    title: 'Jobs List Page',
    labels: ['phase-1-mvp', 'frontend', 'priority-medium'],
    milestone: 'MVP - Week 4: Notifications',
    body: `## Description
Create page to display detected jobs with filtering.

## Tasks
- [ ] Create app/(dashboard)/jobs/page.tsx
- [ ] Create JobCard component
- [ ] Fetch jobs from API
- [ ] Implement pagination
- [ ] Add basic filters (platform, budget)
- [ ] Add sorting options
- [ ] Write component tests

## Acceptance Criteria
- [ ] Jobs display correctly
- [ ] Pagination works
- [ ] Filters work
- [ ] All tests pass`
  },
  {
    title: 'Docker Compose Configuration',
    labels: ['phase-1-mvp', 'devops', 'priority-high'],
    milestone: 'MVP - Week 4: Notifications',
    body: `## Description
Create docker-compose.yml for local development environment.

## Tasks
- [ ] Create docker-compose.yml
- [ ] Add PostgreSQL service
- [ ] Add Redis service
- [ ] Add backend service
- [ ] Add Celery worker service
- [ ] Add Celery beat service
- [ ] Add frontend service
- [ ] Configure networking
- [ ] Document usage in README

## Acceptance Criteria
- [ ] All services start with docker-compose up
- [ ] Services can communicate
- [ ] Data persists in volumes
- [ ] Documentation complete`
  },
  {
    title: 'End-to-End Testing',
    labels: ['phase-1-mvp', 'backend', 'frontend', 'priority-high'],
    milestone: 'MVP - Week 4: Notifications',
    body: `## Description
Create end-to-end tests for MVP functionality.

## Tasks
- [ ] Set up testing framework (Pytest, Jest)
- [ ] Test user registration flow
- [ ] Test user login flow
- [ ] Test job scraping
- [ ] Test proposal generation
- [ ] Test notification sending
- [ ] Create test data fixtures
- [ ] Document test procedures

## Acceptance Criteria
- [ ] All E2E tests pass
- [ ] Test coverage >80%
- [ ] Tests run in CI/CD
- [ ] Documentation complete`
  },
  {
    title: 'MVP Deployment',
    labels: ['phase-1-mvp', 'devops', 'priority-high'],
    milestone: 'MVP - Week 4: Notifications',
    body: `## Description
Deploy MVP to staging environment.

## Tasks
- [ ] Choose hosting provider
- [ ] Set up server/container
- [ ] Configure environment variables
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Set up database
- [ ] Configure Redis
- [ ] Set up SSL certificates
- [ ] Test deployment
- [ ] Document deployment process

## Acceptance Criteria
- [ ] MVP accessible via URL
- [ ] All services running
- [ ] HTTPS enabled
- [ ] Documentation complete`
  }
];

async function createIssues(milestones) {
  console.log('\n🎫 Creating Phase 1 issues...');
  let created = 0;
  
  for (const issue of PHASE1_ISSUES) {
    try {
      const milestoneNumber = milestones[issue.milestone];
      const issueData = {
        title: issue.title,
        body: issue.body,
        labels: issue.labels,
        milestone: milestoneNumber
      };
      
      const result = await makeRequest('POST', '/issues', issueData);
      console.log(`✅ Created issue #${result.number}: ${issue.title}`);
      created++;
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`❌ Error creating issue "${issue.title}":`, error.message);
    }
  }
  
  return created;
}

async function main() {
  console.log('🚀 AI Job Hunter - Phase 1 Issue Creator');
  console.log(`📦 Repository: ${REPO_OWNER}/${REPO_NAME}`);
  
  try {
    await createLabels();
    const milestones = await createMilestones();
    const created = await createIssues(milestones);
    
    console.log(`\n✨ Done! Created ${created} issues out of ${PHASE1_ISSUES.length}`);
    console.log(`\n🔗 View issues: https://github.com/${REPO_OWNER}/${REPO_NAME}/issues`);
  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

main();
