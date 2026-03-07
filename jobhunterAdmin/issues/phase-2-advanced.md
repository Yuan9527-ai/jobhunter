# Phase 2: Advanced Features Issues (Weeks 5-7)

## Issue #34: Best Match Detection
**Labels**: `phase-2-advanced`, `backend`, `priority-high`
**Milestone**: V2 - Week 5: Smart Filters
**Assignee**: Backend Team

### Description
Implement detection of "Best Match" badge on Upwork jobs.

### Tasks
- [ ] Update Upwork scraper to detect Best Match badge
- [ ] Add is_best_match field to job extraction
- [ ] Create API filter for Best Match jobs
- [ ] Add Best Match indicator in database
- [ ] Prioritize Best Match jobs in queue
- [ ] Write unit tests

### Acceptance Criteria
- [ ] Best Match badge detected accurately
- [ ] Best Match jobs prioritized
- [ ] Filter works in API
- [ ] All tests pass

---

## Issue #35: Proposal Count Filter
**Labels**: `phase-2-advanced`, `backend`, `priority-high`
**Milestone**: V2 - Week 5: Smart Filters
**Assignee**: Backend Team

### Description
Filter out jobs with too many proposals (>20 by default).

### Tasks
- [ ] Extract proposal count from job pages
- [ ] Add proposal_count to job model
- [ ] Implement filter in pipeline
- [ ] Make threshold configurable per user
- [ ] Add to user preferences
- [ ] Update API to support filter
- [ ] Write unit tests

### Acceptance Criteria
- [ ] Proposal count extracted correctly
- [ ] Filter works with threshold
- [ ] User can configure threshold
- [ ] All tests pass

---

## Issue #36: Connect Budget System
**Labels**: `phase-2-advanced`, `backend`, `priority-high`
**Milestone**: V2 - Week 5: Smart Filters
**Assignee**: Backend Team

### Description
Filter jobs based on connects required vs user's budget.

### Tasks
- [ ] Extract connects_required from jobs
- [ ] Add max_connects_per_job to preferences
- [ ] Implement connect budget filter
- [ ] Track connects spent
- [ ] Add connect budget warnings
- [ ] Update API
- [ ] Write unit tests

### Acceptance Criteria
- [ ] Connects required extracted
- [ ] Filter respects budget
- [ ] Tracking works correctly
- [ ] All tests pass

---

## Issue #37: Client Rating Filter
**Labels**: `phase-2-advanced`, `backend`, `priority-high`
**Milestone**: V2 - Week 5: Smart Filters
**Assignee**: Backend Team

### Description
Filter jobs based on client rating and history.

### Tasks
- [ ] Extract client rating from jobs
- [ ] Extract client total spent
- [ ] Extract payment verification status
- [ ] Add min_client_rating to preferences
- [ ] Implement client quality filter
- [ ] Update API
- [ ] Write unit tests

### Acceptance Criteria
- [ ] Client data extracted
- [ ] Filter works correctly
- [ ] User can set minimum rating
- [ ] All tests pass

---

## Issue #38: Job Scoring Algorithm
**Labels**: `phase-2-advanced`, `backend`, `priority-high`
**Milestone**: V2 - Week 5: Smart Filters
**Assignee**: AI/ML Team

### Description
Implement comprehensive job scoring system (0-100).

### Tasks
- [ ] Implement calculate_job_score function
- [ ] Weight: skill match (30 points)
- [ ] Weight: best match bonus (25 points)
- [ ] Weight: client quality (20 points)
- [ ] Weight: proposal count (15 points)
- [ ] Weight: budget (10 points)
- [ ] Add score to job model
- [ ] Sort jobs by score
- [ ] Write unit tests

### Acceptance Criteria
- [ ] Scoring algorithm works
- [ ] Scores are accurate
- [ ] Jobs sorted by score
- [ ] All tests pass

---

## Issue #39: Multi-Style Proposal Templates
**Labels**: `phase-2-advanced`, `backend`, `priority-medium`
**Milestone**: V2 - Week 6: Enhanced AI
**Assignee**: AI/ML Team

### Description
Create multiple proposal styles (professional, casual, technical).

### Tasks
- [ ] Design professional template
- [ ] Design casual template
- [ ] Design technical template
- [ ] Implement style selection logic
- [ ] Add style parameter to API
- [ ] Store preferred style in user preferences
- [ ] Write unit tests

### Acceptance Criteria
- [ ] Three styles available
- [ ] Styles produce different tones
- [ ] User can select style
- [ ] All tests pass

---

## Issue #40: Enhanced Repository Matching
**Labels**: `phase-2-advanced`, `backend`, `priority-medium`
**Milestone**: V2 - Week 6: Enhanced AI
**Assignee**: AI/ML Team

### Description
Improve repository matching with better embeddings and ranking.

### Tasks
- [ ] Enhance embedding generation for repos
- [ ] Include tech stack in matching
- [ ] Add recency weighting
- [ ] Implement multi-factor ranking
- [ ] Return top 2-3 repos
- [ ] Cache matching results
- [ ] Write unit tests

### Acceptance Criteria
- [ ] Matching more accurate
- [ ] Relevant repos selected
- [ ] Performance acceptable
- [ ] All tests pass

---

## Issue #41: Portfolio Project Matching
**Labels**: `phase-2-advanced`, `backend`, `priority-medium`
**Milestone**: V2 - Week 6: Enhanced AI
**Assignee**: AI/ML Team

### Description
Match portfolio projects to job descriptions.

### Tasks
- [ ] Create portfolio_projects table
- [ ] Implement portfolio CRUD API
- [ ] Generate embeddings for projects
- [ ] Implement project-to-job matching
- [ ] Include in proposal generation
- [ ] Write unit tests

### Acceptance Criteria
- [ ] Portfolio projects can be added
- [ ] Matching works correctly
- [ ] Projects included in proposals
- [ ] All tests pass

---

## Issue #42: Advanced Analytics Dashboard
**Labels**: `phase-2-advanced`, `frontend`, `priority-medium`
**Milestone**: V2 - Week 7: Dashboard V2
**Assignee**: Frontend Team

### Description
Create analytics page with charts and metrics.

### Tasks
- [ ] Create app/(dashboard)/analytics/page.tsx
- [ ] Install chart library (recharts)
- [ ] Show jobs detected per day
- [ ] Show applications sent
- [ ] Show response rate
- [ ] Show interview rate
- [ ] Show platform comparison
- [ ] Add date range filter
- [ ] Write component tests

### Acceptance Criteria
- [ ] Analytics page renders
- [ ] Charts display correctly
- [ ] Metrics are accurate
- [ ] All tests pass

---

## Issue #43: Filter Customization UI
**Labels**: `phase-2-advanced`, `frontend`, `priority-high`
**Milestone**: V2 - Week 7: Dashboard V2
**Assignee**: Frontend Team

### Description
Create UI for customizing job filters and preferences.

### Tasks
- [ ] Create app/(dashboard)/preferences/page.tsx
- [ ] Create filter configuration form
- [ ] Add max proposal count slider
- [ ] Add connect budget input
- [ ] Add client rating selector
- [ ] Add budget range inputs
- [ ] Save preferences to API
- [ ] Add reset to defaults
- [ ] Write component tests

### Acceptance Criteria
- [ ] Preferences page works
- [ ] All filters configurable
- [ ] Changes saved correctly
- [ ] All tests pass

---

## Issue #44: Job Score Display
**Labels**: `phase-2-advanced`, `frontend`, `priority-medium`
**Milestone**: V2 - Week 7: Dashboard V2
**Assignee**: Frontend Team

### Description
Display job scores and match indicators in UI.

### Tasks
- [ ] Add score badge to JobCard
- [ ] Create score visualization (progress bar)
- [ ] Add Best Match indicator
- [ ] Show score breakdown on hover
- [ ] Sort jobs by score
- [ ] Add score filter
- [ ] Write component tests

### Acceptance Criteria
- [ ] Scores displayed correctly
- [ ] Visual indicators clear
- [ ] Sorting works
- [ ] All tests pass

---

## Issue #45: Application Tracking Improvements
**Labels**: `phase-2-advanced`, `frontend`, `priority-medium`
**Milestone**: V2 - Week 7: Dashboard V2
**Assignee**: Frontend Team

### Description
Enhance application tracking with status updates and timeline.

### Tasks
- [ ] Create app/(dashboard)/applications/page.tsx
- [ ] Show application status
- [ ] Add status update functionality
- [ ] Create timeline view
- [ ] Add client response tracking
- [ ] Show connects spent
- [ ] Add filters by status
- [ ] Write component tests

### Acceptance Criteria
- [ ] Applications page complete
- [ ] Status tracking works
- [ ] Timeline displays correctly
- [ ] All tests pass
