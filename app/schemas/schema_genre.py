from pydantic import BaseModel


class GenreInfo(BaseModel):
    id: int
    name: str
    image_link: str | None = None

    class Config:
        from_attributes = True


class GenreUpdate(BaseModel):
    name: str
    image_link: str | None = None

    class Config:
        from_attributes = True
