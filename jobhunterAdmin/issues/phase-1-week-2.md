# Phase 1 - Week 2: Job Scraping Issues

## Issue #8: Base Scraper Class
**Labels**: `phase-1-mvp`, `backend`, `priority-high`
**Milestone**: MVP - Week 2: Job Scraping
**Assignee**: Backend Team

### Description
Create abstract base scraper class that all platform scrapers will inherit from.

### Tasks
- [ ] Create services/scrapers/base_scraper.py
- [ ] Define abstract methods (scrape_jobs, get_job_details)
- [ ] Implement proxy rotation logic
- [ ] Implement user-agent rotation
- [ ] Add random delay functionality
- [ ] Add error handling and retry logic
- [ ] Create scraper configuration class
- [ ] Write unit tests

### Acceptance Criteria
- [ ] BaseScraper class is abstract
- [ ] Proxy rotation works
- [ ] User-agent rotation works
- [ ] Random delays between requests
- [ ] Retry logic handles failures
- [ ] All tests pass

---

## Issue #9: Playwright Setup and Stealth Mode
**Labels**: `phase-1-mvp`, `backend`, `priority-high`
**Milestone**: MVP - Week 2: Job Scraping
**Assignee**: Backend Team

### Description
Set up Playwright with stealth mode to avoid bot detection.

### Tasks
- [ ] Install Playwright
- [ ] Install browser binaries
- [ ] Create stealth configuration
- [ ] Implement anti-detection measures
- [ ] Add headless browser setup
- [ ] Create browser context manager
- [ ] Test on Upwork (without scraping)
- [ ] Document stealth techniques

### Acceptance Criteria
- [ ] Playwright launches successfully
- [ ] Stealth mode bypasses basic detection
- [ ] Browser context can be reused
- [ ] No webdriver detection
- [ ] Documentation complete

---

## Issue #10: Upwork Job Scraper
**Labels**: `phase-1-mvp`, `backend`, `priority-high`
**Milestone**: MVP - Week 2: Job Scraping
**Assignee**: Backend Team

### Description
Implement Upwork scraper to detect new job postings.

### Tasks
- [ ] Create services/scrapers/upwork_scraper.py
- [ ] Implement job search page navigation
- [ ] Extract job cards from search results
- [ ] Parse job title, description, budget
- [ ] Detect "Best Match" badge
- [ ] Extract proposal count
- [ ] Extract connects required
- [ ] Extract client information
- [ ] Extract skills required
- [ ] Store jobs in database
- [ ] Handle pagination
- [ ] Add error handling
- [ ] Write unit tests

### Acceptance Criteria
- [ ] Scraper detects new jobs
- [ ] All job fields extracted correctly
- [ ] Best Match detection works
- [ ] Jobs saved to database
- [ ] Pagination works
- [ ] All tests pass

---

## Issue #11: Job Model and Database Operations
**Labels**: `phase-1-mvp`, `backend`, `priority-high`
**Milestone**: MVP - Week 2: Job Scraping
**Assignee**: Backend Team

### Description
Create Job model and database operations for storing and querying jobs.

### Tasks
- [ ] Create models/job.py
- [ ] Implement Job SQLAlchemy model
- [ ] Create job CRUD operations
- [ ] Implement duplicate detection
- [ ] Add job status management
- [ ] Create job search/filter methods
- [ ] Add job update methods
- [ ] Write unit tests

### Acceptance Criteria
- [ ] Job model matches database schema
- [ ] CRUD operations work correctly
- [ ] Duplicate jobs not inserted
- [ ] Job queries are efficient
- [ ] All tests pass

---

## Issue #12: Scraper Celery Task
**Labels**: `phase-1-mvp`, `backend`, `priority-high`
**Milestone**: MVP - Week 2: Job Scraping
**Assignee**: Backend Team

### Description
Create Celery task to run Upwork scraper every 5 minutes.

### Tasks
- [ ] Create tasks/scraper_tasks.py
- [ ] Implement scrape_upwork_jobs task
- [ ] Configure periodic task (every 5 minutes)
- [ ] Add task logging
- [ ] Implement error handling
- [ ] Create scraper_logs table entries
- [ ] Add task monitoring
- [ ] Write unit tests

### Acceptance Criteria
- [ ] Task runs every 5 minutes
- [ ] Jobs are detected and stored
- [ ] Errors are logged
- [ ] Task can be monitored
- [ ] All tests pass

---

## Issue #13: Job Detection API Endpoints
**Labels**: `phase-1-mvp`, `backend`, `priority-medium`
**Milestone**: MVP - Week 2: Job Scraping
**Assignee**: Backend Team

### Description
Create API endpoints for viewing detected jobs.

### Tasks
- [ ] Create api/jobs.py
- [ ] Implement GET /api/jobs (list all jobs)
- [ ] Implement GET /api/jobs/{id} (job details)
- [ ] Add pagination support
- [ ] Add filtering (platform, budget, date)
- [ ] Add sorting options
- [ ] Implement POST /api/jobs/refresh (manual scrape)
- [ ] Write unit tests

### Acceptance Criteria
- [ ] All endpoints work correctly
- [ ] Pagination works
- [ ] Filters work correctly
- [ ] Manual refresh triggers scraper
- [ ] All tests pass

---

## Issue #14: Basic Filter Pipeline
**Labels**: `phase-1-mvp`, `backend`, `priority-medium`
**Milestone**: MVP - Week 2: Job Scraping
**Assignee**: Backend Team

### Description
Create basic filter pipeline to filter jobs based on simple criteria.

### Tasks
- [ ] Create services/filter_pipeline.py
- [ ] Implement FilterPipeline class
- [ ] Add budget range filter
- [ ] Add platform filter
- [ ] Add job age filter
- [ ] Create filter result model
- [ ] Add filter logging
- [ ] Write unit tests

### Acceptance Criteria
- [ ] Filters work correctly
- [ ] Multiple filters can be combined
- [ ] Filter results are accurate
- [ ] All tests pass
