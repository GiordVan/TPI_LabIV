from typing import Optional
from pydantic import Field, ConfigDict, BaseModel, PositiveInt


class Libro(BaseModel):
    id: Optional[PositiveInt] = None
    titulo: str = Field(max_length=255)
    autor: Optional[str] = Field(default="Desconocido", max_length=100)
    isbn: str = Field(..., min_length=13, max_length=13, pattern=r'^\d{13}$')
    editorial: Optional[str] = Field(default="Desconocido", max_length=100)
    categoria_id: int
    
    model_config = ConfigDict(from_attributes=True)