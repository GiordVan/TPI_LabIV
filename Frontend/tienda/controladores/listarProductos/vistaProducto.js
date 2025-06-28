import { productosServices } from "../../../servicios/productos-servicios.js";
import { ventasServices } from "../../../servicios/ventas-servicios.js";
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

        const btnComprar = document.querySelector('#btnComprarVistaProducto');
        if (btnComprar) {
            btnComprar.addEventListener('click', registrarCompra);
        } else {
            console.error('Botón de compra no encontrado.');
        }

        window.addEventListener('popstate', manejarCambioHistorial);
    }
}

function htmlVistaProducto(id, nombre, descripcion, precio, imagen) {
    return `
        <div class="productoDetalle">
            <img src="${imagen}" alt="${nombre}" class="imagenProducto">
            <div class="detalles">
                <h2>${nombre}</h2>
                <p>${descripcion}</p>
                <p id="precioVista"><strong>Precio:</strong> $${precio}</p>
                <p>Cantidad:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="number" id="cantidadProducto" value="1" min="1"></p>
                <button class="btnComprar" id="btnComprarVistaProducto" data-idproducto="${id}">Comprar</button>
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

function registrarCompra() {
    const session = getUsuarioAutenticado();
    if (!session.autenticado) {
        alert('Debe iniciar sesión para realizar una compra');
        cerrarModal();
        login();
        return;
    }

    const idProducto = document.querySelector('#btnComprarVistaProducto').getAttribute('data-idproducto');
    const cantidad = document.querySelector('#cantidadProducto').value;
    const nombreProducto = document.querySelector('.productoDetalle h2').textContent;

    const precio = document.querySelector('#precioVista').textContent.split('$')[1];

    const idUsuario = session.id;
    const emailUsuario = session.email;

    const fecha = new Date();
    const fechaFormateada = `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}/${fecha.getFullYear()}`;

    const despachado = false;

    const datosCompra = {
        id: idUsuario,
        emailUsuario: emailUsuario,
        idProducto: idProducto,
        nombreProducto: nombreProducto,
        cantidad: cantidad,
        fecha: fechaFormateada,
        despachado: despachado
    };

    ventasServices.crear(idUsuario, emailUsuario, idProducto, nombreProducto, cantidad, fechaFormateada, despachado)
        .then(() => {
            alert('Compra finalizada');
            location.replace("tienda.html");
        })
        .catch(error => {
            console.error('Error al registrar la compra', error);
            alert('Hubo un error al procesar su compra');
        });
}
