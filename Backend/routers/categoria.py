from typing import  List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import Field, ConfigDict, BaseModel, PositiveInt
from sqlalchemy.orm import Session
from schemas.categoria import Categoria
from models.categorias import Categoria as CategoriaModel
from config.database import get_db
import bcrypt
from middlewares.jwt_bearer import JWTBearer



categoria_router = APIRouter()


@categoria_router.post("/categorias", tags=["categorias"],  response_model=Categoria, dependencies=[Depends(JWTBearer())])
def create_categoria(categoria: Categoria , db: Session = Depends(get_db)):
    existing_categoria = db.query(CategoriaModel).filter(CategoriaModel.nombre == categoria.nombre).first()
    if existing_categoria:
        raise HTTPException(status_code=400, detail="La categoria ya está registrada")
    nueva_categoria = CategoriaModel(
        nombre = categoria.nombre,
        descripcion = categoria.descripcion
    )
    db.add(nueva_categoria)
    db.commit()
    db.refresh(nueva_categoria)
    return nueva_categoria 


@categoria_router.put("/categorias/{categorias_id}", tags=["categorias"])
def update_categoria(categoria_id: int, categoria_update: Categoria, db: Session = Depends(get_db)):
    categoria = db.query(CategoriaModel).filter(CategoriaModel.id == categoria_id).first()
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoria no encontrada")
    categoria.nombre = categoria_update.nombre
    categoria.descripcion = categoria_update.descripcion
    db.commit()
    db.refresh(categoria)
    return {"msg": "Categoria actualizado correctamente", "categoria": categoria}


@categoria_router.get("/categorias", tags=["categorias"], response_model=List[Categoria], dependencies=[Depends(JWTBearer())])
def get_categoria( db: Session = Depends(get_db)):
    categoria = db.query(CategoriaModel).all()
    return categoria


@categoria_router.get("/categorias/{categoria_id}", tags=["categorias"], response_model=Categoria)
def get_categoria_por_id(categoria_id: int, db: Session = Depends(get_db)):
    categoria = db.query(CategoriaModel).filter(CategoriaModel.id == categoria_id).first()
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoria no encontrada")
    return categoria


@categoria_router.delete("/categorias", tags=["categorias"])
def delete_categoria(categoria_id: int , db: Session = Depends(get_db)):
    categoria = db.query(CategoriaModel).filter(CategoriaModel.id == categoria_id).first()
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoria no encontrado")
    db.delete(categoria)
    db.commit()
    return {"msg": "Categoria eliminado correctamente"}