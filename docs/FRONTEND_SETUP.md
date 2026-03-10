# Frontend Project Setup Guide

## Overview
This guide helps set up the Next.js frontend with TypeScript and Tailwind CSS.

## Prerequisites
- Node.js 18+
- npm or yarn

## Setup Steps

### 1. Create Next.js App
```bash
npx create-next-app@latest frontend --typescript --tailwind --eslint
cd frontend
```

### 2. Install shadcn/ui
```bash
npx shadcn-ui@latest init
```

### 3. Folder Structure
```
src/
  app/          # Next.js app router pages
  components/   # React components
  lib/          # Utilities
  types/        # TypeScript types
  api/          # API clients
```

### 4. Configure API Client
Create `src/lib/api.ts` for API calls.

### 5. Run Development Server
```bash
npm run dev
```

## Verification
- [ ] Next.js app runs on port 3000
- [ ] TypeScript configured
- [ ] Tailwind CSS works

---
*Setup guide for jobhunter project - Issue #27*
