from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.schemas.proposal import ProposalPublicResponse
from app.services.proposal_service import ProposalService

router = APIRouter(prefix="/public", tags=["Público"])

@router.get("/proposal/{token}", response_model=ProposalPublicResponse)
def get_public_proposal(token: str, db: Session = Depends(get_db)):
    """Visualizar proposta pública por token"""
    proposal = ProposalService.get_proposal_by_token(db, token)
    
    # Adicionar informações do cliente e empresa
    response_data = {
        "id": proposal.id,
        "proposal_number": proposal.proposal_number,
        "title": proposal.title,
        "total_value": proposal.total_value,
        "status": proposal.status,
        "proposal_date": proposal.proposal_date,
        "notes": proposal.notes,
        "items": proposal.items,
        "client_name": proposal.client.name,
        "company_name": proposal.user.company_name
    }
    
    return response_data

@router.post("/proposal/{token}/approve")
def approve_public_proposal(token: str, db: Session = Depends(get_db)):
    """Aprovar proposta pública por token"""
    proposal = ProposalService.approve_proposal(db, token)
    return {"message": "Proposta aprovada com sucesso", "status": proposal.status}

@router.post("/proposal/{token}/reject")
def reject_public_proposal(token: str, db: Session = Depends(get_db)):
    """Reprovar proposta pública por token"""
    proposal = ProposalService.reject_proposal(db, token)
    return {"message": "Proposta reprovada", "status": proposal.status}
