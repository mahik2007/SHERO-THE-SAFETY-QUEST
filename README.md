# SHERO: The Safety Quest
> **"Every Choice Shapes Your Escape."**

A cinematic, anime-inspired interactive safety adventure game built from scratch. The game teaches situational awareness, digital security, personal boundaries, emergency preparedness, and active bystander interventions through fictional branching survival scenarios.

---

## 🌟 Key Features

1. **Authentic Anime Visual Aesthetic**:
   - Palette: Midnight navy (`#080B18`), Deep indigo (`#11142B`), Dark violet (`#20133F`), Electric blue (`#4B7BFF`), Neon lavender (`#A78BFA`), Soft cyan (`#67E8F9`), Danger red (`#FF5470`), Success mint (`#65F5C5`).
   - Original vector illustrations for protagonist **Aira** with dynamic poses (standing, alert, worried, relieved, victory).
   - Atmospheric layered scene backgrounds for 7 distinct environments.

2. **Deterministic 3-Choice Survival State Machine**:
   - Exactly 3 choices at every decision point.
   - Exactly 1 winning solution per decision; correct decisions advance the story with clear educational feedback.
   - Incorrect choices immediately trigger **GAME OVER** with pedagogical hazard explanations.
   - Missions restart cleanly from the beginning upon defeat.

3. **7 Complete Scenario Operations (21 Nodes, 63 Choices)**:
   - **Mission 1**: *The Last Bus* (Transit & Commute Safety) — Badge: `COMMUTE GUARDIAN`
   - **Mission 2**: *The Shadowed Street* (Urban Pursuit & Evasive Pathing) — Badge: `STREET SMART`
   - **Mission 3**: *The Wrong Ride* (4-Point Rideshare Verification) — Badge: `RIDE READY`
   - **Mission 4**: *The Party Exit* (Consent & Boundary Assertion) — Badge: `BOUNDARY BOSS`
   - **Mission 5**: *The Unknown Account* (Cyber Harassment & MFA Hardening) — Badge: `DIGITAL DEFENDER`
   - **Mission 6**: *The Silent Corridor* (Institutional Redressal & POSH / ICC) — Badge: `COURAGE CHAMPION`
   - **Mission 7**: *The Moment That Matters* (The 5Ds of Bystander Intervention) — Badge: `COMMUNITY PROTECTOR`

4. **SafeCircle Toolkit**:
   - **Module A: Trusted Contacts** (Client-side CRUD with validation and `tel:` integration).
   - **Module B: Personal Safety Plan** (Safe havens, transit checkpoints, and emergency notes).
   - **Module C: Emergency & Support Directory** (Verified pan-India 112 emergency helpline, 1091 Women Helpline, 181 WHL, 1930 Cybercrime, 1098 Childline, and UGC SAKSHAM).
   - **Module D: Check-In Companion** (Configurable countdown timer with in-app expiration alert).
   - **Module E: Find Help Nearby** (Searchable hubs without requiring invasive GPS tracking).
   - **Module F: Digital Safety Center** (Evidence preservation, password hygiene, and MFA standards).

5. **Audio & Sound Synthesizer**:
   - Built-in Web Audio API sound controller with ambient synthesizer chords, button hovers, success fanfares, and alert sound effects without requiring external media assets.

6. **Privacy-First Architecture**:
   - Sensitive SafeCircle data and personal notes stay strictly in browser local storage.
   - SQLite backend persists aggregate statistics, mission completions, and validated game results.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React
- **Backend**: Node.js, Express, TypeScript, sql.js (pure JS/Wasm SQLite), Zod validation, CORS, dotenv
- **Testing**: Vitest, React Testing Library, Playwright / Browser Subagent
- **Audio**: Web Audio API (procedural retro-anime synthesis)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ or v24+)
- npm

### Installation
```bash
git clone <repository_url>
cd "girlswhocode hackathon_game"
npm install
```

### Environment Configuration
Copy the configuration template:
```bash
cp .env.example .env
```
Default parameters in `.env`:
```ini
PORT=4000
DATABASE_PATH=./data/shero.sqlite
AI_API_KEY=
MAPS_API_KEY=
```
*(No paid external API keys are required to play the entire game).*

---

## 🎮 Running the Application

### Option A: Run Full Stack Concurrently
```bash
npm run dev
```

### Option B: Run Services Individually
- **Start Backend API Server (Port 4000)**:
  ```bash
  npx tsx server/src/index.ts
  ```
- **Start Frontend Vite Server (Port 5173/5174)**:
  ```bash
  npx vite
  ```

Open your browser at `http://localhost:5173` (or `http://localhost:5174`).

---

## 🧪 Testing & Validation

### Run Automated Unit & Graph Validation Suite:
```bash
npm test
```
Tests:
- All 7 missions structurally validated.
- 21 decision nodes with exactly 3 choices each.
- Exactly 1 winning choice per decision.
- Every mission starting node and VICTORY terminus.
- Verification of Emergency 112 helpline metadata.

### Run Scenario Integrity Validator:
```bash
npx tsx shared/validateScenarios.ts
```

### Build for Production:
```bash
npm run build:client
```

---

## 📂 Project Structure

```
.
├── shared/
│   ├── types.ts                # TypeScript models (Mission, DecisionNode, SafeCircle)
│   ├── missionsData.ts         # All 7 complete mission narratives and verified helplines
│   └── validateScenarios.ts    # Scenario validation script
├── server/
│   ├── src/
│   │   ├── db.ts               # SQLite database manager using sql.js
│   │   └── index.ts            # Express REST API (health, missions, stats, Zod validation)
│   └── tsconfig.json
├── src/
│   ├── components/
│   │   ├── SheroLogo.tsx       # Custom logo with integrated star-shield motif
│   │   ├── AnimeSceneVisual.tsx# Layered anime SVG illustration for Aira & environments
│   │   ├── TitleScreen.tsx     # Cinematic opening screen with PLAY button & audio toggle
│   │   ├── MainMenu.tsx        # Command deck with New Adventure confirmation modal
│   │   ├── MissionSelectWorld.tsx # 7 illustrated cards with unlock progression
│   │   ├── GameplayView.tsx    # HUD, 3-choice decision buttons, feedback, Game Over & victory
│   │   ├── SafeCircleToolkit.tsx# 6 functional modules (Contacts, Plan, 112, Timer, Cyber)
│   │   ├── ProgressView.tsx    # Telemetry, earned badges, and statistics
│   │   ├── HowToPlay.tsx       # Interactive rules & survival guide
│   │   ├── SettingsModal.tsx   # Music, SFX, reduced motion, text scaling & data purge
│   │   └── CreditsModal.tsx    # Educational frameworks & statutory acknowledgments
│   ├── utils/
│   │   ├── sound.ts            # Web Audio API sound synthesis
│   │   └── storage.ts          # LocalStorage persistence & corruption safety
│   ├── App.tsx                 # Master state navigation
│   ├── index.css               # Dark theme & custom anime scrollbar styling
│   └── main.tsx                # React DOM mount
├── .env.example
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

---

## 🔒 Privacy & Safety Notice

1. **Zero External Tracking**: Personal contact numbers, notes, and check-in sessions are stored locally on the client's browser using versioned LocalStorage.
2. **Authoritative Emergency Helplines**: Helplines cited are official statutory numbers (e.g. National Emergency **112**, Women Helpline **1091** / **181**, Cybercrime **1930**).
3. **No Victim Blaming**: Scenarios emphasize perpetrator accountability and trauma-informed de-escalation.
