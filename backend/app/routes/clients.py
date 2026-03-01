from fastapi import APIRouter, Depends, status
from typing import List
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.schemas.client import ClientCreate, ClientResponse, ClientUpdate
from app.services.client_service import ClientService
from app.routes.auth import get_current_user_id

router = APIRouter(prefix="/clients", tags=["Clientes"])

@router.post("/", response_model=ClientResponse, status_code=status.HTTP_201_CREATED)
def create_client(
    client_data: ClientCreate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Criar novo cliente"""
    return ClientService.create_client(db, user_id, client_data)

@router.get("/", response_model=List[ClientResponse])
def list_clients(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Listar todos os clientes do usuário"""
    return ClientService.get_clients_by_user(db, user_id)

@router.get("/{client_id}", response_model=ClientResponse)
def get_client(
    client_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Obter cliente por ID"""
    return ClientService.get_client_by_id(db, client_id, user_id)

@router.put("/{client_id}", response_model=ClientResponse)
def update_client(
    client_id: int,
    client_data: ClientUpdate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Atualizar cliente"""
    return ClientService.update_client(db, client_id, user_id, client_data)

@router.delete("/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_client(
    client_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Deletar cliente"""
    ClientService.delete_client(db, client_id, user_id)
    return None
