from pydantic import BaseModel, Field
from typing import Optional
from decimal import Decimal

class ProposalItemBase(BaseModel):
    description: str
    quantity: Decimal = Field(default=1, gt=0)
    unit_value: Decimal = Field(..., gt=0)

class ProposalItemCreate(ProposalItemBase):
    product_id: Optional[int] = None

class ProposalItemResponse(ProposalItemBase):
    id: int
    proposal_id: int
    product_id: Optional[int]
    total_value: Decimal

    class Config:
        from_attributes = True
