from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.schemas.schema_user import UserCreate, UserResponse
from app.services.sv_user import UserService

router = APIRouter()


@router.get("/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db), user_service: UserService = Depends()) -> UserResponse:
    """
    API get Detail User
    """
    return user_service.get_user(user_id=user_id, db=db)


@router.post("")
def create(user_data: UserCreate, db: Session = Depends(get_db), user_service: UserService = Depends()) -> UserResponse:
    """
    API Create User
    """
    new_user = user_service.create_user(data=user_data, db=db)
    return new_user
