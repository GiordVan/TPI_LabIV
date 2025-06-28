/**ESTE COMPONENTE SE ENCARGA DE MOSTRAR EL DETALLE DE UN PRODUCTO */
import { productosServices } from "../../../servicios/productos-servicios.js";
import { ventasServices } from "../../../servicios/ventas-servicios.js";
import { getUsuarioAutenticado } from "../login/login.js";


export async function vistaProducto() {
    const vistaProducto = document.querySelector('.vistaProducto');
    console.log("Elemento vistaProducto encontrado:", vistaProducto);

    if (!vistaProducto) {
        console.error("El contenedor .vistaProducto no se encuentra en el DOM.");
        return;
    }

    // Limpiar las secciones previas
    const carrusel = document.querySelector('.carrusel');
    const seccionProducto = document.querySelector('.seccionProductos');
    const seccionLogin = document.querySelector('.seccionLogin');
    
    carrusel.innerHTML = '';
    seccionProducto.innerHTML = '';
    seccionLogin.innerHTML = '';

    // Recuperamos el idProducto de la URL
    const idProducto = leerParametro();

    // Si no existe idProducto en la URL, redirigimos o mostramos un error
    if (!idProducto) {
        alert('Producto no encontrado');
        return;
    }

    // Leemos los detalles del producto
    const producto = await productosServices.obtenerProducto(idProducto);

    // Mostramos el detalle del producto
    if (producto) {
        const productoHTML = htmlVistaProducto(
            producto.id,
            producto.nombre,
            producto.descripcion,
            producto.precio,
            producto.imagen
        );
        vistaProducto.innerHTML = productoHTML;

        // Capturamos el botón de comprar y le enlazamos el evento
        const btnComprar = document.querySelector('#btnComprar');
        btnComprar.addEventListener('click', registrarCompra);
    }
}



function htmlVistaProducto(id, nombre, descripcion, precio, imagen) {
    return `
        <div class="productoDetalle">
            <img src="${imagen}" alt="${nombre}" class="imagenProducto">
            <h1>${nombre}</h1>
            <p>${descripcion}</p>
            <p><strong>Precio:</strong> $${precio}</p>
            <input type="number" id="cantidadProducto" value="1" min="1">
            <button id="btnComprar" data-idproducto="${id}">Comprar</button>
        </div>
    `;
}


function leerParametro() {
    const hash = location.hash;
    const params = new URLSearchParams(hash.split('?')[1]); // Divide el hash en dos partes y toma los parámetros
    return params.get('idProducto');
}






function registrarCompra() {
    // Recuperar el usuario autenticado
    const session = getUsuarioAutenticado();
    if (!session.autenticado) {
        alert('Debe iniciar sesión para realizar una compra');
        return;
    }

    // Obtener datos del producto y de la compra
    const idProducto = document.querySelector('#btnComprar').getAttribute('data-idproducto');
    const cantidad = document.querySelector('#cantidadProducto').value;
    const nombreProducto = document.querySelector('h1').textContent;
    const precio = document.querySelector('p strong').nextSibling.textContent;

    // Datos de la venta
    const idUsuario = session.id;
    const emailUsuario = session.email;
    const fecha = new Date().toISOString();

    // Crear la venta
    ventasServices.crear(idUsuario, emailUsuario, idProducto, nombreProducto, cantidad, precio, fecha)
        .then(() => {
            alert('Compra finalizada');
            location.replace("tienda.html");
        })
        .catch(error => {
            console.error('Error al registrar la compra', error);
            alert('Hubo un error al procesar su compra');
        });
}
