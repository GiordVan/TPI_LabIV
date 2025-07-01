import { App } from "./AppTienda.js";

document.addEventListener('DOMContentLoaded', App);
window.addEventListener("hashchange", App);

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modalVistaProducto');
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.add('oculto');
            modal.querySelector('.vistaProducto').innerHTML = ''; 
            location.hash = ""; 
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const usuarioAutenticado = true; 
    const footerDynamicContent = document.getElementById("footerDynamicContent");

    if (usuarioAutenticado) {
        const link = document.createElement("a");
        link.href = "http://127.0.0.7:5502/index.html#/home";
        link.textContent = "CRUD";
        link.target = "_self";

        footerDynamicContent.appendChild(link);
    }
});
