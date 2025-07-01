import { categoriasServices } from "../../../servicios/categorias-servicios.js";
import { librosServices } from "../../../servicios/libros-servicios.js";
import { prestamosServices } from "../../../servicios/prestamos-servicios.js";
import { abrirModalCategoria } from "./newCategoria.js";

export async function categorias() {
    const main = document.querySelector("main");
    main.innerHTML = "";

    const contenedor = document.createElement("div");
    contenedor.classList.add("contenedor-usuarios");

    const izquierda = document.createElement("div");
    izquierda.classList.add("usuarios-izquierda");

    const tabla = document.createElement("table");
    tabla.classList.add("tabla-usuarios");
    tabla.innerHTML = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = tabla.querySelector("tbody");

    // Declaramos lista para usarla más abajo
    let lista = [];

    try {
        // 🔹 Cargar categorías
        lista = await categoriasServices.listar();
        lista.forEach(categoria => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${categoria.id}</td>
                <td>${categoria.nombre}</td>
                <td>${categoria.descripcion}</td>
                <td>
                    <button class="btn-editar" title="Editar">✏️</button>
                    <button class="btn-borrar" title="Borrar">🗑️</button>
                </td>
            `;

            tr.querySelector(".btn-editar").addEventListener("click", () => abrirModalCategoria(categoria));
            tr.querySelector(".btn-borrar").addEventListener("click", async () => {
                if (confirm(`¿Eliminar categoría '${categoria.nombre}'?`)) {
                    try {
                        await categoriasServices.borrar(categoria.id);
                        tr.remove();
                    } catch {
                        alert("Error al eliminar categoría");
                    }
                }
            });

            tbody.appendChild(tr);
        });

        izquierda.appendChild(tabla);

        // 🔹 Crear columna derecha
        const derecha = document.createElement("div");
        derecha.classList.add("usuarios-derecha");

        const cardCrear = document.createElement("div");
        cardCrear.classList.add("card");
        cardCrear.textContent = "➕ Crear categoría";
        cardCrear.addEventListener("click", () => abrirModalCategoria());
        derecha.appendChild(cardCrear);

        // 🔹 Obtener libros y préstamos
        const libros = await librosServices.listar();
        const prestamos = await prestamosServices.listar();

        // Mapa de libros por ID
        const mapaLibros = {};
        libros.forEach(libro => {
            mapaLibros[libro.id] = libro;
        });

        // Conteo de libros por categoría
        const cantidadPorCategoria = {};
        libros.forEach(libro => {
            const idCat = libro.categoria?.id ?? null;
            if (idCat !== null) {
                cantidadPorCategoria[idCat] = (cantidadPorCategoria[idCat] || 0) + 1;
            }
        });

        let maxLibrosCatId = null;
        let maxLibrosCantidad = -1;
        for (const [catId, count] of Object.entries(cantidadPorCategoria)) {
            if (count > maxLibrosCantidad) {
                maxLibrosCantidad = count;
                maxLibrosCatId = parseInt(catId);
            }
        }

        // Conteo de préstamos por categoría
        const prestadosPorCategoria = {};
        prestamos.forEach(prestamo => {
            const libroId = prestamo.libro_id || prestamo.libro;
            const libro = mapaLibros[libroId];
            const categoriaId = libro?.categoria?.id ?? null;

            if (categoriaId !== null) {
                prestadosPorCategoria[categoriaId] = (prestadosPorCategoria[categoriaId] || 0) + 1;
            }
        });

        let maxPrestadosCatId = null;
        let maxPrestadosCantidad = -1;
        for (const [catId, count] of Object.entries(prestadosPorCategoria)) {
            if (count > maxPrestadosCantidad) {
                maxPrestadosCantidad = count;
                maxPrestadosCatId = parseInt(catId);
            }
        }

        const catMaxLibros = lista.find(c => c.id === maxLibrosCatId);
        const catMaxPrestados = lista.find(c => c.id === maxPrestadosCatId);

        // 🔹 Función para crear tarjetas
        function crearCard(texto, numero) {
            const card = document.createElement("div");
            card.classList.add("card", "card-total");

            const pTexto = document.createElement("p");
            pTexto.classList.add("texto");
            pTexto.textContent = texto;

            const pNumero = document.createElement("p");
            pNumero.classList.add("numero");
            pNumero.textContent = numero;

            card.appendChild(pTexto);
            card.appendChild(pNumero);
            return card;
        }

        derecha.appendChild(
            crearCard("Categoría con mayor cantidad de libros:", catMaxLibros ? `${catMaxLibros.nombre} (${maxLibrosCantidad})` : "N/A")
        );

        derecha.appendChild(
            crearCard("Categoría de libros más popular (prestados):", catMaxPrestados ? `${catMaxPrestados.nombre} (${maxPrestadosCantidad})` : "N/A")
        );

        // 🔹 Agregar todo al DOM
        contenedor.appendChild(izquierda);
        contenedor.appendChild(derecha);
        main.appendChild(contenedor);

    } catch (err) {
        console.error("Error cargando categorías o estadísticas:", err);
        tbody.innerHTML = `<tr><td colspan="4">Error al cargar categorías</td></tr>`;
    }
}
