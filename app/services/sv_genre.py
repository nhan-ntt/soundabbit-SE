from database import db_dependency
from models import Genre
from schemas.schema_genre import GenreInfo, GenreUpdate


async def get_genres(db: db_dependency) -> list[GenreInfo]:
    genres = db.query(Genre).all()
    return genres


async def get_genre_by_id(db: db_dependency, genre_id: int) -> GenreInfo:
    genre = db.query(Genre).filter(Genre.id == genre_id).first()
    return genre


async def create_genre(db: db_dependency, genre: GenreUpdate) -> GenreInfo:
    new_genre = Genre(
        name=genre.name,
        image_link=genre.image_link
    )
    db.add(new_genre)
    db.commit()
    db.refresh(new_genre)
    return new_genre


