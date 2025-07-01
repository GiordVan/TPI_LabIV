import { prestamosServices } from "../../../servicios/prestamos-servicios.js";
import { abrirModalPrestamo } from "./newPrestamo.js";
import { librosServices } from "../../../servicios/libros-servicios.js";
import { usuariosServices } from "../../../servicios/usuarios-servicios.js";

export async function prestamos() {
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
                <th>Libro</th>
                <th>Usuario</th>
                <th>Fecha Préstamo</th>
                <th>Fecha Devolución</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = tabla.querySelector("tbody");

    const derecha = document.createElement("div");
    derecha.classList.add("usuarios-derecha");

    const cardCrear = document.createElement("div");
    cardCrear.classList.add("card");
    cardCrear.textContent = "➕ Crear préstamo";
    cardCrear.addEventListener("click", () => abrirModalPrestamo());
    derecha.appendChild(cardCrear);

    try {
        const [listaPrestamos, listaLibros, listaUsuarios] = await Promise.all([
            prestamosServices.listar(),
            librosServices.listar(),
            usuariosServices.listar()
        ]);

        listaPrestamos.forEach(prestamo => {
            const libro = listaLibros.find(l => l.id === prestamo.libro_id);
            const usuario = listaUsuarios.find(u => u.id === prestamo.usuario_id);

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${prestamo.id}</td>
                <td>${libro?.titulo || 'Desconocido'}</td>
                <td>${usuario?.nombre || 'Desconocido'}</td>
                <td>${prestamo.fecha_prestamo}</td>
                <td>${prestamo.fecha_devolucion || '-'}</td>
                <td>
                    <button class="btn-editar" title="Editar">✏️</button>
                    <button class="btn-borrar" title="Borrar">🗑️</button>
                </td>
            `;

            const btnEditar = tr.querySelector(".btn-editar");
            btnEditar.addEventListener("click", () => abrirModalPrestamo(prestamo));

            const btnBorrar = tr.querySelector(".btn-borrar");
            btnBorrar.addEventListener("click", async () => {
                const confirmar = confirm(`¿Estás seguro de borrar el préstamo #${prestamo.id}?`);
                if (!confirmar) return;

                try {
                    await prestamosServices.borrar(prestamo.id);
                    alert("Préstamo eliminado correctamente");
                    tr.remove();
                } catch (err) {
                    alert("Error al eliminar préstamo");
                }
            });

            tbody.appendChild(tr);
        });

        const prestamosActivos = listaPrestamos.filter(p => {
            if (!p.fecha_devolucion) return true;
            const fechaDev = new Date(p.fecha_devolucion);
            return fechaDev > new Date();
        });

        const cardActivos = document.createElement("div");
        cardActivos.classList.add("card", "card-total");

        const textoActivos = document.createElement("p");
        textoActivos.classList.add("texto");
        textoActivos.textContent = "Número de préstamos activos:";

        const numeroActivos = document.createElement("p");
        numeroActivos.classList.add("numero");
        numeroActivos.textContent = prestamosActivos.length;

        cardActivos.appendChild(textoActivos);
        cardActivos.appendChild(numeroActivos);
        derecha.appendChild(cardActivos);

        const ahora = new Date();
        const enUnMes = new Date();
        enUnMes.setMonth(enUnMes.getMonth() + 1);

        const prestamosCercanos = listaPrestamos.filter(p => {
            if (!p.fecha_devolucion) return false;
            const fechaDev = new Date(p.fecha_devolucion);
            return fechaDev >= ahora && fechaDev <= enUnMes;
        });

        const cardVencenPronto = document.createElement("div");
        cardVencenPronto.classList.add("card", "card-total");

        const textoVencen = document.createElement("p");
        textoVencen.classList.add("texto");
        textoVencen.textContent = "Préstamos que vencen en < 1 mes:";

        const numeroVencen = document.createElement("p");
        numeroVencen.classList.add("numero");
        numeroVencen.textContent = prestamosCercanos.length;

        cardVencenPronto.appendChild(textoVencen);
        cardVencenPronto.appendChild(numeroVencen);
        derecha.appendChild(cardVencenPronto);

    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="6">Error al cargar préstamos</td></tr>`;
        console.error("Error al listar préstamos:", error);
    }

    izquierda.appendChild(tabla);
    contenedor.appendChild(izquierda);
    contenedor.appendChild(derecha);
    main.appendChild(contenedor);
}
