from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from api.handlers import router
from db.seed import seed_database


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Автоматическая инициализация таблиц БД и первичное сидирование при старте
    seed_database()
    yield


app = FastAPI(title="IsoArch — Изотопные сигнатуры", lifespan=lifespan)

app.mount("/static", StaticFiles(directory="static"), name="static")
app.include_router(router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
