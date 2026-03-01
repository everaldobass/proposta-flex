from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate

class ProductService:
    @staticmethod
    def create_product(db: Session, user_id: int, product_data: ProductCreate):
        db_product = Product(
            user_id=user_id,
            type=product_data.type,
            description=product_data.description,
            value=product_data.value
        )
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
        return db_product

    @staticmethod
    def get_products_by_user(db: Session, user_id: int):
        return db.query(Product).filter(Product.user_id == user_id).all()

    @staticmethod
    def get_product_by_id(db: Session, product_id: int, user_id: int):
        product = db.query(Product).filter(
            Product.id == product_id,
            Product.user_id == user_id
        ).first()
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Produto/Serviço não encontrado"
            )
        return product

    @staticmethod
    def update_product(db: Session, product_id: int, user_id: int, product_data: ProductUpdate):
        product = ProductService.get_product_by_id(db, product_id, user_id)
        
        update_data = product_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(product, field, value)
        
        db.commit()
        db.refresh(product)
        return product

    @staticmethod
    def delete_product(db: Session, product_id: int, user_id: int):
        product = ProductService.get_product_by_id(db, product_id, user_id)
        db.delete(product)
        db.commit()
        return True

    @staticmethod
    def count_products_by_user(db: Session, user_id: int):
        return db.query(Product).filter(Product.user_id == user_id).count()
