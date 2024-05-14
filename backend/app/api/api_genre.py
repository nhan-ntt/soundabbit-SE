from fastapi import APIRouter, HTTPException

from backend.app.database import db_dependency
from backend.app.schemas.schema_genre import GenreInfo, GenreUpdate
from backend.app.schemas.schema_song import SongInfo
from backend.app.services import sv_genre

router = APIRouter(tags=["genres"], prefix="/genres")


@router.get("", response_model=dict[str, list[GenreInfo]])
async def get_genres(db: db_dependency) -> dict[str, list[GenreInfo]]:
    """
    API Read genres
    """
    genres = await sv_genre.get_genres(db)
    return {"list": genres}


@router.get("/{genre_id}", response_model=GenreInfo)
async def get_genre_by_id(genre_id: int, db: db_dependency) -> GenreInfo:
    """
    API Read genre by id
    """
    genre = await sv_genre.get_genre_by_id(db, genre_id)
    if genre is None:
        raise HTTPException(status_code=404, detail="Genre not found")
    return genre


@router.post("/", response_model=GenreInfo)
async def create_genre(genre: GenreUpdate, db: db_dependency) -> GenreInfo:
    """
    API Create genre
    """
    return await sv_genre.create_genre(db, genre)


@router.delete("/{genre_id}")
async def delete_genre(genre_id: int, db: db_dependency):
    """
    API Delete genre
    """
    return await sv_genre.delete_genre(db, genre_id)


@router.get("/{genre_id}/songs", response_model=dict[str, list[SongInfo]])
async def get_songs_of_genre(genre_id: int, db: db_dependency) -> dict[str, list[SongInfo]]:
    """
    API Read songs of genre
    """
    songs = await sv_genre.get_songs_of_genre(db, genre_id)
    return {"list": songs}
