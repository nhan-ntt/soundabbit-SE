from sqlalchemy import Column, Integer, Table, ForeignKey
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class BareBase(Base):
    __abstract__ = True

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)


playlist_song_association = Table('playlist_song', BareBase.metadata,
                                  Column('playlist_id', Integer, ForeignKey('playlists.id')),
                                  Column('song_id', Integer, ForeignKey('songs.id'))
                                  )

user_song_association = Table('user_song', BareBase.metadata,
                              Column('user_id', Integer, ForeignKey('users.id')),
                              Column('song_id', Integer, ForeignKey('songs.id'))
                              )

artist_song_association = Table('artist_song', BareBase.metadata,
                                Column('artist_id', Integer, ForeignKey('artists.id')),
                                Column('song_id', Integer, ForeignKey('songs.id'))
                                )