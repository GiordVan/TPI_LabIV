import { getToken } from "../servicios/auth.js";

const url = "http://127.0.0.1:8000/categorias";

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
                "Authorization": `Bearer ${getToken()}`
            }
        });

        if (!respuesta.ok) {
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }

        return await respuesta.json();
    } catch (error) {
        console.error("Error al obtener categorías:", error);
        return [];
    }
}

async function crear(nombre, descripcion) {
    const body = {
        nombre,
        descripcion
    };

    try {
        const respuesta = await fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
            body: JSON.stringify(body)
        });

        if (!respuesta.ok) {
            const errorData = await respuesta.json();
            throw new Error(`Error al crear categoría: ${JSON.stringify(errorData)}`);
        }

        return await respuesta.json();
    } catch (error) {
        console.error("Error al crear categoría:", error);
        throw error;
    }
}

async function editar(id, nombre, descripcion) {
    const urlPut = url + "/" + id;

    const body = {
        nombre,
        descripcion
    };

    try {
        const respuesta = await fetch(urlPut, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
            body: JSON.stringify(body)
        });

        if (!respuesta.ok) {
            const errorData = await respuesta.json();
            throw new Error(`Error al editar categoría: ${JSON.stringify(errorData)}`);
        }

        return await respuesta.json();
    } catch (error) {
        console.error("Error al editar categoría:", error);
        throw error;
    }
}

async function borrar(id){
    const urlPut = url + "/" + id;

    try {
        const respuesta = await fetch(urlPut, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            }
        });

        if (!respuesta.ok) {
            const errorData = await respuesta.json();
            throw new Error(`Error al eliminar categoría: ${JSON.stringify(errorData)}`);
        }

        return await respuesta.json();
    } catch (error) {
        console.error("Error al eliminar categoría:", error);
        throw error;
    }
}

export const categoriasServices = {
    listar,
    crear,
    editar,
    borrar
};