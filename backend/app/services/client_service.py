from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.client import Client
from app.schemas.client import ClientCreate, ClientUpdate

class ClientService:
    @staticmethod
    def create_client(db: Session, user_id: int, client_data: ClientCreate):
        db_client = Client(
            user_id=user_id,
            name=client_data.name,
            phone=client_data.phone,
            email=client_data.email
        )
        db.add(db_client)
        db.commit()
        db.refresh(db_client)
        return db_client

    @staticmethod
    def get_clients_by_user(db: Session, user_id: int):
        return db.query(Client).filter(Client.user_id == user_id).all()

    @staticmethod
    def get_client_by_id(db: Session, client_id: int, user_id: int):
        client = db.query(Client).filter(
            Client.id == client_id,
            Client.user_id == user_id
        ).first()
        if not client:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cliente não encontrado"
            )
        return client

    @staticmethod
    def update_client(db: Session, client_id: int, user_id: int, client_data: ClientUpdate):
        client = ClientService.get_client_by_id(db, client_id, user_id)
        
        update_data = client_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(client, field, value)
        
        db.commit()
        db.refresh(client)
        return client

    @staticmethod
    def delete_client(db: Session, client_id: int, user_id: int):
        client = ClientService.get_client_by_id(db, client_id, user_id)
        db.delete(client)
        db.commit()
        return True

    @staticmethod
    def count_clients_by_user(db: Session, user_id: int):
        return db.query(Client).filter(Client.user_id == user_id).count()
