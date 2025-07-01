import { App } from "./App.js";
import { getAuthData, mostrarUsuario, logout } from "../controladores/login/login-controler.js";

document.addEventListener("DOMContentLoaded", () => {
  App();
  window.addEventListener("hashchange", App);


  inicializarNavbar();

  document.addEventListener("click", (e) => {
    if (e.target.matches('a[href="#logout"]')) {
      e.preventDefault();
      logout();
      inicializarNavbar();
    }
  });
});

function inicializarNavbar() {
  const { autenticado, usuario } = getAuthData();
  const btnLoginRegister = document.querySelector('#btnLoginRegister');
  const usuarioAutenticado = document.querySelector('#usuarioAutenticado');

  if (autenticado && usuario) {
    if (btnLoginRegister) btnLoginRegister.style.display = 'none';
    if (usuarioAutenticado) {
      usuarioAutenticado.style.display = 'flex';
      mostrarUsuario(usuario);
    }
  } else {
    if (btnLoginRegister) btnLoginRegister.style.display = 'flex';
    if (usuarioAutenticado) usuarioAutenticado.style.display = 'none';
  }
}
