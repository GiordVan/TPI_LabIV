from config.database import Base
from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship

class Prestamos(Base):

    __tablename__ = "Prestamos"

    id = Column(Integer, primary_key = True, autoincrement = True)
    libro_id = Column(Integer, ForeignKey("Libros.id"), nullable = False)
    usuario_id = Column(Integer, ForeignKey("Usuarios.id"), nullable = False)
    fecha_prestamo = Column(DateTime, nullable = False)
    fecha_validacion = Column(DateTime, nullable = False)
    
    libro = relationship("Libros")
    usuario = relationship("Usuarios")