from pydantic import BaseModel, Field
from typing import Optional
from decimal import Decimal
from datetime import datetime

class ProductBase(BaseModel):
    type: str = Field(..., pattern="^(produto|servico)$")
    description: str
    value: Decimal = Field(..., gt=0)

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    type: Optional[str] = Field(None, pattern="^(produto|servico)$")
    description: Optional[str] = None
    value: Optional[Decimal] = Field(None, gt=0)

class ProductResponse(ProductBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
