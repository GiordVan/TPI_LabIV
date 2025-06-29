# libros.py
from config.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

class Libro(Base):
    __tablename__ = "libros"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(255), nullable=False)
    autor = Column(String(100), nullable=False, default="Desconocido")
    isbn = Column(String(13), unique=True, index=True, nullable=False)
    editorial = Column(String(100), nullable=False, default="Desconocido")
    categoria_id = Column(Integer, ForeignKey("categorias.id"), nullable=False)

    # Relación con categoría
    categoria = relationship("Categoria", back_populates="libros")