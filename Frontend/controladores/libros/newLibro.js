import { librosServices } from "../../../servicios/libros-servicios.js";
import { categoriasServices } from "../../../servicios/categorias-servicios.js";

export async function abrirModalLibro(libro = null) {
    const modalExistente = document.querySelector(".modal-overlay");
    if (modalExistente) modalExistente.remove();

    const categorias = await categoriasServices.listar();

    const modal = document.createElement("div");
    modal.classList.add("modal-overlay");
    modal.innerHTML = `
        <div class="modal">
            <h2>${libro ? "Editar Libro" : "Nuevo Libro"}</h2>
            <form class="form-usuario">
                <label>Título:
                    <input type="text" name="titulo" value="${libro?.titulo || ""}" required>
                </label>
                <label>Autor:
                    <input type="text" name="autor" value="${libro?.autor || ""}" required>
                </label>
                <label>ISBN:
                    <input type="text" name="isbn" value="${libro?.isbn || ""}" required>
                </label>
                <label>Editorial:
                    <input type="text" name="editorial" value="${libro?.editorial || ""}">
                </label>
                <label>Categoría:
                    <select name="categoria_id" required>
                        <option value="">Selecciona una categoría</option>
                        ${categorias.map(cat => `
                            <option value="${cat.id}" ${libro?.categoria_id == cat.id ? "selected" : ""}>${cat.nombre}</option>
                        `).join('')}
                    </select>
                </label>
                <label>Imagen (URL):
    <input type="url" name="imagen" value="${libro?.imagen || ""}">
</label>
                <div class="acciones">
                    <button type="submit">${libro ? "Guardar Cambios" : "Crear Libro"}</button>
                    <button type="button" class="btn-cancelar">Cancelar</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    const form = modal.querySelector(".form-usuario");
    const btnCancelar = modal.querySelector(".btn-cancelar");

    btnCancelar.addEventListener("click", () => modal.remove());

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const datos = Object.fromEntries(new FormData(form));

        try {
            if (libro) {
                await librosServices.editar(libro.id, datos.titulo, datos.autor, datos.isbn, datos.editorial, datos.categoria_id, 1, datos.imagen);
                alert("Libro actualizado correctamente");
            } else {
                await librosServices.crear(datos.titulo, datos.autor, datos.isbn, datos.editorial, datos.categoria_id, 1, datos.imagen);
                alert("Libro creado correctamente");
            }
            modal.remove();
            location.reload();
        } catch (error) {
            alert("Error al guardar libro: " + error.message);
        }
    });
}
