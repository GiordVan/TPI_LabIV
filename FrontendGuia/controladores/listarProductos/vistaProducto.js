import { productosServices } from "../../servicios/productos-servicios.js";
import { ventasServices } from "../../servicios/ventas-servicios.js";
import { getUsuarioAutenticado, login } from "../login/login.js";

export async function vistaProducto() {
    const modalVistaProducto = document.querySelector('#modalVistaProducto');
    const vistaProducto = document.querySelector('.vistaProducto');

    if (!vistaProducto || !modalVistaProducto) {
        console.error("El contenedor o el modal no se encuentran en el DOM.");
        return;
    }

    const idProducto = leerParametro();

    if (!idProducto) {
        alert('Producto no encontrado');
        return;
    }

    const producto = await productosServices.listar(idProducto);

    if (producto) {
        const productoHTML = htmlVistaProducto(
            producto.id,
            producto.nombre,
            producto.descripcion,
            producto.precio,
            producto.foto
        );
        vistaProducto.innerHTML = productoHTML;

        modalVistaProducto.classList.remove('oculto');

        const closeModal = document.querySelector('#closeModal');
        if (closeModal) {
            closeModal.addEventListener('click', cerrarModal);
        } else {
            console.error('Botón de cerrar no encontrado.');
        }

        const btnSolicitar = document.querySelector('#btnComprarVistaProducto');
        if (btnSolicitar) {
            btnSolicitar.addEventListener('click', registrarSolicitud);
        } else {
            console.error('Botón de solicitud no encontrado.');
        }

        window.addEventListener('popstate', manejarCambioHistorial);
    }
}

function htmlVistaProducto(id, nombre, descripcion, precio, imagen) {
    // Fecha actual en formato ISO para valor por defecto en input type="date"
    const hoy = new Date();
    const fechaActualISO = hoy.toISOString().split('T')[0]; // yyyy-mm-dd

    return `
        <div class="productoDetalle">
            <img src="${imagen}" alt="${nombre}" class="imagenProducto">
            <div class="detalles">
                <h2>${nombre}</h2>
                <p>${descripcion}</p>
                <p id="precioVista"><strong>Precio:</strong> $${precio}</p>

                <!-- Fecha de solicitud tipo date editable con valor por defecto hoy -->
                <p>
                    Fecha de solicitud:&nbsp;&nbsp;&nbsp;
                    <input type="date" id="fechaSolicitud" value="${fechaActualISO}" />
                </p>

                <!-- Fecha de devolución tipo date vacía inicialmente -->
                <p>
                    Fecha de devolución:&nbsp;&nbsp;&nbsp;
                    <input type="date" id="fechaDevolucion" />
                </p>

                <button class="btnComprar" id="btnComprarVistaProducto" data-idproducto="${id}">Solicitar</button>
            </div>
        </div>
    `;
}

function leerParametro() {
    const hash = location.hash;
    const params = new URLSearchParams(hash.split('?')[1]);
    return params.get('idProducto');
}

function cerrarModal() {
    const modalVistaProducto = document.querySelector('#modalVistaProducto');
    const vistaProducto = document.querySelector('.vistaProducto');

    if (modalVistaProducto) modalVistaProducto.classList.add('oculto');
    if (vistaProducto) vistaProducto.innerHTML = '';

    history.replaceState(null, '', 'tienda.html');
}

function manejarCambioHistorial() {
    const hash = location.hash;

    if (hash === '' || hash === '#') {
        cerrarModal();
    }
}

// Función para convertir fecha ISO (yyyy-mm-dd) a dd/mm/yyyy sin problemas de zona horaria
function isoADDMYYYY(fechaISO) {
    const partes = fechaISO.split('-'); // ["2025", "06", "08"]
    const año = partes[0];
    const mes = partes[1];
    const dia = partes[2];
    return `${dia}/${mes}/${año}`;
}

function registrarSolicitud() {
    const session = getUsuarioAutenticado();

    if (!session.autenticado) {
        alert('Debe iniciar sesión para realizar una solicitud');
        cerrarModal();
        login();
        return;
    }

    const idProducto = document.querySelector('#btnComprarVistaProducto').getAttribute('data-idproducto');
    const nombreProducto = document.querySelector('.productoDetalle h2').textContent;

    // Leer fechas en formato ISO yyyy-mm-dd
    const fechaSolicitud = document.getElementById('fechaSolicitud').value;
    const fechaDevolucion = document.getElementById('fechaDevolucion').value;

    if (!fechaSolicitud) {
        alert('Por favor ingrese una fecha de solicitud');
        return;
    }

    if (!fechaDevolucion) {
        alert('Por favor ingrese una fecha de devolución');
        return;
    }

    const idUsuario = session.idUsuario;
    const emailUsuario = session.email;

    const despachado = false;

    // Convertir fechas a formato dd/mm/yyyy usando la función corregida
    const fechaSolicitudDDMMYYYY = isoADDMYYYY(fechaSolicitud);
    const fechaDevolucionDDMMYYYY = isoADDMYYYY(fechaDevolucion);

    const datosSolicitud = {
        idUsuario,
        emailUsuario,
        idProducto,
        nombreProducto,
        fechaSolicitud: fechaSolicitudDDMMYYYY,
        fechaDevolucion: fechaDevolucionDDMMYYYY,
        despachado
    };

    ventasServices.crear(
        idUsuario,
        emailUsuario,
        idProducto,
        nombreProducto,
        fechaSolicitudDDMMYYYY,
        fechaDevolucionDDMMYYYY,
        despachado
    )
    .then(() => {
        guardarSolicitudLocal(datosSolicitud);
        alert('Solicitud registrada');
        location.replace("tienda.html");
    })
    .catch(error => {
        console.error('Error al registrar la solicitud', error);
        alert('Hubo un error al procesar su solicitud');
    });
}

function guardarSolicitudLocal(solicitud) {
    const key = `solicitudes_usuario_${solicitud.idUsuario}`;
    let solicitudes = JSON.parse(localStorage.getItem(key)) || [];
    solicitudes.push(solicitud);
    localStorage.setItem(key, JSON.stringify(solicitudes));
}
