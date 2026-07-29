const inputNombre = document.getElementById('nombre-usuario');
const btnGuardar = document.getElementById('btn-guardar-nombre');
const pantallaRegistro = document.getElementById('pantalla-registro');
const pantallaLobby = document.getElementById('pantalla-lobby');
const saludoUsuario = document.getElementById('saludo-usuario');
const btnEditarNombre = document.getElementById('btn-editar-nombre');
const btnIniciar = document.getElementById('btn-iniciar');
const modalConfiguracion = document.getElementById('modal-configuracion');
const btnCerrarModal = document.getElementById('btn-cerrar-modal');
const btnEmpezarPomodoro = document.getElementById('btn-empezar-pomodoro');
const pantallaTemporizador = document.getElementById('pantalla-temporizador');
const btnVolverLobby = document.getElementById('btn-volver-lobby');
const inputTarea = document.getElementById('input-tarea');
const inputEnfoque = document.getElementById('input-enfoque');
const inputDescanso = document.getElementById('input-descanso');
const inputCiclos = document.getElementById('input-ciclos');
const textoTareaActiva = document.getElementById('texto-tarea-activa');
const tiempoDisplay = document.getElementById('tiempo-display');
const cicloTotalDisplay = document.getElementById('ciclo-total');
const cicloActualDisplay = document.getElementById('ciclo-actual');
const btnPlayPause = document.getElementById('btn-play-pause');
const btnDetener = document.getElementById('btn-detener');

let tiempoRestante = 0; 
let intervaloReloj = null;
let estaCorriendo = false;
let faseActual = 'enfoque';
let cicloActual = 1;

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

btnIniciar.addEventListener('click', () => {
    modalConfiguracion.classList.remove('pantalla-oculta');
});

btnCerrarModal.addEventListener('click', () => {
    modalConfiguracion.classList.add('pantalla-oculta');
});

document.querySelectorAll('.control-numero').forEach(control => {
    const btnRestar = control.querySelector('.btn-restar');
    const btnSumar = control.querySelector('.btn-sumar');
    const input = control.querySelector('input');

    btnRestar.addEventListener('click', () => {
        let valorActual = parseInt(input.value) || 0;
        let min = parseInt(input.getAttribute('min')) || 1;
        if (valorActual > min) {
            input.value = valorActual - 1;
        }
    });

    btnSumar.addEventListener('click', () => {
        let valorActual = parseInt(input.value) || 0;
        let max = parseInt(input.getAttribute('max')) || 120;
        if (valorActual < max) {
            input.value = valorActual + 1;
        }
    });
});

btnEmpezarPomodoro.addEventListener('click', () => {
    const nombreTarea = inputTarea.value.trim() || 'Sesión de Enfoque'; 
    const minutosEnfoque = parseInt(inputEnfoque.value);
    const ciclosTotales = parseInt(inputCiclos.value);

    textoTareaActiva.innerText = nombreTarea;
    cicloTotalDisplay.innerText = ciclosTotales;
    cicloActualDisplay.innerText = "1"; 
    tiempoRestante = minutosEnfoque * 60;

    const minFormateados = minutosEnfoque < 10 ? `0${minutosEnfoque}` : minutosEnfoque;
    tiempoDisplay.innerText = `${minFormateados}:00`;

    modalConfiguracion.classList.add('pantalla-oculta');
    
    pantallaLobby.classList.remove('pantalla-activa');
    pantallaLobby.classList.add('pantalla-oculta');
    
    pantallaTemporizador.classList.remove('pantalla-oculta');
    pantallaTemporizador.classList.add('pantalla-activa');
});

btnVolverLobby.addEventListener('click', () => {
    clearInterval(intervaloReloj);
    estaCorriendo = false;
    btnPlayPause.innerHTML = '▶️ Empezar';
    document.body.classList.remove('tema-enfoque', 'tema-descanso', 'tema-descanso-largo');

    pantallaTemporizador.classList.remove('pantalla-activa');
    pantallaTemporizador.classList.add('pantalla-oculta');
    
    pantallaLobby.classList.remove('pantalla-oculta');
    pantallaLobby.classList.add('pantalla-activa');
});

btnPlayPause.addEventListener('click', () => {
    if (estaCorriendo) {
        clearInterval(intervaloReloj); 
        estaCorriendo = false;
        btnPlayPause.innerHTML = '▶️ Empezar';
        
        document.body.classList.remove('tema-enfoque', 'tema-descanso', 'tema-descanso-largo');
    } 
    else {
        estaCorriendo = true;
        btnPlayPause.innerHTML = '⏸️ Pausar';
        
        if (faseActual === 'enfoque') {
            document.body.classList.add('tema-enfoque');
        } else if (faseActual === 'descanso') {
            document.body.classList.add('tema-descanso');
        } else if (faseActual === 'descanso-largo') {
            document.body.classList.add('tema-descanso-largo');
        }
        
        intervaloReloj = setInterval(() => {
            tiempoRestante--; 
            
            let min = Math.floor(tiempoRestante / 60);
            let seg = tiempoRestante % 60;
            
            min = min < 10 ? '0' + min : min;
            seg = seg < 10 ? '0' + seg : seg;
            
            tiempoDisplay.innerText = `${min}:${seg}`;
            
            if (tiempoRestante <= 0) {
                clearInterval(intervaloReloj); 
                estaCorriendo = false;
                btnPlayPause.innerHTML = '▶️ Empezar';
                
                document.body.classList.remove('tema-enfoque', 'tema-descanso', 'tema-descanso-largo');

                if (faseActual === 'enfoque') {
                    const ciclosTotales = parseInt(inputCiclos.value);
                    
                    if (cicloActual >= ciclosTotales) {
                        let quiereDescansoLargo = confirm("¡Felicidades! Terminaste todos tus ciclos de enfoque. ¿Deseas tomar tu descanso largo de 15 minutos?");
                        
                        if (quiereDescansoLargo) {
                            faseActual = 'descanso-largo';
                            document.getElementById('fase-display').innerText = "Descanso Largo";
                            
                            document.querySelector('.circulo-progreso').style.borderColor = "var(--color-descanso-largo)";
                            
                            tiempoRestante = 15 * 60;
                        } else {
                            faseActual = 'enfoque';
                            cicloActual = 1;
                            cicloActualDisplay.innerText = cicloActual;
                            
                            pantallaTemporizador.classList.remove('pantalla-activa');
                            pantallaTemporizador.classList.add('pantalla-oculta');
                            pantallaLobby.classList.remove('pantalla-oculta');
                            pantallaLobby.classList.add('pantalla-activa');
                            return; 
                        }
                    } else {
                        faseActual = 'descanso';
                        document.getElementById('fase-display').innerText = "Descanso Corto";
                        document.querySelector('.circulo-progreso').style.borderColor = "var(--color-descanso-corto)";
                        
                        const minDescanso = parseInt(inputDescanso.value);
                        tiempoRestante = minDescanso * 60;
                    }
                } 
                else {
                    faseActual = 'enfoque';
                    
                    if (document.getElementById('fase-display').innerText === "Descanso Corto") {
                        cicloActual++; 
                        cicloActualDisplay.innerText = cicloActual;
                    } else {
                        cicloActual = 1;
                        cicloActualDisplay.innerText = cicloActual;
                    }
                    
                    document.getElementById('fase-display').innerText = "Tiempo de Enfoque";
                    document.querySelector('.circulo-progreso').style.borderColor = "var(--color-focus)";
                    
                    const minEnfoque = parseInt(inputEnfoque.value);
                    tiempoRestante = minEnfoque * 60;
                }

                let nuevoMin = Math.floor(tiempoRestante / 60);
                nuevoMin = nuevoMin < 10 ? '0' + nuevoMin : nuevoMin;
                tiempoDisplay.innerText = `${nuevoMin}:00`;
            }
        }, 1000); 
    }
});

btnDetener.addEventListener('click', () => {
    clearInterval(intervaloReloj);
    estaCorriendo = false;
    btnPlayPause.innerHTML = '▶️ Empezar';

    document.body.classList.remove('tema-enfoque', 'tema-descanso', 'tema-descanso-largo');
    
    faseActual = 'enfoque';
    document.getElementById('fase-display').innerText = "Tiempo de Enfoque";
    document.querySelector('.circulo-progreso').style.borderColor = "var(--color-focus)";
    
    const minutosOriginales = parseInt(inputEnfoque.value);
    tiempoRestante = minutosOriginales * 60;
    
    const minFormateados = minutosOriginales < 10 ? `0${minutosOriginales}` : minutosOriginales;
    tiempoDisplay.innerText = `${minFormateados}:00`;
});