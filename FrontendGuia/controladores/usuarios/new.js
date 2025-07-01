import { usuariosServices } from "/servicios/usuarios-servicios.js";

const htmlAmUsuarios = `
<div class="card card-dark card-outline">
    <form class="needs-validation frmAmUsuario">
        <div class="card-header">
            <div class="col-md-8 offset-md-2">	
                <!--=====================================
                Nombre
                ======================================-->
                <div class="form-group mt-5">
                    <label>Nombre</label>
                    <input 
                        type="text" 
                        class="form-control"
                        pattern="[A-Za-zñÑáéíóúÁÉÍÓÚ ]{1,}"
                        onchange="validateJS(event,'text')"
                        name="nombre"
                        id="usuarioNombre"
                        required>
                    <div class="valid-feedback">Valid.</div>
                    <div class="invalid-feedback">Please fill out this field.</div>
                </div>

                <!--=====================================
                Correo electrónico
                ======================================-->
                <div class="form-group mt-2">
                    <label>Email</label>
                    <input 
                        type="email" 
                        class="form-control"
                        onchange="validateRepeat(event,'email')"
                        name="email"
                        id="usuarioEmail"
                        required>
                    <div class="valid-feedback">Valid.</div>
                    <div class="invalid-feedback">Please fill out this field.</div>
                </div>

                <!--=====================================
                Contraseña
                ======================================-->
                <div class="form-group mt-2">
                    <label>Password</label>
                    <input 
                        type="password" 
                        class="form-control"
                        onchange="validateJS(event,'pass')"
                        name="password"
                        id="usuarioPassword" 
                        required>
                    <div class="valid-feedback">Valid.</div>
                    <div class="invalid-feedback">Please fill out this field.</div>
                </div>

                <!--=====================================
                Rol
                ======================================-->
                 <div class="form-group mt-2">
                    <label>Rol</label>
                    <select class="form-control" name="rol" id="usuarioRol" required>
                        <option value="">Seleccionar rol</option>
                        <option value="Cliente">Cliente</option>
                        <option value="Bibliotecario">Bibliotecario</option>
                    </select>
                    <div class="valid-feedback">Valid.</div>
                    <div class="invalid-feedback">Please fill out this field.</div>
                </div>  

            </div>
        </div>

        <div class="card-footer">
            <div class="col-md-8 offset-md-2">
                <div class="form-group mt-3">
                    <a href="#/usuarios" class="btn btn-light border text-left">Cancelar</a>
                    <button type="submit" class="btn bg-dark float-right">Guardar</button>
                </div>
            </div>
        </div>
    </form>
</div>`;

var formulario = '';
var txtNombre = '';
var txtCorreo = '';
var txtPass = '';
var selRol = '';
var idUsuario;

export async function newRegister() {
    let d = document;
    d.querySelector('.contenidoTitulo').innerHTML = 'Agregar Usuario';
    d.querySelector('.contenidoTituloSec').innerHTML = 'Agregar';
    crearFormulario();
    formulario = d.querySelector(".frmAmUsuario");
    formulario.addEventListener("submit", guardar);
}

export async function editRegister(id) {
    let d = document;
    idUsuario = id;
    d.querySelector('.contenidoTitulo').innerHTML = 'Editar Usuario';
    d.querySelector('.contenidoTituloSec').innerHTML = 'Editar';
    crearFormulario();
    formulario = d.querySelector(".frmAmUsuario");
    formulario.addEventListener("submit", modificar);

    let usuario = await usuariosServices.listar(id);
    txtNombre.value = usuario.nombre;
    txtCorreo.value = usuario.email;
    txtPass.value = usuario.contrasenia || ''; // Asegúrate que tu backend devuelva contrasenia si es necesario
    selRol.value = usuario.rol;
}

function crearFormulario() {
    let d = document;
    d.querySelector('.rutaMenu').innerHTML = "Usuarios";
    d.querySelector('.rutaMenu').setAttribute('href', "#/usuarios");

    let cP = d.getElementById('contenidoPrincipal');
    cP.innerHTML = htmlAmUsuarios;

    txtNombre = d.getElementById('usuarioNombre');
    txtCorreo = d.getElementById('usuarioEmail');
    txtPass = d.getElementById('usuarioPassword');
    selRol = d.getElementById('usuarioRol');
}

function validarPassword(pass) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(pass);
}

function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function guardar(e) {
	
    e.preventDefault();

    if (!validarPassword(txtPass.value)) {
        alert("La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número.");
        return;
    }

if (!validarEmail(txtCorreo.value)) {
	alert("Por favor, ingresa un correo electrónico válido.");
    return;
}

    const rol = selRol.options[selRol.selectedIndex].value;
if (!rol || (rol !== "Cliente" && rol !== "Bibliotecario")) {
    alert("Selecciona un rol válido");
    return;
}

    usuariosServices.crear(
        txtNombre.value,
        txtCorreo.value,
        txtPass.value,
        rol
    )
    .then(respuesta => {
        formulario.reset();
        window.location.href = "#/usuarios";
    })
    .catch(error => console.log(error));
}

function modificar(e) {
    e.preventDefault();
    const rol = selRol.options[selRol.selectedIndex].value;

    usuariosServices.editar(
        idUsuario,
        txtNombre.value,
        txtCorreo.value,
        txtPass.value,
        rol
    )
    .then(respuesta => {
        formulario.reset();
        window.location.href = "#/usuarios";
    })
    .catch(error => console.log(error));
}