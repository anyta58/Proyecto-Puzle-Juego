//VARIABLES QUE SE RECIBEN DESDE EL LOCALSTORAGE
const usuarioActual = localStorage.getItem('usuarioActual');
let ultPartidaGanadausuaActual = parseInt(localStorage.getItem('numUltimaPartidaGanada'));
let numFilyCol = getNumFilyColLS('numFilyCol');
let ultimoContadorTemporizador = getUltimoContadorTemporizadorLS('ultimoContadorTemporizador');
console.log(ultimoContadorTemporizador);
const imagenVisible = getImagenVisibleLS('imagenVisible');
const movPreviosBtnEmpezar = JSON.parse(localStorage.getItem(`movimientosrealizados-${usuarioActual}`));

let puzzleCompletado = 0; //esta variable es para que el usuario no acumule victorias en la misma ronda despues de completarlo
let contadorId;
let arregloDeLaMatrizEmpezada = [];
let matrizEmpezada = [];
let contadorTemporizador = 0;
let movimientosrealizados = 0;
let matrizResuelta = [];
let arregloDeLaMatriz = [];
let banderaVerPuzzle = true;
let matriz = [];
let matrizInicial = [];

const tablero = document.querySelector(".tablero");
tablero.style.display = "grid";
tablero.style.gridTemplateColumns = `repeat(${numFilyCol}, 1fr)`;
tablero.style.gap = "4px";
tablero.style.backgroundColor = "#f3f3f3";

const btnEmpezar = document.querySelector("#Empezar");
const primeraPantalla = document.querySelector(".primera-pantalla");
const contenedorBtnIniciar = document.querySelector(".contenedor-btnIniciar");
const temporizadorElemento = document.querySelector(".temporizador");
const movimientoElemento = document.querySelector(".movimientos");
const contenedorBtnJuego = document.querySelector(".btns-juego");
const btnNumerosAyuda = document.querySelector("#numAyuda");
const btnReiniciar = document.querySelector("#reiniciar");
const btnVerPuzzle = document.querySelector('#verPuzzle');
const btnMenuPrincipal = document.querySelector('#regMen');
const imagenpantallainicio = document.querySelector('#imagenpantallainicio')
imagenpantallainicio.src = imagenVisible;

btnNumerosAyuda.addEventListener("click", () => {
  const spanPieza = document.querySelectorAll(".span-pieza");

  spanPieza.forEach((elemento) => {
    //si los numeros estan visibles se tienen que ocultar
    if (elemento.style.display === "block") {
      elemento.style.display = "none";
      banderaVerPuzzle = false;
    } else {
      elemento.style.display = "block";
      banderaVerPuzzle = true;
    }
  });
});

btnMenuPrincipal.addEventListener('click', () => {
  guardarMatrizInicialEnLocalStorage();
  guardarPartidaLS();
  setUltimoContadorTemporizadorLS('ultimoContadorTemporizador', contadorTemporizador);
  setMovimientosRealizadosLS('movimientosrealizados', movimientosrealizados);
  // window.open('../../Menu-de-Inicio/MenuInicio.html', '_self')
  window.open('../../index.html', '_self')
});

function getMatrizInicialLS() {
  return JSON.parse(localStorage.getItem(`matrizInicial-${usuarioActual}`));
}

function setMatrizInicialLS(matriz) {
  localStorage.setItem(`matrizInicial-${usuarioActual}`, JSON.stringify(matriz));
}

btnReiniciar.addEventListener("click", () => {
  if (movimientosrealizados > 0) {
    reiniciarFichas(getMatrizInicialLS());
  }
});

btnVerPuzzle.addEventListener('click', () => {
  const imagenVisible = getImagenVisibleLS('imagenVisible');
  const imgVisibleSrc = document.createElement('img');
  imgVisibleSrc.src = imagenVisible; 
  imgVisibleSrc.classList.add('imagenvisible');
  
  const tableroAncho = tablero.clientWidth;
  const tableroAlto = tablero.clientHeight;
  
  imgVisibleSrc.width = tableroAncho;
  imgVisibleSrc.height = tableroAlto;
  
  tablero.appendChild(imgVisibleSrc);
  imgVisibleSrc.style.display = 'block';

  contenedorBtnJuego.style.display = 'none';

  setTimeout(function(){
    imgVisibleSrc.style.display = 'none';
    contenedorBtnJuego.style.display = 'flex';
  }, 3000);
});

if(movPreviosBtnEmpezar !== 0){
  btnEmpezar.textContent = 'Continuar Puzzle';
}

//Animacion de botones de Empezar y Jugar de Nuevo
btnEmpezar.addEventListener("mousedown", () => {
  btnEmpezar.style.top = "4px";
});
btnEmpezar.addEventListener("mouseup", () => {
  btnEmpezar.style.top = "0px";
});

//Presionar boton de Revolver Puzzle / Continuar Puzzle y Regresar al menu principal
btnEmpezar.addEventListener("click", () => {
  eliminarFichas();
  cargarLS();

  //si se accede a este if quiere decir que existe una partida empezada 
  if (ultimoContadorTemporizador !== null && puzzleCompletado === 0 && movimientosrealizados !== 0) {
    contadorTemporizador = ultimoContadorTemporizador
  } else {
    contadorTemporizador = 0;
    guardarMatrizInicialEnLocalStorage();
  }

  puzzleCompletado = 0;

  primeraPantalla.style.display = "none";
  contenedorBtnIniciar.style.display = "none";

  temporizadorElemento.style.display = "block";
  movimientoElemento.style.display = "block";

  // Determinar qué matriz usar como matriz inicial: una aleatoria o una comenzada
  if (movimientosrealizados === 0) {
    matriz = matrizInicial;
    setMatrizInicialLS(matrizInicial);
  } else {
    matriz = matrizEmpezada;
  }

  movimientoElemento.innerHTML = `Movimientos Realizados: ${movimientosrealizados}`;

  contenedorBtnJuego.style.display = "flex";

  comenzarTemporizador();
  dibujarFichas();
  cargarEventListeners();
  //aqui ya se esta añadiendo la imagen 
  implementandoimagenVisible();

  if (btnEmpezar.textContent === "Regresar al menu principal") {
    removeMatrizInicialLS('matrizInicial');
    localStorage.removeItem`arrayPiezas-${usuarioActual}`
    // window.open('../../Menu-de-Inicio/MenuInicio.html', '_self')
    window.open('../../index.html', '_self')
  }
});

function dibujarFichas() {
  console.log(matriz);
  matriz.forEach((fila) => {
    fila.forEach((elemento) => {
      const ficha = document.createElement("div");
      ficha.classList.add("fichas");
      if (elemento[0] === "") {
        ficha.classList.add("vacio");
      } else {
        ficha.classList.add("ficha");
        // Crear un elemento de imagen y establecer su atributo src con la URL almacenada en la matriz
        const imagenFicha = document.createElement("img");
        imagenFicha.classList.add("pieza");
        imagenFicha.src = elemento[1]; // Usar la URL almacenada en la matriz
        ficha.appendChild(imagenFicha);
      }

      // Añadir el número de la pieza
      const numeroFicha = document.createElement("span");
      numeroFicha.classList.add("span-pieza");
      numeroFicha.textContent = elemento[0];
      ficha.appendChild(numeroFicha);

      tablero.appendChild(ficha);
    });
  });

  //Esta parte es para que se mantenga la opcion que no se muestren los numeros despues de volver a dibujarse las fichas
  const spanFichas = document.querySelectorAll('.span-pieza');

  spanFichas.forEach((elemento) => {
    if(banderaVerPuzzle){
      elemento.style.display = 'block';
    }else{
      elemento.style.display = 'none';
    }
  });
}

function cargarEventListeners() {
  console.log("cargarEventListeners");
  const fichas = document.querySelectorAll(".fichas");
  fichas.forEach((ficha) => {
    ficha.addEventListener("click", listener);
  });
}

function buscarPosicion(elemento) {
  let indiceFila = 0;
  let indiceCol = 0;

  // Recorrer la matriz
  matriz.forEach((fila, indiceFilaMatriz) => {
    fila.forEach((elementoMatriz, indiceColMatriz) => {
      // Verificar si el elemento del DOM coincide con el elemento de la matriz
      if (elemento === elementoMatriz[0]) {
        indiceFila = indiceFilaMatriz;
        indiceCol = indiceColMatriz;
      }
    });
  });

  //console.log(indiceFila, indiceCol);
  return [indiceFila, indiceCol];
}

function puedeMoverse(posicionActual, posicionVacio) {
  // Movimiento horizontal,
  if (
    posicionActual[0] === posicionVacio[0] &&
    Math.abs(posicionActual[1] - posicionVacio[1]) === 1
  ) {
    return true;
  }
  // Movimiento vertical
  if (
    posicionActual[1] === posicionVacio[1] &&
    Math.abs(posicionActual[0] - posicionVacio[0]) === 1
  ) {
    return true;
  }
  // No se puede mover en otro caso
  return false;
}

function actualizarMatriz(contenidoSpan1, urlImagenPieza1, contenidoSpan2, urlImagenPieza2,
  posicionActual, posicionVacio) {

  matriz[posicionActual[0]][posicionActual[1]] = [
    contenidoSpan2,
    urlImagenPieza2,
  ];
  matriz[posicionVacio[0]][posicionVacio[1]] = [
    contenidoSpan1,
    urlImagenPieza1,
  ];

  eliminarFichas();
  dibujarFichas();
  cargarEventListeners();

  //console.log(matriz);
}

function eliminarFichas() {
  const tablero = document.querySelector('.tablero');
  const fichas = document.querySelectorAll('.fichas');

  fichas.forEach((ficha) => {
      ficha.removeEventListener('click', listener);
  });

  // Limpiar el tablero
  while (tablero.firstChild) {
      tablero.removeChild(tablero.firstChild);
  }

  //
  implementandoimagenVisible();
}

function desordenarMatriz() {
  let matrizDesorganizada = [];
  let filaTemp = []; //es para que se guarden arreglos dentro del arreglo

  //el .sort tiene similitud como otras funciones flechas como el some o .map
  //arregloDeLaMatriz ya tiene los datos que se pasaron [num, imagen]
  let arregloDesorganizado = arregloDeLaMatriz.sort(() => Math.random() - 0.5);

  let columna = 0;
  let fila = 0;

  arregloDesorganizado.forEach((elemento) => {
    //en este caso elemento es cada sub arreglo ['1', data:image], ['2', data:image] ...

    filaTemp.push(elemento);
    if (columna < numFilyCol - 1) {
      columna++;
    } else {
      matrizDesorganizada.push(filaTemp);
      filaTemp = [];
      columna = 0;
      fila++;
    }
  });

  //console.log(matrizDesorganizada);
  return matrizDesorganizada;
}

function verificarPuzzleCompleto() {
  for (let i = 0; i < matriz.length; i++) {
    for (let j = 0; j < matriz[i].length; j++) {
      if (matriz[i][j][0] !== matrizResuelta[i][j][0]) {
        return false;
      }
    }
  }
  return true;
}

function comenzarTemporizador() {
  temporizadorElemento.textContent = `Tiempo: ${contadorTemporizador} s`;

  contadorId = setInterval(() => {
    contadorTemporizador++;
    setUltimoContadorTemporizadorLS('ultimoContadorTemporizador', contadorTemporizador);
    temporizadorElemento.textContent = `Tiempo: ${contadorTemporizador} s`;

    if (puzzleCompletado === 1) {
      clearInterval(contadorId);
      temporizadorElemento.textContent = `Tiempo: ${contadorTemporizador} s`;
    }
  }, 1000);
}

function cargarLS() {
  // Verificar si hay datos guardados en el Local Storage
  const existenMovimientosPrevios = localStorage.getItem(`movimientosrealizados-${usuarioActual}`);
  console.log(`existenMovimientosPrevios: ${existenMovimientosPrevios}`);

  if (!!existenMovimientosPrevios) {
    console.log('Desde if (!!existenMovimientosPrevios)');
    movimientosrealizados = getMovimientosRealizadosLS(existenMovimientosPrevios);

    //Aqui se recargan los datos que van al arreglo de la matrizsolucion
    const arrayPiezasJSON = localStorage.getItem(`arrayPiezas-${usuarioActual}`);
    if (arrayPiezasJSON !== null) {
      const arrayPiezas = JSON.parse(arrayPiezasJSON);

      arrayPiezas.forEach((pieza, indice) => {
        const imagen64ImageData = pieza.imagen;
        if (indice < arrayPiezas.length - 1) {
          arregloDeLaMatriz.push([pieza.numeroPieza, imagen64ImageData]);
        } else {
          arregloDeLaMatriz.push(["", imagen64ImageData]);
        }
      });

      pasarArregloaMatrizSolucion();
    }
    //Aqui se finaliza la recarga los datos que van al arreglo de la matrizsolucion

    //SI NO EXISTEN MOVIMIENTOS CREAR UNA NUEVA MATRIZ
    if (movimientosrealizados === 0) {
      if (arrayPiezasJSON !== null) {
        //Llamado para crear la matriz Inicial
          matrizInicial = desordenarMatriz();
      }
    } 
    else {
      cargarPartidaLS();
    }
  } 
  
}

function pasarArregloaMatrizSolucion() {
  let fila = [];

  for (let i = 0; i < arregloDeLaMatriz.length; i++) {
    fila.push(arregloDeLaMatriz[i]);

    // Si el tamaño del grupo es igual a numingresado o si se ha alcanzado el final del arreglo original
    if (fila.length === numFilyCol || i === arregloDeLaMatriz.length - 1) {
      matrizResuelta.push(fila);

      fila = [];
    }
  }

  //console.log(matrizResuelta);
}

function guardarPartidaLS() {
  const fichas = document.querySelectorAll(".fichas");
  const arrayFichasPartida = [];

  fichas.forEach((ficha) => {
    const spanFicha = ficha.querySelector("span");
    const contenidoSpanFicha = spanFicha.textContent;
    const imagenFicha = ficha.querySelector("img");
    const urlImagenFicha = imagenFicha ? imagenFicha.src : "";

    arrayFichasPartida.push({
      numeroFicha: contenidoSpanFicha,
      imgFicha: urlImagenFicha,
    });
  });

  localStorage.setItem(`arrayFichasPartida-${usuarioActual}`, JSON.stringify(arrayFichasPartida));
}

function cargarPartidaLS() {
  puzzleCompletado = 0;
  eliminarFichas(); // Limpiar el tablero antes de cargar la partida

  const arrayFichasPartidaJSON = localStorage.getItem(`arrayFichasPartida-${usuarioActual}`);

  if (arrayFichasPartidaJSON !== null) {
    const arrayFichasPartida = JSON.parse(arrayFichasPartidaJSON);

    // Limpiar arregloDeLaMatrizEmpezada antes de cargar nuevos datos
    arregloDeLaMatrizEmpezada = [];

    arrayFichasPartida.forEach((ficha) => {
      let imagenData = ficha.imgFicha !== undefined ? ficha.imgFicha : "";
      arregloDeLaMatrizEmpezada.push([ficha.numeroFicha, imagenData]);
    });

    // Llamar a la función para pasar el arreglo a la matriz empezada
    pasarArregloaMatrizEmpezada();
  }
}

function pasarArregloaMatrizEmpezada() {
  // Reiniciar la matrizEmpezada para evitar duplicados
  matrizEmpezada = [];

  // Iterar sobre el arreglo y llenar la matrizEmpezada
  for (let i = 0; i < arregloDeLaMatrizEmpezada.length; i += numFilyCol) {
    let fila = [];
    for (let j = i; j < i + numFilyCol; j++) {
      if (Array.isArray(arregloDeLaMatrizEmpezada[j])) {
        fila.push([...arregloDeLaMatrizEmpezada[j]]);
      } else {
        fila.push(["", ""]);
      }
    }
    matrizEmpezada.push(fila);
  }
}

function listener() {
  const fichas = document.querySelectorAll(".ficha");
  // Obtener las referencias necesarias a elementos dentro de la ficha
  const span1 = this.querySelector("span");
  const contenidoSpan1 = span1.textContent;
  const imagenPieza1 = this.querySelector("img");
  const urlImagenPieza1 = imagenPieza1.currentSrc;

  // Obtener la referencia a la ficha vacía
  const piezaVacia = document.querySelector(".vacio");
  const span2 = piezaVacia.querySelector("span");
  const contenidoSpan2 = span2.textContent;
  const imagenPieza2 = piezaVacia.querySelector("img");
  const urlImagenPieza2 = imagenPieza2 ? imagenPieza2.currentSrc : null;

  // Realizar la lógica para verificar si se puede hacer el movimiento
  const posicionActual = buscarPosicion(contenidoSpan1);
  const posicionVacio = buscarPosicion(contenidoSpan2);
  const movimiento = puedeMoverse(posicionActual, posicionVacio);

  if (movimiento) {
    // Actualizar la matriz y realizar otras operaciones necesarias
    movimientosrealizados++;
    movimientoElemento.innerHTML = `Movimientos Realizados: ${movimientosrealizados}`;
    setMovimientosRealizadosLS('movimientosrealizados', movimientosrealizados);

    actualizarMatriz(contenidoSpan1, urlImagenPieza1, contenidoSpan2, urlImagenPieza2,
                    posicionActual, posicionVacio);

    guardarPartidaLS();

    const resultadoComparacion = verificarPuzzleCompleto();

    if (resultadoComparacion && puzzleCompletado === 0) {

      confetti({
        particleCount: 300,
        spread: 180,
      });

      removeMatrizInicialLS('matrizInicial');

      subirDatosPartida();

      movimientosrealizados = 0;
      setMovimientosRealizadosLS('movimientosrealizados', movimientosrealizados);

      //ANTES DE SETEAR LA SIGUIENTE LINEA SE DEBE SETEAR EN CADA JUGAR EL TIEMPO DE CADA PARTIDA
      setUltimoContadorTemporizadorLS('ultimoContadorTemporizador', 0);

      contenedorBtnJuego.style.display = "none";
      puzzleCompletado = 1;

      //CON ESTO SE ESTABLECE QUE ESTE BOTON APAREZCA DOS SEGUNDOS DESPUES
      setTimeout(() => {
        if (puzzleCompletado === 1) {
          contenedorBtnIniciar.style.display = "block";
          //antes decia Jugar de nuevo
          btnEmpezar.style.fontSize = '16px';
          btnEmpezar.textContent = "Regresar al menu principal";
        }
      }, 2000);

      //AÑADIR LA IMAGEN QUE APAREZCA EL PUZZLE RESUELTO
      const imagenVisible = getImagenVisibleLS('imagenVisible');
      const imgVisibleSrc = document.createElement('img');
      imgVisibleSrc.src = imagenVisible; 
      imgVisibleSrc.classList.add('imagenvisible');
      
      const tableroAncho = tablero.clientWidth;
      const tableroAlto = tablero.clientHeight;
      
      imgVisibleSrc.width = tableroAncho;
      imgVisibleSrc.height = tableroAlto;
      
      tablero.appendChild(imgVisibleSrc);
      imgVisibleSrc.style.display = 'block';

      //ESTO SE PODRIA PONER DENTRO DE UN SETTIMEOUT Y DARLE ANIMACION
      const divFelicitacion = document.createElement('div');
      const parrafodivFelicitacion = document.createElement('p');
      parrafodivFelicitacion.id = 'textofelicitacion';
      parrafodivFelicitacion.textContent = 'Felicidades haz completado el Puzzle';
      divFelicitacion.appendChild(parrafodivFelicitacion);
      divFelicitacion.classList.add('divFelicitacion')
      // divFelicitacion.textContent = 'Felicidades haz completado el Puzzle'
      document.body.appendChild(divFelicitacion);

      //QUITAR EL MENSAJE DESPUES DE 2 SEGUNDOS
      setTimeout(function(){
        divFelicitacion.style.display = 'none';
      }, 2000);

      localStorage.removeItem(`arrayFichasPartida-${usuarioActual}`); //ESTA LINEA PROBABLEMENTE LLEGUE A DAR PROBLEMAS O NO

      //MOVER UN POCO MAS EL BOTON DE LOS MOVIMIENTOS REALIZADOS
      btnEmpezar.style.marginTop = '15px';
      const btnEmpezarSombra = document.querySelector('.btn-Sombra');
      btnEmpezarSombra.style.marginTop = '15px';
      movimientoElemento.style.marginTop = '100px';

      fichas.forEach((ficha) => {
        ficha.removeEventListener("click", listener);
      });
    }
  }
}

function reiniciarFichas(matrizReinicio) {
  matriz = matrizReinicio;
  eliminarFichas();
  dibujarFichas();
  cargarEventListeners();
  guardarPartidaLS();
}

//Esto es para que la imagenvisible exista siempre que se ejecute eliminarFichas() o btnEmpezar
function implementandoimagenVisible() {

  const imagenVisible = getImagenVisibleLS('imagenVisible');
  const imgVisibleSrc = document.createElement('img')
  imgVisibleSrc.src = imagenVisible; 
  imgVisibleSrc.classList.add('imagenvisible');

  const tableroAncho = tablero.clientWidth;
  const tableroAlto = tablero.clientHeight;

  imgVisibleSrc.width = tableroAncho;
  imgVisibleSrc.height = tableroAlto

  tablero.appendChild(imgVisibleSrc);
}

function subirDatosPartida(){

  let numUltimaPartidaGanada = JSON.parse(localStorage.getItem(`numUltimaPartidaGanada-${usuarioActual}`))
  numUltimaPartidaGanada += 1;
  let usuariosEstadisticas;
  const usuariosEstadisticasString = localStorage.getItem('usuariosEstadisticas');

  if(usuariosEstadisticasString !== null){
    usuariosEstadisticas = JSON.parse(usuariosEstadisticasString);
  }else{
    usuariosEstadisticas = [];
  }

  const datosPartida = {
    nickname: usuarioActual,
    numPartida: numUltimaPartidaGanada,
    tiempo: contadorTemporizador,
    numFilyCol: numFilyCol,
    movHechos: movimientosrealizados,
  }

  usuariosEstadisticas.push(datosPartida)
  localStorage.setItem('usuariosEstadisticas', JSON.stringify(usuariosEstadisticas));

  localStorage.setItem(`numUltimaPartidaGanada-${usuarioActual}`, JSON.stringify(numUltimaPartidaGanada))

}

function guardarMatrizInicialEnLocalStorage() {
  localStorage.setItem(`matrizInicial-${usuarioActual}`, JSON.stringify(getMatrizInicialLS()));
}

//FUNCIONES RELACIONADAS AL LOCALSTORAGE DE LOS USUARIOS
//Funciones get______LS
function getNumFilyColLS (key) {
  return JSON.parse(localStorage.getItem(`${key}-${usuarioActual}`))
}

function getUltimoContadorTemporizadorLS(key){
  return JSON.parse(localStorage.getItem(`${key}-${usuarioActual}`));
}

function getMovimientosRealizadosLS(key){
  return JSON.parse(key);
}

function getImagenVisibleLS(key){
  return localStorage.getItem(`${key}-${usuarioActual}`);
}

function getMatrizInicialLS() {
  return JSON.parse(localStorage.getItem(`matrizInicial-${usuarioActual}`));
}

//Funciones set_______LS
function setUltimoContadorTemporizadorLS(key, value){
  localStorage.setItem(`${key}-${usuarioActual}`, JSON.stringify(value));
}

function setMovimientosRealizadosLS(key, value){
  localStorage.setItem(`${key}-${usuarioActual}`, JSON.stringify(value));
}

//Funciones remove______LS
function removeMatrizInicialLS(key){
  localStorage.removeItem(`${key}-${usuarioActual}`)
}