from sqlalchemy import Column, Integer, String, ForeignKey, Numeric, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.config.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(String, nullable=False)  # 'produto' ou 'servico'
    description = Column(String, nullable=False)
    value = Column(Numeric(10, 2), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relacionamentos
    user = relationship("User", back_populates="products")
    proposal_items = relationship("ProposalItem", back_populates="product", cascade="all, delete-orphan")
