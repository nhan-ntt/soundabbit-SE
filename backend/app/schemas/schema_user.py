from pydantic import BaseModel


class UserInfo(BaseModel):
    id: int
    username: str
    name: str
    image_link: str | None
    is_admin: bool = False
    deleted: bool = False

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    username: str
    password: str
    name: str
    image_link: str | None

    class Config:
        from_attributes = True


class UserLoginResponse(BaseModel):
    id: int
    username: str
    name: str
    image_link: str | None
    is_admin: bool = False
    token: str



