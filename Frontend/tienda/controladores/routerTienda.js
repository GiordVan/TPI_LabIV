import { Carrusel } from "./carrusel/carrusel.js";
import { listarProductos } from "./listarProductos/listarProductos.js";
import { vistaProducto } from "./listarProductos/vistaProducto.js";
import { getUsuarioAutenticado, login, mostrarUsuario, register, setUsuarioAutenticado } from "./login/login.js";
import { armador, btnArmador } from "./armador/armador.js";


export function RouterTienda() {
    let session = getUsuarioAutenticado();
    setSession(session);
    let hash = location.hash;

    if (hash === "" || hash === "#") {
        Carrusel();
        btnArmador();
        listarProductos();
        return;
    } else if (hash.startsWith('#vistaProducto')) {
        vistaProducto();
    } else if (hash === '#login') {
        login();
    } else if (hash === '#register') {
        register();
    } else if (hash === '#logout') {
        setUsuarioAutenticado(false, -1);
        location.replace("tienda.html");
    } else if (hash === '#armador') {
        armador();
    }
}


function setSession(session) {
    if (session.autenticado) {
        mostrarUsuario(session.email);
    }
}
