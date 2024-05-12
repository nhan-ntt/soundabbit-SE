from fastapi import APIRouter

from database import db_dependency
from schemas.schema_playlist import PlaylistInfo, PlaylistUpdate
from services import sv_playlist
from services.auth import user_dependency

router = APIRouter(tags=["playlists"], prefix="/playlists")


@router.get("/", response_model=list[PlaylistInfo])
async def get_playlists(user: user_dependency, db: db_dependency) -> list[PlaylistInfo]:
    """
    API Read Playlist
    """
    return await sv_playlist.read_playlist(db, user)


@router.get("/{playlist_id}", response_model=PlaylistInfo)
async def get_playlist_by_id(playlist_id: int, db: db_dependency) -> PlaylistInfo:
    """
    API Read Playlist by id
    """
    return await sv_playlist.read_playlist_by_id(db, playlist_id)


@router.post("/", response_model=PlaylistInfo)
async def create_playlist(playlist: PlaylistUpdate, db: db_dependency, user: user_dependency) -> PlaylistInfo:
    """
    API Create Playlist
    """
    return await sv_playlist.create_playlist(db, user, playlist)


@router.delete("/{playlist_id}")
async def delete_playlist(playlist_id: int, db: db_dependency, user: user_dependency) -> None:
    """
    API Delete Playlist
    """
    return await sv_playlist.delete_playlist(db, user, playlist_id)
