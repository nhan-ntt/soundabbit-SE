from fastapi import APIRouter, Depends, HTTPException
from database import db_dependency
from schemas.schema_artist import ArtistInfo
from schemas.schema_genre import GenreInfo
from schemas.schema_song import SongInfo, SongUpdate
from services import sv_song

router = APIRouter(tags=["songs"], prefix="/songs")


@router.get("/", response_model=list[SongInfo])
async def get_songs(db: db_dependency) -> list[SongInfo]:
    return await sv_song.get_songs(db)


@router.get("/{song_id}", response_model=SongInfo)
async def get_song_by_id(song_id: int, db: db_dependency) -> SongInfo:
    song = await sv_song.get_song_by_id(db, song_id)
    if song is None:
        raise HTTPException(status_code=404, detail="Song not found")
    return song


@router.get("/{song_id}/listen", response_model=SongInfo)
async def get_song_by_id(song_id: int, db: db_dependency) -> SongInfo:
    song = await sv_song.get_song_by_id(db, song_id)
    if song is None:
        raise HTTPException(status_code=404, detail="Song not found")
    return song


@router.post("/", response_model=SongInfo)
async def create_song(song: SongUpdate, db: db_dependency) -> SongInfo:
    return await sv_song.create_song(db, song)


@router.delete("/{song_id}")
async def delete_song(song_id: int, db: db_dependency):
    await sv_song.delete_song(db, song_id)


@router.get("/{song_id}/artists")
async def get_artist_of_song(song_id: int, db: db_dependency) -> ArtistInfo:
    return await sv_song.get_artist_of_song(db, song_id)


@router.get("/{song_id}/genres")
async def get_genre_of_song(song_id: int, db: db_dependency) -> GenreInfo:
    return await sv_song.get_genre_of_song(db, song_id)
