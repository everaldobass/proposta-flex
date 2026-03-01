from sqlalchemy import Column, Integer, String, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from app.config.database import Base

class ProposalItem(Base):
    __tablename__ = "proposal_items"

    id = Column(Integer, primary_key=True, index=True)
    proposal_id = Column(Integer, ForeignKey("proposals.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)
    description = Column(String, nullable=False)
    quantity = Column(Numeric(10, 2), default=1)
    unit_value = Column(Numeric(10, 2), nullable=False)
    total_value = Column(Numeric(10, 2), nullable=False)
    
    # Relacionamentos
    proposal = relationship("Proposal", back_populates="items")
    product = relationship("Product", back_populates="proposal_items")
