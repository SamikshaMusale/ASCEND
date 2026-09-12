-- ASCEND Initial Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. USERS
-- ==========================================
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- 2. CHARACTERS
-- ==========================================
CREATE TABLE public.characters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    level INTEGER NOT NULL DEFAULT 1 CHECK (level > 0),
    xp INTEGER NOT NULL DEFAULT 0 CHECK (xp >= 0),
    gold INTEGER NOT NULL DEFAULT 0 CHECK (gold >= 0),
    streak INTEGER NOT NULL DEFAULT 0 CHECK (streak >= 0),
    intellect INTEGER NOT NULL DEFAULT 0 CHECK (intellect >= 0),
    strength INTEGER NOT NULL DEFAULT 0 CHECK (strength >= 0),
    vitality INTEGER NOT NULL DEFAULT 0 CHECK (vitality >= 0),
    creativity INTEGER NOT NULL DEFAULT 0 CHECK (creativity >= 0),
    last_activity_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- 3. QUESTS
-- ==========================================
CREATE TABLE public.quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('Learning', 'Fitness', 'Wellness', 'Creative')),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard', 'Epic')),
    xp_reward INTEGER NOT NULL CHECK (xp_reward >= 0),
    gold_reward INTEGER NOT NULL CHECK (gold_reward >= 0),
    completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ
);

-- ==========================================
-- 4. ITEMS
-- ==========================================
CREATE TABLE public.items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    price INTEGER NOT NULL CHECK (price >= 0),
    type TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- 5. INVENTORY
-- ==========================================
CREATE TABLE public.inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
    purchased_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_user_item UNIQUE (user_id, item_id)
);

-- ==========================================
-- 6. ACHIEVEMENTS
-- ==========================================
CREATE TABLE public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon TEXT,
    requirement_type TEXT NOT NULL,
    requirement_value INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- 7. USER_ACHIEVEMENTS
-- ==========================================
CREATE TABLE public.user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_user_achievement UNIQUE (user_id, achievement_id)
);

-- ==========================================
-- 8. ACTIVITY_LOGS
-- ==========================================
CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ==========================================
-- INDEXES
-- ==========================================
CREATE INDEX idx_quests_user_id ON public.quests(user_id);
CREATE INDEX idx_quests_created_at ON public.quests(created_at);
CREATE INDEX idx_quests_completed ON public.quests(completed);
CREATE INDEX idx_inventory_user_id ON public.inventory(user_id);
CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs(created_at);
CREATE INDEX idx_user_achievements_user_id ON public.user_achievements(user_id);


-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Users can only read and update their own data
CREATE POLICY "Users can view own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Characters
CREATE POLICY "Users can view own character" ON public.characters FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own character" ON public.characters FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own character" ON public.characters FOR UPDATE USING (auth.uid() = user_id);

-- Quests
CREATE POLICY "Users can view own quests" ON public.quests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quests" ON public.quests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own quests" ON public.quests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own quests" ON public.quests FOR DELETE USING (auth.uid() = user_id);

-- Items (Catalogue - public read-only)
CREATE POLICY "Anyone can view items" ON public.items FOR SELECT USING (true);

-- Inventory
CREATE POLICY "Users can view own inventory" ON public.inventory FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own inventory" ON public.inventory FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Achievements (Catalogue - public read-only)
CREATE POLICY "Anyone can view achievements" ON public.achievements FOR SELECT USING (true);

-- User Achievements
CREATE POLICY "Users can view own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own achievements" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Activity Logs
CREATE POLICY "Users can view own logs" ON public.activity_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own logs" ON public.activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);


-- ==========================================
-- SEED DATA
-- ==========================================
INSERT INTO public.items (name, description, price, type) VALUES
('Iron Frame', 'A sturdy frame for beginners.', 100, 'frame'),
('Void Theme', 'Embrace the darkness with this sleek UI theme.', 500, 'theme'),
('Champion Badge', 'Show off your dedication to the grind.', 1000, 'badge'),
('Warrior Aura', 'A subtle glowing effect for your profile.', 2500, 'aura'),
('Legendary Title', 'Only for the most dedicated ascendants.', 5000, 'title');

INSERT INTO public.achievements (name, description, requirement_type, requirement_value) VALUES
('First Blood', 'Complete your first quest.', 'quests_completed', 1),
('On Fire', 'Maintain a 7-day streak.', 'streak_days', 7),
('Quest Master', 'Complete 50 quests.', 'quests_completed', 50),
('Treasure Hunter', 'Purchase your first item from the Loot Vault.', 'items_purchased', 1),
('Level Up', 'Reach level 5.', 'level_reached', 5);

-- ==========================================
-- TRIGGERS
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_characters_updated_at
    BEFORE UPDATE ON public.characters
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

