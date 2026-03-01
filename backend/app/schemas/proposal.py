from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from decimal import Decimal
from .proposal_item import ProposalItemCreate, ProposalItemResponse

class ProposalBase(BaseModel):
    title: str
    notes: Optional[str] = None
    followup_date: Optional[datetime] = None

class ProposalCreate(ProposalBase):
    client_id: int
    items: List[ProposalItemCreate]

class ProposalUpdate(BaseModel):
    title: Optional[str] = None
    status: Optional[str] = Field(None, pattern="^(Rascunho|Enviado|Aprovado|Reprovado)$")
    notes: Optional[str] = None
    followup_date: Optional[datetime] = None

class ProposalResponse(ProposalBase):
    id: int
    user_id: int
    client_id: int
    proposal_number: int
    total_value: Decimal
    status: str
    proposal_date: datetime
    public_token: Optional[str]
    items: List[ProposalItemResponse]

    class Config:
        from_attributes = True

class ProposalPublicResponse(BaseModel):
    id: int
    proposal_number: int
    title: str
    total_value: Decimal
    status: str
    proposal_date: datetime
    notes: Optional[str]
    items: List[ProposalItemResponse]
    client_name: str
    company_name: Optional[str]

    class Config:
        from_attributes = True
