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
from sqlalchemy import text
from app.config.database import SessionLocal

# Criar tabelas
Base.metadata.create_all(bind=engine)

def run_schema_migrations():
    """Migração simples para SQLite sem Alembic."""
    if engine.dialect.name != "sqlite":
        return

    migrations = {
        "clients": [
            ("company", "ALTER TABLE clients ADD COLUMN company VARCHAR"),
            ("document", "ALTER TABLE clients ADD COLUMN document VARCHAR"),
            ("address", "ALTER TABLE clients ADD COLUMN address VARCHAR"),
            ("notes", "ALTER TABLE clients ADD COLUMN notes TEXT"),
            ("created_at", "ALTER TABLE clients ADD COLUMN created_at DATETIME"),
        ],
        "products": [
            ("created_at", "ALTER TABLE products ADD COLUMN created_at DATETIME"),
        ],
    }

    with engine.begin() as conn:
        for table, table_migrations in migrations.items():
            columns = {
                row[1]
                for row in conn.execute(text(f"PRAGMA table_info({table})")).fetchall()
            }
            for column_name, sql_stmt in table_migrations:
                if column_name not in columns:
                    conn.execute(text(sql_stmt))

        conn.execute(
            text("UPDATE clients SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL")
        )
        conn.execute(
            text("UPDATE products SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL")
        )

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
    run_schema_migrations()
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
