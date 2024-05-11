from sqlalchemy import Column, String, ForeignKey, Integer, Boolean
from sqlalchemy.orm import relationship
from .model_base import BareBase


class Playlist(BareBase):
    __tablename__ = 'playlists'

    name = Column(String, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    image_link = Column(String)
    is_public = Column(Boolean, default=True)

    user = relationship('User', back_populates='playlists')
    songs = relationship('Song', secondary='playlist_song', back_populates='playlists')
