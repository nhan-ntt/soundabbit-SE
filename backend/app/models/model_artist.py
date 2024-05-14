from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from .model_base import BareBase


class Artist(BareBase):
    __tablename__ = 'artists'

    name = Column(String, index=True, nullable=False)
    image_link = Column(String)

    songs = relationship('Song', secondary='artist_song', back_populates='artists')
