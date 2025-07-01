from fastapi.security import HTTPBearer
from fastapi import Request, HTTPException, Depends
from sqlalchemy.orm import Session
from utils.jwt_manager import validate_token
from config.database import get_db
from models.usuarios import Usuario

class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        auth = await super().__call__(request)

        try:
            data = validate_token(auth.credentials)
        except Exception as e:
            raise HTTPException(status_code=403, detail="Token inválido o malformado")

        db: Session = next(get_db())

        db_user = db.query(Usuario).filter(Usuario.email == data.get("email")).first()
        if not db_user:
            raise HTTPException(status_code=403, detail="Usuario no autorizado")


        return data 
