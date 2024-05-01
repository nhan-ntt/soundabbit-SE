from fastapi import APIRouter

from app.api import api_user

router = APIRouter()

router.include_router(api_user.router, tags=["user"], prefix="/users")