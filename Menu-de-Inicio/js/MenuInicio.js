document.addEventListener('DOMContentLoaded', function () {
    const usuarioActual = localStorage.getItem('usuarioActual');
    const singupForm = document.querySelector('#singupForm');
    const btnInstrucciones = document.querySelector('#btnInstrucciones');
    const contenedorInstrucciones = document.querySelector('#instrucciones');
    const btnVerUsuarios = document.querySelector('#btnVerUsuarios')
    const mensajeSeleccion = document.querySelector('#mensajeSeleccion');
    const mensajeRegistro = document.querySelector('#mensajeRegistro');
    const registroExitoso = document.querySelector('#registroExitoso');
    const btnResultados = document.querySelector('#btnResultados');
    const contenedorTabla = document.querySelector('#contenedor-Tabla')
    const btnNuevoJuego = document.querySelector('#btnNuevoJuego');
    const btncontinuarJuego = document.querySelector('#btnContinuarJuego');
    const mensajeNuevoJuego = document.querySelector('#mensajeNuevoJuego');
    const mensajeMovimientosUsuarioActual = document.querySelector('#mensajeMovimientosUsuarioActual');
    
        btnInstrucciones.addEventListener('click', () => {
            if (contenedorInstrucciones.style.display === 'flex') {
                contenedorInstrucciones.style.display = 'none';
            } else {
                contenedorInstrucciones.style.display = 'flex';
            }
        });
    
        function mostrarUsuarios() {
            const usersContainer = document.querySelector('#usersContainer');
            const Users = JSON.parse(localStorage.getItem('users')) || [];
    
            // Limpiar el contenedor antes de agregar los usuarios
            usersContainer.innerHTML = '';
    
            //la siguiente condicion fue la que se añadio
            if(usersContainer.style.display === 'block'){
                usersContainer.style.display = 'none';
            }else{
                usersContainer.style.display = 'block';
            }
    
            if (Users.length === 0) {
                usersContainer.textContent = 'No hay usuarios registrados.';
                // alert ('No hay usuarios registrados.')
            } else {
                const userList = document.createElement('div');
    
                Users.forEach(user => {
                const userItem = document.createElement('div');
                userItem.classList.add('user-item'); 
                userItem.textContent = user.name;
                userItem.addEventListener('click', () => seleccionarUsuario(user.name));
                userList.appendChild(userItem);
                });
                
                usersContainer.appendChild(userList);
            }
        }
    
         // Función para seleccionar un usuario y guardarlo en el Local Storage
        function seleccionarUsuario(userName) {
            localStorage.setItem('usuarioActual', userName);
            mensajeSeleccion.textContent =`Has seleccionado a ${userName} para jugar.`;
            // Redirigir al juego.
            mensajeSeleccion.style.display = 'block';
    
            const usersContainer = document.querySelector('#usersContainer');
            if(usersContainer.style.display === 'block'){
                usersContainer.style.display = 'none';
            }else{
                usersContainer.style.display = 'block';
            }
            
        }
    
        singupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.querySelector('#name').value;
            
            const Users = JSON.parse(localStorage.getItem('users')) || [];
            const isUserRegistered = Users.find(user => user.name === name);
            
            if (isUserRegistered) {
                mensajeRegistro.textContent = 'El usuario ya está registrado';
                mensajeRegistro.style.display = 'block';
                setTimeout(() => {
                    mensajeRegistro.style.display = 'none';
                }, 3000);
                return;
            }
            
            Users.push({ name: name });
            localStorage.setItem('users', JSON.stringify(Users));
            //Implementando movimientos realizados y num de ultima partida ganada.
            let movimientosrealizados = 0;
            let numUltPartidagan = 0;
    
            setUltimaPartidaGanada('numUltimaPartidaGanada', numUltPartidagan);
            function setUltimaPartidaGanada(key, value){
                localStorage.setItem(`${key}-${name}`, JSON.stringify(value));
            }
    
            setMovimientosRealizadosLS('movimientosrealizados', movimientosrealizados);
            function setMovimientosRealizadosLS(key, value){
                localStorage.setItem(`${key}-${name}`, JSON.stringify(value));
            }
    
            registroExitoso.textContent = 'Registro Exitoso!';
            registroExitoso.style.display = 'block';
            setTimeout(() => {
                registroExitoso.style.display = 'none';
                // window.location.href = 'inicio.html';
            }, 3000); 
        });
    
        // Agregar evento de clic al botón de usuarios existentes
        btnVerUsuarios.addEventListener('click', mostrarUsuarios);
    
        // Verificar si hay un usuario seleccionado al cargar la página
        // const usuarioActual = localStorage.getItem('usuarioActual');
        if (usuarioActual) {
            mensajeSeleccion.textContent = `Has seleccionado a ${usuarioActual} para jugar.`;
            mensajeSeleccion.style.display = 'block';
        } else {
            mensajeSeleccion.textContent = 'No hay usuario seleccionado.';
            mensajeSeleccion.style.display = 'none';
        }
    
        btnResultados.addEventListener('click', () =>{
            const contenedorResultados = document.querySelector('#resultados');
    
            if (contenedorTabla.style.display === 'flex') {
                contenedorTabla.style.display = 'none';
                contenedorResultados.style.height = '100px';
            } else {
                contenedorTabla.style.display = 'flex';
                contenedorResultados.style.height = 'auto';
            }
    
            // console.log('prueba');
    
            //--------Obteniendo el arreglo que esta en localstorage --------------
            let usuariosEstadisticas; 
            const usuariosEstadisticasString = localStorage.getItem('usuariosEstadisticas');
    
            if(usuariosEstadisticasString !== null){
                usuariosEstadisticas = JSON.parse(usuariosEstadisticasString);
            }else{
                usuariosEstadisticas = [];
            }
            // console.log(usuariosEstadisticas);
    
            // --------------Creacion de la tabla en base a los datos del localstorage ----------
    
            let crearTabla = function(lista){
            //let stringTabla = `<tr><th>Usuario</th><th># de Partida</th><th>Tiempo</th><th># Fil y Col</th><th>Mov. Hechos</th></tr>`;
    
            let stringTabla = `<thead>
            <tr>
                <th>Usuario</th><th># de Partida</th><th>Tiempo</th><th># Fil y Col</th><th>Mov. Hechos</th>
            </tr>
            </thead>`
    
            for(let dato of lista){
                let fila = `<tr> 
                <td>${dato.nickname}</td>
                <td>${dato.numPartida}</td>
                <td>${dato.tiempo}</td>
                <td>${dato.numFilyCol}</td>
                <td>${dato.movHechos}</td>
                </tr>`
    
                stringTabla += fila;
                //console.log(stringTabla);
            }
            return stringTabla
        }
        console.log(usuariosEstadisticas);
        //el llamado tiene que ir despues de la declaracion de la funcion por el scope
        document.getElementById('tablaResultados').innerHTML = crearTabla(usuariosEstadisticas)
        });
    
        btnNuevoJuego.addEventListener('click', () => {
            const usuarioActual = localStorage.getItem('usuarioActual');
            if (!usuarioActual) {
                mensajeNuevoJuego.textContent = 'Error: Debes seleccionar un usuario para iniciar un nuevo juego.';
                mensajeNuevoJuego.style.display = 'block';
                setTimeout(() => {
                mensajeNuevoJuego.style.display = 'none';
                }, 3000);
                // return;
            }else{
                mensajeNuevoJuego.textContent = `Bienvenido ${usuarioActual}`;
                mensajeNuevoJuego.style.display = 'block';
                setTimeout(() => {
                mensajeNuevoJuego.style.display = 'none';
                window.open('../../Seleccion-del-Puzzle/SeleccionPuzzle.html', '_self')
                }, 3000);
            }
        });
    
        btncontinuarJuego.addEventListener('click', () =>{
            const usuarioActual = localStorage.getItem('usuarioActual');
            const movimientosUsuarioActual = parseInt(localStorage.getItem(`movimientosrealizados-${usuarioActual}`));
            // console.log(movimientosUsuarioActual);
            if (!usuarioActual) {
                mensajeNuevoJuego.textContent = 'Error: Debes seleccionar un usuario para iniciar un nuevo juego.';
                mensajeNuevoJuego.style.display = 'block';
                setTimeout(() => {
                mensajeNuevoJuego.style.display = 'none';
                }, 3000);
            } else{
                if (movimientosUsuarioActual === 0 ) {
                    mensajeMovimientosUsuarioActual.textContent =`Error: El usario ${usuarioActual} no tiene partidas pendientes`;
                    mensajeMovimientosUsuarioActual.style.display = 'block';
                    setTimeout(() => {
                    mensajeMovimientosUsuarioActual.style.display = 'none';
                    }, 3000);
                }else{
                    mensajeMovimientosUsuarioActual.textContent = `Bienvenido de nuevo!! ${usuarioActual}`;
                    mensajeMovimientosUsuarioActual.style.display = 'block';
                    setTimeout(() => {
                    mensajeMovimientosUsuarioActual.style.display = 'none';
                    window.open('../../Juego-Puzzle/JuegoPuzzle.html', '_self')
                    }, 3000);
                }
            }
    
        });
    
    });