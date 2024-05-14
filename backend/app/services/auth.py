from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext

from core.config import settings
from database import db_dependency
from models import User
from schemas.schema_token import Token, TokenData
from schemas.schema_user import UserUpdate, UserLoginResponse

# to get a string like this run:
# openssl rand -hex 32
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/token")

# used for log out
blacklisted_tokens = set()


async def create_user(db: db_dependency, data: UserUpdate):
    if data.username is None:
        raise ValueError("username must be provided")
    exist_user = db.query(User).filter(User.username == data.username).first()
    if exist_user:
        raise Exception("User already exist")

    new_user = User(
        name=data.name,
        hashed_password=get_password_hash(data.password),
        username=data.username,
        image_link=data.image_link
    )

    db.add(new_user)
    db.commit()
    return new_user


async def login_for_access_token(
        form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
        db: db_dependency
) -> Token:
    user = authenticate_user(form_data.username, form_data.password, db)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate user"
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        user.username, user.id,
        expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")
    # return UserLoginResponse(
    #     id=user.id,
    #     username=user.username,
    #     name=user.name,
    #     image_link=user.image_link,
    #     is_admin=user.is_admin,
    #     token=access_token,
    #     token_type="bearer"
    # )


async def login(
        form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
        db: db_dependency
) -> UserLoginResponse:
    token = await login_for_access_token(form_data, db)
    user = authenticate_user(form_data.username, form_data.password, db)

    return UserLoginResponse(
        id=user.id,
        username=user.username,
        name=user.name,
        image_link=user.image_link,
        is_admin=user.is_admin,
        token=token.access_token,
    )


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def authenticate_user(username: str, password: str, db):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def get_password_hash(password):
    return pwd_context.hash(password)


def create_access_token(username: str, user_id: int, expires_delta: timedelta | None = None):
    to_encode = {'sub': username, 'id': user_id}
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: db_dependency):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if token in blacklisted_tokens:
        raise credentials_exception
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        user_id: int = payload.get("id")
        if username is None or user_id is None:
            raise credentials_exception
        token_data = TokenData(username=username)
        return db.query(User).filter(User.id == user_id).first()
    except JWTError:
        raise credentials_exception


user_dependency = Annotated[dict, Depends(get_current_user)]
