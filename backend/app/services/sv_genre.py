from database import db_dependency
from models import Genre, Song
from schemas.schema_genre import GenreInfo, GenreUpdate
from schemas.schema_song import SongInfo


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


def delete_genre(db: db_dependency, genre_id: int):
    genre = db.query(Genre).filter(Genre.id == genre_id).first()
    db.delete(genre)
    db.commit()
    return


async def get_songs_of_genre(db: db_dependency, genre_id: int) -> list[SongInfo]:
    songs = db.query(Song).filter(Song.genre_id == genre_id).all()
    return songs
