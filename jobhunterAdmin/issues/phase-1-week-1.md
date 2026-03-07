# Phase 1 - Week 1: Foundation Issues

## Issue #1: Project Setup and Repository Structure
**Labels**: `phase-1-mvp`, `devops`, `priority-high`, `good-first-issue`
**Milestone**: MVP - Week 1: Foundation
**Assignee**: DevOps Team

### Description
Set up the monorepo structure with backend, frontend, and extension folders. Initialize Git repository with proper .gitignore and README.

### Tasks
- [ ] Create monorepo structure
- [ ] Initialize backend (Python/FastAPI)
- [ ] Initialize frontend (Next.js)
- [ ] Initialize extension (Plasmo)
- [ ] Create .gitignore files
- [ ] Create README.md with setup instructions
- [ ] Set up .env.example files

### Acceptance Criteria
- [ ] Repository structure matches DEVELOPMENT_SPEC.md
- [ ] All folders initialized with package managers
- [ ] README has clear setup instructions
- [ ] .gitignore excludes node_modules, venv, .env

---

## Issue #2: Database Schema Implementation
**Labels**: `phase-1-mvp`, `backend`, `priority-high`
**Milestone**: MVP - Week 1: Foundation
**Assignee**: Backend Team

### Description
Implement PostgreSQL database schema with all required tables and relationships.

### Tasks
- [ ] Set up PostgreSQL with Docker
- [ ] Install pgvector extension for embeddings
- [ ] Create users table
- [ ] Create user_skills table
- [ ] Create user_preferences table
- [ ] Create jobs table
- [ ] Create github_repositories table
- [ ] Create portfolio_projects table
- [ ] Create applications table
- [ ] Create notifications table
- [ ] Create scraper_logs table
- [ ] Add indexes for performance
- [ ] Set up Alembic for migrations

### Acceptance Criteria
- [ ] All tables created with proper relationships
- [ ] Foreign keys and constraints in place
- [ ] Indexes created for common queries
- [ ] Migration scripts work correctly
- [ ] Database can be reset and recreated easily

---

## Issue #3: FastAPI Backend Skeleton
**Labels**: `phase-1-mvp`, `backend`, `priority-high`
**Milestone**: MVP - Week 1: Foundation
**Assignee**: Backend Team

### Description
Create FastAPI application structure with basic configuration, database connection, and health check endpoint.

### Tasks
- [ ] Install FastAPI and dependencies
- [ ] Create main.py with FastAPI app
- [ ] Set up database connection with SQLAlchemy
- [ ] Create config.py for environment variables
- [ ] Add CORS middleware
- [ ] Create health check endpoint
- [ ] Set up logging
- [ ] Create Docker container for backend

### Acceptance Criteria
- [ ] FastAPI server runs on port 8000
- [ ] Health check endpoint returns 200
- [ ] Database connection works
- [ ] Environment variables loaded correctly
- [ ] Docker container builds and runs

---

## Issue #4: Authentication System
**Labels**: `phase-1-mvp`, `backend`, `priority-high`
**Milestone**: MVP - Week 1: Foundation
**Assignee**: Backend Team

### Description
Implement JWT-based authentication with register, login, and token refresh endpoints.

### Tasks
- [ ] Install python-jose and passlib
- [ ] Create User model
- [ ] Implement password hashing
- [ ] Create JWT token generation
- [ ] Create JWT token verification
- [ ] Implement /api/auth/register endpoint
- [ ] Implement /api/auth/login endpoint
- [ ] Implement /api/auth/refresh endpoint
- [ ] Implement /api/auth/me endpoint
- [ ] Add authentication dependency for protected routes
- [ ] Write unit tests

### Acceptance Criteria
- [ ] Users can register with email/password
- [ ] Users can login and receive JWT token
- [ ] Token refresh works correctly
- [ ] Protected routes require valid token
- [ ] Passwords are hashed securely
- [ ] All tests pass

---

## Issue #5: User Profile CRUD API
**Labels**: `phase-1-mvp`, `backend`, `priority-medium`
**Milestone**: MVP - Week 1: Foundation
**Assignee**: Backend Team

### Description
Create API endpoints for managing user profiles, skills, and preferences.

### Tasks
- [ ] Implement GET /api/users/profile
- [ ] Implement PUT /api/users/profile
- [ ] Implement POST /api/users/upload-cv
- [ ] Implement GET /api/users/skills
- [ ] Implement POST /api/users/skills
- [ ] Implement DELETE /api/users/skills/{id}
- [ ] Implement GET /api/preferences
- [ ] Implement PUT /api/preferences
- [ ] Add file upload handling for CV
- [ ] Write unit tests

### Acceptance Criteria
- [ ] All endpoints work correctly
- [ ] CV upload saves file to storage
- [ ] Skills can be added/removed
- [ ] Preferences can be updated
- [ ] All tests pass

---

## Issue #6: Redis Setup and Cache Service
**Labels**: `phase-1-mvp`, `backend`, `priority-medium`
**Milestone**: MVP - Week 1: Foundation
**Assignee**: Backend Team

### Description
Set up Redis for caching and create cache service for frequently accessed data.

### Tasks
- [ ] Add Redis to docker-compose.yml
- [ ] Install redis-py
- [ ] Create CacheService class
- [ ] Implement cache methods (get, set, delete)
- [ ] Add TTL configuration
- [ ] Create cache decorators
- [ ] Write unit tests

### Acceptance Criteria
- [ ] Redis container runs successfully
- [ ] CacheService can store and retrieve data
- [ ] TTL works correctly
- [ ] Cache decorators work on functions
- [ ] All tests pass

---

## Issue #7: Celery Task Queue Setup
**Labels**: `phase-1-mvp`, `backend`, `priority-high`
**Milestone**: MVP - Week 1: Foundation
**Assignee**: Backend Team

### Description
Set up Celery with Redis as broker for background task processing.

### Tasks
- [ ] Install Celery
- [ ] Configure Celery with Redis broker
- [ ] Create celery.py configuration
- [ ] Create tasks/__init__.py
- [ ] Add Celery worker to docker-compose
- [ ] Add Celery beat for periodic tasks
- [ ] Create sample task for testing
- [ ] Write unit tests

### Acceptance Criteria
- [ ] Celery worker starts successfully
- [ ] Celery beat schedules tasks
- [ ] Sample task executes correctly
- [ ] Tasks can be monitored
- [ ] All tests pass
