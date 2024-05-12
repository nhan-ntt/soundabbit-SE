from pydantic import BaseModel


class PlaylistInfo(BaseModel):
    id: int
    name: str
    image_link: str | None = None
    user_id: int
    is_public: bool = True

    class Config:
        from_attributes = True


class PlaylistUpdate(BaseModel):
    name: str
    image_link: str | None = None
    is_public: bool = True

    class Config:
        from_attributes = True
