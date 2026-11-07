
from fastapi import (
    FastAPI,
    Depends,
    HTTPException,
    status
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.background import BackgroundTask
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import Literal
from datetime import datetime, timezone, timedelta
from pwdlib import PasswordHash
import jwt
import json
import os
import tempfile

from .database import Base, engine, get_db
from . import models, schemas
from .claimtrace import analyze_content
from .report_generator import generate_verification_report


app = FastAPI(
    title="VERITY",
    description="Evidence-Backed Brand Governance Platform",
    version="1.0.0"
)


# CORS CONFIGURATION
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://verity-zeta-seven.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DATABASE TABLES
Base.metadata.create_all(bind=engine)


# AUTHENTICATION CONFIGURATION
SECRET_KEY = os.getenv(
    "VERITY_SECRET_KEY",
    "verity-development-key-change-before-deployment"
)
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

password_hash = PasswordHash.recommended()

oauth2_scheme = HTTPBearer()


# REQUEST MODELS
class ContentSubmission(BaseModel):
    content: str = Field(..., min_length=5)


class RoleUpdate(BaseModel):
    role: Literal["admin", "reviewer", "viewer"]


# AUDIT HELPERS
def create_audit_log(
    db,
    fact,
    action,
    actor,
    details=None
):
    log = models.AuditLog(
        brand_fact_id=fact.id,
        record_title=fact.title,
        action=action,
        actor=actor,
        details=details,
        created_at=datetime.now(timezone.utc)
    )

    db.add(log)


def create_system_audit_log(
    db,
    record_title,
    action,
    actor,
    details=None
):
    log = models.AuditLog(
        brand_fact_id=None,
        record_title=record_title,
        action=action,
        actor=actor,
        details=details,
        created_at=datetime.now(timezone.utc)
    )

    db.add(log)


# JWT TOKEN CREATION
def create_access_token(username: str):
    expires = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": username,
        "exp": expires
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


# GET CURRENT AUTHENTICATED USER
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired authentication token",
        headers={"WWW-Authenticate": "Bearer"}
    )

    try:
        payload = jwt.decode(
            credentials.credentials,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        username = payload.get("sub")

        if username is None:
            raise credentials_exception

    except jwt.InvalidTokenError:
        raise credentials_exception

    user = db.query(models.User).filter(
        models.User.username == username
    ).first()

    if user is None or not user.is_active:
        raise credentials_exception

    return user


# ROLE PERMISSION CHECKER
def require_roles(*allowed_roles):
    def role_checker(
        current_user: models.User = Depends(get_current_user)
    ):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action"
            )

        return current_user

    return role_checker


# HOME
@app.get("/")
def home():
    return {
        "message": "VERITY backend is running!",
        "status": "active"
    }


# HEALTH CHECK
@app.get("/health")
def health_check():
    return {"status": "healthy"}


# USER REGISTRATION
@app.post(
    "/register",
    response_model=schemas.TokenResponse
)
def register_user(
    user_data: schemas.UserRegister,
    db: Session = Depends(get_db)
):
    existing_user = db.query(models.User).filter(
        (models.User.username == user_data.username) |
        (models.User.email == user_data.email)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username or email already registered"
        )

    # First registered account becomes Admin.
    # Subsequent accounts become Viewers.
    if db.query(models.User).count() == 0:
        assigned_role = "admin"
    else:
        assigned_role = "viewer"

    new_user = models.User(
        username=user_data.username,
        email=user_data.email,
        password_hash=password_hash.hash(user_data.password),
        role=assigned_role,
        is_active=True,
        created_at=datetime.now(timezone.utc)
    )

    db.add(new_user)
    db.flush()

    create_system_audit_log(
        db,
        "User Registration",
        "USER_REGISTERED",
        new_user.username,
        "New account registered with role: " + assigned_role
    )

    db.commit()
    db.refresh(new_user)

    token = create_access_token(new_user.username)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": new_user
    }


# USER LOGIN
@app.post(
    "/login",
    response_model=schemas.TokenResponse
)
def login_user(
    login_data: schemas.UserLogin,
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(
        models.User.username == login_data.username
    ).first()

    if (
        user is None
        or not password_hash.verify(
            login_data.password,
            user.password_hash
        )
    ):
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=403,
            detail="This account has been disabled"
        )

    token = create_access_token(user.username)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }


# GET CURRENT USER PROFILE
@app.get(
    "/me",
    response_model=schemas.UserResponse
)
def get_my_profile(
    current_user: models.User = Depends(get_current_user)
):
    return current_user


# ADMIN: VIEW ALL USERS
@app.get("/users")
def get_users(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(
        require_roles("admin")
    )
):
    users = db.query(models.User).all()

    return [
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "is_active": user.is_active,
            "created_at": user.created_at
        }
        for user in users
    ]


# ADMIN: CHANGE USER ROLE
@app.patch("/users/{user_id}/role")
def update_user_role(
    user_id: int,
    update: RoleUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(
        require_roles("admin")
    )
):
    user = db.query(models.User).filter(
        models.User.id == user_id
    ).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    old_role = user.role
    user.role = update.role

    create_system_audit_log(
        db,
        "User Role Updated",
        "ROLE_UPDATED",
        current_user.username,
        json.dumps({
            "username": user.username,
            "old_role": old_role,
            "new_role": update.role
        })
    )

    db.commit()

    return {
        "message": "User role updated successfully",
        "username": user.username,
        "role": user.role
    }


# CREATE A BRAND FACT - ADMIN ONLY
@app.post(
    "/brand-facts",
    response_model=schemas.BrandFactResponse
)
def create_brand_fact(
    fact: schemas.BrandFactCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(
        require_roles("admin")
    )
):
    new_fact = models.BrandFact(
        **fact.model_dump(exclude={"is_approved"}),
        is_approved=False
    )

    db.add(new_fact)
    db.flush()

    create_audit_log(
        db,
        new_fact,
        "CREATED",
        current_user.username,
        "New brand evidence submitted and placed in Pending Approval."
    )

    db.commit()
    db.refresh(new_fact)

    return new_fact


# VIEW ALL BRAND FACTS - AUTHENTICATED USERS
@app.get(
    "/brand-facts",
    response_model=list[schemas.BrandFactResponse]
)
def get_brand_facts(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return db.query(models.BrandFact).all()


# VIEW ONE BRAND FACT - AUTHENTICATED USERS
@app.get(
    "/brand-facts/{fact_id}",
    response_model=schemas.BrandFactResponse
)
def get_brand_fact(
    fact_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    fact = db.query(models.BrandFact).filter(
        models.BrandFact.id == fact_id
    ).first()

    if fact is None:
        raise HTTPException(
            status_code=404,
            detail="Brand fact not found"
        )

    return fact


# EDIT EVIDENCE METADATA - ADMIN ONLY
@app.patch(
    "/brand-facts/{fact_id}/metadata",
    response_model=schemas.BrandFactResponse
)
def update_brand_fact_metadata(
    fact_id: int,
    update: schemas.BrandFactMetadataUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(
        require_roles("admin")
    )
):
    fact = db.query(models.BrandFact).filter(
        models.BrandFact.id == fact_id
    ).first()

    if fact is None:
        raise HTTPException(
            status_code=404,
            detail="Brand fact not found"
        )

    updates = update.model_dump(exclude_unset=True)

    if not updates:
        raise HTTPException(
            status_code=400,
            detail="No metadata changes provided"
        )

    old_values = {}

    for field, value in updates.items():
        old_values[field] = getattr(fact, field)
        setattr(fact, field, value)

    changed_values = {
        field: {
            "old": old_values[field],
            "new": getattr(fact, field)
        }
        for field in updates
        if old_values[field] != getattr(fact, field)
    }

    if changed_values:
        create_audit_log(
            db,
            fact,
            "METADATA_UPDATED",
            current_user.username,
            json.dumps(changed_values)
        )

    db.commit()
    db.refresh(fact)

    return fact


# APPROVE BRAND FACT - ADMIN OR REVIEWER
@app.patch("/brand-facts/{fact_id}/approve")
def approve_brand_fact(
    fact_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(
        require_roles("admin", "reviewer")
    )
):
    fact = db.query(models.BrandFact).filter(
        models.BrandFact.id == fact_id
    ).first()

    if fact is None:
        raise HTTPException(
            status_code=404,
            detail="Brand fact not found"
        )

    if fact.is_approved:
        return {
            "message": "Brand fact is already approved",
            "id": fact.id
        }

    fact.is_approved = True

    create_audit_log(
        db,
        fact,
        "APPROVED",
        current_user.username,
        "Brand evidence approved and made eligible for verification subject to its validity period."
    )

    db.commit()
    db.refresh(fact)

    return {
        "message": "Brand fact approved successfully",
        "id": fact.id
    }


# DELETE BRAND FACT - ADMIN ONLY
@app.delete("/brand-facts/{fact_id}")
def delete_brand_fact(
    fact_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(
        require_roles("admin")
    )
):
    fact = db.query(models.BrandFact).filter(
        models.BrandFact.id == fact_id
    ).first()

    if fact is None:
        raise HTTPException(
            status_code=404,
            detail="Brand fact not found"
        )

    create_audit_log(
        db,
        fact,
        "DELETED",
        current_user.username,
        "Brand evidence record was deleted from the vault."
    )

    db.delete(fact)
    db.commit()

    return {
        "message": "Brand fact deleted successfully",
        "id": fact_id
    }


# VIEW AUDIT HISTORY - ADMIN ONLY
@app.get("/audit-logs")
def get_audit_logs(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(
        require_roles("admin")
    )
):
    logs = db.query(models.AuditLog).order_by(
        models.AuditLog.created_at.desc()
    ).all()

    return [
        {
            "id": log.id,
            "brand_fact_id": log.brand_fact_id,
            "record_title": log.record_title,
            "action": log.action,
            "actor": log.actor,
            "details": log.details,
            "created_at": log.created_at
        }
        for log in logs
    ]


# ANALYZE MARKETING CONTENT - ALL AUTHENTICATED USERS
@app.post("/analyze")
def analyze_brand_content(
    submission: ContentSubmission,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    all_facts = db.query(models.BrandFact).all()

    findings = analyze_content(
        submission.content,
        all_facts
    )

    analysis_log = models.AuditLog(
        brand_fact_id=None,
        record_title="ClaimTrace Analysis",
        action="ANALYSIS_COMPLETED",
        actor=current_user.username,
        details=json.dumps({
            "total_findings": len(findings)
        }),
        created_at=datetime.now(timezone.utc)
    )

    db.add(analysis_log)
    db.commit()

    return {
        "platform": "VERITY",
        "analysis_status": "completed",
        "submitted_content": submission.content,
        "total_findings": len(findings),
        "findings": findings
    }


# GENERATE AND DOWNLOAD CLAIMTRACE PDF REPORT
@app.post("/analyze/report")
def download_verification_report(
    submission: ContentSubmission,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    all_facts = db.query(models.BrandFact).all()

    findings = analyze_content(
        submission.content,
        all_facts
    )

    analysis = {
        "platform": "VERITY",
        "analysis_status": "completed",
        "submitted_content": submission.content,
        "total_findings": len(findings),
        "findings": findings
    }

    temp_file = tempfile.NamedTemporaryFile(
        delete=False,
        suffix=".pdf"
    )

    report_path = temp_file.name
    temp_file.close()

    try:
        generate_verification_report(
            analysis,
            report_path
        )

    except Exception:
        if os.path.exists(report_path):
            os.remove(report_path)
        raise

    return FileResponse(
        path=report_path,
        media_type="application/pdf",
        filename="VERITY_Verification_Report.pdf",
        background=BackgroundTask(
            os.remove,
            report_path
        )
    )
