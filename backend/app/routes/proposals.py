from fastapi import APIRouter, Depends, status
from typing import List
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.schemas.proposal import ProposalCreate, ProposalResponse, ProposalUpdate
from app.services.proposal_service import ProposalService
from app.routes.auth import get_current_user_id

router = APIRouter(prefix="/proposals", tags=["Propostas"])

@router.post("/", response_model=ProposalResponse, status_code=status.HTTP_201_CREATED)
def create_proposal(
    proposal_data: ProposalCreate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Criar nova proposta"""
    return ProposalService.create_proposal(db, user_id, proposal_data)

@router.get("/", response_model=List[ProposalResponse])
def list_proposals(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Listar todas as propostas do usuário"""
    return ProposalService.get_proposals_by_user(db, user_id)

@router.get("/{proposal_id}", response_model=ProposalResponse)
def get_proposal(
    proposal_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Obter proposta por ID"""
    return ProposalService.get_proposal_by_id(db, proposal_id, user_id)

@router.put("/{proposal_id}", response_model=ProposalResponse)
def update_proposal(
    proposal_id: int,
    proposal_data: ProposalUpdate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Atualizar proposta"""
    return ProposalService.update_proposal(db, proposal_id, user_id, proposal_data)

@router.delete("/{proposal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_proposal(
    proposal_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Deletar proposta"""
    ProposalService.delete_proposal(db, proposal_id, user_id)
    return None

@router.post("/{proposal_id}/send")
def send_proposal(
    proposal_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Enviar proposta (altera status para Enviado)"""
    return ProposalService.update_proposal(
        db, proposal_id, user_id, 
        ProposalUpdate(status="Enviado")
    )
