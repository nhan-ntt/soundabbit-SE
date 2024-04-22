from pydantic import BaseModel

class UserBase(BaseModel):
    username: str
    email: str


# register
class UserCreate(UserBase):
    password: str


# get user
class User(UserBase):
    id: int
    is_admin: bool

    class Config:
        orm_mode = True