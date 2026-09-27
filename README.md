# Indie Hacker Micro-SaaS Leaderboard

A dynamic web application built for **Cloud Computing and DevOps (CCA 2)** assessment. It allows student developers to showcase side-projects, track active users, and view real-time community statistics.

##  Key Features
- **Dynamic Leaderboard:** Renders live project counts and active user statistics.
- **Project Submission Form:** POST request endpoint with input validation.
- **REST API:** `/api/projects` returns JSON data for external integration.
- **Health Check Endpoint:** `/health` returns server status and current commit SHA.
- **Automated Quality Gates:** Unit tests with Node test runner and code linting via ESLint.
- **Automated Deployment:** CI/CD pipeline triggers automatic deployment to Render upon successful main branch push.

##  Tech Stack
- **Backend Framework:** Node.js, Express.js
- **Testing & Linting:** `node:test`, ESLint
- **CI/CD Automation:** GitHub Actions
- **Hosting Platform:** Render

##  Running Locally

1. **Clone repository:**
   ```bash
   git clone [https://github.com/arpita595/indie-hustle-leaderboard.git](https://github.com/arpita595/indie-hustle-leaderboard.git)
   cd indie-hustle-leaderboard