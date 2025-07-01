import { Router } from "../controladores/router.js";
import { verificarAutenticacion } from "../servicios/auth.js";

let redirigiendo = false;

export function App() {
    if (redirigiendo) return;

    const hash = location.hash;

    if (hash.startsWith("#/bibliotecario")) {
        const usuario = verificarAutenticacion();

        if (!usuario) {
            location.hash = "#/login";
            return;
        }

        if (usuario.rol.toLowerCase().trim() !== "bibliotecario") {
            redirigiendo = true;
            Swal.fire({
                icon: "error",
                title: "Acceso denegado",
                text: "Solo los bibliotecarios pueden acceder a esta sección"
            }).then(() => {
                location.hash = "#/cliente";
                redirigiendo = false;
            });
            return;
        }
    }

    Router(); 
}
