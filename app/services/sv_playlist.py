from sqlalchemy import insert, delete

from database import db_dependency
from models import Playlist, Song
from models.model_base import playlist_song_association
from schemas.schema_playlist import PlaylistInfo, PlaylistUpdate
from schemas.schema_song import SongInfo
from services.auth import user_dependency


async def read_playlist(db: db_dependency, user: user_dependency) -> list[PlaylistInfo]:
    playlists = db.query(Playlist).filter(Playlist.user_id == user.id).all()
    return playlists


async def read_playlist_by_id(db: db_dependency, playlist_id: int) -> PlaylistInfo:
    playlist = db.query(Playlist).filter(Playlist.id == playlist_id).first()
    return playlist


async def create_playlist(db: db_dependency, user: user_dependency, playlist: PlaylistUpdate) -> PlaylistInfo:
    new_playlist = Playlist(
        name=playlist.name,
        user_id=user.id
    )
    db.add(new_playlist)
    db.commit()
    db.refresh(new_playlist)
    return new_playlist


async def delete_playlist(db: db_dependency, user: user_dependency, playlist_id: int) -> None:
    db.query(Playlist).filter(Playlist.id == playlist_id).delete()
    db.commit()
    return None


async def get_songs(db: db_dependency, playlist_id: int) -> list[SongInfo]:
    # songs = db.query(playlist_song_association).filter(playlist_song_association.c.playlist_id == playlist_id).all()
    songs = (db.query(Song)
             .join(playlist_song_association)
             .filter(playlist_song_association.c.playlist_id == playlist_id)
             .all())

    return songs


def add_song_to_playlist(db: db_dependency, playlist_id: int, song_id: int):
    stmt = insert(playlist_song_association).values(playlist_id=playlist_id, song_id=song_id)
    db.execute(stmt)
    db.commit()
    return None


def remove_song_from_playlist(db: db_dependency, playlist_id: int, song_id: int):
    stmt = delete(playlist_song_association).where(
        (playlist_song_association.c.playlist_id == playlist_id) &
        (playlist_song_association.c.song_id == song_id)
    )
    db.execute(stmt)
    db.commit()
