import { usuariosServices } from "../../servicios/usuarios-servicios.js";
import { newRegister } from "./new.js";
import { editRegister } from "./new.js";

var dtable;


const htmlUsuarios =
    `<div class="card">
   <div class="card-header">
   
   <h3 class="card-title"> 
       <a class="btn bg-dark btn-sm btnAgregarUsuario" href="#/newUsuario">Agregar Usuario</a>
   </h3>

   </div>

   <!-- /.card-header -->
   <div class="card-body">            
   <table id="usuariosTable" class="table table-bordered table-striped tableUsuario" width="100%">
       <thead>
    <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Email</th>
        <th>Rol</th>
        <th>Acciones</th>
    </tr>
</thead>
   
   </table>
   </div>
   <!-- /.card-body -->
</div> `;

function generarAcciones(usuario) {
    return `
        <div class='btn-group'>
            <a class='btn btn-warning btn-sm mr-1 rounded-circle btnEditarUsuario' href='#/editUsuario' data-idUsuario='${usuario.id}'>
                <i class='fas fa-pencil-alt'></i>
            </a>
            <a class='btn btn-danger btn-sm rounded-circle removeItem btnBorrarUsuario' href='#/delUsuario' data-idUsuario='${usuario.id}'>
                <i class='fas fa-trash'></i>
            </a>
        </div>`;
}

export async function Usuarios() {
    let d = document;
    let res = '';
    d.querySelector('.contenidoTitulo').innerHTML = 'Usuarios';
    d.querySelector('.contenidoTituloSec').innerHTML = '';
    d.querySelector('.rutaMenu').innerHTML = "Usuarios";
    d.querySelector('.rutaMenu').setAttribute('href', "#/usuarios");
    let cP = d.getElementById('contenidoPrincipal');

    res = await usuariosServices.listar();
    res.forEach(element => {
    element.action = generarAcciones(element);
});

    cP.innerHTML = htmlUsuarios;

    llenarTabla(res);



    let btnAgregar = d.querySelector(".btnAgregarUsuario");


    btnAgregar.addEventListener("click", agregar);



}

function enlazarEventos() {
    const d = document;

    // Delegación de eventos en lugar de bucle
    d.querySelector('#usuariosTable').addEventListener('click', function(e) {
        if (e.target.closest('.btnEditarUsuario')) {
            const id = e.target.closest('.btnEditarUsuario').dataset.idUsuario;
            editRegister(id);
        }

        if (e.target.closest('.btnBorrarUsuario')) {
            const id = e.target.closest('.btnBorrarUsuario').dataset.idUsuario;
            borrarUsuario(id);
        }
    });
}

async function borrarUsuario(id) {
    let confirmado = false;
    await Swal.fire({
        title: '¿Está seguro que desea eliminar el registro?',
        showDenyButton: true,
        confirmButtonText: 'Sí',
        denyButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) confirmado = true;
    });

    if (confirmado) {
        await usuariosServices.borrar(id);
        Swal.fire('Usuario eliminado', '', 'success');
        window.location.href = "#/usuarios"; // Recargar vista
    }
}


function agregar() {
    newRegister();

}
function editar() {
    let id = this.getAttribute('data-idUsuario');
    editRegister(id);

}

async function borrar() {
    let id = this.getAttribute('data-idUsuario');
    let borrar = 0;
    await Swal.fire({
        title: 'Está seguro que desea eliminar el registro?',
        showDenyButton: true,
        confirmButtonText: 'Si',
        denyButtonText: `Cancelar`,

        focusDeny: true
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            borrar = 1;
        } else if (result.isDenied) {
            borrar = 0;
            Swal.fire('Se canceló la eliminación', '', 'info');
        }
    })
    if (borrar === 1)
        await usuariosServices.borrar(id);
    window.location.href = "#/usuarios";
}

function llenarTabla(res) {
    // Si ya existe la tabla, actualiza los datos
    if (dtable) {
        dtable.clear().rows.add(res).draw();
        return;
    }

    // Si no existe, crea la tabla con configuración completa
    dtable = new DataTable('#usuariosTable', {
        responsive: true,
        data: res,
        columns: [
            { data: 'id' },
            { data: 'nombre' },
            { data: 'email' },
            { data: 'rol' },
            { data: 'action', orderable: false }
        ],
        fnDrawCallback: function (oSettings) {
            enlazarEventos();  // Llama a tu función que asigna eventos
        },
        deferRender: true,
        retrieve: true,
        processing: true,
        language: {
            sProcessing: "Procesando...",
            sLengthMenu: "Mostrar _MENU_ registros",
            sZeroRecords: "No se encontraron resultados",
            sEmptyTable: "Ningún dato disponible en esta tabla",
            sInfo: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_",
            sInfoEmpty: "Mostrando registros del 0 al 0 de un total de 0",
            sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
            sInfoPostFix: "",
            sSearch: "Buscar:",
            sUrl: "",
            sInfoThousands: ",",
            sLoadingRecords: "Cargando...",
            oPaginate: {
                sFirst: "Primero",
                sLast: "Último",
                sNext: "Siguiente",
                sPrevious: "Anterior"
            },
            oAria: {
                sSortAscending: ": Activar para ordenar la columna de manera ascendente",
                sSortDescending: ": Activar para ordenar la columna de manera descendente"
            }
        }
    });
}