from fastapi import APIRouter, Depends, status
from typing import List
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.schemas.product import ProductCreate, ProductResponse, ProductUpdate
from app.services.product_service import ProductService
from app.routes.auth import get_current_user_id

router = APIRouter(prefix="/products", tags=["Produtos e Serviços"])

@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product_data: ProductCreate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Criar novo produto ou serviço"""
    return ProductService.create_product(db, user_id, product_data)

@router.get("/", response_model=List[ProductResponse])
def list_products(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Listar todos os produtos/serviços do usuário"""
    return ProductService.get_products_by_user(db, user_id)

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Obter produto/serviço por ID"""
    return ProductService.get_product_by_id(db, product_id, user_id)

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product_data: ProductUpdate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Atualizar produto/serviço"""
    return ProductService.update_product(db, product_id, user_id, product_data)

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Deletar produto/serviço"""
    ProductService.delete_product(db, product_id, user_id)
    return None
