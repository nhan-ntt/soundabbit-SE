from typing import Optional

from fastapi import APIRouter, Depends, HTTPException

from database import db_dependency
from services import algolia

router = APIRouter(tags=["algolia"], prefix="/algolia")


@router.patch("/index/songs")
async def index_songs(reset: Optional[bool] = False, db=Depends(db_dependency)):
    try:
        if reset:
            algolia.index.clear_objects()
        algolia.sync_songs(db)
        return {"message": "Songs indexed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
