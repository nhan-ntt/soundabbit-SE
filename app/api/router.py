from fastapi import APIRouter

from api import api_auth
from app.api import api_user

router = APIRouter()

router.include_router(api_user.router)
router.include_router(api_auth.router)