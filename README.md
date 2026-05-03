# X Code: AI-Powered Engineering Workflow & Resource Optimization System

## Problem Statement Alignment

X Code is designed to address the core requirements of the AI-Powered Engineering Workflow & Resource Optimization System by combining GitHub integration with a custom VS Code AI chatbot to structure development workflows, monitor developer productivity, track AI usage, and improve task allocation.

---

## System Overview

X Code is an AI-driven engineering management platform that focuses on:

- Structuring the software development lifecycle
- Capturing detailed development metrics
- Monitoring GitHub-based developer productivity
- Tracking AI usage through a custom VS Code chatbot
- Dynamically allocating tasks
- Providing real-time dashboards for managers and developers

---

## 1. Workflow Engine

The system organizes development into structured phases:

### Planning → Development → Testing → Feedback

### Implementation:
- GitHub tracks repository progress, commits,project members and contribution history
- Custom VS Code chatbot captures AI interactions during coding
- Tasks are broken into small, manageable units
- AI is integrated as a collaborative assistant at every stage

---

## 2. Data Capture Layer

### GitHub Integration
GitHub is used to authenticate users and capture:

- User profile details
- Repository access
- Commit history
- Contribution frequency
- Code activity
- Project participation

### Custom VS Code AI Chatbot
The chatbot is designed to monitor AI usage during development by capturing:

- AI prompts used
- Token consumption
- AI-generated code contribution
- Session count
- AI-assisted productivity metrics

### Captured Metrics:
- Time spent per task
- Developer productivity
- AI usage and effectiveness
- Work sessions
- Contribution tracking

---

## 3. Allocation Engine

Task assignment is dynamically handled using:

- Current workload
- GitHub contribution history
- Skill compatibility
- Past performance
- AI efficiency

### Purpose:
- Balance workloads
- Prevent overloading
- Improve resource utilization
- Increase productivity

---

## 4. Analytics Dashboard

### Manager Dashboard:
- Project progress
- Team productivity
- Resource utilization
- Risk indicators
- Bottlenecks
- AI contribution

### Developer Dashboard:
- Personal commits
- Task status
- Productivity metrics
- AI usage
- Performance insights

---

## System Architecture

### Frontend:
- Next.js
- React
- Tailwind CSS

### Backend:
- GitHub OAuth Authentication
- GitHub API Integration
- Custom VS Code Chatbot
- Task Allocation Engine
- Analytics Engine

### Database:
- MongoDB

### Core Data Stored:
- User profiles
- GitHub activity
- Task records
- AI chatbot logs
- Productivity analytics

---

## Database Design / Schema

### Main Collections:
- Users
- Developers
- Projects
- Tasks
- GitHub Metrics
- AI Usage Logs
- Activity Logs
- Sessions

---

## AI Integration Strategy

AI is used as a collaborative development tool, not a replacement.

### AI Responsibilities:
- Assist coding through VS Code chatbot
- Track AI usage
- Measure token and prompt consumption
- Monitor AI-generated contribution
- Support workflow decisions

### Key Goal:
Measure how effectively AI improves engineering productivity.

---

## Constraints Handling

### X Code follows all required constraints:

- Tasks are divided into manageable units
- AI supports developers instead of replacing them
- Modular and scalable architecture
- Real-time metrics and actionable insights

---

## Deliverables Covered

### 1. System Architecture Diagram
Includes:
- GitHub Integration
- VS Code Chatbot
- Workflow Engine
- Allocation Engine
- Dashboard

### 2. Database Design
Includes:
- GitHub developer data
- AI usage metrics
- Productivity tracking
- Task management

### 3. Working Prototype
- Manager dashboard
- Developer dashboard
- Task management system
- VS Code chatbot extension

### 4. Sample Dataset and Analytics
Generated from:
- GitHub commits
- AI token usage
- Productivity metrics

### 5. AI Integration Explanation
Focused on:
- AI collaboration
- AI usage measurement
- AI productivity contribution

---

## Outcome

X Code creates an AI-assisted, data-driven, and self-optimizing engineering workflow system by combining:

### GitHub:
For developer identity, commits, repositories, and productivity tracking

### Custom VS Code AI Chatbot:
For AI usage tracking, token monitoring, prompt analysis, and AI code contribution

---

## Final Objective Achieved

X Code improves:

- Developer productivity
- Task allocation efficiency
- Resource optimization
- Code quality visibility
- AI effectiveness measurement
- Project decision-making

---

## Core Innovation

**GitHub for developer workflow intelligence + Custom VS Code chatbot for AI usage and contribution tracking**

---

## Getting Started

### 1. Prerequisites
- Node.js 18+
- MongoDB running locally or on Atlas
- Gemini API Key ([Get it here](https://aistudio.google.com/app/apikey))

### 2. Environment Setup
Create a `.env.local` file in the root directory and add the following:
```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=xcode_db
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
GITHUB_OAUTH_CALLBACK_URL=http://localhost:3000/api/auth/github
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Installation & Running the Web App
```bash
npm install
npm run dev
```

### 4. VS Code Extension Setup
The custom assistant is located in the `vscode-extension` folder.
```bash
cd vscode-extension
npm install
npm run compile
```
- Open the `vscode-extension` folder in VS Code.
- Press `F5` to launch a new VS Code window with the extension enabled.
- Find the **X Code** icon in the Activity Bar to start using the assistant.

## AI Usage Tracking
The system monitors:
- **Tokens Used**: Real-time consumption tracking.
- **Prompts Count**: Number of AI interactions.
- **Contribution %**: AI's part in the overall project development.
