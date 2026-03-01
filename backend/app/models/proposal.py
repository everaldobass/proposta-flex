from sqlalchemy import Column, Integer, String, ForeignKey, Numeric, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.config.database import Base

class Proposal(Base):
    __tablename__ = "proposals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    proposal_number = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    total_value = Column(Numeric(10, 2), default=0)
    status = Column(String, default="Rascunho")  # Rascunho, Enviado, Aprovado, Reprovado
    proposal_date = Column(DateTime, default=datetime.utcnow)
    followup_date = Column(DateTime, nullable=True)
    public_token = Column(String, unique=True, index=True, nullable=True)
    notes = Column(Text, nullable=True)
    
    # Relacionamentos
    user = relationship("User", back_populates="proposals")
    client = relationship("Client", back_populates="proposals")
    items = relationship("ProposalItem", back_populates="proposal", cascade="all, delete-orphan", order_by="ProposalItem.id")
