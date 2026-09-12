# ========================================
# ASCEND Backend — Game Services
# Server-authoritative gamification logic:
#   • XP/Gold reward tables
#   • Attribute mapping
#   • Leveling formula
#   • Streak management
#   • Achievement checking
# ========================================

from __future__ import annotations

import math
from datetime import date, datetime, timezone
from uuid import UUID

from sqlalchemy.orm import Session

from . import models


# ============================================================
#  CONSTANTS — Server-authoritative reward tables
# ============================================================

DIFFICULTY_REWARDS: dict[str, dict[str, int]] = {
    "Easy":   {"xp": 30,  "gold": 15},
    "Medium": {"xp": 60,  "gold": 30},
    "Hard":   {"xp": 100, "gold": 50},
    "Epic":   {"xp": 200, "gold": 100},
}

CATEGORY_ATTRIBUTE_MAP: dict[str, str] = {
    "Learning":  "intellect",
    "Fitness":   "strength",
    "Wellness":  "vitality",
    "Creative":  "creativity",
}

# Attribute points scale with difficulty
DIFFICULTY_ATTRIBUTE_POINTS: dict[str, int] = {
    "Easy":   2,
    "Medium": 4,
    "Hard":   6,
    "Epic":   10,
}


# ============================================================
#  XP / LEVELING
# ============================================================

def xp_required_for_level(level: int) -> int:
    """
    XP required to advance FROM `level` TO `level + 1`.
    Formula: floor(100 × level^1.5)
    """
    return math.floor(100 * (level ** 1.5))


def total_xp_for_level(level: int) -> int:
    """Total cumulative XP to reach `level` from level 1."""
    total = 0
    for lv in range(1, level):
        total += xp_required_for_level(lv)
    return total


def compute_level_from_xp(total_xp: int) -> int:
    """Derive the current level from total accumulated XP."""
    level = 1
    accumulated = 0
    while accumulated + xp_required_for_level(level) <= total_xp:
        accumulated += xp_required_for_level(level)
        level += 1
    return level


# ============================================================
#  STREAK
# ============================================================

def update_streak(character: models.Character, today: date) -> int:
    """
    Update streak based on last_activity_date.
    Returns the new streak value.
    - Same day: no change
    - Consecutive day: increment
    - Gap > 1 day or no previous: reset to 1
    """
    if character.last_activity_date is None:
        return 1

    delta = (today - character.last_activity_date).days

    if delta == 0:
        # Already active today, keep current streak
        return character.streak
    elif delta == 1:
        # Consecutive day — extend streak
        return character.streak + 1
    else:
        # Streak broken — reset
        return 1


# ============================================================
#  QUEST COMPLETION (transactional)
# ============================================================

def get_server_rewards(difficulty: str) -> dict[str, int]:
    """Return server-authoritative XP/Gold for a difficulty tier."""
    return DIFFICULTY_REWARDS.get(difficulty, DIFFICULTY_REWARDS["Easy"])


def get_attribute_for_category(category: str) -> str:
    """Map quest category → character attribute name."""
    return CATEGORY_ATTRIBUTE_MAP.get(category, "intellect")


def get_attribute_points(difficulty: str) -> int:
    """Return attribute points awarded for a difficulty tier."""
    return DIFFICULTY_ATTRIBUTE_POINTS.get(difficulty, 2)


def apply_quest_completion(
    db: Session,
    quest: models.Quest,
    character: models.Character,
) -> dict:
    """
    Execute the full quest-completion pipeline inside the caller's transaction.
    Mutates `quest` and `character` in-place.

    Returns a summary dict with reward details for the response.
    """
    now = datetime.now(timezone.utc)
    today = now.date()

    # 1. Mark quest completed
    quest.completed = True
    quest.completed_at = now

    # 2. Compute server-authoritative rewards
    rewards = get_server_rewards(quest.difficulty)
    xp_earned = rewards["xp"]
    gold_earned = rewards["gold"]

    # Overwrite quest's stored rewards with authoritative values
    quest.xp_reward = xp_earned
    quest.gold_reward = gold_earned

    # 3. Apply XP & Gold to character
    old_level = character.level
    character.xp += xp_earned
    character.gold += gold_earned

    # 4. Recalculate level
    new_level = compute_level_from_xp(character.xp)
    character.level = new_level
    leveled_up = new_level > old_level

    # 5. Apply attribute points
    attr_name = get_attribute_for_category(quest.category)
    attr_points = get_attribute_points(quest.difficulty)
    current_val = getattr(character, attr_name, 0)
    setattr(character, attr_name, current_val + attr_points)

    # 6. Update streak
    character.streak = update_streak(character, today)
    character.last_activity_date = today
    character.updated_at = now

    # 7. Write activity logs
    log_quest = models.ActivityLog(
        user_id=character.user_id,
        type="quest_complete",
        message=f"Completed quest: {quest.title} (+{xp_earned} XP, +{gold_earned} Gold)",
    )
    db.add(log_quest)

    if leveled_up:
        log_level = models.ActivityLog(
            user_id=character.user_id,
            type="level_up",
            message=f"Leveled up from {old_level} to {new_level}!",
        )
        db.add(log_level)

    return {
        "xp": xp_earned,
        "gold": gold_earned,
        "attribute": attr_name,
        "attribute_points": attr_points,
        "new_level": new_level,
        "leveled_up": leveled_up,
    }


# ============================================================
#  ACHIEVEMENT CHECKING
# ============================================================

def check_and_award_achievements(
    db: Session,
    user_id: UUID,
    character: models.Character,
) -> list[models.Achievement]:
    """
    Check all achievements against the user's current stats.
    Awards any that are newly met. Returns list of newly unlocked achievements.
    """
    # Get all achievements the user has NOT yet unlocked
    already_unlocked_ids = (
        db.query(models.UserAchievement.achievement_id)
        .filter(models.UserAchievement.user_id == user_id)
        .all()
    )
    unlocked_set = {row[0] for row in already_unlocked_ids}

    all_achievements = db.query(models.Achievement).all()
    newly_unlocked: list[models.Achievement] = []

    # Count completed quests for this user
    completed_count = (
        db.query(models.Quest)
        .filter(models.Quest.user_id == user_id, models.Quest.completed.is_(True))
        .count()
    )

    # Count purchased items
    purchased_count = (
        db.query(models.Inventory)
        .filter(models.Inventory.user_id == user_id)
        .count()
    )

    for ach in all_achievements:
        if ach.id in unlocked_set:
            continue  # Already unlocked

        met = False
        if ach.requirement_type == "quests_completed":
            met = completed_count >= (ach.requirement_value or 0)
        elif ach.requirement_type == "streak_days":
            met = character.streak >= (ach.requirement_value or 0)
        elif ach.requirement_type == "items_purchased":
            met = purchased_count >= (ach.requirement_value or 0)
        elif ach.requirement_type == "level_reached":
            met = character.level >= (ach.requirement_value or 0)

        if met:
            ua = models.UserAchievement(
                user_id=user_id,
                achievement_id=ach.id,
            )
            db.add(ua)

            log = models.ActivityLog(
                user_id=user_id,
                type="achievement",
                message=f"Achievement unlocked: {ach.name}",
            )
            db.add(log)

            newly_unlocked.append(ach)

    return newly_unlocked
