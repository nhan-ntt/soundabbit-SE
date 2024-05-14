from fastapi import APIRouter, HTTPException

from backend.app.database import db_dependency
from backend.app.schemas.schema_artist import ArtistInfo, ArtistUpdate
from backend.app.schemas.schema_song import SongInfo
from backend.app.services import sv_artist

router = APIRouter(tags=["artists"], prefix="/artists")


@router.get("", response_model=dict[str, list[ArtistInfo]])
async def get_artists(db: db_dependency) -> dict[str, list[ArtistInfo]]:
    """
    API Read Artists
    """
    artists = await sv_artist.get_artists(db)
    return {"list": artists}


@router.get("/{artist_id}", response_model=ArtistInfo)
async def get_artist_by_id(artist_id: int, db: db_dependency) -> ArtistInfo:
    """
    API Read Artist by id
    """
    artist = await sv_artist.get_artist_by_id(db, artist_id)
    if artist is None:
        raise HTTPException(status_code=404, detail="Artist not found")
    return artist


@router.post("/", response_model=ArtistInfo)
async def create_artist(artist: ArtistUpdate, db: db_dependency = db_dependency) -> ArtistInfo:
    """
    API Create Artist
    """
    return await sv_artist.create_artist(db, artist)


@router.delete("/{artist_id}")
async def delete_artist(artist_id: int, db: db_dependency = db_dependency):
    """
    API Delete Artist
    """
    return await sv_artist.delete_artist(db, artist_id)


@router.get("/{artist_id}/songs", response_model=dict[str, list[SongInfo]])
async def get_songs_of_artist(artist_id: int, db: db_dependency) -> dict[str, list[SongInfo]]:
    """
    API Read songs of Artist
    """
    songs = await sv_artist.get_songs_of_artist(db, artist_id)
    return {"list": songs}

