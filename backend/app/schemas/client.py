from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ClientBase(BaseModel):
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    company: Optional[str] = None
    document: Optional[str] = None
    address: Optional[str] = None
    notes: Optional[str] = None

class ClientCreate(ClientBase):
    pass

class ClientUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    company: Optional[str] = None
    document: Optional[str] = None
    address: Optional[str] = None
    notes: Optional[str] = None

class ClientResponse(ClientBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
