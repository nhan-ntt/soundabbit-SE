from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship

from .model_base import BareBase


class Song(BareBase):
    __tablename__ = 'songs'

    name = Column(String, index=True, nullable=False)
    audio_link = Column(String)
    image_link = Column(String)
    genre_id = Column(Integer, ForeignKey('genres.id'), nullable=False)

    genre = relationship('Genre', back_populates='songs')
    artists = relationship('Artist', secondary='artist_song', back_populates='songs')
    playlists = relationship('Playlist', secondary='playlist_song', back_populates='songs')
    users = relationship('User', secondary='user_song', back_populates='favorite_songs')
