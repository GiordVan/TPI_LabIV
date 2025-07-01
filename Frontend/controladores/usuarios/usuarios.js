import { usuariosServices } from "../../../servicios/usuarios-servicios.js";
import { abrirModalUsuario } from "./newUsuario.js";

export async function usuarios() {
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
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = tabla.querySelector("tbody");

    try {
        const listaUsuarios = await usuariosServices.listar();

        listaUsuarios.forEach(usuario => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${usuario.id}</td>
                <td>${usuario.nombre}</td>
                <td>${usuario.email}</td>
                <td>${usuario.rol}</td>
                <td>
                    <button class="btn-editar" title="Editar">✏️</button>
                    <button class="btn-borrar" title="Borrar">🗑️</button>
                </td>
            `;

            const btnEditar = tr.querySelector(".btn-editar");
            btnEditar.addEventListener("click", () => abrirModalUsuario(usuario));

            const btnBorrar = tr.querySelector(".btn-borrar");
            btnBorrar.addEventListener("click", async () => {
                const confirmar = confirm(`¿Estás seguro de borrar al usuario ${usuario.nombre}?`);
                if (!confirmar) return;

                try {
                    await usuariosServices.borrar(usuario.id);
                    alert("Usuario eliminado correctamente");
                    tr.remove();
                } catch (err) {
                    alert("Error al eliminar usuario");
                }
            });

            tbody.appendChild(tr);
        });

    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="5">Error al cargar usuarios</td></tr>`;
        console.error("Error al listar usuarios:", error);
    }

    izquierda.appendChild(tabla);

    const derecha = document.createElement("div");
    derecha.classList.add("usuarios-derecha");

    const cardCrear = document.createElement("div");
    cardCrear.classList.add("card");
    cardCrear.textContent = "➕ Crear usuario";
    cardCrear.addEventListener("click", () => abrirModalUsuario());
    derecha.appendChild(cardCrear);

    let total = 0, clientes = 0, bibliotecarios = 0;
try {
    const listaUsuarios = await usuariosServices.listar();
    total = listaUsuarios.length;
    clientes = listaUsuarios.filter(u => u.rol === "cliente").length;
    bibliotecarios = listaUsuarios.filter(u => u.rol === "bibliotecario").length;
} catch (e) {
    console.error("Error al contar usuarios:", e);
}

const cardTotal = document.createElement("div");
cardTotal.classList.add("card", "card-total");

const texto = document.createElement("p");
texto.classList.add("texto");
texto.textContent = "Número de usuarios registrados:";

const numero = document.createElement("p");
numero.classList.add("numero");
numero.textContent = total;

cardTotal.appendChild(texto);
cardTotal.appendChild(numero);

derecha.appendChild(cardTotal);




    contenedor.appendChild(izquierda);
    contenedor.appendChild(derecha);

    main.appendChild(contenedor);
}
