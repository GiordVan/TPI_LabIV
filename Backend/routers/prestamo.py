from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session
from typing import List, Optional
from config.database import get_db
from schemas.prestamo import Prestamo
from models.prestamos import Prestamo as PrestamoModel
from middlewares.jwt_bearer import JWTBearer
from utils.jwt_manager import validate_token
from models.libros import Libro as LibroModel


prestamo_router = APIRouter()

@prestamo_router.post("/prestamos", tags=["Préstamos"], response_model=Prestamo,
    dependencies=[Depends(JWTBearer())])
def crear_prestamo(prestamo: Prestamo, db: Session = Depends(get_db)):
    libro = db.query(LibroModel).filter(LibroModel.id == prestamo.libro_id).first()
    if not libro:
        raise HTTPException(status_code=404, detail="Libro no encontrado")

    if libro.cantidad == 0:
        raise HTTPException(status_code=400, detail="El libro ya está prestado")

    nuevo_prestamo = PrestamoModel(
        libro_id=prestamo.libro_id,
        usuario_id=prestamo.usuario_id,
        fecha_prestamo=prestamo.fecha_prestamo,
        fecha_devolucion=prestamo.fecha_devolucion
    )
    db.add(nuevo_prestamo)

    libro.cantidad = 0

    db.commit()
    db.refresh(nuevo_prestamo)

    return nuevo_prestamo


@prestamo_router.get("/prestamos", tags=["Prestamos"], response_model=List[Prestamo])
def obtenerPrestamos(
    request: Request,
    usuario_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=401, detail="Token no proporcionado")

    token = auth_header.split(" ")[1]
    datos_token = validate_token(token)
    id_token = datos_token.get("id")
    rol = datos_token.get("rol", "").lower()

    if rol == "bibliotecario":
        if usuario_id is not None:
            return db.query(PrestamoModel).filter(PrestamoModel.usuario_id == usuario_id).all()
        return db.query(PrestamoModel).all()


    if usuario_id is not None and usuario_id != id_token:
        raise HTTPException(status_code=403, detail="No tienes permiso para acceder a estos préstamos")

    return db.query(PrestamoModel).filter(PrestamoModel.usuario_id == id_token).all()


@prestamo_router.get("/prestamos/{prestamoId}", tags=["Prestamos"], response_model=Prestamo, dependencies=[Depends(JWTBearer())])
def obtenerPrestamoPorId(prestamoId: int, db: Session = Depends(get_db)):
    prestamo = db.query(PrestamoModel).filter(PrestamoModel.id == prestamoId).first()
    if not prestamo:
        raise HTTPException(status_code=404, detail="Préstamo no encontrado")
    return prestamo

@prestamo_router.put("/prestamos/{prestamoId}", tags=["Prestamos"], dependencies=[Depends(JWTBearer())])
def actualizarPrestamo(prestamoId: int, prestamoActualizado: Prestamo, db: Session = Depends(get_db)):
    prestamo = db.query(PrestamoModel).filter(PrestamoModel.id == prestamoId).first()
    if not prestamo:
        raise HTTPException(status_code=404, detail="Préstamo no encontrado")

    prestamo.libro_id = prestamoActualizado.libro_id
    prestamo.usuario_id = prestamoActualizado.usuario_id
    prestamo.fecha_prestamo = prestamoActualizado.fecha_prestamo
    prestamo.fecha_devolucion = prestamoActualizado.fecha_devolucion

    db.commit()
    db.refresh(prestamo)
    return {"msg": "Préstamo actualizado correctamente", "prestamo": prestamo}

@prestamo_router.delete("/prestamos/{prestamoId}", tags=["Prestamos"], dependencies=[Depends(JWTBearer())])
def eliminarPrestamo(prestamoId: int, db: Session = Depends(get_db)):
    prestamo = db.query(PrestamoModel).filter(PrestamoModel.id == prestamoId).first()
    if not prestamo:
        raise HTTPException(status_code=404, detail="Préstamo no encontrado")

    libro = db.query(LibroModel).filter(LibroModel.id == prestamo.libro_id).first()
    if libro:
        libro.cantidad = 1  

    db.delete(prestamo)
    db.commit()

    return {"msg": "Préstamo eliminado correctamente y libro restablecido"}
