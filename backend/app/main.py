# ========================================
# ASCEND Backend — FastAPI Application
# All endpoints in a single file for simplicity.
# ========================================

from __future__ import annotations

from datetime import datetime, timezone
from uuid import UUID

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import get_db, settings
from .dependencies import get_current_user_id
from .models import (
    User, Character, Quest, Item, Inventory,
    Achievement, UserAchievement, ActivityLog,
)
from .schemas import (
    HealthResponse,
    MessageResponse,
    RegisterRequest,
    UserResponse,
    CharacterResponse,
    CharacterWithAchievementsResponse,
    AchievementStatusResponse,
    AchievementResponse,
    QuestCreateRequest,
    QuestResponse,
    QuestCompleteResponse,
    QuestRewardsResponse,
    ShopItemResponse,
    PurchaseResponse,
    ActivityLogResponse,
    DashboardResponse,
    StreakResponse,
)
from .services import (
    get_server_rewards,
    apply_quest_completion,
    check_and_award_achievements,
)

# ============================================================
#  APP SETUP
# ============================================================

app = FastAPI(
    title="ASCEND API",
    description="Gamified productivity backend for the ASCEND hackathon project.",
    version="1.0.0",
)

# CORS — allow the Vite dev frontend (supports multiple ports)
_cors_origins = [
    origin.strip()
    for origin in settings.FRONTEND_URL.split(",")
    if origin.strip()
]
# Also allow common Vite dev ports during development
for port in ["5173", "5174", "5175"]:
    candidate = f"http://localhost:{port}"
    if candidate not in _cors_origins:
        _cors_origins.append(candidate)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




# ============================================================
#  HEALTH CHECK
# ============================================================

@app.get("/health", response_model=HealthResponse, tags=["Health"])
def health_check():
    return HealthResponse(status="ok", version="1.0.0")


# ============================================================
#  AUTH
# ============================================================

@app.post(
    "/auth/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Auth"],
)
def register_user(
    body: RegisterRequest,
    user_id: UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """
    Initialise the backend profile for a newly-registered Supabase user.
    Creates rows in `users` and `characters`.
    Idempotent — if the user already exists, returns the existing profile.
    """
    existing = db.query(User).filter(User.id == user_id).first()
    if existing:
        return existing

    user = User(id=user_id, username=body.username, email=body.email)
    db.add(user)
    db.flush()  # Ensure user row exists before FK reference

    character = Character(user_id=user_id)
    db.add(character)

    # Welcome activity log
    log = ActivityLog(
        user_id=user_id,
        type="system",
        message="Welcome to ASCEND! Your adventure begins.",
    )
    db.add(log)

    db.commit()
    db.refresh(user)
    return user


@app.get("/auth/me", response_model=UserResponse, tags=["Auth"])
def get_me(
    user_id: UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Return the authenticated user's profile."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found. Please register first.",
        )
    return user


# ============================================================
#  QUESTS
# ============================================================

@app.get("/quests", response_model=list[QuestResponse], tags=["Quests"])
def list_quests(
    user_id: UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """List all quests for the authenticated user, newest first."""
    quests = (
        db.query(Quest)
        .filter(Quest.user_id == user_id)
        .order_by(Quest.created_at.desc())
        .all()
    )
    return quests


@app.post(
    "/quests",
    response_model=QuestResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Quests"],
)
def create_quest(
    body: QuestCreateRequest,
    user_id: UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """
    Create a new quest. Rewards are set SERVER-SIDE based on difficulty.
    Frontend-supplied reward values are ignored.
    """
    rewards = get_server_rewards(body.difficulty)

    quest = Quest(
        user_id=user_id,
        title=body.title,
        description=body.description,
        category=body.category,
        difficulty=body.difficulty,
        xp_reward=rewards["xp"],
        gold_reward=rewards["gold"],
    )
    db.add(quest)
    db.commit()
    db.refresh(quest)
    return quest


@app.delete(
    "/quests/{quest_id}",
    response_model=MessageResponse,
    tags=["Quests"],
)
def delete_quest(
    quest_id: UUID,
    user_id: UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Delete an incomplete quest owned by the authenticated user."""
    quest = (
        db.query(Quest)
        .filter(Quest.id == quest_id, Quest.user_id == user_id)
        .first()
    )
    if not quest:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quest not found.",
        )
    if quest.completed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete a completed quest.",
        )
    db.delete(quest)
    db.commit()
    return MessageResponse(message="Quest deleted successfully.")


@app.post(
    "/quests/{quest_id}/complete",
    response_model=QuestCompleteResponse,
    tags=["Quests"],
)
def complete_quest(
    quest_id: UUID,
    user_id: UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """
    Complete a quest and trigger all server-authoritative game logic:
      1. Server-set XP/Gold rewards
      2. Attribute point allocation
      3. Level recalculation
      4. Streak update
      5. Activity logging
      6. Achievement checks

    Uses row-level locking to prevent race conditions.
    """
    # Lock the quest row
    quest = (
        db.query(Quest)
        .filter(Quest.id == quest_id, Quest.user_id == user_id)
        .with_for_update()
        .first()
    )
    if not quest:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quest not found.",
        )
    if quest.completed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Quest is already completed.",
        )

    # Lock the character row
    character = (
        db.query(Character)
        .filter(Character.user_id == user_id)
        .with_for_update()
        .first()
    )
    if not character:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Character not found. Please register first.",
        )

    # Apply all game logic inside the transaction
    result = apply_quest_completion(db, quest, character)

    # Check achievements (still inside transaction)
    newly_unlocked = check_and_award_achievements(db, user_id, character)

    db.commit()
    db.refresh(quest)
    db.refresh(character)

    return QuestCompleteResponse(
        quest=QuestResponse.model_validate(quest),
        rewards=QuestRewardsResponse(
            xp=result["xp"],
            gold=result["gold"],
            attribute=result["attribute"],
            attribute_points=result["attribute_points"],
        ),
        new_level=result["new_level"],
        leveled_up=result["leveled_up"],
        new_achievements=[
            AchievementResponse.model_validate(a) for a in newly_unlocked
        ],
    )


# ============================================================
#  CHARACTER
# ============================================================

@app.get("/character", response_model=CharacterWithAchievementsResponse, tags=["Character"])
def get_character(
    user_id: UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Return character stats and all achievements with unlock status."""
    character = (
        db.query(Character)
        .filter(Character.user_id == user_id)
        .first()
    )
    if not character:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Character not found. Please register first.",
        )

    # Build achievements with unlock status
    all_achievements = db.query(Achievement).all()
    unlocked_map: dict[UUID, datetime] = {}
    user_achs = (
        db.query(UserAchievement)
        .filter(UserAchievement.user_id == user_id)
        .all()
    )
    for ua in user_achs:
        unlocked_map[ua.achievement_id] = ua.unlocked_at

    achievement_list = [
        AchievementStatusResponse(
            id=a.id,
            name=a.name,
            description=a.description,
            icon=a.icon,
            unlocked=a.id in unlocked_map,
            unlocked_at=unlocked_map.get(a.id),
        )
        for a in all_achievements
    ]

    return CharacterWithAchievementsResponse(
        character=CharacterResponse.model_validate(character),
        achievements=achievement_list,
    )


# ============================================================
#  SHOP
# ============================================================

@app.get("/shop", response_model=list[ShopItemResponse], tags=["Shop"])
def list_shop(
    user_id: UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """List all shop items with purchase status for the authenticated user."""
    items = db.query(Item).all()
    owned_item_ids = {
        row[0]
        for row in db.query(Inventory.item_id)
        .filter(Inventory.user_id == user_id)
        .all()
    }

    return [
        ShopItemResponse(
            id=item.id,
            name=item.name,
            description=item.description,
            price=item.price,
            type=item.type,
            purchased=item.id in owned_item_ids,
        )
        for item in items
    ]


@app.post(
    "/shop/{item_id}/buy",
    response_model=PurchaseResponse,
    tags=["Shop"],
)
def buy_item(
    item_id: UUID,
    user_id: UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """
    Purchase an item from the shop.
    Server reads the price from DB — frontend values are ignored.
    Uses row-level locking on the character to prevent gold race conditions.
    """
    # Read item (catalogue — no lock needed, it's static)
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found.",
        )

    # Check if already owned
    existing = (
        db.query(Inventory)
        .filter(Inventory.user_id == user_id, Inventory.item_id == item_id)
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Item already purchased.",
        )

    # Lock character row for gold deduction
    character = (
        db.query(Character)
        .filter(Character.user_id == user_id)
        .with_for_update()
        .first()
    )
    if not character:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Character not found.",
        )

    if character.gold < item.price:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Not enough gold. Need {item.price}, have {character.gold}.",
        )

    # Deduct gold and add to inventory
    character.gold -= item.price
    character.updated_at = datetime.now(timezone.utc)

    inv = Inventory(user_id=user_id, item_id=item_id)
    db.add(inv)

    log = ActivityLog(
        user_id=user_id,
        type="purchase",
        message=f"Purchased {item.name} for {item.price} Gold.",
    )
    db.add(log)

    # Check achievements after purchase (e.g., "Treasure Hunter")
    check_and_award_achievements(db, user_id, character)

    db.commit()
    db.refresh(character)

    return PurchaseResponse(
        item=ShopItemResponse(
            id=item.id,
            name=item.name,
            description=item.description,
            price=item.price,
            type=item.type,
            purchased=True,
        ),
        remaining_gold=character.gold,
    )


# ============================================================
#  DASHBOARD
# ============================================================

@app.get("/dashboard", response_model=DashboardResponse, tags=["Dashboard"])
def get_dashboard(
    user_id: UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """
    Aggregate dashboard data:
      - Character stats
      - Active (incomplete) quests
      - Recent activity logs (last 10)
      - Streak info
    """
    character = (
        db.query(Character)
        .filter(Character.user_id == user_id)
        .first()
    )
    if not character:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Character not found. Please register first.",
        )

    active_quests = (
        db.query(Quest)
        .filter(Quest.user_id == user_id, Quest.completed.is_(False))
        .order_by(Quest.created_at.desc())
        .all()
    )

    recent_logs = (
        db.query(ActivityLog)
        .filter(ActivityLog.user_id == user_id)
        .order_by(ActivityLog.created_at.desc())
        .limit(10)
        .all()
    )

    return DashboardResponse(
        character=CharacterResponse.model_validate(character),
        active_quests=[QuestResponse.model_validate(q) for q in active_quests],
        recent_activity=[ActivityLogResponse.model_validate(l) for l in recent_logs],
        streak=StreakResponse(
            current=character.streak,
            last_activity_date=character.last_activity_date,
        ),
    )
