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
        from_attributes = True


class UserCreate(UserBase):
    full_name: str
    username: str
    password: str
    email: EmailStr
    is_active: bool = True
    role: str = 'guest'


class UserRegister(UserBase):
    full_name: str
    username: str
    password: str
    email: EmailStr
    role: str = 'guest'


class UserUpdate(UserBase):
    full_name: str | None = None
    email: EmailStr | None = None
    username: str | None = None
    password: str | None = None


class UserResponse(UserBase):
    id: int
    full_name: str
    username: str
    email: EmailStr
    is_active: bool
    role: str

    class Config:
        from_attributes = True
