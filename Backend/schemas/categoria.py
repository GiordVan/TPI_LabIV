from typing import Optional
from pydantic import Field, ConfigDict, BaseModel, PositiveInt

class Categoria(BaseModel):
    id: Optional[PositiveInt] = None
    nombre: str = Field(max_length=100)
    descripcion: Optional[str] = Field(default="Sin descripción", max_length=255)

    model_config = ConfigDict(from_attributes=True)