import { categoriasServices } from "../../../servicios/categorias-servicios.js";
import { productosServices } from "../../../servicios/productos-servicios.js";

function htmlCategoria(id, categoria) {
    return `
        <div class="categoria" data-idCategoria="${id}">
            <div class="categoriaHeader">
                <h2>${categoria}</h2>
            </div>
            <div class="productos"></div>
        </div>
    `;
}

function htmlItemProducto(id, imagen, nombre, precio) {
    return `
    <div class="cardProducto">
        <div class="itemProducto" data-idProducto="${id}">
            <h3 class="productoNombre">${nombre}</h3>
            <img src="${imagen}" alt="${nombre}" class="productoImagen">
            <div class="decoracionLinea"></div>
            <p class="productoPrecio">$${precio}</p>
            <button class="btnComprar" data-idProducto="${id}">Comprar</button>
        </div>
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

        const botonesComprar = document.querySelectorAll('.btnComprar');
        botonesComprar.forEach(boton => {
            boton.addEventListener('click', function () {
                const idProducto = boton.getAttribute('data-idProducto');
                location.hash = `#vistaProducto?idProducto=${idProducto}`;
            });
        });

    } catch (error) {
        console.error(`Error al asignar productos para la categoría ${id}:`, error);
    }
}

export async function listarProductos() {
    try {
        const seccionProductos = document.querySelector('.seccionProductos');
        const loaderContainer = document.getElementById('loaderContainer'); 
        loaderContainer.classList.remove('oculto'); 

        const categorias = await categoriasServices.listar(); 

        seccionProductos.innerHTML = ''; 

        const textoSeleccionarCategoria = `<h2 id="tituloCategorias">Categorías:</h2>`;
        seccionProductos.innerHTML += textoSeleccionarCategoria;

        let botonesCategoriasHTML = `
            <div class="btnCategoriaContenedor">
                <button class="btnCategoria categoriaActiva" data-idCategoria="todas">Todas</button>
            </div>
        `;
        categorias.forEach(categoria => {
            botonesCategoriasHTML += `
                <button class="btnCategoria" data-idCategoria="${categoria.id}">${categoria.descripcion}</button>
            `;
        });
        seccionProductos.innerHTML += `<div class="botonesCategorias">${botonesCategoriasHTML}</div>`;

        for (const categoria of categorias) {
            const categoriaHTML = htmlCategoria(categoria.id, categoria.descripcion);
            seccionProductos.innerHTML += categoriaHTML;

            const productos = await productosServices.listarPorCategoria(categoria.id); 
            let productosHTML = '';

            productos.forEach(producto => {
                if (producto.idCategoria === categoria.id) {
                    productosHTML += htmlItemProducto(
                        producto.id,
                        producto.foto,
                        producto.nombre,
                        producto.precio
                    );
                }
            });

            const contenedorProductos = document.querySelector(`[data-idCategoria="${categoria.id}"] .productos`);
            if (contenedorProductos) {
                contenedorProductos.innerHTML = productosHTML;
            }
        }

        const botonesComprar = document.querySelectorAll('.btnComprar');
        botonesComprar.forEach(boton => {
            boton.addEventListener('click', function (event) {
                event.preventDefault();
                const idProducto = boton.getAttribute('data-idProducto');
                location.hash = `#vistaProducto?idProducto=${idProducto}`;
            });
        });

        const botonesCategoria = document.querySelectorAll('.btnCategoria');
        botonesCategoria.forEach(boton => {
            boton.addEventListener('click', function () {
                const idCategoria = boton.getAttribute('data-idCategoria');

                if (boton.classList.contains('categoriaActiva')) {
                    activarCategoriaTodas();
                    return;
                }

                botonesCategoria.forEach(boton => {
                    boton.classList.remove('categoriaActiva');
                });

                boton.classList.add('categoriaActiva');

                if (idCategoria === 'todas') {
                    mostrarTodasLasCategorias();
                } else {
                    filtrarProductosPorCategoria(idCategoria);
                }
            });
        });

    } catch (error) {
        console.error('Error al listar productos:', error);
    } finally {
        const loaderContainer = document.getElementById('loaderContainer'); // Contenedor del loader
        loaderContainer.classList.add('oculto'); // Ocultar loader
    }
}



function mostrarTodasLasCategorias() {
    const todasLasCategorias = document.querySelectorAll('.categoria');
    todasLasCategorias.forEach(categoria => {
        categoria.classList.remove('oculto');
    });
}

function filtrarProductosPorCategoria(idCategoria) {
    const todasLasCategorias = document.querySelectorAll('.categoria');
    todasLasCategorias.forEach(categoria => {
        const categoriaId = categoria.getAttribute('data-idCategoria');
        if (categoriaId === idCategoria) {
            categoria.classList.remove('oculto');
        } else {
            categoria.classList.add('oculto');
        }
    });
}

function activarCategoriaTodas() {
    const botonTodas = document.querySelector('.btnCategoria[data-idCategoria="todas"]');
    if (botonTodas) {
        botonTodas.click();
    }
}

