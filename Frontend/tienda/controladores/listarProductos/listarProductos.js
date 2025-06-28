import { categoriasServices } from "../../../servicios/categorias-servicios.js";
import { productosServices } from "../../../servicios/productos-servicios.js";

function htmlCategoria(id, categoria){
    /*ESTA FUNCION RECIBE DOS PARAMETROS ID Y CATEGORIA*/
    /*EN ESTA SE GENERA UNA CADENA DE CARACTERES CON EL CODIGO HTML CORRESPONDIENTE A LA CATEGORIA (ESTA EN ASSETS/MODULOS/listarProducto.html)*/
    /*SE DEBERÁ CONCATENAR PARA INCORPORAR EL id DE LA CATEGORIA AL ATRIBUTO data-idCategoria  */
    /*Y ADEMAS REEMPLAZAR EL TEXTO Nombre de Categoría POR EL VALOR QUE LLEGA AL PARAMETRO CATEGORIA DE LA FUNCION*/
    /*POR ULTIMO, LA FUNCION DEVOLVERA LA CADENA RESULTANTE*/   
    
    return `
        <div class="categoria" data-idCategoria="${id}">
            <h2>${categoria}</h2>
            <div class="productos"></div>
        </div>
    `;

}

function htmlItemProducto(id, imagen, nombre, precio) {
    return `
        <div class="itemProducto" data-idProducto="${id}">
            <h3 class="productoNombre">${nombre}</h3>
            <img src="${imagen}" alt="${nombre}" class="productoImagen">
            <p class="productoPrecio">$${precio}</p>
            <button class="btnComprar" data-idProducto="${id}">Comprar</button>
        </div>
    `;
}



async function asignarProducto(id) {
    try {
        const productos = await productosServices.listarPorCategoria(id);
        let productosHTML = '';

        productos.forEach(producto => {
            productosHTML += htmlItemProducto(
                producto.id,
                producto.imagen,
                producto.nombre,
                producto.precio
            );
        });

        const contenedor = document.querySelector(`[data-idCategoria="${id}"] .productos`);
        if (contenedor) {
            contenedor.innerHTML = productosHTML;
        }

        // Asegurarse de que los botones estén disponibles y asignar el evento cuando el DOM esté listo
        document.addEventListener('DOMContentLoaded', () => {
            const botonesComprar = document.querySelectorAll('.btnComprar');
            console.log('Botones de comprar:', botonesComprar); // Verifica si los botones están siendo seleccionados
            botonesComprar.forEach(boton => {
                boton.addEventListener('click', function() {
                    const idProducto = boton.getAttribute('data-idProducto');
                    console.log('Botón comprar clickeado, ID del producto:', idProducto); // Verifica si el clic se detecta
                    location.hash = `#vistaProducto?idProducto=${idProducto}`;
                });
            });
        });

    } catch (error) {
        console.error(`Error al asignar productos para la categoría ${id}:`, error);
    }
}

export async function listarProductos() {
    console.log("Listando productos...");  // Verifica si se ejecuta esta línea
    try {
        const seccionProductos = document.querySelector('.seccionProductos');
        const categorias = await categoriasServices.listar(); // Obtener categorías

        seccionProductos.innerHTML = ''; // Limpiar contenido previo
        console.log("Categorías obtenidas:", categorias);  // Asegúrate de que las categorías se obtienen correctamente

        for (const categoria of categorias) {
            const categoriaHTML = htmlCategoria(categoria.id, categoria.descripcion); // Mostrar categorías
            seccionProductos.innerHTML += categoriaHTML;
            
            // Obtener productos de cada categoría
            const productos = await productosServices.listarPorCategoria(categoria.id);
            let productosHTML = '';
            console.log(`Productos para la categoría ${categoria.descripcion}:`, productos);  // Verifica los productos

            productos.forEach(producto => {
                // Verifica si el producto pertenece a la categoría actual
                if (producto.idCategoria === categoria.id) {
                    productosHTML += htmlItemProducto(
                        producto.id,
                        producto.foto,
                        producto.nombre,
                        producto.precio
                    );
                }
            });

            // Insertar productos debajo de cada categoría
            const contenedorProductos = document.querySelector(`[data-idCategoria="${categoria.id}"] .productos`);
            if (contenedorProductos) {
                contenedorProductos.innerHTML = productosHTML;
            }
        }

        // Verifica si los botones "Comprar" están en el DOM antes de asignarles eventos
        const botonesComprar = document.querySelectorAll('.btnComprar');
        console.log("Botones Comprar encontrados:", botonesComprar);  // Si está vacío, no se están generando los botones correctamente

        botonesComprar.forEach(boton => {
            boton.addEventListener('click', function() {
                const idProducto = boton.getAttribute('data-idProducto');
                console.log('Botón comprar clickeado, ID del producto:', idProducto);
                location.hash = `#vistaProducto?idProducto=${idProducto}`;
            });
        });

    } catch (error) {
        console.error('Error al listar productos:', error);
    }
}


 
