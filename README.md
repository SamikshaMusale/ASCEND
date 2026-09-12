<div align="center">

# ⚔️ ASCEND

### *Your Real Life. Your Character. Your RPG.*

**Transform everyday productivity into an epic RPG adventure.**
Complete real-world quests, earn XP & Gold, level up your character, and unlock achievements — all backed by a server-authoritative game engine.

</div>

---

## 📖 Overview

**ASCEND** is a full-stack gamified productivity application that turns daily tasks into RPG-style quests. Users create a character, set goals across categories like Learning, Fitness, Wellness, and Creative, and complete them to earn XP, Gold, and attribute points — all calculated server-side to prevent cheating.

### Who is it for?

- Students and professionals who want to gamify their daily routines
- RPG enthusiasts looking for a real-life progression system
- Anyone who needs a motivating, visual way to track personal growth

### Key Value

Unlike simple to-do apps, ASCEND provides a deeply gamified experience with leveling curves, attribute systems, streak tracking, a loot shop, unlockable achievements, and an interactive 3D character mascot — making productivity feel like an adventure.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎮 **Quest System** | Create quests across 4 categories (Learning, Fitness, Wellness, Creative) with 4 difficulty tiers (Easy, Medium, Hard, Epic) |
| 📈 **XP & Leveling** | Non-linear progression curve (`100 × level^1.5`) with server-authoritative reward calculation |
| 💰 **Gold Economy** | Earn Gold from quests, spend it in the Loot Vault shop on cosmetic items |
| 🗡️ **Character Attributes** | Four RPG attributes (Intellect, Strength, Vitality, Creativity) that grow based on quest category |
| 🔥 **Streak System** | Track consecutive days of activity with automatic streak management |
| 🏆 **Achievements** | Unlock achievements for milestones like completing quests, maintaining streaks, purchasing items, and reaching levels |
| 🛒 **Loot Vault** | In-game shop with items of varying rarity, purchasable with earned Gold |
| 🧙 **3D Character Mascot** | Interactive chibi character rendered with Three.js that follows your cursor |
| 📊 **Dashboard** | Aggregated view of character stats, active quests, recent activity, and streak info |
| 🔐 **Authentication** | Supabase Auth with JWT-based API protection |
| 📱 **Responsive Design** | Dark fantasy themed UI that works across desktop and mobile |
| ⚡ **Level-Up Celebrations** | Animated modal when the character levels up |
| 📜 **Activity Log** | Chronological history of quest completions, purchases, achievements, and level-ups |
| 🎯 **Demo Account** | Built-in demo/guest mode with mock data for trying the app without registration |

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| [React 18](https://react.dev/) | UI library with hooks and functional components |
| [Vite 5](https://vitejs.dev/) | Build tool and dev server |
| [React Router v6](https://reactrouter.com/) | Client-side routing with protected routes |
| [Tailwind CSS 3](https://tailwindcss.com/) | Utility-first CSS framework |
| [Framer Motion](https://www.framer.com/motion/) | Animations and page transitions |
| [Three.js](https://threejs.org/) | 3D rendering engine |
| [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) | React renderer for Three.js |
| [@react-three/drei](https://github.com/pmndrs/drei) | Useful helpers for R3F (Float, ContactShadows, useGLTF) |
| [Lucide React](https://lucide.dev/) | Icon library |
| [Supabase JS Client](https://supabase.com/docs/reference/javascript/) | Authentication and session management |

### Backend

| Technology | Purpose |
|---|---|
| [FastAPI](https://fastapi.tiangolo.com/) | Python async web framework for the REST API |
| [Uvicorn](https://www.uvicorn.org/) | ASGI server |
| [SQLAlchemy 2.0](https://www.sqlalchemy.org/) | ORM for database operations |
| [Pydantic v2](https://docs.pydantic.dev/) | Request/response validation and serialization |
| [psycopg 3](https://www.psycopg.org/psycopg3/) | PostgreSQL adapter |
| [python-jose](https://github.com/mpdavis/python-jose) | JWT decoding for Supabase Auth tokens |

### Infrastructure

| Technology | Purpose |
|---|---|
| [Supabase](https://supabase.com/) | Authentication (Supabase Auth) and PostgreSQL database hosting |
| [PostgreSQL](https://www.postgresql.org/) | Relational database with RLS policies |

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph Client["Frontend (React + Vite)"]
        A["Landing Page"] --> B["Supabase Auth"]
        B --> C["Dashboard"]
        C --> D["Quests Page"]
        C --> E["Character Page"]
        C --> F["Loot Vault"]
    end

    subgraph Auth["Supabase Auth"]
        B --> G["JWT Token"]
    end

    subgraph API["Backend (FastAPI)"]
        H["JWT Validation"] --> I["API Endpoints"]
        I --> J["Game Services"]
        J --> K["Achievement Engine"]
    end

    subgraph DB["Supabase PostgreSQL"]
        L["users"]
        M["characters"]
        N["quests"]
        O["items"]
        P["inventory"]
        Q["achievements"]
        R["user_achievements"]
        S["activity_logs"]
    end

    G -->|"Bearer Token"| H
    I --> L
    I --> M
    I --> N
    I --> O
    I --> P
    I --> Q
    I --> R
    I --> S
```

---

## 🔄 Application Workflow

```mermaid
flowchart TD
    A["User Visits ASCEND"] --> B{"Authenticated?"}
    B -->|No| C["Landing Page"]
    C --> D["Register / Login"]
    D --> E["Supabase Auth"]
    E --> F["Backend Profile Creation"]
    F --> G["Dashboard"]
    B -->|Yes| G

    G --> H["Create Quest"]
    H --> I["Select Category & Difficulty"]
    I --> J["Server Sets XP/Gold Rewards"]
    J --> K["Quest Added to List"]

    K --> L["Complete Quest"]
    L --> M["Server Calculates Rewards"]
    M --> N["Apply XP + Gold + Attributes"]
    N --> O{"Level Up?"}
    O -->|Yes| P["Level-Up Celebration"]
    O -->|No| Q["Update Dashboard"]
    P --> Q

    M --> R["Check Achievements"]
    R --> S{"New Achievement?"}
    S -->|Yes| T["Award Achievement"]
    T --> Q
    S -->|No| Q

    G --> U["Visit Loot Vault"]
    U --> V["Purchase Item with Gold"]
    V --> W["Server Validates & Deducts Gold"]
    W --> Q
```

---

## 📁 Project Structure

```
ASCEND/
├── public/
│   ├── models/
│   │   └── ascend-character.glb     # 3D character model
│   ├── hero-bg.jpg                   # Landing page background
│   ├── icon-*.jpg                    # UI icons
│   └── vite.svg                      # Favicon
│
├── src/
│   ├── components/
│   │   ├── character/                # AchievementCard
│   │   ├── gamification/             # BossSection, LevelUpModal, StreakDisplay
│   │   ├── layout/                   # Navbar, PageWrapper
│   │   ├── loot/                     # LootCard
│   │   ├── quest/                    # QuestCard, QuestModal
│   │   ├── three/                    # ChibiMascot (3D), FloatingCrystal
│   │   ├── ui/                       # Button, XPBar, AttributeBar, GoldDisplay, etc.
│   │   └── ProtectedRoute.jsx        # Auth route guard
│   │
│   ├── context/
│   │   ├── AuthContext.jsx            # Supabase auth state management
│   │   └── GameContext.jsx            # Global game state (useReducer)
│   │
│   ├── data/
│   │   └── mockData.js               # Demo/fallback data
│   │
│   ├── lib/
│   │   └── supabase.js               # Supabase client initialization
│   │
│   ├── pages/
│   │   ├── LandingPage.jsx            # Marketing/hero page
│   │   ├── LoginPage.jsx              # Email/password login
│   │   ├── RegisterPage.jsx           # Account registration
│   │   ├── DashboardPage.jsx          # Main dashboard
│   │   ├── QuestsPage.jsx             # Quest management
│   │   ├── CharacterPage.jsx          # Character stats & achievements
│   │   └── LootVaultPage.jsx          # Item shop
│   │
│   ├── services/
│   │   ├── api.js                     # Backend API calls + response transforms
│   │   └── authService.js             # Supabase auth methods
│   │
│   ├── utils/
│   │   ├── apiClient.js               # Authenticated fetch wrapper (JWT)
│   │   └── progression.js             # XP/level calculation utilities
│   │
│   ├── App.jsx                        # Root component with routing
│   ├── main.jsx                       # React DOM entry point
│   └── index.css                      # Global styles
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                    # FastAPI app + all endpoints
│   │   ├── models.py                  # SQLAlchemy ORM models
│   │   ├── schemas.py                 # Pydantic request/response schemas
│   │   ├── services.py                # Game logic (rewards, leveling, streaks, achievements)
│   │   ├── database.py                # Engine, session, settings
│   │   └── dependencies.py            # JWT auth dependency
│   ├── requirements.txt               # Python dependencies
│   └── .env.example                   # Backend environment template
│
├── DATABASE_SCHEMA.md                  # Full database schema documentation
├── package.json                        # Frontend dependencies & scripts
├── vite.config.js                      # Vite configuration
├── tailwind.config.js                  # Tailwind CSS configuration
├── postcss.config.js                   # PostCSS configuration
└── .env.example                        # Frontend environment template
```

---

## 🧩 Modules & Components

### Frontend

| Module | Description |
|---|---|
| `AuthContext` | Manages Supabase authentication state, auto-registers backend profile on signup |
| `GameContext` | Global game state using `useReducer`; fetches all data on login, dispatches actions for quest/shop/UI |
| `apiClient` | Authenticated fetch wrapper that auto-attaches Supabase JWT as Bearer token |
| `api.js` | Service layer with snake_case → camelCase transforms for all backend endpoints |
| `progression.js` | Client-side XP/level calculation utilities (mirrors backend formula) |
| `ChibiMascot` | Interactive 3D character loaded from GLB with cursor-following, idle animation, and purple lighting |
| `FloatingCrystal` | Animated 3D crystal used on the landing page |
| `ProtectedRoute` | Route guard that redirects unauthenticated users to login |
| `QuestModal` | Form for creating new quests with category/difficulty selection |
| `LevelUpModal` | Animated celebration overlay on level-up |

### Backend

| Module | Description |
|---|---|
| `main.py` | All FastAPI endpoints in a single file: auth, quests, character, shop, dashboard |
| `models.py` | SQLAlchemy ORM models mapped to existing Supabase PostgreSQL tables |
| `schemas.py` | Pydantic v2 models for request validation and response serialization |
| `services.py` | Server-authoritative game logic: reward tables, leveling formula, streak management, achievement engine |
| `database.py` | Database engine, session factory, and environment settings via `pydantic-settings` |
| `dependencies.py` | JWT authentication dependency — extracts user UUID from Supabase tokens |

---

## 🗄️ Database Schema

```mermaid
erDiagram
    users ||--|| characters : "has one"
    users ||--o{ quests : "creates"
    users ||--o{ inventory : "owns"
    users ||--o{ user_achievements : "unlocks"
    users ||--o{ activity_logs : "generates"
    items ||--o{ inventory : "purchased via"
    achievements ||--o{ user_achievements : "tracked via"

    users {
        UUID id PK
        TEXT username
        TEXT email
        TIMESTAMPTZ created_at
    }

    characters {
        UUID id PK
        UUID user_id FK
        INTEGER level
        INTEGER xp
        INTEGER gold
        INTEGER streak
        INTEGER intellect
        INTEGER strength
        INTEGER vitality
        INTEGER creativity
        DATE last_activity_date
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    quests {
        UUID id PK
        UUID user_id FK
        TEXT title
        TEXT description
        TEXT category
        TEXT difficulty
        INTEGER xp_reward
        INTEGER gold_reward
        BOOLEAN completed
        TIMESTAMPTZ created_at
        TIMESTAMPTZ completed_at
    }

    items {
        UUID id PK
        TEXT name
        TEXT description
        INTEGER price
        TEXT type
        TIMESTAMPTZ created_at
    }

    inventory {
        UUID id PK
        UUID user_id FK
        UUID item_id FK
        TIMESTAMPTZ purchased_at
    }

    achievements {
        UUID id PK
        TEXT name
        TEXT description
        TEXT icon
        TEXT requirement_type
        INTEGER requirement_value
        TIMESTAMPTZ created_at
    }

    user_achievements {
        UUID id PK
        UUID user_id FK
        UUID achievement_id FK
        TIMESTAMPTZ unlocked_at
    }

    activity_logs {
        UUID id PK
        UUID user_id FK
        TEXT type
        TEXT message
        TIMESTAMPTZ created_at
    }
```

---

## 📡 API Documentation

All endpoints require a valid Supabase JWT in the `Authorization: Bearer <token>` header unless noted otherwise.

### Health

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/health` | Health check, returns status and version | No |

### Auth

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/auth/register` | Initialize backend profile for a Supabase user (idempotent) | Yes |
| `GET` | `/auth/me` | Get authenticated user's profile | Yes |

### Quests

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/quests` | List all quests for the user (newest first) | Yes |
| `POST` | `/quests` | Create a new quest (rewards set server-side by difficulty) | Yes |
| `DELETE` | `/quests/{quest_id}` | Delete an incomplete quest | Yes |
| `POST` | `/quests/{quest_id}/complete` | Complete a quest — triggers XP, Gold, attributes, level, streak, achievements | Yes |

### Character

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/character` | Get character stats and all achievements with unlock status | Yes |

### Shop

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/shop` | List all shop items with purchase status | Yes |
| `POST` | `/shop/{item_id}/buy` | Purchase an item (server validates Gold balance) | Yes |

### Dashboard

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/dashboard` | Aggregated data: character, active quests, recent activity, streak | Yes |

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** ≥ 18.x and **npm**
- **Python** ≥ 3.10
- A **Supabase** project (for Auth + PostgreSQL)

### 1. Clone the Repository

```bash
git clone https://github.com/SamikshaMusale/ASCEND.git
cd ASCEND
```

### 2. Set Up the Database

Create the tables in your Supabase SQL Editor using the schema documented in [`DATABASE_SCHEMA.md`](DATABASE_SCHEMA.md). Run the seed data for items and achievements.

### 3. Frontend Setup

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_ANON_KEY
```

### 4. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
```

Edit `backend/.env` with your credentials:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_JWT_SECRET=YOUR_SUPABASE_JWT_SECRET
FRONTEND_URL=http://localhost:5173
```

### 5. Start Development Servers

**Terminal 1 — Backend:**
```bash
cd backend
venv\Scripts\activate          # or source venv/bin/activate
uvicorn app.main:app --reload
```

**Terminal 2 — Frontend:**
```bash
npm run dev
```

The app will be available at `http://localhost:5173` with the API running on `http://127.0.0.1:8000`.

---

## 🔑 Environment Variables

### Frontend (`.env`)

| Variable | Description | Required |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anonymous/public key | Yes |
| `VITE_API_URL` | Backend API base URL (defaults to `http://127.0.0.1:8000`) | No |

### Backend (`backend/.env`)

| Variable | Description | Required |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_JWT_SECRET` | Supabase JWT secret for token validation | Yes |
| `FRONTEND_URL` | Allowed CORS origin(s), comma-separated | Yes |

---

## 📋 Usage

1. **Register** — Create an account on the registration page. Supabase handles auth; the backend auto-creates your character profile.

2. **Dashboard** — View your character stats, level, Gold, XP progress, active quests, streak, and recent activity. Interact with the 3D character mascot.

3. **Create Quests** — Navigate to the Quests page and create tasks across four categories:
   - **Learning** → grows *Intellect*
   - **Fitness** → grows *Strength*
   - **Wellness** → grows *Vitality*
   - **Creative** → grows *Creativity*

4. **Complete Quests** — Mark quests done to earn XP, Gold, and attribute points. Rewards scale with difficulty (Easy → Epic).

5. **Level Up** — Accumulate XP to level up. A celebration modal appears on each level-up.

6. **Loot Vault** — Spend earned Gold on cosmetic items of varying rarity.

7. **Achievements** — Unlock achievements automatically by hitting milestones (first quest, 7-day streak, level 5, etc.).

8. **Character Page** — View detailed attribute stats and all achievements with unlock status.

---

## 📸 Screenshots

> Replace the placeholders below with actual screenshots of your application.

| Screen | Preview |
|---|---|
| Landing Page | *`screenshots/landing.png`* |
| Dashboard | *`screenshots/dashboard.png`* |
| Quests Page | *`screenshots/quests.png`* |
| Character Page | *`screenshots/character.png`* |
| Loot Vault | *`screenshots/loot-vault.png`* |
| Level-Up Modal | *`screenshots/level-up.png`* |

---

## 🌟 Key Highlights

- **Server-Authoritative Game Logic** — All XP, Gold, attribute, and level calculations happen on the backend. The frontend cannot cheat rewards.
- **Row-Level Locking** — Quest completion and shop purchases use `SELECT ... FOR UPDATE` to prevent race conditions.
- **Non-Linear Progression** — XP curve (`100 × level^1.5`) creates satisfying early gains with meaningful late-game grind.
- **Automatic Achievement Engine** — Server checks all achievement conditions on every quest completion and purchase.
- **Interactive 3D Mascot** — GLB model loaded via React Three Fiber with cursor-tracking, idle bobbing, and purple atmospheric lighting.
- **Code Splitting** — All pages are lazy-loaded with React's `Suspense` for optimal bundle sizes.
- **Streak Management** — Automatic streak tracking with consecutive-day detection and gap reset.
- **Type-Safe API Contract** — Pydantic v2 schemas enforce strict request/response validation.
- **Dark Fantasy UI** — Custom Tailwind theme with Cinzel + Inter typography, purple accents, glassmorphism, and Framer Motion animations.

---

## 🔮 Future Enhancements

- **Social Features** — Friend system, leaderboards, and guild/party quests
- **Recurring Quests** — Daily/weekly repeating quests with bonus streak rewards
- **Quest Categories Expansion** — Additional categories like Finance, Social, and Health
- **Character Customization** — Equippable items from the Loot Vault visually reflected on the 3D character
- **Push Notifications** — Reminders for active quests and streak maintenance
- **Mobile App** — React Native companion app
- **Admin Dashboard** — Analytics and content management for items/achievements
- **OAuth Providers** — Google, GitHub, and Discord login via Supabase Auth

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

Please ensure your code:
- Follows the existing project structure and naming conventions
- Does not introduce breaking changes to the API contract
- Keeps all game logic server-authoritative

---

## 🙏 Acknowledgements & Credits

- **3D Character**: [Collectible Cute Chibi Assassin [MESHY]](https://sketchfab.com/3d-models/collectible-cute-chibi-assassin-meshy-a6d72abafc124fabaa446a103f4b3a67) by **Fthan Cox**, licensed under [Creative Commons Attribution (CC-BY-4.0)](http://creativecommons.org/licenses/by/4.0/)
- **Authentication & Database**: [Supabase](https://supabase.com/)
- **Icons**: [Lucide](https://lucide.dev/)
- **Fonts**: [Cinzel](https://fonts.google.com/specimen/Cinzel) and [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts

---

<div align="center">

*Built with ⚔️ by the ASCEND team*

</div>