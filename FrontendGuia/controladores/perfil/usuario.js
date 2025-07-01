// usuario.js
import { usuariosServices } from "../../servicios/usuarios-servicios.js";
import { getUsuarioAutenticado } from "../login/login.js";

export async function usuario() {
    const usuarioSection = document.querySelector('section.usuario');

    // Limpiar otras secciones para que no haya contenido cruzado
    document.querySelector('section.carrusel').innerHTML = "";
    document.querySelector('section.seccionProductos').innerHTML = "";
    document.querySelector('section.armador').innerHTML = "";
    document.querySelector('section.seccionLogin').innerHTML = "";

    const session = getUsuarioAutenticado();

    if (!session.autenticado) {
        usuarioSection.innerHTML = "<h2>Debes iniciar sesión para ver el perfil.</h2>";
        return;
    }

    try {
        // Obtener datos completos del usuario por idUsuario usando el servicio usuariosServices
        const usuarioCompleto = await usuariosServices.listar(session.idUsuario);

        // Construcción del HTML básico con datos del usuario
        let htmlPerfil = `
            <h1>Perfil de Usuario</h1>
            <img src="${usuarioCompleto.avatar}" alt="Avatar" style="width:100px; border-radius:50%;">
            <p><strong>Nombre:</strong> ${usuarioCompleto.nombre} ${usuarioCompleto.apellido}</p>
            <p><strong>Email:</strong> ${usuarioCompleto.correo}</p>
            <p><strong>País:</strong> ${usuarioCompleto.pais}</p>
            <p><strong>Ciudad:</strong> ${usuarioCompleto.ciudad}</p>
            <p><strong>Dirección:</strong> ${usuarioCompleto.direccion}</p>
            <p><strong>Teléfono:</strong> ${usuarioCompleto.telefono}</p>
            <p><strong>Rol:</strong> ${usuarioCompleto.role}</p>
            <h2>Solicitudes / Préstamos realizados</h2>
        `;

        // --- Aquí empieza la parte que muestra el historial de solicitudes/préstamos ---
        // Obtenemos las solicitudes guardadas en localStorage para este usuario,
        // usando una clave personalizada: 'solicitudes_usuario_{idUsuario}'
        const key = `solicitudes_usuario_${session.idUsuario}`;
        const solicitudes = JSON.parse(localStorage.getItem(key)) || [];

        // Si no hay solicitudes, mostramos mensaje
        if (solicitudes.length === 0) {
            htmlPerfil += `<p>No hay solicitudes registradas.</p>`;
        } else {
            // Si existen solicitudes, construimos una tabla para mostrar su información
            htmlPerfil += `
                <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
                    <thead style="background-color: #f2f2f2;">
                        <tr>
                            <th>Producto</th>
                            <th>Fecha Solicitud</th>
                            <th>Fecha Devolución</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            // Iteramos cada solicitud y agregamos una fila con sus datos
            solicitudes.forEach(sol => {
                htmlPerfil += `
                    <tr>
                        <td>${sol.nombreProducto}</td>
                        <td>${sol.fechaSolicitud}</td>
                        <td>${sol.fechaDevolucion}</td>
                        <td>${sol.despachado ? 'Entregado' : 'Pendiente'}</td>
                    </tr>
                `;
            });

            htmlPerfil += `</tbody></table>`;
        }
        // --- Fin de la sección de solicitudes/préstamos ---

        usuarioSection.innerHTML = htmlPerfil;

    } catch (error) {
        usuarioSection.innerHTML = `<p>Error al cargar el perfil: ${error.message}</p>`;
    }
}
