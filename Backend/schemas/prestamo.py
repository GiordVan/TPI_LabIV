from pydantic import Field, PositiveInt, ConfigDict, BaseModel
from datetime import datetime, timezone
from typing import Optional

def utc_now():
    return datetime.now(timezone.utc)

class Prestamo(BaseModel):
    id: Optional[PositiveInt] = None
    libro_id: PositiveInt
    usuario_id: PositiveInt
    fecha_prestamo: Optional[datetime] = Field(default_factory=utc_now)
    fecha_devolucion: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
        