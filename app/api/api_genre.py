from fastapi import APIRouter

from database import db_dependency
from schemas.schema_genre import GenreInfo, GenreUpdate
from services import sv_genre
from services.auth import user_dependency

router = APIRouter(tags=["genres"], prefix="/genres")


@router.get("/", response_model=list[GenreInfo])
async def get_genres(db: db_dependency) -> list[GenreInfo]:
    """
    API Read genres
    """
    return await sv_genre.get_genres(db)


@router.get("/{genre_id}", response_model=GenreInfo)
async def get_genre_by_id(genre_id: int, db: db_dependency) -> GenreInfo:
    """
    API Read genre by id
    """
    return await sv_genre.get_genre_by_id(db, genre_id)


@router.post("/", response_model=GenreInfo)
async def create_genre(genre: GenreUpdate, db: db_dependency = db_dependency) -> GenreInfo:
    """
    API Create genre
    """
    return await sv_genre.create_genre(db, genre)
