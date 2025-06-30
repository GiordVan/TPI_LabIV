from pydantic import EmailStr, SecretStr, Field, field_validator, ConfigDict, BaseModel, PositiveInt
from typing import Literal, Optional

class Usuario(BaseModel):
    id: Optional[PositiveInt] = None
    nombre: str = Field(min_length=3, max_length=50)
    email: EmailStr = Field(max_length=100)
    rol: Optional[Literal["Bibliotecario", "Cliente"]] = "Cliente"
    model_config = ConfigDict(
        validate_assignment=True,
        extra='ignore'  # o 'forbid', según lo que necesites
    )

class UsuarioAuth(Usuario):
    model_config = ConfigDict(
        validate_default=True,
        validate_assignment=True,
        from_attributes=True
    )

    contrasenia: SecretStr = Field(min_length=8, max_length=255)

    @field_validator("contrasenia")
    def validar_password(cls, password_secret: SecretStr) -> SecretStr:
        p = password_secret.get_secret_value()

        tiene_numero = any(c.isdigit() for c in p)
        tiene_minuscula = any(c.islower() for c in p)
        tiene_mayuscula = any(c.isupper() for c in p)

        if not (tiene_numero and tiene_minuscula and tiene_mayuscula):
            raise ValueError(
                "La contraseña debe contener al menos: "
                "un número, una letra minúscula y una letra mayúscula."
            )

        return password_secret

class UsuarioLogin(BaseModel):
    email: EmailStr
    contrasenia: SecretStr = Field(min_length=8, max_length=255)