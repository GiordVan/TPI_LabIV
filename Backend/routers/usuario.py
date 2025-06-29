from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from utils.jwt_manager import create_token
from schemas.usuario import UsuarioAuth
from config.database import Base, get_db
from models.usuarios import Usuario
import bcrypt

usuario_router = APIRouter()

@usuario_router.post('/login', tags=['Auth'])
def login(user: UsuarioAuth, db: Session = Depends(get_db)):
    # Buscar usuario por email
    db_user = db.query(Usuario).filter(Usuario.email == user.email).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # Verificar contraseña
    if not bcrypt.checkpw(user.password.encode('utf-8'), db_user.contrasena.encode('utf-8')):
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")

    # Datos que se incluyen en el token
    token_data = {
        "id": db_user.id,
        "email": db_user.email,
        "rol": db_user.rol
    }

    token = create_token(token_data)
    return {"token": token}