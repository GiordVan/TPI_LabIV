import { librosServices } from "../../../servicios/libros-servicios.js";
import { prestamosServices } from "../../../servicios/prestamos-servicios.js"; // asumo que tienes este servicio
import { abrirModalLibro } from "./newLibro.js";

export async function libros() {
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
                <th>Título</th>
                <th>Autor</th>
                <th>ISBN</th>
                <th>Editorial</th>
                <th>Categoría</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = tabla.querySelector("tbody");

    try {
        const listaLibros = await librosServices.listar();

        listaLibros.forEach(libro => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${libro.id}</td>
                <td>${libro.titulo}</td>
                <td>${libro.autor}</td>
                <td>${libro.isbn}</td>
                <td>${libro.editorial}</td>
                <td>${libro.categoria?.nombre || "Sin categoría"}</td>
                <td>
                    <button class="btn-editar" title="Editar">✏️</button>
                    <button class="btn-borrar" title="Borrar">🗑️</button>
                </td>
            `;

            tr.querySelector(".btn-editar").addEventListener("click", () => abrirModalLibro(libro));

            tr.querySelector(".btn-borrar").addEventListener("click", async () => {
                if (confirm(`¿Estás seguro de borrar el libro '${libro.titulo}'?`)) {
                    try {
                        await librosServices.borrar(libro.id);
                        alert("Libro eliminado correctamente");
                        tr.remove();
                    } catch (err) {
                        alert("Error al eliminar libro");
                    }
                }
            });

            tbody.appendChild(tr);
        });

    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="7">Error al cargar libros</td></tr>`;
        console.error("Error al listar libros:", error);
    }

    izquierda.appendChild(tabla);

    const derecha = document.createElement("div");
    derecha.classList.add("usuarios-derecha");

    const cardCrear = document.createElement("div");
    cardCrear.classList.add("card");
    cardCrear.textContent = "➕ Crear libro";
    cardCrear.addEventListener("click", () => abrirModalLibro());
    derecha.appendChild(cardCrear);

    // --- Aquí agregamos las cards con los totales ---
    try {
        const totalLibros = await librosServices.listar();
        const totalPrestados = await prestamosServices.listar();

        const cardTotalLibros = document.createElement("div");
        cardTotalLibros.classList.add("card", "card-total");

        const textoLibros = document.createElement("p");
        textoLibros.classList.add("texto");
        textoLibros.textContent = "Número total de libros en la biblioteca:";

        const numeroLibros = document.createElement("p");
        numeroLibros.classList.add("numero");
        numeroLibros.textContent = totalLibros.length;

        cardTotalLibros.appendChild(textoLibros);
        cardTotalLibros.appendChild(numeroLibros);
        derecha.appendChild(cardTotalLibros);

        const cardTotalPrestados = document.createElement("div");
        cardTotalPrestados.classList.add("card", "card-total");

        const textoPrestados = document.createElement("p");
        textoPrestados.classList.add("texto");
        textoPrestados.textContent = "Número total de libros prestados:";

        const numeroPrestados = document.createElement("p");
        numeroPrestados.classList.add("numero");
        numeroPrestados.textContent = totalPrestados.length;

        cardTotalPrestados.appendChild(textoPrestados);
        cardTotalPrestados.appendChild(numeroPrestados);
        derecha.appendChild(cardTotalPrestados);

    } catch (error) {
        console.error("Error cargando totales:", error);
    }

    contenedor.appendChild(izquierda);
    contenedor.appendChild(derecha);
    main.appendChild(contenedor);
}
