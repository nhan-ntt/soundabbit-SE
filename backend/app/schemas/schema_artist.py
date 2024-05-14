from pydantic import BaseModel


class ArtistInfo(BaseModel):
    id: int
    name: str
    image_link: str | None = None

    class Config:
        from_attributes = True


class ArtistUpdate(BaseModel):
    name: str
    image_link: str | None = None

    class Config:
        from_attributes = True
