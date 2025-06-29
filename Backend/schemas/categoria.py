from typing import Optional
from schemas.base import Base
from pydantic import Field

class Categoria(Base):
    nombre: str = Field(max_length=100)
    descripcion: Optional[str] = Field(default="Sin descripción", max_length=255)

    class Config:
        from_attributes = True