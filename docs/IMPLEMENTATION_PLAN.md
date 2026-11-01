# AI Mystery Room — Implementation Plan

This implementation plan outlines the incremental execution roadmap for **AI Mystery Room**, adhering strictly to the Master Product & Technical Specification (`spec.md` / `docs/SPEC.md`).

---

## 1. Architectural Strategy & Design System

### 1.1 Technology Choices
- **Frontend (`/client`):**
  - **Framework:** React 18+ with Vite (ultra-fast build and HMR).
  - **Styling:** Tailwind CSS with bespoke dark detective design tokens (Charcoal `#0B0D12`, Deep Navy Surface `#151922`, Crimson `#B91C1C`, Warm White `#F5F5F5`, Muted Slate `#9CA3AF`).
  - **Fonts:** Google Fonts (*Outfit* for modern UI, *Cinzel* for dramatic case headings, *JetBrains Mono* for CCTV timestamps and event transcripts).
  - **Icons & Polish:** Lucide-React icons, glassmorphism card surfaces, pulse indicators for active recordings.
  - **State Management:** Zustand for investigation session, discovery tracker, and accusation state.
  - **Routing:** React Router v6 for clean declarative navigation across the 5 mandatory views.
- **Backend (`/server`):**
  - **Runtime & Framework:** Node.js with Express.js modular architecture.
  - **Database & ODM:** MongoDB with Mongoose. Seamless fallback to `mongodb-memory-server` in development when no remote `MONGODB_URI` is provided, ensuring zero friction out-of-the-box on any OS.
  - **AI Provider:** Google Gemini API (`@google/genai` or `@google/generative-ai`), with structured JSON generation and prompt engineering.
  - **Validation:** Zod schemas for both client HTTP requests and AI-generated case structures.
  - **Security:** Strict server-side isolation of culprit, motive, and solution (`toPublicCase()` vs `toResultCase()`).

---

## 2. Phased Implementation Roadmap

### Phase 1: Workspace & Monorepo Infrastructure
- [ ] Root `package.json` with convenience scripts (`npm run dev`, `npm run build`, `npm run test`).
- [ ] Server setup: Express app, CORS, JSON parsing, rate limiting, centralized error handling, and `/api/health` endpoint.
- [ ] Client setup: Vite + React, Tailwind CSS with customized detective palette, Lucide icons, React Router, Zustand.
- [ ] Shared config: `.env.example`, `.gitignore`, `README.md`.

### Phase 2: Database Layer & Schemas
- [ ] MongoDB connection management (`server/src/config/database.js`) supporting URI connection with in-memory dev fallback.
- [ ] `Case` Mongoose Model (`server/src/models/Case.js`):
  - Metadata, difficulty, status, victim profile.
  - Suspect profiles (unique IDs, background, motives, alibis, statements).
  - Clues & Evidence (CHAT, CCTV, IMAGE, DOCUMENT, WITNESS).
  - Timeline & Progressive hints.
  - Isolated solution schema (culpritId, motive, method, critical clues, red herrings).
- [ ] `Investigation` Mongoose Model (`server/src/models/Investigation.js`):
  - Associated case ID, status (`active`, `completed`, `abandoned`).
  - Discovered clue IDs (prevent duplicate credits).
  - Hints consumed levels (tracking penalties).
  - Accusation details & authoritative score breakdown.
- [ ] Data serializers (`toPublicCase()` ensuring zero solution leakage, `toResultCase()` for post-accusation reveals).

### Phase 3: UI Pages & Navigation Shell
- [ ] Theme tokens, global typography, detective audio-visual atmosphere.
- [ ] **Home Page (`/`):** Hero section, feature highlights, detective tagline, "Create Your Mystery" CTA.
- [ ] **Create Mystery Page (`/create`):** Premise textarea (20–2000 chars), Difficulty selector (Easy/Medium/Hard cards), interactive loading screen with staged detective messages.
- [ ] Navigation header, status alerts, error states, and responsive layout.

### Phase 4: Gemini AI Integration & Mystery Generation Service
- [ ] Gemini API client configuration (`server/src/config/gemini.js`).
- [ ] Structured prompt generator (`server/src/prompts/mystery.prompt.js`) adhering to difficulty counts:
  - Easy: 3 suspects, 5 clues, 2 hints.
  - Medium: 4 suspects, 7 clues, 3 hints.
  - Hard: 5 suspects, 9 clues, 3 hints.
- [ ] Zod schema validator (`server/src/validators/case.validator.js`) enforcing structural and logical consistency.
- [ ] Automated retry engine with corrective prompting (up to 3 attempts).
- [ ] API endpoint `POST /api/cases` returning sanitized public case data.

### Phase 5: Investigation Room Layout & Evidence Viewers
- [ ] Three-column desktop layout (Left: Case overview & suspects; Center: Interactive Evidence Viewers; Right: Progress & Investigation Tools).
- [ ] Dynamic Evidence components:
  - **Chat Viewer:** WhatsApp/Signal style chat bubbles, timestamps, sender badges, deleted message markers.
  - **CCTV Player:** Simulated security camera feed with timestamp overlays, night-vision aesthetic, and event log timeline.
  - **Document Viewer:** Forensic autopsy reports, financial ledgers, encrypted notes, receipts.
  - **Image Viewer:** Crime scene photograph viewer with zoom, caption, and evidence tag.
  - **Witness Statement:** Interview transcripts.
- [ ] Suspect dossiers with alibis and statements.

### Phase 6: Clue Discovery & Progress Tracking
- [ ] "Discover Clue" actions linked to evidence items.
- [ ] Endpoint `POST /api/cases/:id/clues/:clueId/discover`.
- [ ] Idempotent points allocation (+5 pts per unique clue).
- [ ] Investigation progress bar (completion percentage based on discovered clues).

### Phase 7: Progressive Hint System
- [ ] Endpoint `POST /api/cases/:id/hints`.
- [ ] Sequential hint delivery (Level 1 $\rightarrow$ Level 2 $\rightarrow$ Level 3).
- [ ] Confirmation prompt warning player of -10 pts deduction.
- [ ] Enforce difficulty hint caps and atomic score deduction.

### Phase 8: Accusation & Scoring Engine
- [ ] **Accusation Page (`/investigation/:id/accuse`):** Suspect card selector, reasoning text area, confirmation modal.
- [ ] Endpoint `POST /api/cases/:id/accuse`.
- [ ] Dedicated scoring service (`server/src/services/scoring.service.js`) implementing exact formula:
  $$\text{Final Score} = \max(0, \text{BasePoints} + 5C - 10H)$$
- [ ] Atomic transition from `active` $\rightarrow$ `completed` status; mark case immutable.

### Phase 9: Case Resolution & Solution Reveal
- [ ] **Results Page (`/investigation/:id/results`):**
  - Solved / Unsolved badge with animated verdict banner.
  - True culprit identity, motive, and method reveal.
  - Critical clue correlation and chronological timeline playback.
  - Full transparent score breakdown card.
  - "Create Another Mystery" CTA to restart the loop.
- [ ] Endpoint `GET /api/cases/:id/result` (secured to completed cases only).

### Phase 10: Verification, Automated Testing & Documentation
- [ ] Vitest scoring test suite matching all spec edge cases (115 pts, 160 pts, 215 pts, 0 pts, etc.).
- [ ] Supertest API test suite verifying security (no solution leakage on GET `/api/cases/:id`).
- [ ] Full end-to-end browser walkthrough.
- [ ] Documentation (`docs/API.md`, `docs/DATABASE.md`, `README.md`).

---
