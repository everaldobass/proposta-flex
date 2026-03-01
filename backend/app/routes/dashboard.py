from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.services.client_service import ClientService
from app.services.proposal_service import ProposalService
from app.routes.auth import get_current_user_id

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats")
def get_dashboard_stats(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Obter estatísticas do dashboard"""
    total_clients = ClientService.count_clients_by_user(db, user_id)
    total_proposals = ProposalService.count_proposals_by_user(db, user_id)
    approved_proposals = ProposalService.count_proposals_by_status(db, user_id, "Aprovado")
    pending_proposals = ProposalService.count_proposals_by_status(db, user_id, "Rascunho") + \
                       ProposalService.count_proposals_by_status(db, user_id, "Enviado")
    total_approved_value = ProposalService.get_total_approved_value(db, user_id)
    
    return {
        "total_clients": total_clients,
        "total_proposals": total_proposals,
        "approved_proposals": approved_proposals,
        "pending_proposals": pending_proposals,
        "total_approved_value": total_approved_value
    }

@router.get("/followup-today")
def get_followup_today(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Obter propostas com follow-up para hoje"""
    proposals = ProposalService.get_followup_today(db, user_id)
    return proposals

@router.get("/chart-data")
def get_chart_data(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Obter dados do gráfico dos últimos 6 meses"""
    data = ProposalService.get_proposals_last_6_months(db, user_id)
    return data
