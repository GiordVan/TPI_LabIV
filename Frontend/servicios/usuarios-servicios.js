const url = "http://127.0.0.1:8000/usuarios";

//API-REST USUARIOS//

function getToken() {
    return sessionStorage.getItem("token");
}

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
                contrasenia: password  // Coincide con el esquema esperado en FastAPI
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
        return []; // o null dependiendo de cómo lo manejes
    }
}

async function crear(nombre, email, contrasenia, rol) {

    const respuesta = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nombre: nombre,
            email: email,
            contrasenia: contrasenia,
            rol: rol
        })
    });

    if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(`Error en registro: ${JSON.stringify(errorData)}`);
    }

    return await respuesta.json();
}

async function editar(id, nombre, email, rol) {
    const urlPut = url + "/" + id;
    return await fetch(urlPut, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify({
            nombre: nombre,
            email: email,
            rol: rol
        })
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