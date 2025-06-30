from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas.libro import Libro
from schemas.categoria import Categoria #esto deberia ir en schemas/libro.
from config.database import get_db
from models.libros import Libro as LibroModel
from models.categorias import Categoria as CategoriaModel
from middlewares.jwt_bearer import JWTBearer
from routers.categorias import categoria_router

# esto deberia ir en el main.py
# from routers.libros import libro_router
# from routers.categorias import categoria_router
#
# app.include_router(libro_router)
# app.include_router(categoria_router)

libro_router = APIRouter()

#esto tambien para schemas.
class LibroConCategoria(Libro):
    categoria: Categoria

@libro_router.post("/libros", tags=["Libros"], response_model=Libro)
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

@libro_router.get("/libros", tags=["Libros"], response_model=List[LibroConCategoria], dependencies=[Depends(JWTBearer())])
def get_libros(db: Session = Depends(get_db)):
    libros = db.query(LibroModel).options(joinedload(LibroModel.categoria)).all()
    return libros
    
@libro_router.get("/libros/{libro_id}", tags=["Libros"], response_model=LibroConCategoria, dependencies=[Depends(JWTBearer())])
def get_libro_por_id(libro_id: int, db: Session = Depends(get_db)):
    libro = db.query(LibroModel).options(joinedload(LibroModel.categoria)).filter(LibroModel.id == libro_id).first()
    if not libro:
        raise HTTPException(status_code=404, detail="Libro no encontrado")
    return libro

@libro_router.put("/libros/{libro_id}", tags=["Libros"], response_model=Libro)
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

    db.commit()
    db.refresh(libro)
    return libro
    
@libro_router.delete("/libros/{libro_id}", tags=["Libros"])
def delete_libro(libro_id: int, db: Session = Depends(get_db)):
    libro = db.query(LibroModel).filter(LibroModel.id == libro_id).first()
    if not libro:
        raise HTTPException(status_code=404, detail="Libro no encontrado")

    db.delete(libro)
    db.commit()
    return {"msg": "Libro eliminado correctamente"}