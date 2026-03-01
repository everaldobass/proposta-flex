from .auth import router as auth_router
from .users import router as users_router
from .clients import router as clients_router
from .products import router as products_router
from .proposals import router as proposals_router
from .dashboard import router as dashboard_router
from .public import router as public_router

__all__ = [
    "auth_router", "users_router", "clients_router", 
    "products_router", "proposals_router", "dashboard_router", "public_router"
]
