# ========================================
# ASCEND Backend — Pydantic Schemas
# Request / Response models for all endpoints.
# ========================================

from __future__ import annotations

import uuid
from datetime import datetime, date
from typing import Optional, List

from pydantic import BaseModel, Field


# ============================================================
#  AUTH
# ============================================================

class RegisterRequest(BaseModel):
    username: str = Field(..., min_length=1, max_length=50)
    email: str


class UserResponse(BaseModel):
    id: uuid.UUID
    username: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================================
#  CHARACTER
# ============================================================

class AttributesResponse(BaseModel):
    intellect: int = 0
    strength: int = 0
    vitality: int = 0
    creativity: int = 0


class CharacterResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    level: int
    xp: int
    gold: int
    streak: int
    intellect: int
    strength: int
    vitality: int
    creativity: int
    last_activity_date: Optional[date] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CharacterWithAchievementsResponse(BaseModel):
    character: CharacterResponse
    achievements: List[AchievementStatusResponse]


# ============================================================
#  QUESTS
# ============================================================

class QuestCreateRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    category: str = Field(..., pattern=r"^(Learning|Fitness|Wellness|Creative)$")
    difficulty: str = Field(..., pattern=r"^(Easy|Medium|Hard|Epic)$")


class QuestResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    title: str
    description: Optional[str] = None
    category: str
    difficulty: str
    xp_reward: int
    gold_reward: int
    completed: bool
    created_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class QuestRewardsResponse(BaseModel):
    xp: int
    gold: int
    attribute: str
    attribute_points: int


class QuestCompleteResponse(BaseModel):
    quest: QuestResponse
    rewards: QuestRewardsResponse
    new_level: int
    leveled_up: bool
    new_achievements: List[AchievementResponse]


# ============================================================
#  ITEMS / SHOP
# ============================================================

class ItemResponse(BaseModel):
    id: uuid.UUID
    name: str
    description: Optional[str] = None
    price: int
    type: str
    created_at: datetime

    class Config:
        from_attributes = True


class ShopItemResponse(BaseModel):
    """Item with purchase status for the authenticated user."""
    id: uuid.UUID
    name: str
    description: Optional[str] = None
    price: int
    type: str
    purchased: bool = False


class PurchaseResponse(BaseModel):
    item: ShopItemResponse
    remaining_gold: int


# ============================================================
#  ACHIEVEMENTS
# ============================================================

class AchievementResponse(BaseModel):
    id: uuid.UUID
    name: str
    description: str
    icon: Optional[str] = None
    requirement_type: str
    requirement_value: Optional[int] = None

    class Config:
        from_attributes = True


class AchievementStatusResponse(BaseModel):
    """Achievement with unlock status for the authenticated user."""
    id: uuid.UUID
    name: str
    description: str
    icon: Optional[str] = None
    unlocked: bool = False
    unlocked_at: Optional[datetime] = None


# ============================================================
#  ACTIVITY LOGS
# ============================================================

class ActivityLogResponse(BaseModel):
    id: uuid.UUID
    type: str
    message: str
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================================
#  DASHBOARD
# ============================================================

class StreakResponse(BaseModel):
    current: int
    last_activity_date: Optional[date] = None


class DashboardResponse(BaseModel):
    character: CharacterResponse
    active_quests: List[QuestResponse]
    recent_activity: List[ActivityLogResponse]
    streak: StreakResponse


# ============================================================
#  GENERIC
# ============================================================

class MessageResponse(BaseModel):
    message: str


class HealthResponse(BaseModel):
    status: str
    version: str


# ---- Forward-reference updates ----
# Pydantic v2 needs model_rebuild() for forward refs
CharacterWithAchievementsResponse.model_rebuild()
QuestCompleteResponse.model_rebuild()
