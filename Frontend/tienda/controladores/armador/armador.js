import { categoriasServices } from "../../../servicios/categorias-servicios.js";
import { productosServices } from "../../../servicios/productos-servicios.js";
import { ventasServices } from "../../../servicios/ventas-servicios.js";
import { getUsuarioAutenticado } from "../login/login.js";

export async function btnArmador() {
    let seccionLogin = document.querySelector(".seccionLogin");
    let armador = document.querySelector(".armador");

    seccionLogin.innerHTML = "";
    armador.innerHTML = "<button id='btnArmador' onclick=\"location.hash='#armador'\">¡Arma tu PC!</button>";
}

function limpiarContenido() {
    document.querySelector('.carrusel').innerHTML = '';
    document.querySelector('.seccionProductos').innerHTML = '';
    document.querySelector('.vistaProducto').innerHTML = '';
    document.querySelector(".armador").innerHTML = '';
    document.querySelector(".seccionLogin").innerHTML = '';
}

export async function armador() {
    limpiarContenido();
    const armador = document.querySelector('.armador');
    armador.innerHTML = `
        <div class="armador-container">
            <div class="categorias-lista">
                <h3>Categorías</h3>
                <ul id="categorias"></ul>
            </div>
            <div class="componentes-lista">
                <h3>Componentes</h3>
                <div id="componentes" class="componentes-grid"></div>
            </div>
            <div class="resumen">
                <h3>Resumen</h3>
                <div id="selecciones"></div>
                <p class="total" id="total">TOTAL: $0</p>
                <button id="finalizarCompra" class="btn-finalizar">Finalizar compra</button>
            </div>
        </div>
    `;

    const categorias = await categoriasServices.listar();
    const categoriasUl = document.getElementById('categorias');
    const componentesDiv = document.getElementById('componentes');
    const seleccionesDiv = document.getElementById('selecciones');
    const totalP = document.getElementById('total');
    const finalizarCompraBtn = document.getElementById('finalizarCompra');

    let seleccionados = {};
    let total = 0;

    categorias.forEach((categoria, index) => {
        const li = document.createElement('li');
        li.textContent = categoria.descripcion;
        li.dataset.id = categoria.id;
        li.addEventListener('click', async () => {
            const productos = await productosServices.listarPorCategoria(categoria.id);
            componentesDiv.innerHTML = productos.map(producto => `
                <div class="componente-card">
                    <img src="${producto.foto}" alt="${producto.nombre}" class="componente-imagen">
                    <h4 class="componente-nombre">${producto.nombre}</h4>
                    <p class="componente-precio">$${producto.precio}</p>
                    <button data-id="${producto.id}" data-nombre="${producto.nombre}" data-precio="${producto.precio}" class="btnSeleccionar">Seleccionar</button>
                </div>
            `).join('');
            activarSeleccionCategoria(li);
            agregarEventosSeleccionar(categoria, index, categorias.length);
        });
        categoriasUl.appendChild(li);
    });

    function activarSeleccionCategoria(li) {
        const lis = categoriasUl.querySelectorAll('li');
        lis.forEach(item => item.classList.remove('categoriaActiva'));
        li.classList.add('categoriaActiva');
    }

    function agregarEventosSeleccionar(categoria, currentIndex, totalCategorias) {
        const botones = document.querySelectorAll('.btnSeleccionar');
        botones.forEach(boton => {
            boton.addEventListener('click', () => {
                const id = boton.dataset.id;
                const nombre = boton.dataset.nombre;
                const precio = parseFloat(boton.dataset.precio);

                seleccionados[categoria.descripcion] = { id, nombre, precio };
                actualizarResumen();

                if (currentIndex < totalCategorias - 1) {
                    const nextCategoryLi = categoriasUl.children[currentIndex + 1];
                    nextCategoryLi.click();
                }
            });
        });
    }

    function actualizarResumen() {
        seleccionesDiv.innerHTML = '';
        total = 0;
        Object.keys(seleccionados).forEach(categoria => {
            const item = seleccionados[categoria];
            seleccionesDiv.innerHTML += `<div class="componente-seleccionado"><span>${categoria}:</span> ${item.nombre} - $${item.precio}</div>`;
            total += item.precio;
        });
        totalP.textContent = `TOTAL: $${total}`;
    }

    finalizarCompraBtn.addEventListener('click', async () => {
        const usuario = getUsuarioAutenticado();
        if (!usuario.autenticado) {
            alert("Debes iniciar sesión para finalizar la compra.");
            location.assign("tienda.html#login");
            return;
        }
    
        const fecha = new Date().toISOString().split("T")[0];
    
        try {
            for (const categoria in seleccionados) {
                const item = seleccionados[categoria];
                await ventasServices.crear(
                    usuario.idUsuario,
                    usuario.email,
                    item.id,
                    item.nombre,
                    1,
                    fecha,
                    false
                );
            }
            alert("¡Compra finalizada con éxito!");
            seleccionados = {};
            actualizarResumen();
            location.assign("tienda.html");
        } catch (error) {
            console.error("Error al finalizar la compra:", error);
            alert("Ocurrió un error al procesar la compra.");
        }
    });
}    
