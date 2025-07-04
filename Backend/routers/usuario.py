from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from utils.jwt_manager import create_token
from schemas.usuario import UsuarioLogin, UsuarioAuth, Usuario
from config.database import get_db
from models.usuarios import Usuario as UsuarioModel
import bcrypt
from middlewares.jwt_bearer import JWTBearer


usuario_router = APIRouter()


@usuario_router.post("/login", tags=["Auth"])
def login(user: UsuarioLogin, db: Session = Depends(get_db)):
    print("Datos recibidos:", user)
    db_user = db.query(UsuarioModel).filter(UsuarioModel.email == user.email).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    if not bcrypt.checkpw(
        user.contrasenia.get_secret_value().encode("utf-8"),
        db_user.contrasenia.encode("utf-8"),
    ):
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")

    token_data = {"id": db_user.id, "email": db_user.email, "rol": db_user.rol}
    token = create_token(token_data)
    return {
        "token": token,
        "usuario": {
            "id": db_user.id,
            "email": db_user.email,
            "rol": db_user.rol,
            "nombre": db_user.nombre,
        }
    }


@usuario_router.post("/usuarios", tags=["Usuarios"])
def register(user: UsuarioAuth, db: Session = Depends(get_db)):
    existing_user = (
        db.query(UsuarioModel).filter(UsuarioModel.email == user.email).first()
    )
    if existing_user:
        raise HTTPException(status_code=400, detail="El correo ya está registrado")

    hashed_password = bcrypt.hashpw(
        user.contrasenia.get_secret_value().encode("utf-8"), bcrypt.gensalt()
    ).decode("utf-8")

    new_user = UsuarioModel(
        nombre=user.nombre, email=user.email, contrasenia=hashed_password, rol=user.rol
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token_data = {"id": new_user.id, "email": new_user.email, "rol": new_user.rol}

    token = create_token(token_data)
    return {
    "token": token,
    "usuario": new_user
}


@usuario_router.get(
    "/usuarios",
    tags=["Usuarios"],
    response_model=List[Usuario],
    dependencies=[Depends(JWTBearer())],
)
def get_usuarios(db: Session = Depends(get_db)):
    usuarios = db.query(UsuarioModel).all()
    return usuarios


@usuario_router.get(
    "/usuarios/{usuario_id}",
    tags=["Usuarios"],
    response_model=Usuario,
    dependencies=[Depends(JWTBearer())],
)
def get_usuario_por_id(usuario_id: int, db: Session = Depends(get_db)):
    usuario = db.query(UsuarioModel).filter(UsuarioModel.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario


@usuario_router.put(
    "/usuarios/{usuario_id}",
    tags=["Usuarios"],
    response_model=Usuario,
    dependencies=[Depends(JWTBearer())],
)
def update_usuario(
    usuario_id: int, user_update: UsuarioAuth, db: Session = Depends(get_db)
):
    usuario = db.query(UsuarioModel).filter(UsuarioModel.id == usuario_id).first()

    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    hashed_password = bcrypt.hashpw(
        user_update.contrasenia.get_secret_value().encode("utf-8"), bcrypt.gensalt()
    ).decode("utf-8")

    usuario.nombre = user_update.nombre
    usuario.email = user_update.email
    usuario.contrasenia = hashed_password
    usuario.rol = user_update.rol

    db.commit()
    db.refresh(usuario)

    return usuario


@usuario_router.delete(
    "/usuarios/{usuario_id}", tags=["Usuarios"], dependencies=[Depends(JWTBearer())]
)
def delete_usuario(usuario_id: int, db: Session = Depends(get_db)):
    usuario = db.query(UsuarioModel).filter(UsuarioModel.id == usuario_id).first()

    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    db.delete(usuario)
    db.commit()

    return {"msg": "Usuario eliminado correctamente"}
