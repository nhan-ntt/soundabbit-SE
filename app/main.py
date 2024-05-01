import uvicorn
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware


# from app.api import router

def get_application() -> FastAPI:
    app = FastAPI()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # app.include_router(router, prefex="/api")
    return app

app = get_application()
if __name__ == "__main__":
    # uvicorn.run(app, host="0.0.0.0", port=8000)
    uvicorn.run(app, host="localhost", port=8000)