from fastapi import APIRouter

from api import api_auth, api_playlist, api_user, api_genre, api_artist

router = APIRouter()

router.include_router(api_auth.router)
router.include_router(api_user.router)
router.include_router(api_playlist.router)
router.include_router(api_genre.router)
router.include_router(api_artist.router)

