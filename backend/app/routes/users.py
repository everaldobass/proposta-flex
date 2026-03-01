from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.schemas.user import UserResponse, UserUpdate
from app.services.user_service import UserService
from app.routes.auth import get_current_user_id

router = APIRouter(prefix="/users", tags=["Usuários"])

@router.get("/me", response_model=UserResponse)
def get_me(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """Obter dados do usuário logado"""
    return UserService.get_user_by_id(db, user_id)

@router.put("/me", response_model=UserResponse)
def update_me(
    user_data: UserUpdate, 
    user_id: int = Depends(get_current_user_id), 
    db: Session = Depends(get_db)
):
    """Atualizar dados do usuário logado"""
    return UserService.update_user(db, user_id, user_data)

@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_me(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """Deletar conta do usuário"""
    UserService.delete_user(db, user_id)
    return None
