from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from schemas.libro import Libro, LibroConCategoria
from config.database import get_db
from models.libros import Libro as LibroModel
from models.categorias import Categoria as CategoriaModel
from middlewares.jwt_bearer import JWTBearer
from routers.categoria import categoria_router

libro_router = APIRouter()

@libro_router.post("/libros", tags=["Libros"], response_model=Libro,
    dependencies=[Depends(JWTBearer())])
def create_libro(libro: Libro, db: Session = Depends(get_db)):
    categoria = db.query(CategoriaModel).filter(CategoriaModel.id == libro.categoria_id).first()
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")

    nuevo_libro = LibroModel(
        titulo=libro.titulo,
        autor=libro.autor,
        isbn=libro.isbn,
        editorial=libro.editorial,
        categoria_id=libro.categoria_id
    )
    db.add(nuevo_libro)
    db.commit()
    db.refresh(nuevo_libro)
    return nuevo_libro

@libro_router.get("/libros", tags=["Libros"], response_model=List[LibroConCategoria])
def get_libros(db: Session = Depends(get_db)):
    libros = db.query(LibroModel).options(joinedload(LibroModel.categoria)).all()
    return libros
    
@libro_router.get("/libros/{libro_id}", tags=["Libros"], response_model=LibroConCategoria)
def get_libro_por_id(libro_id: int, db: Session = Depends(get_db)):
    libro = db.query(LibroModel).options(joinedload(LibroModel.categoria)).filter(LibroModel.id == libro_id).first()
    if not libro:
        raise HTTPException(status_code=404, detail="Libro no encontrado")
    return libro

@libro_router.put("/libros/{libro_id}", tags=["Libros"], response_model=Libro,
    dependencies=[Depends(JWTBearer())])
def update_libro(libro_id: int, libro_update: Libro, db: Session = Depends(get_db)):
    libro = db.query(LibroModel).filter(LibroModel.id == libro_id).first()
    if not libro:
        raise HTTPException(status_code=404, detail="Libro no encontrado")

    categoria = db.query(CategoriaModel).filter(CategoriaModel.id == libro_update.categoria_id).first()
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")

    libro.titulo = libro_update.titulo
    libro.autor = libro_update.autor
    libro.isbn = libro_update.isbn
    libro.editorial = libro_update.editorial
    libro.categoria_id = libro_update.categoria_id
    libro.cantidad = libro_update.cantidad


    db.commit()
    db.refresh(libro)
    return libro
    
@libro_router.delete("/libros/{libro_id}", tags=["Libros"],
    dependencies=[Depends(JWTBearer())])
def delete_libro(libro_id: int, db: Session = Depends(get_db)):
    libro = db.query(LibroModel).filter(LibroModel.id == libro_id).first()
    if not libro:
        raise HTTPException(status_code=404, detail="Libro no encontrado")

    db.delete(libro)
    db.commit()
    return {"msg": "Libro eliminado correctamente"}