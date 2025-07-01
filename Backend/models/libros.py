# libros.py
from config.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, SmallInteger
from sqlalchemy.orm import relationship
from models.categorias import Categoria


class Libro(Base):
    __tablename__ = "libros"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(255), nullable=False)
    autor = Column(String(100), nullable=False, default="Desconocido")
    isbn = Column(String(13), unique=True, index=True, nullable=False)
    editorial = Column(String(100), nullable=False, default="Desconocido")
    categoria_id = Column(Integer, ForeignKey("categorias.id"), nullable=False)
    cantidad = Column(SmallInteger, nullable=False, default=1)  
    imagen = Column(String(255), nullable=True)


    categoria = relationship("Categoria", back_populates="libros")
    prestamos = relationship("Prestamo", back_populates="libro")