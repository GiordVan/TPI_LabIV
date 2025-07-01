import { Home } from "./home/home.js";
import { login, register } from "./login/login-controler.js";
import { bibliotecario } from "./bibliotecarios/bibliotecarios.js";
import { verificarAutenticacion } from "../servicios/auth.js";
import { usuarios } from "./usuarios/usuarios.js";
import { categorias } from "./categorias/categorias.js";
import { libros } from "./libros/libros.js";
import { prestamos } from "./prestamos/prestamos.js";
import {clientes} from "./clientes/clientes.js";

export function Router() {
  const hash = location.hash;

  const main = document.querySelector("main");
  if (!main) return;

  main.innerHTML = "";

  if (hash === "#/" || hash === "#/home") {
    Home();
  } else if (hash === "#/login") {
    login();
  } else if (hash === "#/register") {
    register();
  } else if (hash === "#/bibliotecario") {
    const usuario = verificarAutenticacion();
    bibliotecario(usuario);
  } else if (hash === "#/usuarios") {
    const usuario = verificarAutenticacion();
    usuarios(usuario);
  } else if (hash === "#/categorias") {
    const usuario = verificarAutenticacion();
    categorias(usuario);
  } else if (hash === "#/libros") {
    const usuario = verificarAutenticacion();
    libros(usuario);
  } else if (hash === "#/prestamos") {
    const usuario = verificarAutenticacion();
    prestamos(usuario);
  } else if (hash === "#/perfil") {
    const usuario = verificarAutenticacion();
    clientes(usuario);
  } else {
    Home();
  }
}
