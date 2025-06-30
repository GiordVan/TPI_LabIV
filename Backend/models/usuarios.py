from config.database import Base
from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import relationship
from models.prestamos import Prestamo


class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    contrasenia = Column(String(255), nullable=False)
    rol = Column(Enum("Bibliotecario", "Cliente", name="rol_usuario"), nullable=False)

    prestamos = relationship("Prestamo", back_populates="usuario")

