from pydantic import BaseModel, PositiveInt

class Base(BaseModel):
    id: PositiveInt

    class Config:
        from_attributes = True