from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.database import engine, Base
from app.routes import (
    auth_router, users_router, clients_router, 
    products_router, proposals_router, dashboard_router, public_router
)
from app.services.auth_service import AuthService
from app.services.user_service import UserService
from app.schemas.user import UserCreate
from sqlalchemy.orm import Session
from app.config.database import SessionLocal

# Criar tabelas
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Proposta Flex API",
    description="API para gestão de orçamentos e propostas comerciais",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir rotas
app.include_router(auth_router, prefix="/api")
app.include_router(users_router, prefix="/api")
app.include_router(clients_router, prefix="/api")
app.include_router(products_router, prefix="/api")
app.include_router(proposals_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")
app.include_router(public_router, prefix="/api")

# Criar usuário admin padrão
def create_default_admin():
    db = SessionLocal()
    try:
        # Verificar se admin já existe
        admin = db.query(Base.metadata.tables['users']).filter_by(email="admin@admin.com").first()
        if not admin:
            admin_data = UserCreate(
                name="Administrador",
                email="admin@admin.com",
                password="admin123",
                company_name="Proposta Flex"
            )
            UserService.create_user(db, admin_data)
            print("✅ Usuário admin criado: admin@admin.com / admin123")
    except Exception as e:
        print(f"⚠️ Erro ao criar admin: {e}")
    finally:
        db.close()

@app.on_event("startup")
def startup_event():
    create_default_admin()

@app.get("/")
def root():
    return {
        "message": "Proposta Flex API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
