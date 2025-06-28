from config.database import Base
from sqlalchemy import Column, Integer, String, Float

class Libros(Base):

    __tablename__ = "Libros"

    id = Column(Integer, primary_key = True)
    titulo = Column(String)
    autor = Column(String)
    isbn = Column(String,unique)
    editorial = Column(String)
    categoria_id = Column(Integer, foreign key)


class Categorias(Base):

    __tablename__ = "Categorias"

    id = Column(Integer, primary_key = True)
    nombre = Column(String)
    descripcion = Column(String)
        