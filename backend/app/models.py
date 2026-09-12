# ========================================
# ASCEND Backend — SQLAlchemy ORM Models
# Mapped to EXISTING Supabase PostgreSQL tables.
# DO NOT use Base.metadata.create_all().
# ========================================

import uuid
from datetime import datetime, date

from sqlalchemy import (
    Column,
    String,
    Integer,
    Boolean,
    Text,
    Date,
    DateTime,
    ForeignKey,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True)  # References auth.users(id)
    username = Column(Text, nullable=False)
    email = Column(Text, nullable=False, unique=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default="now()")

    # Relationships
    character = relationship("Character", back_populates="user", uselist=False)
    quests = relationship("Quest", back_populates="user")
    inventory = relationship("Inventory", back_populates="user")
    user_achievements = relationship("UserAchievement", back_populates="user")
    activity_logs = relationship("ActivityLog", back_populates="user")


class Character(Base):
    __tablename__ = "characters"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False, unique=True,
    )
    level = Column(Integer, nullable=False, default=1)
    xp = Column(Integer, nullable=False, default=0)
    gold = Column(Integer, nullable=False, default=0)
    streak = Column(Integer, nullable=False, default=0)
    intellect = Column(Integer, nullable=False, default=0)
    strength = Column(Integer, nullable=False, default=0)
    vitality = Column(Integer, nullable=False, default=0)
    creativity = Column(Integer, nullable=False, default=0)
    last_activity_date = Column(Date, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default="now()")
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default="now()")

    # Relationships
    user = relationship("User", back_populates="character")


class Quest(Base):
    __tablename__ = "quests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    title = Column(Text, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(Text, nullable=False)     # Learning | Fitness | Wellness | Creative
    difficulty = Column(Text, nullable=False)    # Easy | Medium | Hard | Epic
    xp_reward = Column(Integer, nullable=False)
    gold_reward = Column(Integer, nullable=False)
    completed = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default="now()")
    completed_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    user = relationship("User", back_populates="quests")


class Item(Base):
    __tablename__ = "items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(Text, nullable=False, unique=True)
    description = Column(Text, nullable=True)
    price = Column(Integer, nullable=False)
    type = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default="now()")


class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    item_id = Column(
        UUID(as_uuid=True), ForeignKey("items.id", ondelete="CASCADE"),
        nullable=False,
    )
    purchased_at = Column(DateTime(timezone=True), nullable=False, server_default="now()")

    __table_args__ = (UniqueConstraint("user_id", "item_id", name="uq_inventory_user_item"),)

    # Relationships
    user = relationship("User", back_populates="inventory")
    item = relationship("Item")


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(Text, nullable=False, unique=True)
    description = Column(Text, nullable=False)
    icon = Column(Text, nullable=True)
    requirement_type = Column(Text, nullable=False)
    requirement_value = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default="now()")


class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    achievement_id = Column(
        UUID(as_uuid=True), ForeignKey("achievements.id", ondelete="CASCADE"),
        nullable=False,
    )
    unlocked_at = Column(DateTime(timezone=True), nullable=False, server_default="now()")

    __table_args__ = (
        UniqueConstraint("user_id", "achievement_id", name="uq_user_achievement"),
    )

    # Relationships
    user = relationship("User", back_populates="user_achievements")
    achievement = relationship("Achievement")


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    type = Column(Text, nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default="now()")

    # Relationships
    user = relationship("User", back_populates="activity_logs")
