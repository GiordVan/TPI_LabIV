import  enum
from config.database import Base
from sqlalchemy import Column, Integer, String, Enum

class RolUsuario(enum.Enum):
    Bibliotecario = "Bibliotecario"
    Cliente = "Cliente"

class Usuarios(Base):

    __tablename__ = "Usuarios"

    id = Column(Integer, primary_key = True, autoincrement = True)
    nombre = Column(String, nullable = False)
    email = Column(String, unique = True, nullable = False)
    contraseña = Column(String, nullable = False)
    rol = Column(Enum(RolUsuario), nullable = False)