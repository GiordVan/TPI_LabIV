import { getUsuarioAutenticado } from "../login/login.js";

export async function usuario() {
    const usuarioSection = document.querySelector('section.usuario');

    // Limpiar otras secciones
    document.querySelector('section.carrusel').innerHTML = "";
    document.querySelector('section.seccionProductos').innerHTML = "";
    document.querySelector('section.armador').innerHTML = "";
    document.querySelector('section.seccionLogin').innerHTML = "";

    const session = getUsuarioAutenticado();

    if (!session.autenticado) {
        usuarioSection.innerHTML = "<h2>Debes iniciar sesión para ver el perfil.</h2>";
        return;
    }

    // Usuario simulado (puedes usar datos reales si los tenés)
    const usuario = {
        nombre: "Juan",
        apellido: "Pérez",
        correo: session.email,
        pais: "Argentina",
        ciudad: "Córdoba",
        direccion: "Calle Falsa 123",
        telefono: "123456789",
        role: "lector",
        avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
    };

    // Datos de préstamos simulados
    const prestamosUsuario = [
        {
            id: 1,
            libro: "Cien Años de Soledad",
            fechaInicio: "2024-06-01",
            fechaFin: "2024-06-15",
            devuelto: true
        },
        {
            id: 2,
            libro: "El Principito",
            fechaInicio: "2024-06-20",
            fechaFin: null,
            devuelto: false
        }
    ];

    usuarioSection.innerHTML = `
        <h1>Perfil de Usuario</h1>
        <img src="${usuario.avatar}" alt="Avatar" style="width:100px; border-radius:50%;">
        <p><strong>Nombre:</strong> ${usuario.nombre} ${usuario.apellido}</p>
        <p><strong>Email:</strong> ${usuario.correo}</p>
        <p><strong>País:</strong> ${usuario.pais}</p>
        <p><strong>Ciudad:</strong> ${usuario.ciudad}</p>
        <p><strong>Dirección:</strong> ${usuario.direccion}</p>
        <p><strong>Teléfono:</strong> ${usuario.telefono}</p>
        <p><strong>Rol:</strong> ${usuario.role}</p>
        <div id="historialPrestamos">
            <h2>Historial de Préstamos</h2>
            ${generarTablaPrestamos(prestamosUsuario)}
        </div>
    `;
}

function generarTablaPrestamos(prestamos) {
    if (prestamos.length === 0) {
        return `<p>No tienes préstamos registrados.</p>`;
    }

    let tabla = `
        <table border="1" style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Libro</th>
                    <th>Fecha de Inicio</th>
                    <th>Fecha de Fin</th>
                    <th>Devuelto</th>
                </tr>
            </thead>
            <tbody>
    `;

    prestamos.forEach(p => {
        tabla += `
            <tr>
                <td>${p.id}</td>
                <td>${p.libro}</td>
                <td>${p.fechaInicio}</td>
                <td>${p.fechaFin ? p.fechaFin : 'Pendiente'}</td>
                <td>${p.devuelto ? 'Sí' : 'No'}</td>
            </tr>
        `;
    });

    tabla += `
            </tbody>
        </table>
    `;

    return tabla;
}
