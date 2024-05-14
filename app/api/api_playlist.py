from fastapi import APIRouter, HTTPException

from database import db_dependency
from schemas.schema_playlist import PlaylistInfo, PlaylistUpdate
from schemas.schema_song import SongInfo
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
    playlist = await sv_playlist.read_playlist_by_id(db, playlist_id)
    if playlist is None:
        raise HTTPException(status_code=404, detail="Playlist not found")
    return playlist


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
    return await sv_playlist.delete_playlist(db, playlist_id)


@router.get("/{playlist_id}/songs", response_model=list[SongInfo])
async def get_songs(playlist_id: int, db: db_dependency) -> list[SongInfo]:
    """
    API Get Songs
    """
    return await sv_playlist.get_songs(db, playlist_id)


@router.post("/{playlist_id}/songs/{song_id}")
async def add_song_to_playlist(playlist_id: int, song_id: int, db: db_dependency):
    """
    API Add Song to Playlist
    """

    sv_playlist.add_song_to_playlist(db, playlist_id, song_id)
    return {"message": "Song added to playlist",
            "playlist_id": playlist_id,
            "song_id": song_id}


@router.delete("/{playlist_id}/songs/{song_id}")
async def remove_song_from_playlist(playlist_id: int, song_id: int, db: db_dependency):
    """
    API Remove Song from Playlist
    """
    sv_playlist.remove_song_from_playlist(db, playlist_id, song_id)
    return {"message": "Song removed from playlist",
            "playlist_id": playlist_id,
            "song_id": song_id}
