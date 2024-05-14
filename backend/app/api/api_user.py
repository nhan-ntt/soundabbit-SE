from typing import List

from fastapi import APIRouter, HTTPException
from starlette import status

from database import db_dependency
from schemas.schema_playlist import PlaylistInfo
from schemas.schema_song import SongInfo
from schemas.schema_user import UserInfo, UserUpdate
from models import User
from services import auth
from services import sv_user
from services.auth import user_dependency

router = APIRouter(tags=["users"], prefix="/users")


@router.get("/me", status_code=status.HTTP_200_OK)
async def user(user: user_dependency):
    """
    API get User Detail
    """
    if user is None:
        raise HTTPException(status_code=401, detail="Unauthorized")
    print(user.id)
    return {"data": user.id}


@router.get("", response_model=dict[str, List[UserInfo]])
async def get_users(db: db_dependency) -> dict[str, List[UserInfo]]:
    """
    API get List User
    """
    users = db.query(User).all()
    return {"list": users}


@router.get("/{user_id}")
async def get_user(user_id: int, db: db_dependency) -> UserInfo:
    """
    API get User by Id
    """
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def create_user(db: db_dependency, user: UserUpdate) -> UserInfo:
    """
    API Create User
    """
    new_user = await auth.create_user(db, user)
    return new_user


@router.put("/", status_code=status.HTTP_200_OK)
async def update_user(user_db: UserUpdate, user: user_dependency, db: db_dependency) -> UserInfo:
    """
    API Update User
    """

    updating_user = await sv_user.update_user(user_db, user, db)
    return updating_user


@router.delete("/{user_id}")
async def delete_user(user_id: int, db: db_dependency, user: user_dependency):
    """
    API Delete User
    """
    if user_id != user.id:
        raise HTTPException(status_code=400, detail="User ID mismatch")
    await sv_user.delete_user(user_id, db)
    return {"message": "User deleted"}


@router.get("/{user_id}/favorite/playlists", response_model=dict[str, list[PlaylistInfo]])
async def get_favorite_playlists(user_id: int, db: db_dependency, user: user_dependency) -> dict[str, list[PlaylistInfo]]:
    """
    API Get Favorite Playlists
    """
    if user_id != user.id:
        raise HTTPException(status_code=400, detail="User ID mismatch")
    playlists = await sv_user.get_favorite_playlists(user_id, db)
    return {"list": playlists}


@router.get("/{user_id}/own/playlists", response_model=dict[str, list[PlaylistInfo]])
async def get_favorite_playlists(user_id: int, db: db_dependency, user: user_dependency) -> dict[str, list[PlaylistInfo]]:
    """
    API Get Favorite Playlists
    """
    if user_id != user.id:
        raise HTTPException(status_code=400, detail="User ID mismatch")
    playlists = await sv_user.get_favorite_playlists(user_id, db)
    return {"list": playlists}


@router.post("/{user_id}/favorite/playlists/{playlist_id}", response_model=PlaylistInfo)
async def add_favorite_playlist(user_id: int, playlist_id: int, db: db_dependency, user: user_dependency) -> PlaylistInfo:
    """
    API Add Favorite Playlist
    """
    if user_id != user.id:
        raise HTTPException(status_code=400, detail="User ID mismatch")
    playlist = await sv_user.add_favorite_playlist(user_id, playlist_id, db)
    return playlist


@router.delete("/{user_id}/favorite/playlists/{playlist_id}")
async def delete_favorite_playlist(user_id: int, playlist_id: int, db: db_dependency, user: user_dependency):
    """
    API Delete Favorite Playlist
    """
    if user_id != user.id:
        raise HTTPException(status_code=400, detail="User ID mismatch")
    await sv_user.delete_favorite_playlist(user_id, playlist_id, db)
    return {"message": "Playlist deleted"}


@router.get("/{user_id}/favorite/songs", response_model=dict[str, list[SongInfo]])
async def get_favorite_songs(curr_user: user_dependency, db: db_dependency) -> dict[str, list[SongInfo]]:
    """
    API Get Favorite Songs
    """
    # if user_id != curr_user.id:
    #     raise HTTPException(status_code=400, detail="User ID mismatch")
    songs = await sv_user.get_favorite_song(curr_user, db)
    return {"list": songs}


@router.post("/{user_id}/favorite/songs/{song_id}")
async def add_favorite_song(user_id: int, curr_user: user_dependency, song_id: int, db: db_dependency):
    """
    API Add Favorite Song
    """
    if user_id != curr_user.id:
        raise HTTPException(status_code=400, detail="User ID mismatch")
    await sv_user.add_favorite_song(user_id, song_id, db)
    return {"message": "Song added",
            "user_id": user_id,
            "song_id": song_id
            }


@router.delete("/{user_id}/favorite/songs/{song_id}")
async def delete_favorite_song(user_id: int, song_id: int, db: db_dependency, user: user_dependency):
    """
    API Delete Favorite Song
    """
    if user_id != user.id:
        raise HTTPException(status_code=400, detail="User ID mismatch")
    await sv_user.delete_favorite_song(user_id, song_id, db)
    return {"message": "Song deleted",
            "user_id": user_id,
            "song_id": song_id
            }