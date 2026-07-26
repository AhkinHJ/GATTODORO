const inputNombre = document.getElementById('nombre-usuario');
const btnGuardar = document.getElementById('btn-guardar-nombre');
const pantallaRegistro = document.getElementById('pantalla-registro');
const pantallaLobby = document.getElementById('pantalla-lobby');
const saludoUsuario = document.getElementById('saludo-usuario');
const btnEditarNombre = document.getElementById('btn-editar-nombre');

function irAlLobby(nombre) {
    saludoUsuario.innerText = `Hola ${nombre}, listo para empezar`;
    
    pantallaRegistro.classList.remove('pantalla-activa');
    pantallaRegistro.classList.add('pantalla-oculta');
    
    pantallaLobby.classList.remove('pantalla-oculta');
    pantallaLobby.classList.add('pantalla-activa');
}

window.addEventListener('DOMContentLoaded', () => {
    const nombreGuardado = localStorage.getItem('gattodoro_nombre');
    if (nombreGuardado) {
        irAlLobby(nombreGuardado);
    }
});

btnGuardar.addEventListener('click', () => {
    const nombre = inputNombre.value.trim();

    if (nombre !== "") {
        localStorage.setItem('gattodoro_nombre', nombre);
        irAlLobby(nombre);
    } else {
        inputNombre.style.borderColor = "red";
        setTimeout(() => {
            inputNombre.style.borderColor = "#ccc";
        }, 1500);
    }
});

btnEditarNombre.addEventListener('click', () => {
    inputNombre.value = localStorage.getItem('gattodoro_nombre');
    
    pantallaLobby.classList.remove('pantalla-activa');
    pantallaLobby.classList.add('pantalla-oculta');
    
    pantallaRegistro.classList.remove('pantalla-oculta');
    pantallaRegistro.classList.add('pantalla-activa');
});