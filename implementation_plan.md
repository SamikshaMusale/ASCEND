# ASCEND — Frontend Foundation Implementation Plan

Build the complete frontend MVP for **ASCEND** ("Your Real Life. Your Character. Your RPG.") — a dark, RPG-themed productivity web app using React + Vite + Tailwind CSS + Framer Motion + Three.js.

## Proposed Changes

### 1. Project Setup
- Initialize Vite React project in the workspace root
- Install dependencies: `tailwindcss`, `framer-motion`, `three`, `@react-three/fiber`, `@react-three/drei`, `lucide-react`, `react-router-dom`
- Configure Tailwind with custom RPG dark theme (deep blacks, purple/gold accents, glass effects)
- Set up Google Fonts (Inter + Cinzel for RPG headings)

### 2. Project Structure

```
src/
├── assets/                  # Static assets
├── components/
│   ├── ui/                  # Button, XPBar, AttributeBar, GoldDisplay, Toast, etc.
│   ├── layout/              # Navbar, Sidebar, PageWrapper
│   ├── quest/               # QuestCard, QuestModal
│   ├── character/           # CharacterCard, AchievementCard
│   ├── loot/                # LootCard
│   ├── three/               # FloatingCrystal, CharacterScene (Three.js)
│   └── gamification/        # LevelUpModal, StreakDisplay, BossSection
├── data/                    # Mock data (mockQuests, mockCharacter, etc.)
├── context/                 # GameContext (React Context for global state)
├── hooks/                   # Custom hooks
├── pages/                   # 7 pages (Landing, Login, Register, Dashboard, Quests, Character, LootVault)
├── App.jsx                  # Router setup
├── main.jsx                 # Entry point
└── index.css                # Tailwind + custom styles
```

### 3. Mock Data Layer (`src/data/`)

#### [NEW] `mockData.js`
- `mockCharacter` — name, level, xp, gold, streak, attributes (Intellect, Strength, Vitality, Creativity)
- `mockQuests` — array of quests with id, name, description, category, difficulty, xpReward, goldReward, attributeReward, completed status
- `mockAchievements` — array with id, name, description, icon, unlocked status
- `mockLootItems` — array with id, name, description, price, type, purchased status
- `mockActivity` — recent activity log entries

Structures mirror what FastAPI would return so UI swap is seamless later.

### 4. State Management (`src/context/`)

#### [NEW] `GameContext.jsx`
- React Context + useReducer for global game state
- Actions: `COMPLETE_QUEST`, `PURCHASE_ITEM`, `LEVEL_UP`, `ADD_TOAST`
- XP/Gold/Attribute calculations on quest completion
- Level-up detection (when XP exceeds threshold)
- Toast notification queue

### 5. Pages (7 routes)

| Route | Page | Key Features |
|-------|------|-------------|
| `/` | Landing | Hero with Three.js floating crystal, How It Works, Feature preview, CTAs |
| `/login` | Login | Email/Password fields, RPG-styled form |
| `/register` | Register | Username/Email/Password/Confirm, "Create Character" CTA |
| `/dashboard` | Dashboard | Character section w/ 3D scene, XP bar, attributes, today's quests, Daily Boss, streak, recent activity |
| `/quests` | Quests | Quest list, filters, create/edit/delete modal, complete interaction |
| `/character` | Character | Full attribute breakdown, achievements grid |
| `/loot-vault` | Loot Vault | Shop items, Gold display, purchase interaction |

### 6. Three.js Scenes (`src/components/three/`)

#### [NEW] `FloatingCrystal.jsx`
- Icosahedron geometry with emissive purple/gold material
- Slow rotation + floating animation
- Subtle particle points around it
- Used on Landing page hero and Dashboard character section

Kept lightweight — single mesh + particles, no complex models.

### 7. Gamification Interactions

- **Quest Complete**: Button animates → quest fades to completed → XP/Gold increment → attribute bar grows → toast appears
- **Level Up**: When XP threshold crossed → full-screen modal with Framer Motion scale/fade, "LEVEL 7 → LEVEL 8"
- **Loot Purchase**: Gold deducts → item shows "Owned" → purchase celebration toast
- **All animations**: Framer Motion `motion.div` with spring transitions

### 8. Visual Design System

- **Colors**: Deep slate/gray backgrounds (#0a0a0f, #13131a), purple accents (#8b5cf6, #a855f7), gold (#f59e0b, #fbbf24), red for HP, green for success
- **Glass effects**: `backdrop-blur` + semi-transparent borders
- **Typography**: Cinzel (display/headings), Inter (body)
- **Borders**: Subtle glowing borders using box-shadow with accent colors
- **Cards**: Dark glass cards with hover glow effects

## Verification Plan

### Automated Tests
- `npm run build` — ensure zero build errors

### Manual Verification
- Run `npm run dev` and navigate all 7 routes
- Complete a quest → verify XP/Gold/attribute animation + toast
- Trigger level-up → verify modal
- Purchase loot item → verify Gold deduction
- Check responsive layout on mobile viewport
- Verify no console errors
- Verify Three.js renders without performance issues
