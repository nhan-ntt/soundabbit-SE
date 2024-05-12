from typing import List, Any, Annotated, Dict

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status

from database import db_dependency
from schemas.schema_user import UserUpdate, UserInfo, UserUpdate
from models import User
from services import auth, sv_user
from services.auth import user_dependency

router = APIRouter(tags=["users"], prefix="/users")


@router.get("/me", status_code=status.HTTP_200_OK)
async def user(user: user_dependency):
    """
    API get User Detail
    """
    if user is None:
        raise HTTPException(status_code=401, detail="Unauthorized")
    print(user)
    return {"data": user}


@router.get("/", response_model=List[UserInfo])
async def get_users(db: db_dependency) -> List[UserInfo]:
    """
    API get List User
    """
    users = db.query(User).all()
    return users


@router.get("/{user_id}")
async def get_user(user_id: int, db: db_dependency) -> UserInfo:
    """
    API get User by Id
    """
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def create_user(db: db_dependency, user: UserUpdate) -> UserInfo:
    """
    API Create User
    """
    new_user = await auth.create_user(db, user)
    return new_user


@router.put("", status_code=status.HTTP_200_OK)
async def update_user(user_db: UserUpdate, user: user_dependency, db: db_dependency) -> UserInfo:
    """
    API Update User
    """
    updating_user = await sv_user.update_user(user_db, user, db)
    return updating_user
