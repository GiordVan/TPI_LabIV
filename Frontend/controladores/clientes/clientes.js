import { prestamosServices } from "../../servicios/prestamos-servicios.js";
import { librosServices } from "../../servicios/libros-servicios.js";

export async function clientes(usuario) {
    const main = document.querySelector("main");
    main.innerHTML = `
    <section class="dashboard-cliente">
        <h1 class="titulo">Perfil del Cliente</h1>
        <div class="perfil">
            <img src="/assets/img/SinFoto.jpg" alt="Foto del usuario">
            <div class="info-usuario">
                <p><strong>Nombre:</strong> ${usuario.nombre}</p>
                <p><strong>Email:</strong> ${usuario.email}</p>
                <p><strong>Rol:</strong> ${usuario.rol}</p>
            </div>
        </div>
        <h2>Mis Préstamos</h2>
        <div class="tabla-prestamos-container">
            <table class="tabla-usuarios">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Título del Libro</th>
                        <th>Fecha Préstamo</th>
                        <th>Fecha Devolución</th>
                    </tr>
                </thead>
                <tbody id="tbody-prestamos">
                    <tr><td colspan="4">Cargando préstamos...</td></tr>
                </tbody>
            </table>
        </div>
    </section>
    `;

    try {
        const [prestamos, libros] = await Promise.all([
            prestamosServices.listarPorUsuario(usuario.id),
            librosServices.listar()
        ]);

        const tbody = document.querySelector("#tbody-prestamos");
        tbody.innerHTML = "";

        if (prestamos.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4">No tenés préstamos registrados</td></tr>`;
            return;
        }

        prestamos.forEach(p => {
            const libro = libros.find(l => l.id === p.libro_id);
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${p.id}</td>
                <td>${libro?.titulo || "Desconocido"}</td>
                <td>${p.fecha_prestamo}</td>
                <td>${p.fecha_devolucion || "-"}</td>
            `;
            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error("Error al cargar préstamos del cliente:", error);
        const tbody = document.querySelector("#tbody-prestamos");
        tbody.innerHTML = `<tr><td colspan="4">Error al cargar los préstamos</td></tr>`;
    }
}
