from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship

from .model_base import BareBase


class Song(BareBase):
    __tablename__ = 'songs'

    name = Column(String, index=True, nullable=False)
    audio_link = Column(String)
    image_link = Column(String)
    artist_id = Column(Integer, ForeignKey('artists.id'), nullable=False)
    genre_id = Column(Integer, ForeignKey('genres.id'), nullable=False)

    artist = relationship('Artist', back_populates='songs')
    genre = relationship('Genre', back_populates='songs')
    playlists = relationship('Playlist', secondary='playlist_song', back_populates='songs')
    users = relationship('User', secondary='user_song', back_populates='favorite_songs')
