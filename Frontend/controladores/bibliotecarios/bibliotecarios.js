export function bibliotecario(usuario) {
    const main = document.querySelector("main");
    main.innerHTML = `
    <section class="dashboard-bibliotecario">
    <h1 class="titulo">Panel de Control Bibliotecario</h1>
        <div class="perfil">
            <img src="/assets/img/SinFoto.jpg" alt="Foto del usuario">
            <div class="info-usuario">
                <p><strong>Nombre:</strong> ${usuario.nombre}</p>
                <p><strong>Email:</strong> ${usuario.email}</p>
                <p><strong>Rol:</strong> ${usuario.rol}</p>
            </div>
        </div>

        <div class="dashboard-grid">
            <div class="card" onclick="location.hash='#/usuarios'">
                <h3>Usuarios</h3>
                <p>Gestionar usuarios</p>
            </div>
            <div class="card" onclick="location.hash='#/libros'">
                <h3>Libros</h3>
                <p>Administrar libros</p>
            </div>
            <div class="card" onclick="location.hash='#/categorias'">
                <h3>Categorías</h3>
                <p>Organizar categorías</p>
            </div>
            <div class="card" onclick="location.hash='#/prestamos'">
                <h3>Préstamos</h3>
                <p>Seguimiento de préstamos</p>
            </div>
        </div>
    </section>
    `;
}
