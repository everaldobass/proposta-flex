from pydantic import BaseModel
from typing import Optional

class ClientBase(BaseModel):
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None

class ClientCreate(ClientBase):
    pass

class ClientUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None

class ClientResponse(ClientBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
