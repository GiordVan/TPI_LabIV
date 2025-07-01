import { usuariosServices } from "../../../servicios/usuarios-servicios.js";

export function abrirModalUsuario(usuario = null) {
    const modalExistente = document.querySelector(".modal-overlay");
    if (modalExistente) modalExistente.remove();

    const modal = document.createElement("div");
    modal.classList.add("modal-overlay");
    modal.innerHTML = `
    <div class="modal">
        <h2>${usuario ? "Editar Usuario" : "Nuevo Usuario"}</h2>
        <form class="form-usuario">
            <label>Nombre:
                <input type="text" name="nombre" value="${usuario?.nombre || ""}" required>
            </label>
            <label>Email:
                <input type="email" name="email" value="${usuario?.email || ""}" required>
            </label>
            <label>Contraseña:
                <input type="password" name="contrasenia" placeholder="${usuario ? 'Opcional' : ''}" ${usuario ? "" : "required"}>
            </label>
            <label>Rol:
                <select name="rol" required>
                    <option value="">Selecciona un rol</option>
                    <option value="Cliente" ${usuario?.rol === "Cliente" ? "selected" : ""}>Cliente</option>
                    <option value="Bibliotecario" ${usuario?.rol === "Bibliotecario" ? "selected" : ""}>Bibliotecario</option>
                </select>
            </label>
            <label>Imagen (URL):
                <input type="url" name="imagen" value="${usuario?.imagen || ""}">
            </label>
            <div class="acciones">
                <button type="submit">${usuario ? "Guardar Cambios" : "Crear Usuario"}</button>
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
            if (usuario) {
                await usuariosServices.editar(usuario.id, datos.nombre, datos.email, datos.rol, datos.imagen);
                alert("Usuario actualizado correctamente");
            } else {
                await usuariosServices.crear(datos.nombre, datos.email, datos.contrasenia, datos.rol, datos.imagen);
                alert("Usuario creado correctamente");
            }
            modal.remove();
            location.reload();
        } catch (error) {
            alert("Error al guardar usuario: " + error.message);
        }
    });
}
