from sqlalchemy import Column, String
from sqlalchemy.orm import relationship

from .model_base import BareBase


class Genre(BareBase):
    __tablename__ = 'genres'

    name = Column(String, index=True, nullable=False, unique=True)
    image_link = Column(String)

    songs = relationship('Song', back_populates='genre')

    def dict(self, **kwargs):
        return {
            "id": self.id,
            "name": self.name,
            "image_link": self.image_link,
            **kwargs
        }