import { usuariosServices } from "../../servicios/usuarios-servicios.js";

const htmlLogin = `
    <div class="contenedorLogin">
        <div class="cajaLogin">
            <p id="tituloLogin">Iniciar sesión</p>
            <form class="formLogin">
                <div class="input-group">
                    <input type="email" class="form-control" id="loginEmail" placeholder="Email" name="loginEmail" autocomplete required>
                </div>
                <div class="input-group">
                    <input type="password" class="form-control" id="loginPassword" placeholder="Password" name="loginPassword" autocomplete required>
                </div>
                <div class="input-group">
                    <input type="password" class="form-control" id="reLoginPassword" placeholder="Repetir Password" name="reLoginPassword" style="display: none;">
                </div>
                <button type="submit" class="btnLogin">Login</button>
            </form>
            <p id="subtituloLogin">¿No tienes cuenta? <a href="#register">Registrarse</a></p>
        </div>
    </div>
`;

let formulario;
let inputEmail;
let inputPassword;
let inputRepetirPass;

export async function login() {
    crearFormulario(false);

    formulario.addEventListener('submit', async function (e) {
        e.preventDefault();
        await ingresar(e);
    });
}

export async function register() {
    crearFormulario(true);

    formulario.addEventListener('submit', async function (e) {
        e.preventDefault();
        await registrarUsuario(e);
    });
}

function crearFormulario(registrar) {
    document.querySelector('.carrusel').innerHTML = '';
    document.querySelector('.seccionProductos').innerHTML = '';
    document.querySelector('.vistaProducto').innerHTML = '';
    document.querySelector(".armador").innerHTML = '';


    const seccionLogin = document.querySelector('.seccionLogin');
    if (!seccionLogin) return;

    seccionLogin.innerHTML = htmlLogin;

    const tituloFormulario = seccionLogin.querySelector('#tituloLogin');
    if (tituloFormulario) {
        tituloFormulario.textContent = registrar ? "Registrarse" : "Iniciar sesión";
    }

    const textBtnLogin = seccionLogin.
    querySelector('.btnLogin');
    if (textBtnLogin) {
        textBtnLogin.textContent = registrar ? "Registrarse" : "Login";
    }

    const subtituloFormulario = seccionLogin.querySelector('#subtituloLogin');
    if (subtituloFormulario) {
        subtituloFormulario.innerHTML = registrar 
            ? '¿Ya tienes cuenta? <a href="#login">Login</a>' 
            : '¿No tienes cuenta? <a href="#register">Registrarse</a>';
    }

    inputEmail = document.querySelector('#loginEmail');
    inputPassword = document.querySelector('#loginPassword');
    inputRepetirPass = document.querySelector('#reLoginPassword');
    formulario = document.querySelector('.formLogin');

    if (!inputEmail || !inputPassword || !formulario) return;

    inputRepetirPass.style.display = registrar ? 'block' : 'none';
}

async function ingresar(e) {
    const email = inputEmail.value;
    const password = inputPassword.value;

    const usuarioId = await usuarioExiste(email, password);

    if (usuarioId) {
        setUsuarioAutenticado(true, usuarioId, email);
        mostrarUsuario(email);
        alert(`Bienvenido ${email}`);
        location.replace("tienda.html");
    } else {
        mostrarMensaje('Email o contraseña incorrectos, intenta nuevamente');
    }
}

async function registrarUsuario(e) {
    const correo = inputEmail.value;
    const password = inputPassword.value;
    const repetirPassword = inputRepetirPass.value;

    if (password === repetirPassword) {
        const apellido = "ApellidoPrueba";
        const nombre = "NombrePrueba";
        const avatar = "http://127.0.0.1:5501/img/usuarios/default/anonymous.png";
        const pais = "Argentina";
        const ciudad = "Villa María";
        const direccion = "123124844";
        const telefono = "912345";
        const role = "admin";

        await usuariosServices.crear(
            apellido,
            nombre,
            correo,
            password,
            avatar,
            pais,
            ciudad,
            direccion,
            telefono,
            role
        );

        mostrarMensaje("Usuario registrado exitosamente");
        location.replace("#login");
    } else {
        mostrarMensaje("Las contraseñas no coinciden");
    }
}

async function usuarioExiste(email, password) {
    const usuarios = await usuariosServices.listar();
    for (let usuario of usuarios) {
        if (usuario.correo === email && usuario.password === password) {
            return usuario.id;
        }
    }
    return false;
}

export function mostrarUsuario(email) {
    const btnLoginRegister = document.querySelector('#btnLoginRegister');
    const usuarioAutenticado = document.querySelector('#usuarioAutenticado');
    const usuarioEmail = document.querySelector('#usuarioEmail');

    if (btnLoginRegister) btnLoginRegister.style.display = 'none';

    if (usuarioAutenticado) {
        usuarioAutenticado.style.display = 'flex';
        usuarioEmail.textContent = email;
    }
}

function mostrarMensaje(msj) {
    alert(msj);
}

export function setUsuarioAutenticado(autenticado, idUsuario, email = null) {
    sessionStorage.setItem('autenticado', autenticado);
    sessionStorage.setItem('idUsuario', idUsuario || '');
    sessionStorage.setItem('email', email || '');
}

export function getUsuarioAutenticado() {
    const autenticado = sessionStorage.getItem('autenticado') === 'true';
    const idUsuario = sessionStorage.getItem('idUsuario');
    const email = sessionStorage.getItem('email');
    return { autenticado, idUsuario, email };
}
