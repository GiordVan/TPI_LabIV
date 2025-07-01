// newCategoria.js
import { categoriasServices } from "../../../servicios/categorias-servicios.js";

export function abrirModalCategoria(categoria = null) {
    const existente = document.querySelector(".modal-overlay");
    if (existente) existente.remove();

    const modal = document.createElement("div");
    modal.classList.add("modal-overlay");
    modal.innerHTML = `
        <div class="modal">
            <h2>${categoria ? "Editar Categoría" : "Nueva Categoría"}</h2>
            <form class="form-usuario">
                <label>Nombre:
                    <input type="text" name="nombre" value="${categoria?.nombre || ""}" required>
                </label>
                <label>Descripción:
                    <textarea name="descripcion" rows="4">${categoria?.descripcion || ""}</textarea>
                </label>
                <div class="acciones">
                    <button type="submit">${categoria ? "Guardar Cambios" : "Crear Categoría"}</button>
                    <button type="button" class="btn-cancelar">Cancelar</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    const form = modal.querySelector("form");
    const btnCancelar = modal.querySelector(".btn-cancelar");
    btnCancelar.addEventListener("click", () => modal.remove());

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const datos = Object.fromEntries(new FormData(form));

        try {
            if (categoria) {
                await categoriasServices.editar(categoria.id, datos.nombre, datos.descripcion);
                alert("Categoría actualizada correctamente");
            } else {
                await categoriasServices.crear(datos.nombre, datos.descripcion);
                alert("Categoría creada correctamente");
            }
            modal.remove();
            location.reload();
        } catch (error) {
            alert("Error al guardar la categoría: " + error.message);
        }
    });
}
