from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from config.database import engine, Base
from middlewares.error_handler import ErrorHandler
from routers.usuario import usuario_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.title = "Mi aplicación con  FastAPI"
app.version = "0.0.1"
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.7:5502"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(ErrorHandler)

app.include_router(usuario_router)


Base.metadata.create_all(bind=engine)

