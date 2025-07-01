import { prestamosServices } from "../../../servicios/prestamos-servicios.js";
import { librosServices } from "../../../servicios/libros-servicios.js";
import { usuariosServices } from "../../../servicios/usuarios-servicios.js";

export async function abrirModalPrestamo(prestamo = null) {
    // Eliminar modal previo
    const modalExistente = document.querySelector(".modal-overlay");
    if (modalExistente) modalExistente.remove();

    // Obtener libros y usuarios para los <select>
    const libros = await librosServices.listar();
    const usuarios = await usuariosServices.listar();

    // Crear el modal
    const modal = document.createElement("div");
    modal.classList.add("modal-overlay");
    modal.innerHTML = `
        <div class="modal">
            <h2>${prestamo ? "Editar Préstamo" : "Nuevo Préstamo"}</h2>
            <form class="form-usuario">
                <label>Libro:
                    <select name="libro_id" required>
                        <option value="">Seleccione un libro</option>
                        ${libros.map(libro => `
                            <option value="${libro.id}" ${prestamo?.libro_id == libro.id ? "selected" : ""}>${libro.titulo}</option>
                        `).join("")}
                    </select>
                </label>

                <label>Usuario:
                    <select name="usuario_id" required>
                        <option value="">Seleccione un usuario</option>
                        ${usuarios.map(usuario => `
                            <option value="${usuario.id}" ${prestamo?.usuario_id == usuario.id ? "selected" : ""}>${usuario.nombre}</option>
                        `).join("")}
                    </select>
                </label>

                <label>Fecha Préstamo:
                    <input type="date" name="fecha_prestamo" value="${prestamo?.fecha_prestamo || ""}" required>
                </label>

                <label>Fecha Devolución:
                    <input type="date" name="fecha_devolucion" value="${prestamo?.fecha_devolucion || ""}">
                </label>

                <div class="acciones">
                    <button type="submit">${prestamo ? "Guardar Cambios" : "Crear Préstamo"}</button>
                    <button type="button" class="btn-cancelar">Cancelar</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    const form = modal.querySelector(".form-usuario"); // reutilizamos clase
    const btnCancelar = modal.querySelector(".btn-cancelar");

    btnCancelar.addEventListener("click", () => modal.remove());

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const datos = Object.fromEntries(new FormData(form));

        try {
            if (prestamo) {
                await prestamosServices.editar(
                    prestamo.id,
                    datos.libro_id,
                    datos.usuario_id,
                    datos.fecha_prestamo,
                    datos.fecha_devolucion
                );
                alert("Préstamo actualizado correctamente");
            } else {
                await prestamosServices.crear(
                    datos.libro_id,
                    datos.usuario_id,
                    datos.fecha_prestamo,
                    datos.fecha_devolucion
                );
                alert("Préstamo creado correctamente");
            }

            modal.remove();
            location.reload();
        } catch (error) {
            alert("Error al guardar préstamo: " + error.message);
        }
    });
}
