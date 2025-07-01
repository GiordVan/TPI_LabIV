var inputEmail = null;
var inputPassword = null;
var frmLogin = null;

import { usuariosServices } from "/servicios/usuarios-servicios.js";



export function setLogin() {
    frmLogin = document.getElementById('frmLogin');
    const btnLogout = document.getElementById('btnLogout');

    if (btnLogout) {
        btnLogout.addEventListener('click', logout);
    }

    if (getUsuarioAutenticado()) {
        if (frmLogin) frmLogin.outerHTML = '';
    } else {
        document.getElementById("sitio").classList.add('d-none');

        inputEmail = document.getElementById('loginEmail');
        inputPassword = document.getElementById('loginPassword');

        const btnLogin = document.getElementById('iniciar-sesion');

        if (inputEmail) inputEmail.addEventListener('blur', validarForm);
        if (inputPassword) inputPassword.addEventListener('blur', validarForm);
        if (btnLogin) btnLogin.addEventListener('click', usuarioExiste);
    }
}

async function usuarioExiste() {
    const email = inputEmail.value;
    const password = inputPassword.value;

    try {
        const respuesta = await usuariosServices.login(email, password);

        if (!respuesta) {
            mostrarMensaje('Email o contraseña incorrectos');
            return;
        }

        const { token } = respuesta;  // Recibimos el token del backend

        // Decodificar el payload del token (opcional)
        const payload = parseJwt(token);  // Función auxiliar definida abajo

        // Guardamos datos del usuario en sessionStorage
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('usuarioId', payload.id);
        sessionStorage.setItem('usuarioEmail', payload.email);
        sessionStorage.setItem('usuarioRol', payload.rol);
        sessionStorage.setItem('autenticado', "true");

        // Ocultar formulario de login
        if (frmLogin) frmLogin.outerHTML = '';
        document.getElementById("sitio").classList.remove('d-none');

        window.location.href = "#/home";
    } catch (error) {
        console.error(error);
        mostrarMensaje('Error al iniciar sesión');
    }
}

function validarForm(e) {
    return true; // Puedes mejorar esta validación más adelante
}

function mostrarMensaje(msj) {
    alert(msj);
}

function setUsuarioAutenticado(booleano) {
    sessionStorage.setItem('autenticado', booleano);
}

function getUsuarioAutenticado() {
    return sessionStorage.getItem('autenticado') === "true";
}

function logout() {
    setUsuarioAutenticado(false);
    window.location.replace("index.html");
}

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Error al decodificar token", e);
        return {};
    }
}