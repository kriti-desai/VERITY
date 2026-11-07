
from pydantic import BaseModel, Field, EmailStr
from typing import Optional, Literal
from datetime import datetime


# BRAND FACT SCHEMAS

class BrandFactCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=200)
    category: str
    approved_content: str = Field(..., min_length=2)
    source_name: str
    source_reference: Optional[str] = None
    version: str = "1.0"
    approved_by: str
    is_approved: bool = True
    effective_date: Optional[datetime] = None
    expiry_date: Optional[datetime] = None


class BrandFactResponse(BrandFactCreate):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class BrandFactMetadataUpdate(BaseModel):
    source_name: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=200
    )

    source_reference: Optional[str] = Field(
        default=None,
        max_length=500
    )


# USER AUTHENTICATION SCHEMAS

class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: Literal["admin", "reviewer", "viewer"]
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
