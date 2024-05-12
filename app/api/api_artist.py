from fastapi import APIRouter

from database import db_dependency
from schemas.schema_artist import ArtistInfo, ArtistUpdate
from services import sv_artist
from services.auth import user_dependency

router = APIRouter(tags=["artists"], prefix="/artists")


@router.get("/", response_model=list[ArtistInfo])
async def get_artists(db: db_dependency) -> list[ArtistInfo]:
    """
    API Read Artists
    """
    return await sv_artist.get_artists(db)


@router.get("/{artist_id}", response_model=ArtistInfo)
async def get_artist_by_id(artist_id: int, db: db_dependency) -> ArtistInfo:
    """
    API Read Artist by id
    """
    return await sv_artist.get_artist_by_id(db, artist_id)


@router.post("/", response_model=ArtistInfo)
async def create_artist(artist: ArtistUpdate, db: db_dependency = db_dependency) -> ArtistInfo:
    """
    API Create Artist
    """
    return await sv_artist.create_artist(db, artist)
