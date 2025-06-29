from schemas.base import Base
from pydantic import Field, PositiveInt
from datetime import datetime, timezone
from typing import Optional

def utc_now():
    return datetime.now(timezone.utc)

class Prestamo(Base):
    libro_id: PositiveInt
    usuario_id: PositiveInt
    fecha_prestamo: Optional[datetime] = Field(default_factory=utc_now)
    fecha_devolucion: Optional[datetime] = None

    class Config:
        from_attributes = True
        