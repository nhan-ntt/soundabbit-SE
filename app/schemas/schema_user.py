from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    full_name: str | None = None
    email: EmailStr | None = None
    is_active: bool

    class Config:
        orm_mode = True


