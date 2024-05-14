from fastapi import APIRouter

from api import api_auth, api_playlist, api_genre, api_artist, api_song, algolia
from api import api_user

router = APIRouter()

router.include_router(api_auth.router)
router.include_router(api_user.router)
router.include_router(api_playlist.router)
router.include_router(api_genre.router)
router.include_router(api_artist.router)
router.include_router(api_song.router)
router.include_router(algolia.router)

