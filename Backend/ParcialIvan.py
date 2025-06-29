#region Imports
from fastapi import FastAPI, status, Depends, HTTPException
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from pydantic import BaseModel, EmailStr,Field, SecretStr, PositiveInt, field_validator
from typing import List, Optional, Annotated
from passlib.context import CryptContext
import uvicorn
import secrets
#endregion
#region Classes
class Base(BaseModel):
    id: Annotated[PositiveInt, Field(le=1000)]

    def idDuplicados(obj, lista:List):
        for item in lista:
            if item.id == obj.id :
                raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail=f"El id ya se encuentra registrado" )
                    
class Usuario(Base):
    nombre: str = Field(min_length=8, max_length=50)
    apellido: str = Field(min_length=8, max_length=50)
    email: EmailStr
    telefono: Optional[str]=None
    idRol: Optional[PositiveInt]=None  
    
    def validar_existencia_rol(obj, lista:List):
        if obj.idRol is None:
            obj.idRol = 1
            return 
        for i in lista:
            if i.id == obj.idRol :
                return
        raise HTTPException(status_code=status.HTTP_417_EXPECTATION_FAILED, 
                            detail=f"El idRol {obj.idRol} no existe en la lista de roles.")
    
    def emailDuplicado(obj,   lista:List):
        for item in lista:
            if item.email == obj.email:
                raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail=f"El email ya se encuentra registrado" )

class Auth(Usuario):
    password: SecretStr = Field(min_length=8)
    @field_validator("password")
    def validarPassword(cls, password: SecretStr) -> str:
        p = password.get_secret_value()
        numeros:str = "1234567890" 
        letrasMin:str = "abcdefghijklmnopqrstuvwxyz"
        letrasMay:str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        n = 0
        l = 0
        u = 0

        for i in p:
            if numeros.find(i) != -1:
                n += 1
            if letrasMin.find(i) != -1:
                l  += 1
            if letrasMay.find(i) != -1:
                u += 1
                
        if n > 0 and l > 0 and u > 0:
            return password
    
        raise HTTPException(status_code=status.HTTP_417_EXPECTATION_FAILED, 
                        detail=f"El password debe contener al menos un numero, una letra minuscula y una letra mayuscula.")
            
    
class Rol(Base):
    descripcion: str
    def validar_rol(obj):
        if obj.descripcion != "vendedor" and obj.descripcion != "cajero" and obj.descripcion != "administrador":
            raise HTTPException(status_code=status.HTTP_417_EXPECTATION_FAILED, 
                            detail=f"La descripcion del rol debe ser igual a 'vendedor', 'cajero' o 'administrador'.")
        
        

#endregion
#region Setup & Auth
app = FastAPI()

ListaUsuarios = []
ListaRoles = []

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

security = HTTPBasic()

def get_current_username( credentials: Annotated[HTTPBasicCredentials, Depends(security)]):
    current_username_bytes = credentials.username.encode("utf8")
    
    user:Auth = get_usuarios_mail(credentials.username)
    if user:
        correct_username_bytes = user.email.encode("utf8")
        is_correct_username = secrets.compare_digest(current_username_bytes, correct_username_bytes)
        contrasenia = credentials.password    
        
        is_correct_password = pwd_context.verify(contrasenia, user.password)
    
        if not (is_correct_username and is_correct_password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
            		     detail="Email o password incorrecto",
                         headers={"WWW-Authenticate": "Basic"})
        
        return credentials.username
    else:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
            		     detail="Email o password incorrecto",
                         headers={"WWW-Authenticate": "Basic"})


def get_usuarios_mail(email:str):
    for item in ListaUsuarios:
            if item.email == email:
                return item
            
#endregion
#region EndPoints
#Usuario
@app.post("/usuario", tags=['Usuarios'], response_model=Usuario, status_code=status.HTTP_201_CREATED)
async def crear_usuario(usuario: Auth):
    usuario.idDuplicados(ListaUsuarios)
    usuario.emailDuplicado(ListaUsuarios)
    usuario.validar_existencia_rol(ListaRoles)
    usuario.password = pwd_context.hash(usuario.password.get_secret_value())
    ListaUsuarios.append(usuario)
    return usuario

@app.get("/usuarios", tags=['Usuarios'], response_model=List[Usuario], status_code=status.HTTP_200_OK, dependencies=[Depends(get_current_username)] )
async def obtener_usuarios():
    return ListaUsuarios


@app.get("/usuario/{id}", tags=['Usuarios'], response_model=Usuario, status_code=status.HTTP_200_OK)
async def obtener_usuario_by_id(
    id: Annotated[PositiveInt, Field(le=1000)]
):
    for usuario in ListaUsuarios:
        if usuario.id == id:
            return usuario
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")

@app.put("/usuario/{id}", tags=['Usuarios'], response_model=Usuario, status_code=status.HTTP_200_OK)
async def modificar_usuario(
    id: Annotated[PositiveInt, Field(le=1000)], usuario: Auth):
    for i in ListaUsuarios:
        if i.id == id:
            usuario.validar_existencia_rol(ListaRoles)
            if i.email != usuario.email:
                usuario.emailDuplicado(ListaUsuarios)

            usuario.password = pwd_context.hash(usuario.password.get_secret_value())
            i.nombre = usuario.nombre
            i.apellido = usuario.apellido
            i.email = usuario.email
            i.telefono = usuario.telefono
            i.idRol = usuario.idRol
            i.password = usuario.password
            return  i
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")

@app.delete("/usuario/{id}", tags=['Usuarios'], status_code=status.HTTP_200_OK)
async def eliminar_usuario(
    id: Annotated[PositiveInt, Field(le=1000)]
):
    for i in ListaUsuarios:
        if i.id == id:
            ListaUsuarios.remove(i)
            return  {"message": f"Usuario {id} borrado con exito"}
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")

#Rol
@app.post("/rol", tags=['Roles'], response_model=Rol, status_code=status.HTTP_201_CREATED)
async def crear_rol(rol: Rol):
    rol.idDuplicados(ListaRoles)
    rol.validar_rol()
    ListaRoles.append(rol)
    return rol

@app.get("/rol", tags=['Roles'], response_model=List[Rol], status_code=status.HTTP_200_OK)
async def obtener_roles():
    return ListaRoles

@app.put("/rol/{id}", tags=['Roles'], response_model=Rol, status_code=status.HTTP_200_OK)
async def modificar_rol(
    id: Annotated[PositiveInt, Field(le=1000)], rol: Rol):
    
    for i in ListaRoles:
        if i.id == id:
            i.descripcion = rol.descripcion
            Rol.validar_rol(i)
            return  i
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rol no encontrado")

@app.delete("/rol/{id}", tags=['Roles'], status_code=status.HTTP_200_OK)
async def eliminar_rol(
    id: Annotated[PositiveInt, Field(le=1000)]
):
    for i in ListaRoles:
        if i.id == id:
            ListaRoles.remove(i)
            return  {"message": f"Rol {id} borrado con exito"}
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rol no encontrado")

@app.get("/rol/{descripcion}", tags=['Roles'], response_model=List[Usuario], status_code=status.HTTP_200_OK)
async def obtener_usuarios_by_descripcion(
    descripcion: str
):
    p = 0
    listaAux = []
    for rol in ListaRoles:
        if rol.descripcion == descripcion:
            p = rol.id

        for i in ListaUsuarios:
            if i.idRol == p:
                listaAux.append(i)
    
    if listaAux != []:
        return listaAux
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Descripcion no encontrada")
#endregion