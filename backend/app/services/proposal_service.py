from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.proposal import Proposal
from app.models.proposal_item import ProposalItem
from app.schemas.proposal import ProposalCreate, ProposalUpdate
from datetime import datetime, timedelta
import secrets

class ProposalService:
    @staticmethod
    def generate_public_token():
        return secrets.token_urlsafe(32)

    @staticmethod
    def get_next_proposal_number(db: Session, user_id: int):
        last_proposal = db.query(Proposal).filter(
            Proposal.user_id == user_id
        ).order_by(Proposal.proposal_number.desc()).first()
        
        if last_proposal:
            return last_proposal.proposal_number + 1
        return 1

    @staticmethod
    def create_proposal(db: Session, user_id: int, proposal_data: ProposalCreate):
        # Gerar número sequencial
        proposal_number = ProposalService.get_next_proposal_number(db, user_id)
        
        # Calcular valor total
        total_value = sum(
            item.quantity * item.unit_value 
            for item in proposal_data.items
        )
        
        # Criar proposta
        db_proposal = Proposal(
            user_id=user_id,
            client_id=proposal_data.client_id,
            proposal_number=proposal_number,
            title=proposal_data.title,
            total_value=total_value,
            status="Rascunho",
            notes=proposal_data.notes,
            followup_date=proposal_data.followup_date,
            public_token=ProposalService.generate_public_token()
        )
        
        db.add(db_proposal)
        db.commit()
        db.refresh(db_proposal)
        
        # Criar itens da proposta
        for item_data in proposal_data.items:
            db_item = ProposalItem(
                proposal_id=db_proposal.id,
                product_id=item_data.product_id,
                description=item_data.description,
                quantity=item_data.quantity,
                unit_value=item_data.unit_value,
                total_value=item_data.quantity * item_data.unit_value
            )
            db.add(db_item)
        
        db.commit()
        db.refresh(db_proposal)
        return db_proposal

    @staticmethod
    def get_proposals_by_user(db: Session, user_id: int):
        return db.query(Proposal).filter(
            Proposal.user_id == user_id
        ).order_by(Proposal.proposal_date.desc()).all()

    @staticmethod
    def get_proposal_by_id(db: Session, proposal_id: int, user_id: int):
        proposal = db.query(Proposal).filter(
            Proposal.id == proposal_id,
            Proposal.user_id == user_id
        ).first()
        if not proposal:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Proposta não encontrada"
            )
        return proposal

    @staticmethod
    def get_proposal_by_token(db: Session, token: str):
        proposal = db.query(Proposal).filter(
            Proposal.public_token == token
        ).first()
        if not proposal:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Proposta não encontrada"
            )
        return proposal

    @staticmethod
    def update_proposal(db: Session, proposal_id: int, user_id: int, proposal_data: ProposalUpdate):
        proposal = ProposalService.get_proposal_by_id(db, proposal_id, user_id)
        
        update_data = proposal_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(proposal, field, value)
        
        db.commit()
        db.refresh(proposal)
        return proposal

    @staticmethod
    def delete_proposal(db: Session, proposal_id: int, user_id: int):
        proposal = ProposalService.get_proposal_by_id(db, proposal_id, user_id)
        db.delete(proposal)
        db.commit()
        return True

    @staticmethod
    def approve_proposal(db: Session, token: str):
        proposal = ProposalService.get_proposal_by_token(db, token)
        proposal.status = "Aprovado"
        db.commit()
        db.refresh(proposal)
        return proposal

    @staticmethod
    def reject_proposal(db: Session, token: str):
        proposal = ProposalService.get_proposal_by_token(db, token)
        proposal.status = "Reprovado"
        db.commit()
        db.refresh(proposal)
        return proposal

    @staticmethod
    def count_proposals_by_user(db: Session, user_id: int):
        return db.query(Proposal).filter(Proposal.user_id == user_id).count()

    @staticmethod
    def count_proposals_by_status(db: Session, user_id: int, status: str):
        return db.query(Proposal).filter(
            Proposal.user_id == user_id,
            Proposal.status == status
        ).count()

    @staticmethod
    def get_total_approved_value(db: Session, user_id: int):
        result = db.query(Proposal).filter(
            Proposal.user_id == user_id,
            Proposal.status == "Aprovado"
        ).all()
        return sum(float(p.total_value) for p in result)

    @staticmethod
    def get_followup_today(db: Session, user_id: int):
        today = datetime.utcnow().date()
        tomorrow = today + timedelta(days=1)
        
        return db.query(Proposal).filter(
            Proposal.user_id == user_id,
            Proposal.followup_date >= today,
            Proposal.followup_date < tomorrow
        ).all()

    @staticmethod
    def get_proposals_last_6_months(db: Session, user_id: int):
        six_months_ago = datetime.utcnow() - timedelta(days=180)
        
        proposals = db.query(Proposal).filter(
            Proposal.user_id == user_id,
            Proposal.proposal_date >= six_months_ago
        ).all()
        
        # Agrupar por mês
        data = {}
        for p in proposals:
            month_key = p.proposal_date.strftime("%Y-%m")
            if month_key not in data:
                data[month_key] = {"total": 0, "aprovado": 0, "reprovado": 0, "pendente": 0}
            
            data[month_key]["total"] += float(p.total_value)
            if p.status == "Aprovado":
                data[month_key]["aprovado"] += float(p.total_value)
            elif p.status == "Reprovado":
                data[month_key]["reprovado"] += float(p.total_value)
            else:
                data[month_key]["pendente"] += float(p.total_value)
        
        return data
