from typing import Annotated, Dict, Any

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from starlette import status

from database import db_dependency
from schemas.schema_token import Token
from schemas.schema_user import UserCreate, UserResponse
from services import auth
from services.auth import user_dependency, blacklisted_tokens

router = APIRouter(tags=["auth"], prefix="/auth")


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def create_user(db: db_dependency, user: UserCreate) -> UserResponse:
    new_user = await auth.create_user(db, user)
    return new_user


@router.post("/login")
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
                                 db: db_dependency) -> Token:
    return await auth.login_for_access_token(form_data, db)


@router.post("/logout")
async def logout(token: Annotated[str, Depends(auth.oauth2_scheme)]) -> Dict[str, Any]:
    blacklisted_tokens.add(token)
    return {"message": "Logout successful"}
