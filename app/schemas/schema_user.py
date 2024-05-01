from pydantic import BaseModel, EmailStr
import enum


class UserRole(enum.Enum):
    ADMIN = 'admin'
    GUEST = 'guest'


class UserBase(BaseModel):
    full_name: str | None = None
    email: EmailStr | None = None
    is_active: bool

    class Config:
        orm_mode = True


class UserCreate(UserBase):
    full_name: str
    username: str
    password: str
    email: EmailStr
    is_active: bool = True
    role: UserRole = UserRole.GUEST


class UserRegister(UserBase):
    full_name: str
    username: str
    password: str
    email: EmailStr
    role: UserRole = UserRole.GUEST


class UserUpdate(UserBase):
    full_name: str | None = None
    username: str | None = None
    email: EmailStr | None = None
    is_active: bool | None = None
    role: UserRole | None = None