from database import db_dependency
from schemas.schema_artist import ArtistInfo
from schemas.schema_genre import GenreInfo
from schemas.schema_song import SongInfo, SongUpdate
from models import Song


async def get_songs(db: db_dependency) -> list[SongInfo]:
    """
    API Read songs
    """
    songs = db.query(Song).all()
    return songs


async def get_song_by_id(db: db_dependency, song_id: int) -> SongInfo:
    """
    API Read song by id
    """
    song = db.query(Song).filter(Song.id == song_id).first()
    return song


async def create_song(db: db_dependency, song: SongUpdate) -> SongInfo:
    """
    API Create song
    """
    new_song = Song(**song.dict())
    db.add(new_song)
    db.commit()
    return new_song


async def delete_song(db: db_dependency, song_id: int):
    """
    API Delete song
    """
    song = db.query(Song).filter(Song.id == song_id).first()
    db.delete(song)
    db.commit()
    return song


async def get_artist_of_song(db: db_dependency, song_id: int) -> ArtistInfo:
    """
    API Read artist of song
    """
    song = db.query(Song).filter(Song.id == song_id).first()
    return song.artist


async def get_genre_of_song(db: db_dependency, song_id: int) -> GenreInfo:
    """
    API Read genre of song
    """
    song = db.query(Song).filter(Song.id == song_id).first()
    return song.genre


