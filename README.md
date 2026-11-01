# AI Mystery Room 🕵️‍♂️🔍

> **Investigate. Discover. Connect the Clues. Find the Culprit.**

AI Mystery Room is a next-generation interactive detective investigation web application. Unlike traditional static mystery games with pre-baked puzzles, players provide their own custom mystery premise and choose their difficulty. Gemini synthesizes a complete, logically consistent case featuring suspects, alibis, surveillance CCTV event logs, encrypted WhatsApp chats, forensic autopsy records, progressive hints, and a secret server-side culprit.

---

## ✨ Key Features

- **Dynamic Gemini Mystery Generation:** Enter any premise (e.g. mansion murder, museum heist, corporate espionage), and the AI builds a bespoke, 100% solvable investigation.
- **Difficulty Scaling (Enforced strictly by backend):**
  - **Easy:** 3 suspects, 5 clues, 2 hints, 100 base accusation points.
  - **Medium:** 4 suspects, 7 clues, 3 hints, 150 base accusation points.
  - **Hard:** 5 suspects, 9 clues, 3 hints, 200 base accusation points.
- **Interactive Evidence Lockers:**
  - 💬 **Encrypted WhatsApp Chats:** Message logs with timestamps and sender badges.
  - 📹 **Surveillance CCTV Feeds:** Simulated camera viewport with night-vision/infrared filters, timestamp watermarks, and event timeline playback.
  - 📄 **Forensic Documents:** Confidential autopsy reports, police filings, and IT network logs.
  - 📸 **Photographic Evidence:** High-resolution crime scene photographs with zoom inspection.
- **Gamified Investigation & Scoring Engine:**
  - 🔍 Discover Clues: **+5 points** per unique clue uncovered.
  - 💡 Progressive Hints: **-10 points** penalty per level unlocked.
  - ⚖️ Authoritative Scoring Formula: $\text{Final Score} = \max(0, \text{BasePoints} + 5C - 10H)$.
- **Strict Server-Side Solution Isolation:** The culprit ID, motive, and master explanation remain protected on the backend until formal indictment submission.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, React Router v6, Zustand, Axios, Canvas Confetti |
| **Backend** | Node.js, Express.js (REST API mounted at `/api`), Zod, Express Rate Limit |
| **Database** | MongoDB & Mongoose (with automated embedded In-Memory MongoDB dev fallback) |
| **AI Engine** | Google Gemini API (`@google/generative-ai` with structured output & prompt retries) |
| **Testing** | Vitest (unit & scoring test suite), Supertest |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher recommended, verified on v22.14.0)
- **npm** (v9.0.0 or higher)

### 2. Clone & Install Dependencies

From the project root:
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install && cd ..

# Install client dependencies
cd client && npm install && cd ..
```

### 3. Environment Configuration

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` (optional):
```env
PORT=5000
NODE_ENV=development

# Optional: Provide your MongoDB URI or leave blank for automatic zero-config in-memory MongoDB!
MONGODB_URI=

# Optional: Google Gemini API Key (If omitted, dynamic deterministic case generation engine is used)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash

CLIENT_URL=http://localhost:5173
```

### 4. Run the Development Server

You can launch both the frontend and backend with a single command from the root:
```bash
npm run dev
```

Or run them individually:
```bash
# Terminal 1: Backend API (port 5000)
npm run dev:server

# Terminal 2: Frontend Client (port 5173)
npm run dev:client
```

Open your browser at:
👉 **[http://localhost:5173](http://localhost:5173)**

---

## 🧪 Running Automated Tests

Run the full Vitest automated scoring and validation test suite:
```bash
cd server
npm test
```

---

## 📁 Repository Structure

```
ai-mystery-room/
├── client/                     # Frontend React + Vite application
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── common/         # Navbar, Footer
│       │   ├── evidence/       # ChatViewer, CCTVViewer, DocumentViewer, ImageViewer
│       │   ├── investigation/  # ClueItem, HintModal
│       │   └── suspects/       # SuspectCard, SuspectModal
│       ├── pages/              # Home, CreateMystery, InvestigationRoom, Accusation, Results
│       ├── services/           # Axios API client
│       ├── store/              # Zustand state management
│       ├── App.jsx
│       └── main.jsx
│
├── server/                     # Backend Express REST API
│   ├── src/
│   │   ├── config/             # Database (Mongoose) & Gemini client
│   │   ├── controllers/        # Express route controllers
│   │   ├── middleware/         # Centralized error handler & rate limiters
│   │   ├── models/             # Case & Investigation Mongoose schemas
│   │   ├── prompts/            # Gemini system prompt & schema definitions
│   │   ├── routes/             # REST endpoints under /api
│   │   ├── services/           # Case, Gemini, and Scoring services
│   │   ├── utils/              # Standardized API response helpers
│   │   ├── validators/         # Zod schemas for requests & AI output
│   │   ├── app.js
│   │   └── server.js
│   └── tests/                  # Scoring & validation test suites
│
├── docs/                       # Project Specification & Documentation
│   ├── SPEC.md                 # Single Source of Truth Master Specification
│   ├── IMPLEMENTATION_PLAN.md  # 10-Phase execution roadmap
│   ├── API.md                  # REST API contract documentation
│   ├── DATABASE.md             # MongoDB schemas & security rules
│   └── AI_PROMPTS.md           # Gemini prompt engineering guide
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🛡️ License

MIT License &copy; 2026 AI Mystery Room. Built with precision following the Master Product & Technical Specification.
