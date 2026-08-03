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
const anilloAnimado = document.getElementById('anillo-animado'); 
const sonidoAlarma = document.getElementById('sonido-alarma');
const btnRapido = document.getElementById('btn-rapido');
const btnPresets = document.getElementById('btn-presets');
const modalFavoritos = document.getElementById('modal-favoritos');
const btnCerrarFavoritos = document.getElementById('btn-cerrar-favoritos');
const listaFavoritos = document.getElementById('lista-favoritos');
const btnInmersivo = document.getElementById('btn-inmersivo');
const inputDescansoLargo = document.getElementById('input-descanso-largo');
const modalDescansoLargo = document.getElementById('modal-descanso-largo');
const btnTomarDescanso = document.getElementById('btn-tomar-descanso');
const btnOmitirDescanso = document.getElementById('btn-omitir-descanso');
const textoMinutosLargo = document.getElementById('texto-minutos-largo');
const modalEliminarFav = document.getElementById('modal-eliminar-fav');
const btnConfirmarEliminar = document.getElementById('btn-confirmar-eliminar');
const btnCancelarEliminar = document.getElementById('btn-cancelar-eliminar');

let tiempoRestante = 0; 
let tiempoTotalOriginal = 0; 
let intervaloReloj = null;
let estaCorriendo = false;
let faseActual = 'enfoque';
let cicloActual = 1;
let creandoFavorito = false;
let indiceAEliminar = null; 

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
    if (localStorage.getItem('gattodoro_ultima_sesion')) {
        btnRapido.classList.remove('oculto-inicio');
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
    creandoFavorito = false;
    btnEmpezarPomodoro.innerText = 'Listo'; 
    inputTarea.value = ''; 
    inputTarea.placeholder = "¿Qué vas a enfocar hoy?";
    modalConfiguracion.classList.remove('pantalla-oculta');
});

btnCerrarModal.addEventListener('click', () => {
    modalConfiguracion.classList.add('pantalla-oculta');
    if (creandoFavorito) {
        creandoFavorito = false;
        btnEmpezarPomodoro.innerText = 'Listo';
        modalFavoritos.classList.remove('pantalla-oculta'); 
    }
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
    const nombreTarea = inputTarea.value.trim() || (creandoFavorito ? 'Nuevo Favorito' : 'Sesión de Enfoque'); 
    const minutosEnfoque = parseInt(inputEnfoque.value);
    const ciclosTotales = parseInt(inputCiclos.value);
    const minutosDescanso = parseInt(inputDescanso.value);

    if (creandoFavorito) {
        const nuevoFav = {
            nombre: nombreTarea, 
            tarea: nombreTarea,
            enfoque: minutosEnfoque,
            descanso: minutosDescanso,
            ciclos: ciclosTotales
        };
        favoritosGuardados.push(nuevoFav);
        localStorage.setItem('gattodoro_favoritos', JSON.stringify(favoritosGuardados));
        
        creandoFavorito = false;
        btnEmpezarPomodoro.innerText = 'Listo'; 
        modalConfiguracion.classList.add('pantalla-oculta');
        
        renderizarFavoritos(); 
        modalFavoritos.classList.remove('pantalla-oculta'); 
        return; 
    }

    textoTareaActiva.innerText = nombreTarea;
    cicloTotalDisplay.innerText = ciclosTotales;
    cicloActualDisplay.innerText = "1"; 
    
    tiempoRestante = minutosEnfoque * 60;
    tiempoTotalOriginal = tiempoRestante; 
    anilloAnimado.style.strokeDashoffset = '0'; 

    const minFormateados = minutosEnfoque < 10 ? `0${minutosEnfoque}` : minutosEnfoque;
    tiempoDisplay.innerText = `${minFormateados}:00`;

    const configSesion = {
        tarea: nombreTarea,
        enfoque: minutosEnfoque,
        descanso: minutosDescanso,
        ciclos: ciclosTotales
    };
    localStorage.setItem('gattodoro_ultima_sesion', JSON.stringify(configSesion));
    btnRapido.classList.remove('oculto-inicio');

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

            let porcentaje = tiempoRestante / tiempoTotalOriginal;
            let offset = 283 - (porcentaje * 283);
            anilloAnimado.style.strokeDashoffset = offset;
            
            let min = Math.floor(tiempoRestante / 60);
            let seg = tiempoRestante % 60;
            
            min = min < 10 ? '0' + min : min;
            seg = seg < 10 ? '0' + seg : seg;
            
            tiempoDisplay.innerText = `${min}:${seg}`;
            
            if (tiempoRestante <= 0) {
                clearInterval(intervaloReloj); 
                estaCorriendo = false;
                btnPlayPause.innerHTML = '▶️ Empezar';

                sonidoAlarma.play();
                
                document.body.classList.remove('tema-enfoque', 'tema-descanso', 'tema-descanso-largo');

                if (faseActual === 'enfoque') {
                    const ciclosTotales = parseInt(inputCiclos.value);
                    
                    if (cicloActual >= ciclosTotales) {
                        // Mostramos nuestro modal personalizado
                        textoMinutosLargo.innerText = inputDescansoLargo.value;
                        modalDescansoLargo.classList.remove('pantalla-oculta');
                    } else {
                        faseActual = 'descanso';
                        document.getElementById('fase-display').innerText = "DESCANSO";
                        
                        anilloAnimado.style.stroke = "var(--color-descanso-corto)";
                        
                        const minDescanso = parseInt(inputDescanso.value);
                        tiempoRestante = minDescanso * 60;
                        tiempoTotalOriginal = tiempoRestante;
                        anilloAnimado.style.strokeDashoffset = '0';
                    }
                }
                else {
                    faseActual = 'enfoque';
                    
                    // Aseguramos que detecte correctamente la palabra en mayúsculas
                    if (document.getElementById('fase-display').innerText === "DESCANSO") {
                        cicloActual++; 
                        cicloActualDisplay.innerText = cicloActual;
                    } else {
                        cicloActual = 1;
                        cicloActualDisplay.innerText = cicloActual;
                    }
                    
                    document.getElementById('fase-display').innerText = "ENFOQUE";
                    
                    anilloAnimado.style.stroke = "var(--color-focus)"; 
                    
                    const minEnfoque = parseInt(inputEnfoque.value);
                    tiempoRestante = minEnfoque * 60;
                    tiempoTotalOriginal = tiempoRestante;
                    anilloAnimado.style.strokeDashoffset = '0';
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
    document.getElementById('fase-display').innerText = "ENFOQUE";
    
    anilloAnimado.style.stroke = "var(--color-focus)"; 
    
    const minutosOriginales = parseInt(inputEnfoque.value);
    tiempoRestante = minutosOriginales * 60;
    tiempoTotalOriginal = tiempoRestante;
    anilloAnimado.style.strokeDashoffset = '0'; 
    
    const minFormateados = minutosOriginales < 10 ? `0${minutosOriginales}` : minutosOriginales;
    tiempoDisplay.innerText = `${minFormateados}:00`;
});

let favoritosGuardados = JSON.parse(localStorage.getItem('gattodoro_favoritos')) || [];

function renderizarFavoritos() {
    listaFavoritos.innerHTML = '';
    
    favoritosGuardados.forEach((fav, index) => {
        const div = document.createElement('div');
        div.className = 'item-favorito';
        
        const btnCargar = document.createElement('button');
        btnCargar.className = 'btn-cargar-fav';
        btnCargar.innerText = `📁 ${fav.nombre} (${fav.enfoque}m / ${fav.descanso}m)`;
        btnCargar.addEventListener('click', () => {
            inputTarea.value = fav.nombre;
            inputEnfoque.value = fav.enfoque;
            inputDescanso.value = fav.descanso;
            inputCiclos.value = fav.ciclos;
            
            modalFavoritos.classList.add('pantalla-oculta');
            modalConfiguracion.classList.remove('pantalla-oculta');
        });

        const btnEliminar = document.createElement('button');
        btnEliminar.className = 'btn-eliminar-fav';
        btnEliminar.innerText = '🗑️';
        btnEliminar.title = "Eliminar favorito";
        btnEliminar.addEventListener('click', () => {
            indiceAEliminar = index; 
            modalEliminarFav.classList.remove('pantalla-oculta');
        });

        div.appendChild(btnCargar);
        div.appendChild(btnEliminar);
        listaFavoritos.appendChild(div);
    });

    if (favoritosGuardados.length < 5) {
        const btnAgregar = document.createElement('button');
        btnAgregar.className = 'btn-agregar-fav';
        btnAgregar.innerText = '➕ Crear nuevo favorito';
        
        btnAgregar.addEventListener('click', () => {
            creandoFavorito = true;

            inputTarea.value = '';
            inputTarea.placeholder = "Nombre";
            inputEnfoque.value = 25;
            inputDescanso.value = 5;
            inputCiclos.value = 4;
            
            btnEmpezarPomodoro.innerText = 'Guardar Favorito';
            
            modalFavoritos.classList.add('pantalla-oculta');
            modalConfiguracion.classList.remove('pantalla-oculta');
        });
        listaFavoritos.appendChild(btnAgregar);
    }
}

btnPresets.addEventListener('click', () => {
    renderizarFavoritos(); 
    modalFavoritos.classList.remove('pantalla-oculta');
});

btnCerrarFavoritos.addEventListener('click', () => {
    modalFavoritos.classList.add('pantalla-oculta');
});

btnRapido.addEventListener('click', () => {
    const sesionGuardada = JSON.parse(localStorage.getItem('gattodoro_ultima_sesion'));
    
    if (sesionGuardada) {
        textoTareaActiva.innerText = sesionGuardada.tarea;
        cicloTotalDisplay.innerText = sesionGuardada.ciclos;
        cicloActualDisplay.innerText = "1"; 
        
        tiempoRestante = sesionGuardada.enfoque * 60;
        tiempoTotalOriginal = tiempoRestante;
        
        anilloAnimado.style.strokeDashoffset = '0';
        anilloAnimado.style.stroke = "var(--color-focus)";
        faseActual = 'enfoque';

        inputTarea.value = sesionGuardada.tarea;
        inputEnfoque.value = sesionGuardada.enfoque;
        inputDescanso.value = sesionGuardada.descanso;
        inputCiclos.value = sesionGuardada.ciclos;

        const minFormateados = sesionGuardada.enfoque < 10 ? `0${sesionGuardada.enfoque}` : sesionGuardada.enfoque;
        tiempoDisplay.innerText = `${minFormateados}:00`;

        pantallaLobby.classList.remove('pantalla-activa');
        pantallaLobby.classList.add('pantalla-oculta');
        pantallaTemporizador.classList.remove('pantalla-oculta');
        pantallaTemporizador.classList.add('pantalla-activa');
    }
});

// --- LÓGICA DEL MODO INMERSIVO ---
btnInmersivo.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error intentando activar modo inmersivo: ${err.message}`);
        });
    }
});

document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
        document.body.classList.add('modo-inmersivo');
    } else {
        document.body.classList.remove('modo-inmersivo');
    }
});


btnTomarDescanso.addEventListener('click', () => {
    modalDescansoLargo.classList.add('pantalla-oculta'); 
    faseActual = 'descanso-largo';
    document.getElementById('fase-display').innerText = "DESCANSO LARGO";
    
    anilloAnimado.style.stroke = "var(--color-descanso-largo)"; 
    
    const minLargo = parseInt(inputDescansoLargo.value);
    tiempoRestante = minLargo * 60;
    tiempoTotalOriginal = tiempoRestante;
    anilloAnimado.style.strokeDashoffset = '0';
    
    let nuevoMin = minLargo < 10 ? '0' + minLargo : minLargo;
    tiempoDisplay.innerText = `${nuevoMin}:00`;
});

btnOmitirDescanso.addEventListener('click', () => {
    modalDescansoLargo.classList.add('pantalla-oculta'); 
    faseActual = 'enfoque';
    cicloActual = 1;
    cicloActualDisplay.innerText = cicloActual;
    
    pantallaTemporizador.classList.remove('pantalla-activa');
    pantallaTemporizador.classList.add('pantalla-oculta');
    pantallaLobby.classList.remove('pantalla-oculta');
    pantallaLobby.classList.add('pantalla-activa');
});

btnCancelarEliminar.addEventListener('click', () => {
    indiceAEliminar = null; 
    modalEliminarFav.classList.add('pantalla-oculta');
});

btnConfirmarEliminar.addEventListener('click', () => {
    if (indiceAEliminar !== null) {
        favoritosGuardados.splice(indiceAEliminar, 1);
        localStorage.setItem('gattodoro_favoritos', JSON.stringify(favoritosGuardados));
        renderizarFavoritos(); 
        
        indiceAEliminar = null; 
        modalEliminarFav.classList.add('pantalla-oculta');
    }
});