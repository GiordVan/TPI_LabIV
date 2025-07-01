// archivo: controladores/home/solicitar-prestamo.js
import { prestamosServices } from "../../servicios/prestamos-servicios.js";
import { getUsuario } from "../../servicios/auth.js";

export function crearModalSolicitud(libro) {
    const usuario = getUsuario();

    // Si no hay usuario logeado, redireccionar al login
    if (!usuario) {
        location.hash = "#/login";
        return;
    }

    // Eliminar modal anterior si existía
    const modalExistente = document.querySelector(".modal-overlay");
    if (modalExistente) modalExistente.remove();

    const modal = document.createElement("div");
    modal.classList.add("modal-overlay");

    modal.innerHTML = `
    <div class="modal">
        <h2>Solicitar Libro</h2>
        <div class="imagen-libro" style="text-align:center; margin-bottom: 15px;">
            <img src="${libro.imagen}" alt="Portada de ${libro.titulo}" style="max-width: 200px; max-height: 300px; object-fit: contain;">
        </div>
        <form class="form-usuario form-solicitud">
            <label>Título:
                <input type="text" value="${libro.titulo}" disabled>
            </label>
            <label>Autor:
                <input type="text" value="${libro.autor}" disabled>
            </label>
            <label>Editorial:
                <input type="text" value="${libro.editorial}" disabled>
            </label>
            <label>ISBN:
                <input type="text" value="${libro.isbn}" disabled>
            </label>

            <input type="hidden" name="libro_id" value="${libro.id}" />
            <input type="hidden" name="usuario_id" value="${usuario.id}" />

            <label>Fecha Préstamo:
                <input type="date" name="fecha_prestamo" required>
            </label>
            <label>Fecha Devolución:
                <input type="date" name="fecha_devolucion" required>
            </label>

            <div class="acciones">
                <button type="submit">Confirmar Préstamo</button>
                <button type="button" class="btn-cancelar">Cancelar</button>
            </div>
        </form>
    </div>
`;


    document.body.appendChild(modal);

    const form = modal.querySelector(".form-solicitud");
    const btnCancelar = modal.querySelector(".btn-cancelar");

    btnCancelar.addEventListener("click", () => modal.remove());

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const datos = Object.fromEntries(new FormData(form));

        if (datos.fecha_devolucion <= datos.fecha_prestamo) {
            alert("La fecha de devolución debe ser posterior a la de préstamo.");
            return;
        }

        try {
            await prestamosServices.crear(
                datos.libro_id,
                datos.usuario_id,
                datos.fecha_prestamo,
                datos.fecha_devolucion
            );

            alert("Préstamo solicitado con éxito");
            modal.remove();
        } catch (error) {
            alert("Error al solicitar préstamo: " + error.message);
        }
    });
}
