import { usuariosServices } from "../../../servicios/usuarios-servicios.js";

const htmlLogin = `
    <div class="contenedorLogin">
      <div class="cajaLogin">
        <h2 id="tituloLogin">Iniciar sesión</h2>
        <form class="formLogin">
          <!-- Nombre -->
          <div class="input-group" id="grupoNombre" style="display: none;">
            <label for="loginNombre">Nombre</label>
            <input type="text" id="loginNombre" name="loginNombre" placeholder="Nombre" required>
          </div>

          <!-- Email -->
          <div class="input-group">
            <label for="loginEmail">Email</label>
            <input type="email" id="loginEmail" name="loginEmail" placeholder="Email" required>
          </div>

          <!-- Contraseña -->
          <div class="input-group">
            <label for="loginPassword">Contraseña</label>
            <input type="password" id="loginPassword" name="loginPassword" placeholder="Contraseña" required>
          </div>

          <!-- Repetir contraseña -->
          <div class="input-group" id="grupoRepetirPass" style="display: none;">
            <label for="reLoginPassword">Repetir Contraseña</label>
            <input type="password" id="reLoginPassword" name="reLoginPassword" placeholder="Repetir Contraseña" required>
          </div>

          <!-- Rol -->
          <div class="input-group" id="grupoRol" style="display: none;">
            <label for="loginRol">Rol</label>
            <select id="loginRol" name="loginRol" required>
              <option value="">Selecciona un rol</option>
              <option value="Cliente">Cliente</option>
              <option value="Bibliotecario">Bibliotecario</option>
            </select>
          </div>

          <!-- Imagen -->
          <div class="input-group" id="grupoImagen" style="display: none;">
            <label for="loginImagen">Imagen (URL)</label>
            <input type="url" id="loginImagen" name="loginImagen" placeholder="URL de imagen (opcional)">
          </div>

          <!-- Botón -->
          <button type="submit" class="btnLogin">Registrarse</button>
        </form>

        <p id="subtituloLogin">
          ¿No tienes cuenta? <a href="#/register">Registrarse</a>
        </p>
      </div>
    </div>
`;


let formulario;
let inputEmail;
let inputPassword;
let inputRepetirPass;
let inputNombre;
let inputRol;
let inputImagen;

export async function login() {
    crearFormulario(false);

    setTimeout(() => {
        formulario.addEventListener('submit', async function (e) {
            e.preventDefault();
            await ingresar(e);
        });
    }, 0);

}

export async function register() {
    crearFormulario(true);

    formulario.addEventListener('submit', async function (e) {
        e.preventDefault();
        await registrarUsuario(e);
    });
}

function crearFormulario(registrar) {
    const main = document.querySelector("main");

    let seccionLogin = main.querySelector(".seccionLogin");
    if (!seccionLogin) {
        seccionLogin = document.createElement("div");
        seccionLogin.classList.add("seccionLogin");
        main.innerHTML = "";
        main.appendChild(seccionLogin);
    } else {
        seccionLogin.innerHTML = "";
    }

    seccionLogin.innerHTML = htmlLogin;
    if (!seccionLogin) return;

    seccionLogin.innerHTML = htmlLogin;

    const tituloFormulario = seccionLogin.querySelector('#tituloLogin');
    if (tituloFormulario) {
        tituloFormulario.textContent = registrar ? "Registrarse" : "Iniciar sesión";
    }

    const textBtnLogin = seccionLogin.querySelector('.btnLogin');
    if (textBtnLogin) {
        textBtnLogin.textContent = registrar ? "Registrarse" : "Login";
    }

    const subtituloFormulario = seccionLogin.querySelector('#subtituloLogin');
    if (subtituloFormulario) {
        subtituloFormulario.innerHTML = registrar
            ? '¿Ya tienes cuenta? <a href="#/login">Login</a>'
            : '¿No tienes cuenta? <a href="#/register">Registrarse</a>';
    }


    formulario = document.querySelector('.formLogin');
    inputNombre = document.querySelector('#loginNombre');
    inputEmail = document.querySelector('#loginEmail');
    inputPassword = document.querySelector('#loginPassword');
    inputRepetirPass = document.querySelector('#reLoginPassword');
    inputRol = document.querySelector('#loginRol');
    inputImagen = document.querySelector('#loginImagen');
    formulario = document.querySelector('.formLogin');

    if (registrar) {
        if (inputNombre) {
            inputNombre.parentElement.style.display = 'flex';
            inputNombre.required = true;
        }
        if (inputRepetirPass) {
            inputRepetirPass.parentElement.style.display = 'flex';
            inputRepetirPass.required = true;
        }
        if (inputRol) {
            inputRol.parentElement.style.display = 'flex';
            inputRol.required = true;
        }
        if (inputImagen) {
            inputImagen.parentElement.style.display = 'flex';
        }
    } else {
        if (inputNombre) {
            inputNombre.parentElement.style.display = 'none';
            inputNombre.required = false;
        }
        if (inputRepetirPass) {
            inputRepetirPass.parentElement.style.display = 'none';
            inputRepetirPass.required = false;
        }
        if (inputRol) {
            inputRol.parentElement.style.display = 'none';
            inputRol.required = false;
        }
        if (inputImagen) {
            inputImagen.parentElement.style.display = 'none';
        }
    }

}

async function ingresar(e) {
    const email = inputEmail.value;
    const password = inputPassword.value;

    const resultado = await usuariosServices.login(email, password);

    if (resultado && resultado.token) {
        setAuthData(resultado.token, resultado.usuario);
        mostrarUsuario(resultado.usuario);  // <-- PASAR OBJETO USUARIO COMPLETO
        alert(`Bienvenido ${resultado.usuario.email}`);
        location.hash = "#/home";
    } else {
        mostrarMensaje('Email o contraseña incorrectos, intenta nuevamente');
    }

}

async function registrarUsuario(e) {
    e.preventDefault();

    const nombre = inputNombre.value.trim();
    const correo = inputEmail.value.trim();
    const password = inputPassword.value;
    const repetirPassword = inputRepetirPass.value;
    const role = inputRol ? inputRol.value : "Cliente";
    const imagen = inputImagen ? inputImagen.value.trim() : "../img/usuarioDefault.png";

    if (!nombre || !correo || !password || !role) {
        mostrarMensaje("Por favor completa todos los campos obligatorios");
        return;
    }

    if (password !== repetirPassword) {
        mostrarMensaje("Las contraseñas no coinciden");
        return;
    }

    try {
        const data = await usuariosServices.crear(
            nombre,
            correo,
            password,
            role,
            imagen
        );

        if (data && data.token) {
            setAuthData(data.token, data.usuario);
            mostrarUsuario(data.usuario);
            alert(`Bienvenido ${data.usuario.email}`);
            location.hash = "#/home";
        } else {
            mostrarMensaje("Error al registrar usuario");
        }
    } catch (error) {
        console.error("Error en registro:", error);
        mostrarMensaje("No se pudo registrar el usuario");
    }
}


export function mostrarUsuario(usuario) {
    const btnDashboard = document.querySelector('#btnDashboard');
    const btnPerfil = document.querySelector('#btnPerfil');

    const btnLoginRegister = document.querySelector('#btnLoginRegister');
    const usuarioAutenticado = document.querySelector('#usuarioAutenticado');
    const usuarioEmail = document.querySelector('#usuarioEmail');
    const usuarioRol = document.querySelector('#usuarioRol');

    if (btnLoginRegister) btnLoginRegister.style.display = 'none';

    if (usuarioAutenticado) {
        usuarioAutenticado.style.display = 'flex';
        usuarioEmail.textContent = `Hola ${usuario.nombre}!`;

        if (usuarioRol) {
            usuarioRol.textContent = usuario.rol;
        }
        if (usuario.rol.toLowerCase() === 'bibliotecario') {
    if (btnDashboard) {
        btnDashboard.style.display = 'inline-block';
        btnDashboard.onclick = () => {
            location.hash = "#/bibliotecario";
        };
    }
    if (btnPerfil) {
        btnPerfil.style.display = 'none';
        btnPerfil.onclick = null;
    }
} else {
    if (btnPerfil) {
        btnPerfil.style.display = 'inline-block';
        btnPerfil.onclick = () => {
            location.hash = "#/perfil";
        };
    }
    if (btnDashboard) {
        btnDashboard.style.display = 'none';
        btnDashboard.onclick = null;
    }
}
    }
}

function mostrarMensaje(msj) {
    alert(msj);
}

export function setAuthData(token, usuario) {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("usuario", JSON.stringify(usuario));
}

export function getAuthData() {
    const token = sessionStorage.getItem("token");
    if (!token) {
        return { autenticado: false, token: null, usuario: null };
    }
    const usuarioJson = sessionStorage.getItem("usuario");
    const usuario = usuarioJson ? JSON.parse(usuarioJson) : null;
    return { autenticado: true, token, usuario };
}


export function logout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("usuario");

    const btnLoginRegister = document.querySelector('#btnLoginRegister');
    const usuarioAutenticado = document.querySelector('#usuarioAutenticado');
    if (btnLoginRegister) btnLoginRegister.style.display = 'flex';
    if (usuarioAutenticado) usuarioAutenticado.style.display = 'none';

    location.hash = "#/login";
}
