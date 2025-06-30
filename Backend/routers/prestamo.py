from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from config.database import get_db
from schemas.prestamo import Prestamo
from models.prestamos import Prestamo as PrestamoModel
from middlewares.jwt_bearer import JWTBearer

prestamoRouter = APIRouter()

# Crear préstamo
@prestamoRouter.post("/prestamos", tags=["Prestamos"], response_model=Prestamo)
def crearPrestamo(prestamo: Prestamo, db: Session = Depends(get_db)):
    nuevoPrestamo = PrestamoModel(
        libro_id=prestamo.libro_id,
        usuario_id=prestamo.usuario_id,
        fecha_prestamo=prestamo.fecha_prestamo,
        fecha_devolucion=prestamo.fecha_devolucion,
    )
    db.add(nuevoPrestamo)
    db.commit()
    db.refresh(nuevoPrestamo)
    return nuevoPrestamo

# Traer todos los préstamos (requiere token)
@prestamoRouter.get("/prestamos", tags=["Prestamos"], response_model=List[Prestamo], dependencies=[Depends(JWTBearer())])
def obtenerPrestamos(db: Session = Depends(get_db)):
    prestamos = db.query(PrestamoModel).all()
    return prestamos

# Traer préstamo por ID (requiere token)
@prestamoRouter.get("/prestamos/{prestamoId}", tags=["Prestamos"], response_model=Prestamo, dependencies=[Depends(JWTBearer())])
def obtenerPrestamoPorId(prestamoId: int, db: Session = Depends(get_db)):
    prestamo = db.query(PrestamoModel).filter(PrestamoModel.id == prestamoId).first()
    if not prestamo:
        raise HTTPException(status_code=404, detail="Préstamo no encontrado")
    return prestamo

# Editar préstamo
@prestamoRouter.put("/prestamos/{prestamoId}", tags=["Prestamos"])
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

# Eliminar préstamo
@prestamoRouter.delete("/prestamos/{prestamoId}", tags=["Prestamos"])
def eliminarPrestamo(prestamoId: int, db: Session = Depends(get_db)):
    prestamo = db.query(PrestamoModel).filter(PrestamoModel.id == prestamoId).first()
    if not prestamo:
        raise HTTPException(status_code=404, detail="Préstamo no encontrado")

    db.delete(prestamo)
    db.commit()
    return {"msg": "Préstamo eliminado correctamente"}
