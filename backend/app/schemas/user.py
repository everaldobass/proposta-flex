from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    company_name: Optional[str] = None
    name: str
    email: EmailStr
    whatsapp: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserUpdate(BaseModel):
    company_name: Optional[str] = None
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    whatsapp: Optional[str] = None
    password: Optional[str] = Field(None, min_length=8)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
