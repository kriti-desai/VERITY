
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from datetime import datetime, timezone

from .database import Base


class BrandFact(Base):
    __tablename__ = "brand_facts"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(200), nullable=False)

    category = Column(String(100), nullable=False)

    approved_content = Column(Text, nullable=False)

    source_name = Column(String(200), nullable=False)

    source_reference = Column(String(500), nullable=True)

    version = Column(String(50), default="1.0")

    approved_by = Column(String(150), nullable=False)

    is_approved = Column(Boolean, default=True)

    effective_date = Column(DateTime(timezone=True), nullable=True)

    expiry_date = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)

    brand_fact_id = Column(Integer, nullable=True)

    record_title = Column(String(200), nullable=False)

    action = Column(String(100), nullable=False)

    actor = Column(String(150), nullable=False)

    details = Column(Text, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )


# User model for authentication and role-based access
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String(100), unique=True, nullable=False)

    email = Column(String(200), unique=True, nullable=False)

    password_hash = Column(String(255), nullable=False)

    role = Column(
        String(50),
        nullable=False,
        default="viewer"
    )

    is_active = Column(Boolean, default=True)

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )
