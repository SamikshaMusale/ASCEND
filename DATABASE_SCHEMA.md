# ASCEND Database Schema Documentation

This document outlines the PostgreSQL database schema for the ASCEND project. It is intended for the FastAPI backend developer to facilitate the creation of SQLAlchemy models and API logic.

## Overview
The database uses standard PostgreSQL with `uuid-ossp` for primary keys. All timestamps use `TIMESTAMPTZ` and default to `now()`. 
Row Level Security (RLS) is enabled for all tables, restricting access so users can only view and modify their own data, except for static catalogue tables (`items`, `achievements`) which are publicly readable.

## Important Note on Authentication & RLS
The project architecture is:
**React** &rarr; **Supabase Auth JWT** &rarr; **FastAPI** &rarr; **PostgreSQL**

- Supabase Auth is the source of truth for user identity.
- **`users.id`** references **`auth.users.id`** from Supabase Auth.
- No passwords or hashes are stored in the public schema. 
- **Backend Validation**: FastAPI will validate the user's Supabase Auth JWT and obtain the authenticated user's UUID from the JWT.
- **Ownership**: FastAPI will enforce data ownership when using SQLAlchemy/database queries.
- **RLS as Defense-in-Depth**: A normal SQLAlchemy PostgreSQL connection should NOT be assumed to automatically provide `auth.uid()` context. Supabase RLS remains enabled as defense-in-depth where applicable, but the backend must not rely on `auth.uid()` alone when connecting directly through SQLAlchemy.
---

## Tables and Structure

### 1. `users`
Core user profile linked to Supabase Auth.
- `id`: UUID (Primary Key, References `auth.users(id) ON DELETE CASCADE`)
- `username`: TEXT (NOT NULL)
- `email`: TEXT (NOT NULL, UNIQUE)
- `created_at`: TIMESTAMPTZ (NOT NULL, Default: `now()`)

### 2. `characters`
RPG stats and attributes. One-to-one relationship with `users`.
- `id`: UUID (Primary Key, Default: `uuid_generate_v4()`)
- `user_id`: UUID (NOT NULL, UNIQUE, References `users(id) ON DELETE CASCADE`)
- `level`: INTEGER (NOT NULL, Default: 1, `CHECK (level > 0)`)
- `xp`: INTEGER (NOT NULL, Default: 0, `CHECK (xp >= 0)`)
- `gold`: INTEGER (NOT NULL, Default: 0, `CHECK (gold >= 0)`)
- `streak`: INTEGER (NOT NULL, Default: 0, `CHECK (streak >= 0)`)
- `intellect`, `strength`, `vitality`, `creativity`: INTEGER (NOT NULL, Default: 0, `CHECK (value >= 0)`)
- `last_activity_date`: DATE
- `created_at`: TIMESTAMPTZ (NOT NULL, Default: `now()`)
- `updated_at`: TIMESTAMPTZ (NOT NULL, Default: `now()`)

### 3. `quests`
Tasks created by users.
- `id`: UUID (Primary Key, Default: `uuid_generate_v4()`)
- `user_id`: UUID (NOT NULL, References `users(id) ON DELETE CASCADE`)
- `title`: TEXT (NOT NULL)
- `description`: TEXT
- `category`: TEXT (NOT NULL, `CHECK IN ('Learning', 'Fitness', 'Wellness', 'Creative')`)
- `difficulty`: TEXT (NOT NULL, `CHECK IN ('Easy', 'Medium', 'Hard', 'Epic')`)
- `xp_reward`: INTEGER (NOT NULL, `CHECK >= 0`)
- `gold_reward`: INTEGER (NOT NULL, `CHECK >= 0`)
- `completed`: BOOLEAN (NOT NULL, Default: `false`)
- `created_at`: TIMESTAMPTZ (NOT NULL, Default: `now()`)
- `completed_at`: TIMESTAMPTZ
**Indexes**: `user_id`, `created_at`, `completed`

> [!IMPORTANT] 
> **Quest Reward Security:** `xp_reward` and `gold_reward` are **SERVER-AUTHORITATIVE**. The frontend must never be trusted to decide its own XP or Gold rewards. The FastAPI backend must determine rewards based on quest difficulty:
> - **Easy**: 30 XP / 15 Gold
> - **Medium**: 60 XP / 30 Gold
> - **Hard**: 100 XP / 50 Gold
> - **Epic**: 200 XP / 100 Gold
> 
> The database stores the final reward values, but clients must not be allowed to arbitrarily set XP/Gold during creation/updates.

### 4. `items`
Static catalogue of items in the Loot Vault.
- `id`: UUID (Primary Key, Default: `uuid_generate_v4()`)
- `name`: TEXT (NOT NULL, UNIQUE)
- `description`: TEXT
- `price`: INTEGER (NOT NULL, `CHECK >= 0`)
- `type`: TEXT (NOT NULL)
- `created_at`: TIMESTAMPTZ (NOT NULL, Default: `now()`)

### 5. `inventory`
Items purchased by users.
- `id`: UUID (Primary Key, Default: `uuid_generate_v4()`)
- `user_id`: UUID (NOT NULL, References `users(id) ON DELETE CASCADE`)
- `item_id`: UUID (NOT NULL, References `items(id) ON DELETE CASCADE`)
- `purchased_at`: TIMESTAMPTZ (NOT NULL, Default: `now()`)
**Constraints**: `UNIQUE(user_id, item_id)`
**Indexes**: `user_id`

### 6. `achievements`
Static catalogue of unlockable achievements.
- `id`: UUID (Primary Key, Default: `uuid_generate_v4()`)
- `name`: TEXT (NOT NULL, UNIQUE)
- `description`: TEXT (NOT NULL)
- `icon`: TEXT
- `requirement_type`: TEXT (NOT NULL)
- `requirement_value`: INTEGER
- `created_at`: TIMESTAMPTZ (NOT NULL, Default: `now()`)

### 7. `user_achievements`
Achievements unlocked by users.
- `id`: UUID (Primary Key, Default: `uuid_generate_v4()`)
- `user_id`: UUID (NOT NULL, References `users(id) ON DELETE CASCADE`)
- `achievement_id`: UUID (NOT NULL, References `achievements(id) ON DELETE CASCADE`)
- `unlocked_at`: TIMESTAMPTZ (NOT NULL, Default: `now()`)
**Constraints**: `UNIQUE(user_id, achievement_id)`
**Indexes**: `user_id`

### 8. `activity_logs`
Historical logs of user actions (e.g., leveling up, quest completion).
- `id`: UUID (Primary Key, Default: `uuid_generate_v4()`)
- `user_id`: UUID (NOT NULL, References `users(id) ON DELETE CASCADE`)
- `type`: TEXT (NOT NULL)
- `message`: TEXT (NOT NULL)
- `created_at`: TIMESTAMPTZ (NOT NULL, Default: `now()`)
**Indexes**: `user_id`, `created_at`

---

## Seed Data
The database migration seeds the following items and achievements:

**Items:**
- Iron Frame (100g, frame)
- Void Theme (500g, theme)
- Champion Badge (1000g, badge)
- Warrior Aura (2500g, aura)
- Legendary Title (5000g, title)

**Achievements:**
- First Blood (Complete your first quest, type: quests_completed, value: 1)
- On Fire (Maintain a 7-day streak, type: streak_days, value: 7)
- Quest Master (Complete 50 quests, type: quests_completed, value: 50)
- Treasure Hunter (Purchase your first item, type: items_purchased, value: 1)
- Level Up (Reach level 5, type: level_reached, value: 5)

---

## Note for FastAPI Integration
- Ensure all business logic (calculating XP, leveling up, ensuring enough gold for a purchase) is implemented strictly in the backend. 
- Map these structures using SQLAlchemy `declarative_base` or standard `MetaData`. 
- Ensure endpoints extract user identity securely from Supabase Auth JWTs.
