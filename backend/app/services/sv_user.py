from fastapi import HTTPException

from database import db_dependency
from models import User, Playlist, Song
from models.model_base import user_song_association
from schemas.schema_playlist import PlaylistInfo
from schemas.schema_song import SongInfo
from schemas.schema_user import UserUpdate, UserInfo
from services.auth import user_dependency


async def update_user(user_db: UserUpdate, user: user_dependency, db: db_dependency) -> UserInfo:
    updating_user = user
    if updating_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    if user_db.name is not None:
        updating_user.name = user_db.name
    if user_db.username is not None:
        updating_user.username = user_db.username
    if user_db.password is not None:
        updating_user.password = user_db.password
    db.commit()
    return updating_user


async def get_favorite_playlists(user_id: int, db: db_dependency) -> list[PlaylistInfo]:
    # curr_user = db.query(User).filter(User.id == user_id).first()
    playlists = db.query(Playlist).filter(Playlist.user_id == user_id).all()

    return playlists


async def add_favorite_playlist(user_id: int, playlist_id: int, db: db_dependency) -> PlaylistInfo:
    playlist = db.query(Playlist).filter(Playlist.id == playlist_id).first()

    new_playlist = Playlist(
        name=playlist.name,
        image_link=playlist.image_link,
        is_public=playlist.is_public,
        user_id=user_id
    )
    db.add(new_playlist)
    db.commit()
    return new_playlist


async def delete_favorite_playlist(user_id: int, playlist_id: int, db: db_dependency):
    playlist = db.query(Playlist).filter(Playlist.id == playlist_id, Playlist.user_id == user_id).first()
    if playlist is None:
        raise HTTPException(status_code=404, detail="Playlist not found")
    db.delete(playlist)
    db.commit()
    return {"message": "Playlist deleted"}


async def get_favorite_song(curr_user: user_dependency, db: db_dependency) -> list[SongInfo]:
    # if user_id != curr_user.id:
    #     raise HTTPException(status_code=400, detail="User ID mismatch")
    user_id = curr_user.id
    songs = (db.query(Song)
             .join(user_song_association)
             .filter(user_song_association.c.user_id == user_id)
             .all())
    return songs


async def add_favorite_song(user_id: int, song_id: int, db: db_dependency):
    stmt = user_song_association.insert().values(user_id=user_id, song_id=song_id)
    db.execute(stmt)
    db.commit()
    return {"message": "Song added",
            "user_id": user_id,
            "song_id": song_id
            }


async def delete_favorite_song(user_id: int, song_id: int, db: db_dependency):
    stmt = user_song_association.delete().where(
        (user_song_association.c.user_id == user_id) &
        (user_song_association.c.song_id == song_id)
    )
    db.execute(stmt)
    db.commit()
    return {"message": "Song deleted",
            "user_id": user_id,
            "song_id": song_id
            }


def delete_user(user_id: int, db: db_dependency):
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted"}