# 🎋 LEVELORA

### *Your Life. Your Levels. Your Journey.*

LEVELORA transforms real-life goals into a cozy RPG experience. Users complete daily quests, earn XP, level up, develop character skills, unlock achievements, maintain streaks, and track personal growth.

The project is structured into two clean parts: **Frontend** and **Backend**.

---

## 📁 Repository Structure

```
levelora/
├── frontend/                     # React + Vite + TypeScript + Tailwind CSS Client
│   ├── src/
│   │   ├── components/           # UI components (Layout, Common, Quests, Habits, etc.)
│   │   │   ├── common/           # PandaMascot, PandaBadge, LevelUpModal, ToastContainer
│   │   │   ├── layout/           # AppShell, Header, Sidebar, BottomNav
│   │   │   ├── quests/           # QuestModal
│   │   │   └── habits/           # HabitModal
│   │   ├── context/              # LeveloraContext (RPG state & progression)
│   │   ├── pages/                # Dashboard, Quests, Habits, Character, SkillGarden, Rewards, Analytics, Leaderboard, Settings
│   │   ├── services/             # Storage service, API client, Seed data
│   │   ├── tests/                # Acceptance test suite
│   │   ├── types/                # TypeScript interfaces
│   │   └── utils/                # Progression math, Dates & Streaks, Sound synthesizer, Confetti
│   ├── index.html
│   ├── vite.config.ts            # Configured with proxy to http://localhost:5000/api
│   ├── tsconfig.json
│   └── package.json
│
├── backend/                      # Node.js + Express + TypeScript REST API Server
│   ├── src/
│   │   ├── data/                 # Seed data
│   │   ├── routes/               # REST API endpoints (quests, habits, character, skills, rewards, analytics)
│   │   ├── services/             # db.ts (file-based persistence with auto-save)
│   │   ├── tests/                # API and Database unit tests
│   │   ├── types/                # Shared RPG TypeScript models
│   │   └── server.ts             # Express application & middleware
│   ├── data/                     # db.json (persisted data)
│   ├── tsconfig.json
│   └── package.json
│
├── package.json                  # Root orchestrator scripts
└── README.md
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
# Install dependencies for both frontend and backend in one command:
npm run install:all
```

### 2. Run the Applications

#### Run Frontend:
```bash
npm run dev:frontend
# Starts Vite at http://localhost:5173
```

#### Run Backend:
```bash
npm run dev:backend
# Starts Express API at http://localhost:5000
```

### 3. Run Automated Tests
```bash
# Runs both frontend acceptance tests and backend unit tests:
npm test

# Run frontend tests individually:
npm run test:frontend

# Run backend tests individually:
npm run test:backend
```

### 4. Build for Production
```bash
# Builds both frontend and backend:
npm run build
```

---

## 🔌 Backend REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check |
| `GET` | `/api/state` | Returns complete player RPG state |
| `POST` | `/api/state/reset` | Resets data to initial demo state |
| `GET` | `/api/quests` | List all quests |
| `POST` | `/api/quests` | Create a new quest |
| `PUT` | `/api/quests/:id` | Update quest details |
| `DELETE` | `/api/quests/:id` | Delete quest |
| `POST` | `/api/quests/:id/complete` | Complete quest and award XP |
| `POST` | `/api/quests/:id/reverse` | Reverse quest completion and revert XP |
| `GET` | `/api/habits` | List all habits |
| `POST` | `/api/habits` | Create a new habit |
| `PUT` | `/api/habits/:id` | Update habit |
| `DELETE` | `/api/habits/:id` | Delete habit |
| `POST` | `/api/habits/:id/toggle` | Toggle habit for a given date |
| `GET` | `/api/character` | Get player profile & 5 attributes |
| `PUT` | `/api/character/profile` | Update username / avatar |
| `GET` | `/api/skills` | Get Skill Garden plants & progress |
| `GET` | `/api/rewards` | Get achievements & unlock statuses |
| `GET` | `/api/analytics` | Get aggregated XP velocity and category breakdown |
