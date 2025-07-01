import { getToken } from "../servicios/auth.js";

const url = "http://127.0.0.1:8000/libros";

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
        console.error("Error al obtener libros:", error);
        return [];
    }
}

async function crear(titulo, autor, isbn, editorial, categoria_id, cantidad = 1, imagen = null) {
    const body = {
        titulo,
        autor,
        isbn,
        editorial,
        categoria_id,
        cantidad, 
        imagen
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
            throw new Error(`Error al crear libro: ${JSON.stringify(errorData)}`);
        }

        return await respuesta.json();
    } catch (error) {
        console.error("Error al crear libro:", error);
        throw error;
    }
}

async function editar(id, titulo, autor, isbn, editorial, categoria_id, cantidad = 1, imagen = null) {
    const urlPut = url + "/" + id;

    const body = {
        titulo,
        autor,
        isbn,
        editorial,
        categoria_id,
        cantidad,
        imagen
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
            throw new Error(`Error al editar libro: ${JSON.stringify(errorData)}`);
        }

        return await respuesta.json();
    } catch (error) {
        console.error("Error al editar libro:", error);
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
            throw new Error(`Error al eliminar libro: ${JSON.stringify(errorData)}`);
        }

        return await respuesta.json();
    } catch (error) {
        console.error("Error al eliminar libro:", error);
        throw error;
    }
}

// Opcional: si necesitas filtrar por categoría
async function listarPorCategoria(categoria_id) {
    const newUrl = new URL(url);
    newUrl.searchParams.append('categoria_id', categoria_id);

    try {
        const respuesta = await fetch(newUrl, {
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
        console.error("Error al obtener libros por categoría:", error);
        return [];
    }
}

export const librosServices = {
    listar,
    crear,
    editar,
    borrar,
    listarPorCategoria
};