from fastapi import HTTPException

from database import db_dependency
from models import User
from schemas.schema_user import UserUpdate, UserResponse
from services.auth import user_dependency


async def update_user(user_db: UserUpdate, user: user_dependency, db: db_dependency) -> UserResponse:
    """
    API Update User
    """
    updating_user = user
    if updating_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    if user_db.full_name is not None:
        updating_user.full_name = user_db.full_name
    if user_db.email is not None:
        updating_user.email = user_db.email
    if user_db.username is not None:
        updating_user.username = user_db.username
    if user_db.password is not None:
        updating_user.password = user_db.password
    db.commit()
    return updating_user
