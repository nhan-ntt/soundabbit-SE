from sqlalchemy import Column, String, Boolean
from sqlalchemy.orm import relationship

from .model_base import BareBase


class User(BareBase):
    __tablename__ = 'users'

    username = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, index=True, nullable=False)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    image_link = Column(String, nullable=True)

    playlists = relationship('Playlist', back_populates='user')
    favorite_songs = relationship('Song', secondary='user_song', back_populates='users')