import uvicorn
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from fastapi_sqlalchemy import DBSessionMiddleware

from app.api.router import router
from app.core.config import settings
from app.database import engine
from app.models import Base

Base.metadata.create_all(bind=engine)


def get_application() -> FastAPI:
    application = FastAPI()

    application.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    application.add_middleware(
        DBSessionMiddleware,
        db_url=settings.DATABASE_URL,
    )

    application.include_router(router, prefix="/api")
    return application


app = get_application()
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
