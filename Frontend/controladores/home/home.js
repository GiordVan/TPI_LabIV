import { librosServices } from "../../servicios/libros-servicios.js";
import { categoriasServices } from "../../servicios/categorias-servicios.js";
import { crearModalSolicitud } from "./solicitar-prestamo.js";
import { getUsuario } from "../../servicios/auth.js";

async function cargarCategorias() {
    try {
        const categorias = await categoriasServices.listar();
        
        filtroCategoria.innerHTML = `<option value="">Todas las categorías</option>`;
        
        categorias.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.id;
            option.textContent = cat.nombre;
            filtroCategoria.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar categorías:", error);
    }
}

async function cargarLibros() {
    try {
        const libros = await librosServices.listar();
        renderizarLibros(libros); 
    } catch (error) {
        console.error("Error al cargar libros:", error);
    }
}


async function cargarLibrosPorCategoria(categoriaId) {
    try {
        const todos = await librosServices.listar(); 
        const filtrados = todos.filter(libro => libro.categoria.id === parseInt(categoriaId));
        renderizarLibros(filtrados);
    } catch (error) {
        console.error("Error al filtrar libros:", error);
    }
}


function renderizarLibros(libros) {
    listaLibros.innerHTML = "";

    if (libros.length === 0) {
        listaLibros.innerHTML = "<p>No hay libros disponibles.</p>";
        return;
    }

    const ordenados = libros.slice().sort((a, b) => {
        const aSinStock = a.cantidad === 0;
        const bSinStock = b.cantidad === 0;
        return aSinStock - bSinStock;
    });

    ordenados.forEach(libro => {
        const div = document.createElement("div");
        div.classList.add("libro");

        const img = document.createElement("img");
        img.src = libro.imagen || "../../assets/img/LibroSinFoto.webp";
        img.alt = libro.titulo;

        const titulo = document.createElement("h4");
        titulo.textContent = libro.titulo;

        const autor = document.createElement("h3");
        autor.textContent = "Autor: " + libro.autor;

        const boton = document.createElement("button");
        const usuario = getUsuario();

        if (libro.cantidad === 0) {
            boton.textContent = "Sin stock";
            boton.disabled = true;
            boton.style.backgroundColor = "gray";
            img.style.filter = "grayscale(100%)";
            boton.title = "Este libro no está disponible actualmente";
        } else {
            boton.textContent = "Solicitar";
            boton.addEventListener("click", () => {
                crearModalSolicitud(libro);
            });

            if (!usuario) {
                boton.disabled = true;
                boton.title = "Debes iniciar sesión para solicitar un libro";
            }
        }

        div.appendChild(img);
        div.appendChild(titulo);
        div.appendChild(autor);
        div.appendChild(boton);

        listaLibros.appendChild(div);
    });
}



let listaLibros;
let filtroCategoria;

export async function Home() {
    const main = document.querySelector("main");
    main.innerHTML = `
      <div class="filtro-contenedor">
        <h3 class="filtro-titulo">Filtro por título o autor:</h3>
        <input type="text" id="filtro-busqueda" placeholder="Buscar por título o autor..."/>
        <h3 class="filtro-titulo">Filtro por categoría:</h3>
        <select id="filtro-categoria"></select>
      </div>
      <div id="lista-libros"></div>
    `;

    filtroCategoria = document.getElementById("filtro-categoria");
    listaLibros = document.getElementById("lista-libros");

    try {
        await cargarCategorias();
        await cargarLibros();
    } catch (error) {
        console.error("Error cargando Home:", error);
    }

    const inputBusqueda = document.getElementById("filtro-busqueda");

    inputBusqueda.addEventListener("input", aplicarFiltros);
    filtroCategoria.addEventListener("change", aplicarFiltros);
}



async function aplicarFiltros() {
    try {
        const texto = document.getElementById("filtro-busqueda").value.toLowerCase();
        const categoriaId = filtroCategoria.value;

        const libros = await librosServices.listar();

        const filtrados = libros.filter(libro => {
            const coincideTexto =
                libro.titulo.toLowerCase().includes(texto) ||
                libro.autor.toLowerCase().includes(texto);

            const coincideCategoria = categoriaId === "" || libro.categoria.id === parseInt(categoriaId);

            return coincideTexto && coincideCategoria;
        });

        renderizarLibros(filtrados);
    } catch (error) {
        console.error("Error aplicando filtros:", error);
    }
}
