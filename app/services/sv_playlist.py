from database import db_dependency
from models import Playlist
from schemas.schema_playlist import PlaylistInfo, PlaylistUpdate
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
