from fastapi import Depends
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.schemas.schema_user import UserCreate
from app.core.security import verify_password, get_password_hash


class UserService(object):
    def __init__(self) -> None:
        pass

    reusable_oauth2 = HTTPBearer(
        scheme_name="Authorization",
        auto_error=False
    )

    # get user by id
    @staticmethod
    def get_user(user_id: int, db: Session = Depends(get_db)):
        exist_user = db.query(User).get(user_id)
        if exist_user is None:
            raise Exception("User not found")
        return exist_user

    # create user
    @staticmethod
    def create_user(data: UserCreate, db: Session = Depends(get_db)):
        if data.username is None:
            raise ValueError("Username must be provided")
        exist_user = db.query(User).filter(User.username == data.username).first()
        if exist_user:
            raise Exception("User already exist")

        new_user = User(
            full_name=data.full_name,
            username=data.username,
            hashed_password=get_password_hash(data.password),
            email=data.email,
            is_active=data.is_active,
            role=data.role
        )

        db.add(new_user)
        db.commit()
        return new_user


