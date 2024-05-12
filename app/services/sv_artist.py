from database import db_dependency
from models import Artist
from schemas.schema_artist import ArtistInfo, ArtistUpdate


async def get_artists(db: db_dependency) -> list[ArtistInfo]:
    artists = db.query(Artist).all()
    return artists


async def get_artist_by_id(db: db_dependency, artist_id: int) -> ArtistInfo:
    artist = db.query(Artist).filter(Artist.id == artist_id).first()
    return artist


async def create_artist(db: db_dependency, artist: ArtistUpdate) -> ArtistInfo:
    new_artist = Artist(
        name=artist.name,
        image_link=artist.image_link
    )
    db.add(new_artist)
    db.commit()
    db.refresh(new_artist)
    return new_artist


