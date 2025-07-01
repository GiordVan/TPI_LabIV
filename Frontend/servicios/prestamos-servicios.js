import { getToken } from "../servicios/auth.js";

const url = "http://127.0.0.1:8000/prestamos"; 

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
        console.error("Error al obtener préstamos:", error);
        return [];
    }
}

async function crear(libro_id, usuario_id, fecha_prestamo, fecha_devolucion) {
    const body = {
        libro_id,
        usuario_id,
        fecha_prestamo,
        fecha_devolucion
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
            throw new Error(`Error al crear préstamo: ${JSON.stringify(errorData)}`);
        }

        return await respuesta.json();
    } catch (error) {
        console.error("Error al crear préstamo:", error);
        throw error;
    }
}

async function editar(id, libro_id, usuario_id, fecha_prestamo, fecha_devolucion) {
    const urlPut = url + "/" + id;

    const body = {
        libro_id,
        usuario_id,
        fecha_prestamo,
        fecha_devolucion
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
            throw new Error(`Error al editar préstamo: ${JSON.stringify(errorData)}`);
        }

        return await respuesta.json();
    } catch (error) {
        console.error("Error al editar préstamo:", error);
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
            throw new Error(`Error al eliminar préstamo: ${JSON.stringify(errorData)}`);
        }

        return await respuesta.json();
    } catch (error) {
        console.error("Error al eliminar préstamo:", error);
        throw error;
    }
}

async function listarPorUsuario(usuario_id) {
    const newUrl = new URL(url);
    newUrl.searchParams.append('usuario_id', usuario_id);

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
        console.error("Error al obtener préstamos por usuario:", error);
        return [];
    }
}

export const prestamosServices = {
    listar,
    crear,
    editar,
    borrar,
    listarPorUsuario
};