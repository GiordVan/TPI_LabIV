const url = "https://67411cfdd0b59228b7f24513.mockapi.io/Usuarios";

//API-REST USUARIOS//

async function listar(id) {
    let cadUrl;
    if(isNaN(id))
      cadUrl= url;
    else 
      cadUrl = url + "/" + id;  
    return await fetch(cadUrl)
        .then(respuesta => respuesta.json());
}

async function crear(apellido, nombre, correo, password, avatar, pais, ciudad, direccion, telefono, role="admin") {

    return await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            apellido: apellido,
            nombre: nombre,
            correo: correo,
            password: password,
            avatar: avatar,
            pais: pais,
            ciudad: ciudad,
            direccion: direccion,
            telefono:  telefono,
            role: role
        })
    })
}

async function editar(id, apellido, nombre, correo, password, avatar, pais, ciudad, direccion, telefono, role="admin") {

    let urlPut = url + "/" + id;
    return await fetch(urlPut, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            apellido: apellido,
            nombre: nombre,
            correo: correo,
            password: password,
            avatar: avatar,
            pais: pais,
            ciudad: ciudad,
            direccion: direccion,
            telefono:  telefono,
            role: role
        })
    })
}

async function borrar(id){
  
    let urlPut = url + "/" + id;
    return await fetch(urlPut, {
            method: 'DELETE'
       })
}

export const usuariosServices = {
    listar,
    crear,
    editar,
    borrar
}