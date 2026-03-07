# Technical Specification - AI Job Hunter Agent

## Filter Pipeline Logic

### Job Scoring Algorithm

Each job receives a score from 0-100 based on multiple factors:

```python
def calculate_job_score(job: Job, user: User, preferences: Preferences) -> float:
    """
    Calculate comprehensive job score
    Returns: 0.0 to 100.0
    """
    score = 0.0
    weights = {
        'skill_match': 30,
        'best_match_bonus': 25,
        'client_quality': 20,
        'proposal_count': 15,
        'budget': 10
    }
    
    # 1. Skill Match (0-30 points)
    skill_similarity = calculate_skill_similarity(job.embedding, user.skills_embedding)
    score += skill_similarity * weights['skill_match']
    
    # 2. Best Match Bonus (0-25 points)
    if job.is_best_match:
        score += weights['best_match_bonus']
    
    # 3. Client Quality (0-20 points)
    client_score = (
        (job.client_rating / 5.0) * 0.4 +  # 40% weight on rating
        (min(job.client_total_spent / 10000, 1.0)) * 0.3 +  # 30% on spending
        (1.0 if job.client_payment_verified else 0.0) * 0.3  # 30% on verification
    )
    score += client_score * weights['client_quality']
    
    # 4. Proposal Count (0-15 points) - inverse relationship
    if job.proposal_count <= 5:
        proposal_score = 1.0
    elif job.proposal_count <= 10:
        proposal_score = 0.7
    elif job.proposal_count <= 20:
        proposal_score = 0.4
    else:
        proposal_score = 0.0
    score += proposal_score * weights['proposal_count']
    
    # 5. Budget (0-10 points)
    if preferences.min_budget and preferences.max_budget:
        if preferences.min_budget <= job.budget_max <= preferences.max_budget:
            budget_score = 1.0
        elif job.budget_max >= preferences.min_budget:
            budget_score = 0.5
        else:
            budget_score = 0.0
        score += budget_score * weights['budget']
    
    return round(score, 2)
```

### Filter Decision Tree

```
Job Detected
    │
    ├─> Is Platform Enabled? ──NO──> REJECT
    │       │
    │      YES
    │       │
    ├─> Is Best Match? ──YES──> PRIORITY QUEUE
    │       │
    │       NO
    │       │
    ├─> Proposal Count > Max? ──YES──> REJECT
    │       │
    │       NO
    │       │
    ├─> Connects Required > Budget? ──YES──> REJECT
    │       │
    │       NO
    │       │
    ├─> Client Rating < Min? ──YES──> REJECT
    │       │
    │       NO
    │       │
    ├─> Budget Out of Range? ──YES──> REJECT
    │       │
    │       NO
    │       │
    ├─> Job Age > 2 hours? ──YES──> REJECT
    │       │
    │       NO
    │       │
    ├─> Skill Match < 75%? ──YES──> REJECT
    │       │
    │       NO
    │       │
    └─> Calculate Score ──> QUALIFIED QUEUE
            │
            ├─> Score > 70 ──> HIGH PRIORITY
            ├─> Score 50-70 ──> MEDIUM PRIORITY
            └─> Score < 50 ──> LOW PRIORITY
```

---

## Proposal Generation System

### Proposal Template Structure

```python
class ProposalTemplate:
    """
    Dynamic proposal template with AI-powered sections
    """
    
    def __init__(self, style: str = "professional"):
        self.style = style  # professional, casual, technical
        
    def generate(self, job: Job, user: User, repos: List[Repo], portfolio: List[Project]) -> str:
        sections = [
            self.greeting(job),
            self.hook(job),
            self.relevant_experience(repos, portfolio, job),
            self.solution_approach(job),
            self.tech_stack(repos, job),
            self.question(job),
            self.closing(user)
        ]
        return "\n\n".join(sections)
    
    def greeting(self, job: Job) -> str:
        """Personalized greeting"""
        if self.style == "casual":
            return f"Hey {job.client_name or 'there'}!"
        return f"Hi {job.client_name or 'there'},"
    
    def hook(self, job: Job) -> str:
        """Attention-grabbing opening"""
        # AI extracts key requirement from job description
        key_requirement = extract_key_requirement(job.description)
        return f"I noticed you're looking for {key_requirement}. This aligns perfectly with my recent work."
    
    def relevant_experience(self, repos: List[Repo], portfolio: List[Project], job: Job) -> str:
        """Show most relevant project"""
        best_repo = repos[0] if repos else None
        best_project = portfolio[0] if portfolio else None
        
        if best_repo:
            return f"""I recently built a similar project: **{best_repo.name}**
            
GitHub: {best_repo.url}
Tech Stack: {', '.join(best_repo.tech_stack[:5])}

{best_repo.description[:200]}..."""
        
        return "I have extensive experience in this domain."
    
    def solution_approach(self, job: Job) -> str:
        """AI-generated solution outline"""
        # Use GPT-4 to generate custom approach
        prompt = f"""
        Job: {job.title}
        Description: {job.description[:500]}
        
        Generate a brief solution approach (3-4 sentences) that shows understanding
        and proposes a high-level implementation strategy.
        """
        return call_openai(prompt)
    
    def tech_stack(self, repos: List[Repo], job: Job) -> str:
        """Relevant technologies"""
        if repos:
            tech = repos[0].tech_stack[:6]
            return f"**Technologies I'll use**: {', '.join(tech)}"
        return ""
    
    def question(self, job: Job) -> str:
        """Intelligent question to show engagement"""
        # AI generates relevant question
        prompt = f"""
        Job: {job.title}
        Description: {job.description[:300]}
        
        Generate ONE specific, intelligent question that shows you understand
        the project and want to clarify an important detail.
        """
        return call_openai(prompt)
    
    def closing(self, user: User) -> str:
        """Professional closing"""
        if self.style == "casual":
            return f"Looking forward to hearing from you!\n\n{user.full_name}"
        return f"I'd love to discuss this further.\n\nBest regards,\n{user.full_name}"
```

### Proposal Styles

**Professional Style**:
- Formal language
- Structured sections
- Emphasis on credentials
- Use case: Corporate clients, large budgets

**Casual Style**:
- Conversational tone
- Shorter paragraphs
- Friendly language
- Use case: Startups, creative projects

**Technical Style**:
- Heavy technical details
- Architecture discussions
- Code examples
- Use case: Complex engineering projects

---

## Embedding & Matching System

### Embedding Generation

```python
class EmbeddingService:
    """
    Generate and manage embeddings for semantic search
    """
    
    def __init__(self):
        self.model = "text-embedding-3-small"  # OpenAI
        self.dimension = 1536
    
    async def generate_embedding(self, text: str) -> List[float]:
        """Generate embedding for text"""
        response = await openai.Embedding.create(
            model=self.model,
            input=text
        )
        return response['data'][0]['embedding']
    
    async def generate_job_embedding(self, job: Job) -> List[float]:
        """Generate embedding for job description"""
        # Combine title and description with weights
        text = f"{job.title} {job.title} {job.title} {job.description}"
        return await self.generate_embedding(text)
    
    async def generate_skill_embedding(self, skills: List[str]) -> List[float]:
        """Generate embedding for user skills"""
        text = " ".join(skills)
        return await self.generate_embedding(text)
    
    async def generate_repo_embedding(self, repo: Repository) -> List[float]:
        """Generate embedding for GitHub repo"""
        # Combine name, description, and README
        text = f"{repo.name} {repo.description} {repo.readme_content[:2000]}"
        return await self.generate_embedding(text)
```

### Similarity Calculation

```python
def cosine_similarity(embedding1: List[float], embedding2: List[float]) -> float:
    """
    Calculate cosine similarity between two embeddings
    Returns: 0.0 to 1.0
    """
    import numpy as np
    
    vec1 = np.array(embedding1)
    vec2 = np.array(embedding2)
    
    dot_product = np.dot(vec1, vec2)
    norm1 = np.linalg.norm(vec1)
    norm2 = np.linalg.norm(vec2)
    
    return dot_product / (norm1 * norm2)

async def match_repositories(job: Job, repos: List[Repository], top_k: int = 2) -> List[Repository]:
    """
    Find most relevant repositories for a job
    """
    similarities = []
    
    for repo in repos:
        similarity = cosine_similarity(job.embedding, repo.embedding)
        similarities.append((repo, similarity))
    
    # Sort by similarity and return top K
    similarities.sort(key=lambda x: x[1], reverse=True)
    return [repo for repo, _ in similarities[:top_k]]
```

---

## Scraping Strategy

### Upwork Scraper Implementation

```python
class UpworkScraper:
    """
    Scrape Upwork job listings with stealth mode
    """
    
    def __init__(self):
        self.base_url = "https://www.upwork.com"
        self.search_url = f"{self.base_url}/nx/search/jobs"
        
    async def scrape_jobs(self, search_params: dict) -> List[Job]:
        """
        Scrape jobs with Playwright
        """
        async with async_playwright() as p:
            # Launch browser with stealth
            browser = await p.chromium.launch(
                headless=True,
                args=[
                    '--disable-blink-features=AutomationControlled',
                    '--disable-dev-shm-usage',
                    '--no-sandbox'
                ]
            )
            
            context = await browser.new_context(
                viewport={'width': 1920, 'height': 1080},
                user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            )
            
            # Inject stealth scripts
            await context.add_init_script("""
                Object.defineProperty(navigator, 'webdriver', {
                    get: () => undefined
                });
            """)
            
            page = await context.new_page()
            
            # Navigate to search page
            await page.goto(self.search_url)
            await page.wait_for_load_state('networkidle')
            
            # Extract job cards
            jobs = []
            job_cards = await page.query_selector_all('[data-test="job-tile"]')
            
            for card in job_cards:
                job = await self.extract_job_data(card)
                if job:
                    jobs.append(job)
            
            await browser.close()
            return jobs
    
    async def extract_job_data(self, card) -> Optional[Job]:
        """Extract job data from card element"""
        try:
            title = await card.query_selector('[data-test="job-title"]')
            title_text = await title.inner_text()
            
            description = await card.query_selector('[data-test="job-description"]')
            description_text = await description.inner_text()
            
            budget = await card.query_selector('[data-test="budget"]')
            budget_text = await budget.inner_text() if budget else None
            
            # Check for "Best Match" badge
            best_match = await card.query_selector('[data-test="best-match-badge"]')
            is_best_match = best_match is not None
            
            # Extract proposal count
            proposals = await card.query_selector('[data-test="proposals"]')
            proposal_text = await proposals.inner_text() if proposals else "0"
            proposal_count = int(re.search(r'\d+', proposal_text).group())
            
            # Extract connects required
            connects = await card.query_selector('[data-test="connects"]')
            connects_text = await connects.inner_text() if connects else "0"
            connects_required = int(re.search(r'\d+', connects_text).group())
            
            return Job(
                platform='upwork',
                title=title_text,
                description=description_text,
                is_best_match=is_best_match,
                proposal_count=proposal_count,
                connects_required=connects_required,
                # ... other fields
            )
        except Exception as e:
            logger.error(f"Error extracting job: {e}")
            return None
    
    async def check_best_match_status(self, job_url: str) -> bool:
        """
        Navigate to job page and check if it's marked as Best Match
        """
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            await page.goto(job_url)
            
            badge = await page.query_selector('[data-test="best-match-badge"]')
            is_best_match = badge is not None
            
            await browser.close()
            return is_best_match
```

### Anti-Detection Measures

```python
class ScraperRotation:
    """
    Rotate proxies and user agents to avoid detection
    """
    
    def __init__(self):
        self.proxies = self.load_proxies()
        self.user_agents = self.load_user_agents()
        self.current_proxy_index = 0
        self.current_ua_index = 0
    
    def get_next_proxy(self) -> str:
        """Get next proxy in rotation"""
        proxy = self.proxies[self.current_proxy_index]
        self.current_proxy_index = (self.current_proxy_index + 1) % len(self.proxies)
        return proxy
    
    def get_random_user_agent(self) -> str:
        """Get random user agent"""
        return random.choice(self.user_agents)
    
    async def random_delay(self, min_seconds: int = 2, max_seconds: int = 5):
        """Add random delay between requests"""
        delay = random.uniform(min_seconds, max_seconds)
        await asyncio.sleep(delay)
```

---

## Chrome Extension Architecture

### Content Script Injection

```typescript
// content/upwork-content.tsx

import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import ProposalPanel from '../components/ProposalPanel';

// Detect if we're on a job page
const isJobPage = () => {
  return window.location.pathname.includes('/jobs/') ||
         window.location.pathname.includes('/ab/proposals/job/');
};

// Extract job ID from URL
const extractJobId = (): string | null => {
  const match = window.location.pathname.match(/jobs\/~([a-f0-9]+)/);
  return match ? match[1] : null;
};

// Extract job details from DOM
const extractJobDetails = () => {
  const title = document.querySelector('[data-test="job-title"]')?.textContent;
  const description = document.querySelector('[data-test="job-description"]')?.textContent;
  const budget = document.querySelector('[data-test="budget"]')?.textContent;
  const connects = document.querySelector('[data-test="connects-to-apply"]')?.textContent;
  
  return { title, description, budget, connects };
};

// Main content script
const initExtension = async () => {
  if (!isJobPage()) return;
  
  const jobId = extractJobId();
  if (!jobId) return;
  
  // Create container for our UI
  const container = document.createElement('div');
  container.id = 'ai-job-hunter-panel';
  container.style.cssText = `
    position: fixed;
    right: 0;
    top: 0;
    width: 400px;
    height: 100vh;
    z-index: 10000;
    background: white;
    box-shadow: -2px 0 10px rgba(0,0,0,0.1);
  `;
  
  document.body.appendChild(container);
  
  // Render React component
  const root = createRoot(container);
  root.render(<ProposalPanel jobId={jobId} />);
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initExtension);
} else {
  initExtension();
}
```

### Proposal Panel Component

```typescript
// components/ProposalPanel.tsx

import { useState, useEffect } from 'react';
import { apiClient } from '../utils/api-client';

interface ProposalPanelProps {
  jobId: string;
}

export default function ProposalPanel({ jobId }: ProposalPanelProps) {
  const [proposal, setProposal] = useState<string>('');
  const [matchScore, setMatchScore] = useState<number>(0);
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadProposal();
  }, [jobId]);
  
  const loadProposal = async () => {
    try {
      const response = await apiClient.get(`/extension/job-info?jobId=${jobId}`);
      setProposal(response.proposal);
      setMatchScore(response.matchScore);
      setRepos(response.relevantRepos);
    } catch (error) {
      console.error('Failed to load proposal:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const insertProposal = () => {
    // Find the proposal textarea on Upwork
    const textarea = document.querySelector('[data-test="proposal-text"]') as HTMLTextAreaElement;
    if (textarea) {
      textarea.value = proposal;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };
  
  const regenerateProposal = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post('/proposals/regenerate', { jobId });
      setProposal(response.proposal);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <div className="p-4">Loading proposal...</div>;
  }
  
  return (
    <div className="flex flex-col h-full p-4 overflow-y-auto">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-bold">AI Proposal Ready</h2>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm">Match Score:</span>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${matchScore}%` }}
            />
          </div>
          <span className="text-sm font-bold">{matchScore}%</span>
        </div>
      </div>
      
      {/* Relevant Repos */}
      {repos.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Relevant Projects</h3>
          {repos.map(repo => (
            <div key={repo.id} className="p-2 bg-gray-50 rounded mb-2">
              <a href={repo.url} target="_blank" className="text-blue-600 hover:underline">
                {repo.name}
              </a>
              <p className="text-xs text-gray-600 mt-1">{repo.description}</p>
            </div>
          ))}
        </div>
      )}
      
      {/* Proposal Text */}
      <div className="flex-1 mb-4">
        <h3 className="font-semibold mb-2">Generated Proposal</h3>
        <textarea
          value={proposal}
          onChange={(e) => setProposal(e.target.value)}
          className="w-full h-64 p-2 border rounded resize-none"
        />
      </div>
      
      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={insertProposal}
          className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Insert Proposal
        </button>
        <button
          onClick={regenerateProposal}
          className="px-4 bg-gray-200 rounded hover:bg-gray-300"
        >
          Regenerate
        </button>
      </div>
    </div>
  );
}
```

---

## Real-Time Notification System

### WebSocket Server

```python
# backend/websocket/connection_manager.py

from fastapi import WebSocket
from typing import Dict, Set
import json

class ConnectionManager:
    """
    Manage WebSocket connections for real-time updates
    """
    
    def __init__(self):
        self.active_connections: Dict[str, Set[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, user_id: str):
        """Accept new WebSocket connection"""
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = set()
        self.active_connections[user_id].add(websocket)
    
    def disconnect(self, websocket: WebSocket, user_id: str):
        """Remove WebSocket connection"""
        if user_id in self.active_connections:
            self.active_connections[user_id].discard(websocket)
    
    async def send_personal_message(self, message: dict, user_id: str):
        """Send message to specific user"""
        if user_id in self.active_connections:
            for connection in self.active_connections[user_id]:
                await connection.send_json(message)
    
    async def broadcast_new_job(self, job: Job, user_ids: List[str]):
        """Broadcast new job to relevant users"""
        message = {
            'type': 'new_job',
            'data': {
                'job_id': str(job.id),
                'title': job.title,
                'platform': job.platform,
                'budget': job.budget_max,
                'is_best_match': job.is_best_match,
                'match_score': job.match_score
            }
        }
        
        for user_id in user_ids:
            await self.send_personal_message(message, user_id)

# WebSocket endpoint
@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(websocket, user_id)
    try:
        while True:
            # Keep connection alive
            data = await websocket.receive_text()
            # Handle ping/pong
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)
```

---

## Performance Optimization

### Caching Strategy

```python
# backend/services/cache_service.py

from redis import Redis
import json
from typing import Optional

class CacheService:
    """
    Redis caching for frequently accessed data
    """
    
    def __init__(self):
        self.redis = Redis(host='localhost', port=6379, db=0)
        self.ttl = {
            'job': 300,  # 5 minutes
            'proposal': 3600,  # 1 hour
            'user_profile': 1800,  # 30 minutes
            'embeddings': 86400  # 24 hours
        }
    
    async def get_job(self, job_id: str) -> Optional[dict]:
        """Get cached job"""
        data = self.redis.get(f"job:{job_id}")
        return json.loads(data) if data else None
    
    async def set_job(self, job_id: str, job_data: dict):
        """Cache job data"""
        self.redis.setex(
            f"job:{job_id}",
            self.ttl['job'],
            json.dumps(job_data)
        )
    
    async def get_proposal(self, job_id: str, user_id: str) -> Optional[str]:
        """Get cached proposal"""
        return self.redis.get(f"proposal:{user_id}:{job_id}")
    
    async def set_proposal(self, job_id: str, user_id: str, proposal: str):
        """Cache generated proposal"""
        self.redis.setex(
            f"proposal:{user_id}:{job_id}",
            self.ttl['proposal'],
            proposal
        )
```

### Database Indexing

```sql
-- Optimize query performance with indexes

-- Jobs table indexes
CREATE INDEX idx_jobs_platform ON jobs(platform);
CREATE INDEX idx_jobs_posted_at ON jobs(posted_at DESC);
CREATE INDEX idx_jobs_is_best_match ON jobs(is_best_match) WHERE is_best_match = TRUE;
CREATE INDEX idx_jobs_proposal_count ON jobs(proposal_count);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_platform_job_id ON jobs(platform, platform_job_id);

-- Applications table indexes
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_created_at ON applications(created_at DESC);

-- Composite indexes for common queries
CREATE INDEX idx_jobs_platform_status_posted ON jobs(platform, status, posted_at DESC);
CREATE INDEX idx_applications_user_status ON applications(user_id, status);

-- Vector similarity search (pgvector extension)
CREATE INDEX idx_jobs_embedding ON jobs USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_user_skills_embedding ON user_skills USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_github_repos_embedding ON github_repositories USING ivfflat (embedding vector_cosine_ops);
```

---

## Testing Strategy

### Unit Tests
- Filter pipeline logic
- Proposal generation
- Embedding similarity
- Job scoring algorithm

### Integration Tests
- API endpoints
- Database operations
- Celery tasks
- WebSocket connections

### E2E Tests
- Complete job detection flow
- Proposal generation flow
- Extension functionality
- Dashboard workflows

### Load Tests
- 1000 concurrent users
- 10,000 jobs/day processing
- API response times
- WebSocket scalability

---

## Monitoring & Logging

```python
# backend/monitoring/metrics.py

from prometheus_client import Counter, Histogram, Gauge

# Metrics
jobs_detected = Counter('jobs_detected_total', 'Total jobs detected', ['platform'])
proposals_generated = Counter('proposals_generated_total', 'Total proposals generated')
api_requests = Counter('api_requests_total', 'Total API requests', ['endpoint', 'method'])
api_latency = Histogram('api_latency_seconds', 'API latency', ['endpoint'])

# Gauges
active_jobs = Gauge('active_jobs', 'Number of active jobs')
active_users = Gauge('active_users', 'Number of active users')
queue_size = Gauge('queue_size', 'Size of job queue')
```

---

## Security Best Practices

1. **API Security**
   - Rate limiting per user
   - JWT with refresh tokens
   - CORS configuration
   - Input validation

2. **Data Protection**
   - Encrypt CVs and sensitive data
   - Secure password storage
   - HTTPS only
   - Regular security audits

3. **Scraping Safety**
   - Respect robots.txt
   - Rate limiting
   - Proxy rotation
   - Error handling

4. **Extension Security**
   - Content Security Policy
   - Secure message passing
   - Token storage best practices
   - Permission minimization
