#!/usr/bin/env python3
"""
Script to create GitHub issues from markdown files.

Usage:
    python scripts/create_github_issues.py --repo owner/repo --token YOUR_GITHUB_TOKEN

Requirements:
    pip install PyGithub
"""

import argparse
import re
from pathlib import Path
from github import Github


def parse_issue_from_markdown(content: str) -> dict:
    """Parse issue details from markdown content."""
    lines = content.strip().split('\n')
    
    # Extract title (first line starting with ##)
    title = None
    for line in lines:
        if line.startswith('## Issue #'):
            title = line.replace('## Issue #', '').split(':', 1)[1].strip()
            break
    
    # Extract labels
    labels = []
    for line in lines:
        if line.startswith('**Labels**:'):
            labels_str = line.split(':', 1)[1].strip()
            labels = [l.strip().strip('`') for l in labels_str.split(',')]
            break
    
    # Extract milestone
    milestone = None
    for line in lines:
        if line.startswith('**Milestone**:'):
            milestone = line.split(':', 1)[1].strip()
            break
    
    # Extract assignee
    assignee = None
    for line in lines:
        if line.startswith('**Assignee**:'):
            assignee = line.split(':', 1)[1].strip()
            break
    
    # Extract body (everything after the metadata)
    body_start = 0
    for i, line in enumerate(lines):
        if line.startswith('### Description'):
            body_start = i
            break
    
    body = '\n'.join(lines[body_start:])
    
    return {
        'title': title,
        'body': body,
        'labels': labels,
        'milestone': milestone,
        'assignee': assignee
    }


def create_labels(repo, labels_to_create):
    """Create labels if they don't exist."""
    existing_labels = {label.name for label in repo.get_labels()}
    
    label_colors = {
        'phase-1-mvp': '0E8A16',
        'phase-2-advanced': '1D76DB',
        'phase-3-extension': '5319E7',
        'backend': 'D93F0B',
        'frontend': 'FBCA04',
        'extension': 'C5DEF5',
        'devops': '0052CC',
        'priority-high': 'B60205',
        'priority-medium': 'FFA500',
        'priority-low': 'CCCCCC',
        'good-first-issue': '7057FF',
        'bug': 'D73A4A',
        'enhancement': 'A2EEEF',
        'documentation': '0075CA',
    }
    
    for label_name in labels_to_create:
        if label_name not in existing_labels:
            color = label_colors.get(label_name, 'EDEDED')
            repo.create_label(name=label_name, color=color)
            print(f"Created label: {label_name}")


def create_milestones(repo):
    """Create milestones if they don't exist."""
    milestones_to_create = [
        "MVP - Week 1: Foundation",
        "MVP - Week 2: Job Scraping",
        "MVP - Week 3: AI Integration",
        "MVP - Week 4: Notifications",
        "V2 - Week 5: Smart Filters",
        "V2 - Week 6: Enhanced AI",
        "V2 - Week 7: Dashboard V2",
        "V3 - Week 8-9: Extension",
        "V3 - Week 10: Multi-Platform",
        "V3 - Week 11: Advanced Features",
        "V3 - Week 12: Production Launch",
    ]
    
    existing_milestones = {m.title for m in repo.get_milestones()}
    
    for milestone_title in milestones_to_create:
        if milestone_title not in existing_milestones:
            repo.create_milestone(title=milestone_title)
            print(f"Created milestone: {milestone_title}")


def main():
    parser = argparse.ArgumentParser(description='Create GitHub issues from markdown files')
    parser.add_argument('--repo', required=True, help='Repository in format owner/repo')
    parser.add_argument('--token', required=True, help='GitHub personal access token')
    parser.add_argument('--dry-run', action='store_true', help='Print issues without creating them')
    args = parser.parse_args()
    
    # Initialize GitHub client
    g = Github(args.token)
    repo = g.get_repo(args.repo)
    
    print(f"Connected to repository: {repo.full_name}")
    
    # Create labels and milestones
    if not args.dry_run:
        print("\nCreating labels...")
        all_labels = [
            'phase-1-mvp', 'phase-2-advanced', 'phase-3-extension',
            'backend', 'frontend', 'extension', 'devops',
            'priority-high', 'priority-medium', 'priority-low',
            'good-first-issue', 'bug', 'enhancement', 'documentation'
        ]
        create_labels(repo, all_labels)
        
        print("\nCreating milestones...")
        create_milestones(repo)
    
    # Read and parse issue files
    issues_dir = Path('issues')
    issue_files = sorted(issues_dir.glob('*.md'))
    
    all_issues = []
    for file_path in issue_files:
        print(f"\nReading {file_path}...")
        content = file_path.read_text()
        
        # Split by issue headers
        issue_sections = re.split(r'\n## Issue #\d+:', content)
        
        for i, section in enumerate(issue_sections[1:], 1):  # Skip first empty section
            issue_data = parse_issue_from_markdown(f"## Issue #{i}: {section}")
            if issue_data['title']:
                all_issues.append(issue_data)
    
    print(f"\nFound {len(all_issues)} issues to create")
    
    # Create issues
    if args.dry_run:
        print("\nDRY RUN - Issues that would be created:")
        for i, issue in enumerate(all_issues, 1):
            print(f"\n#{i}: {issue['title']}")
            print(f"  Labels: {', '.join(issue['labels'])}")
            print(f"  Milestone: {issue['milestone']}")
    else:
        print("\nCreating issues...")
        for i, issue_data in enumerate(all_issues, 1):
            try:
                # Get milestone object
                milestone = None
                if issue_data['milestone']:
                    for m in repo.get_milestones():
                        if m.title == issue_data['milestone']:
                            milestone = m
                            break
                
                # Create issue
                issue = repo.create_issue(
                    title=issue_data['title'],
                    body=issue_data['body'],
                    labels=issue_data['labels'],
                    milestone=milestone
                )
                
                print(f"Created issue #{issue.number}: {issue.title}")
                
            except Exception as e:
                print(f"Error creating issue {i}: {e}")
    
    print("\nDone!")


if __name__ == '__main__':
    main()
