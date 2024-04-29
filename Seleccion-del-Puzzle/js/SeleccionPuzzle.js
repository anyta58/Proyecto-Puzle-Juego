document.addEventListener('DOMContentLoaded', function () {

    const usuarioActual = localStorage.getItem('usuarioActual') ;
    const ultPartidaGanadausuaActual = localStorage.getItem(`numUltimaPartidaGanada-${usuarioActual}`)
    //creo que la linea anterior es innecesaria

    const btnElegirImagen = document.querySelector('#btnElegirImagen');
    const contenedorImg = document.querySelector('#contenedorImg');
    const contenedorimagenSeleccionada = document.querySelector('#contenedor-imagenSeleccionada');
    const btnDividir = document.querySelector('#btnDividir');
    const inputSelect = document.querySelector('#seleccionPuzzle');
    const contenedorSeleccion = document.querySelector('.contenedor-Seleccion')
    const contenedorImagenCuadricula = document.querySelector('#imagencuadricula');
    const contenedorCrearPuzzle = document.querySelector('.contenedor-btn-crearpuzzle');
    const btnCrearPuzzle = document.querySelector('#btncrearpuzzle');
    const btnRegresarMenuPrincipal = document.querySelector('#regresarmenuprincipal');
    const mensajesSeleccionTamano = document.querySelector('#mensajesSeleccionTamano')

    btnRegresarMenuPrincipal.addEventListener('click', () => {
        // window.open('../../Menu-de-Inicio/MenuInicio.html', '_self')
        window.open('../../index.html', '_self')
    });

    const imgs = contenedorImg.querySelectorAll('.imgs');
    imgs.forEach(img => {
        img.addEventListener('click', () => {
            const rutaImagen = img.getAttribute('src');

            contenedorimagenSeleccionada.style.display = 'block'
            contenedorimagenSeleccionada.innerHTML = `<img src="${rutaImagen}" alt="Imagen seleccionada">`;
            contenedorSeleccion.style.display = 'block'
            contenedorImg.style.display = 'none';

            //AÑADIDO PARA RECIBIR LA IMG DEL DIV con id contenedor-imagenSeleccionada
            const imagenEnContImagenSelec = contenedorimagenSeleccionada.querySelector('img');
            guardarImagenBase64(imagenEnContImagenSelec);

            const canvas = document.querySelector('#canvas');
            canvas.style.display = 'none';

            //Cuando se presiona una imagen se va a perder la partida iniciada si ya tenia alguna
            let movimientosrealizados = 0;
            setMovimientosRealizadosLS('movimientosrealizados', movimientosrealizados);
        });
    });

    btnElegirImagen.addEventListener('click', () => {
        if (contenedorImg.style.display === 'flex') {
            btnElegirImagen.textContent = 'Elegir Imagen'
            contenedorImg.style.display = 'none';

        } else {
            btnElegirImagen.textContent = 'Cambiar Imagen'
            contenedorImg.style.display = 'flex';
            //ocultar el resto de espacios
            contenedorimagenSeleccionada.style.display = 'none';
            contenedorSeleccion.style.display = 'none';
            contenedorCrearPuzzle.style.display = 'none';
            contenedorImagenCuadricula.style.display = 'none';
            eliminarPiezasExistentes();
        }
    });

    btnDividir.addEventListener('click', (evento) => {
        let numFilyCol = parseInt(inputSelect.value);
        evento.preventDefault();

    
        if(numFilyCol !== 3 && numFilyCol !== 4 && numFilyCol !== 5){
            mensajesSeleccionTamano.textContent = 'Selecciona el tamaño del tablero'
                mensajesSeleccionTamano.style.display = 'block';
                setTimeout(() => {
                mensajesSeleccionTamano.style.display = 'none';
                }, 3000);
            eliminarPiezasExistentes();
            contenedorImagenCuadricula.style.display = 'none';
            contenedorCrearPuzzle.style.display = 'none';
        }
        else{
            setNumFilyColLS('numFilyCol', numFilyCol);    //esto se recibira para la disposicion de la matriz y el tableri
            
            partirImagen(numFilyCol);
            contenedorImagenCuadricula.style.display = 'grid';
            contenedorImagenCuadricula.style.gridTemplateColumns = `repeat(${numFilyCol}, 1fr)`
            // contenedorImagenCuadricula.style.gap = "4px";
            contenedorCrearPuzzle.style.display = 'block'
            
            //Dandole estilos a las piezas
            let tamanoPieza = 510 / numFilyCol;
            let espacioRestante = 510 - (tamanoPieza * numFilyCol)
            // let gap = espacioRestante / (numFilyCol - 1);
            let gap = Math.floor(espacioRestante / (numFilyCol - 1));
            let piezas = document.querySelectorAll('.pieza-individual');
            piezas.forEach((pieza) => {
                pieza.style.width = `${tamanoPieza}px`
                pieza.style.height = `${tamanoPieza}px`
                pieza.style.marginRight = `${gap}px`
            })
        }

    });

    btnCrearPuzzle.addEventListener('click', () => {

        guardarEnLS();
        window.open('../../Juego-Puzzle/JuegoPuzzle.html', '_self')
    });

    function guardarImagenBase64(imagen) {
        // Obtener la ruta de la imagen
        const imageUrl = imagen.src;
    
        // Crear un nuevo objeto de tipo Image
        const img = new Image();
    
        // Cuando la imagen se carga completamente, convertirla a base64 y guardarla en el localStorage
        img.onload = function () {
            // Crear un lienzo (canvas) para convertir la imagen a base64
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
    
            canvas.width = img.width;
            canvas.height = img.height;
    
            // Dibujar la imagen en el lienzo
            ctx.drawImage(img, 0, 0);
    
            // Obtener la representación base64 de la imagen desde el lienzo
            const base64ImageData = canvas.toDataURL();
    
            // Guardar la imagen base64 en el localStorage
            setImagenVisibleLS('imagenVisible', base64ImageData);
        };
    
        // Establecer la fuente de la imagen en la URL de la imagen seleccionada
        img.src = imageUrl;

    }

    function partirImagen(numFilyCol) {
        const imagenDentroContImagenSelec = contenedorimagenSeleccionada.querySelector('img');
        const rutaImagen = imagenDentroContImagenSelec.getAttribute('src');
    
        // Crear una nueva imagen
        const image = new Image();
        
        // Establecer la fuente de la imagen en la URL de la imagen seleccionada
        image.src = rutaImagen;
    
        eliminarPiezasExistentes();
    
        // Obtener el contexto 2D del lienzo
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
    
        // Esperar a que la imagen se cargue completamente
        image.onload = function () {
            // Dibujar la imagen en el lienzo
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    
            // Calcular el ancho y alto de cada celda
            const numRows = numFilyCol;
            const numCols = numFilyCol;
            const cellWidth = canvas.width / numCols;
            const cellHeight = canvas.height / numRows;

            let acum = 0;
    
            // Iterar sobre cada celda de la cuadrícula
            for (let row = 0; row < numRows; row++) {

                let numPieza = 1;
                numPieza += acum;

                for (let col = 0; col < numCols; col++) {
                    // Calcular las coordenadas de la esquina superior izquierda de la celda
                    const x = col * cellWidth;
                    const y = row * cellHeight;
    
                    const imageData = ctx.getImageData(x, y, cellWidth, cellHeight);
    
                    // Crear un nuevo lienzo para la celda recortada
                    const cellCanvas = document.createElement('canvas');
                    cellCanvas.classList.add('pieza');
                    cellCanvas.width = cellWidth;
                    cellCanvas.height = cellHeight;
                    const cellCtx = cellCanvas.getContext('2d');
    
                    // Dibujar la imagen recortada en el nuevo lienzo
                    cellCtx.putImageData(imageData, 0, 0);

                    acum = col + numPieza;

                    //añadir num que va encima
                    const numeroPieza = document.createElement('span');
                    numeroPieza.classList.add('span-pieza')
                    let numero = document.createTextNode(acum);
                    numeroPieza.appendChild(numero);

                    //div que contendra el num e imagen de una pieza
                    const divUnaPieza = document.createElement('div');
                    divUnaPieza.classList.add('pieza-individual')
                    divUnaPieza.id = `${acum}`;

                    //agregar numero y lienzo al div
                    divUnaPieza.appendChild(numeroPieza);
                    divUnaPieza.appendChild(cellCanvas);
    
                    // Agregar el lienzo de la celda al contenedor de la cuadrícula
                    contenedorImagenCuadricula.appendChild(divUnaPieza);
                }
            }
        };
    }

    function eliminarPiezasExistentes() {
        //const contenedorImagenCuadricula = document.querySelector('#imagencuadricula');
    
        while (contenedorImagenCuadricula.firstChild) {
            contenedorImagenCuadricula.removeChild(contenedorImagenCuadricula.firstChild);
        }
    }

    function guardarEnLS() {
        const todasPiezas = document.querySelectorAll('.pieza-individual');
    
        const arrayPiezas = [];
    
        todasPiezas.forEach((pieza) => {
    
            const numeroPieza = pieza.querySelector('span').textContent;
    
            const canvas = pieza.querySelector('canvas');
    
            const imageDataUrl = canvas.toDataURL();
            //console.log(imageDataUrl);
    
            const datosPieza = {
                numeroPieza: numeroPieza,
                imagen: imageDataUrl,
            };
    
            arrayPiezas.push(datosPieza);
        });
    
        localStorage.setItem(`arrayPiezas-${usuarioActual}`, JSON.stringify(arrayPiezas));
        //console.log(arrayPiezas);
    }


    //AQUI VAN TODAS LAS FUNCIONES DEL LOCALSTORAGE 
    function setNumFilyColLS (key, value){
        localStorage.setItem(`${key}-${usuarioActual}`, JSON.stringify(value));
    }

    function setMovimientosRealizadosLS(key, value){
        localStorage.setItem(`${key}-${usuarioActual}`, JSON.stringify(value));
    }

    function setImagenVisibleLS(key, value){
        //no es necesario parsear el value porque es un base64
        localStorage.setItem(`${key}-${usuarioActual}`, value)
    }

});