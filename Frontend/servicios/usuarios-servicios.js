import { getToken } from "../servicios/auth.js";

const url = "http://127.0.0.1:8000/usuarios";

async function login(email, password) {
    const urlLogin = "http://127.0.0.1:8000/login";

    try {
        const respuesta = await fetch(urlLogin, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                contrasenia: password
            })
        });

        if (!respuesta.ok) {
            throw new Error("Error en autenticación");
        }

        return await respuesta.json();
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        return null;
    }
}


async function listar(id) {
    let cadUrl = url;

    if (typeof id !== 'undefined' && !isNaN(id)) {
        cadUrl += "/" + id;
    }

    try {
        const respuesta = await fetch(cadUrl, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken() }`
            }
        });

        if (!respuesta.ok) {
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }

        return await respuesta.json();
    } catch (error) {
        console.error("Error al obtener datos:", error);
        return []; 
    }
}

async function crear(nombre, email, contrasenia, rol, imagen) {
    const body = {
        nombre,
        email,
        contrasenia,
        rol
    };

    if (imagen && imagen.trim() !== "") {
        body.imagen = imagen;
    }

    const respuesta = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(`Error en registro: ${JSON.stringify(errorData)}`);
    }

    return await respuesta.json();
}

async function editar(id, nombre, email, rol, imagen) {
    const urlPut = url + "/" + id;

    const body = {
        nombre,
        email,
        rol
    };

    if (imagen && imagen.trim() !== "") {
        body.imagen = imagen;
    }

    return await fetch(urlPut, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify(body)
    });
}

async function borrar(id){
    const urlPut = url + "/" + id;
    return await fetch(urlPut, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        }
    });
}

export const usuariosServices = {
    listar,
    crear,
    editar,
    borrar,
    login
};