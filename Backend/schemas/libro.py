from typing import Optional
from schemas.base import Base
from pydantic import Field


class Libro(Base):
    titulo: str = Field(max_length=255)
    autor: Optional[str] = Field(default="Desconocido", max_length=100)
    isbn: str = Field(..., min_length=13, max_length=13, pattern=r'^\d{13}$')
    editorial: Optional[str] = Field(default="Desconocido", max_length=100)
    categoria_id: int
    
    class Config:
        from_attributes = True