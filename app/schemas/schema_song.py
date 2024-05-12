from pydantic import BaseModel


class SongInfo(BaseModel):
    id: int
    name: str
    image_link: str | None = None
    audio_link: str

    class Config:
        from_attributes = True


class SongUpdate(BaseModel):
    name: str
    image_link: str | None = None
    audio_link: str

    class Config:
        from_attributes = True
        