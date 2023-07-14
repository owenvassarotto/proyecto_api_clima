//Variables
const contenido = document.querySelector('#contenido');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () =>{
    formulario.addEventListener('submit', buscarClima);
});

function buscarClima(e){
    e.preventDefault();

    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if(ciudad === '' || pais === ''){
        mostrarAlerta("Debes ingresar una ciudad y un país");

        return;//Cortar la ejecución del código
    }

    consultarAPI(ciudad, pais);
}

function mostrarAlerta(mensaje){

    const alerta = document.querySelector('.alerta');

    if(!alerta){
        const alerta = document.createElement('div');
        alerta.className = 'bg-red-500 text-white p-3 text-center rounded-md mt-5 alerta';
        alerta.innerHTML = `
            <span class="font-bold">¡Error!</span>
            <p>${mensaje}</p>
        `;

        contenido.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

function consultarAPI(ciudad, pais){
    const apiKey = '540f3da5c798f01050b57302f5a94d21';

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${apiKey}`;

    mostrarSpinner();

    //Obtenemos datos de la API mediante fetch
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => {

            limpiarResultado();

            if(resultado.cod === '404'){
                mostrarAlerta("No se encontró la ciudad");
            
                return;
            }

            mostrarClima(resultado);
        })
}


function mostrarClima(datos){
    console.log(datos);
    const { name, main: { temp, temp_max, temp_min } } = datos; 

    //Mostrar temperaturas en el HTML
    const tempActual = kelvinToCelsius(temp);
    const tempMax = kelvinToCelsius(temp_max);
    const tempMin = kelvinToCelsius(temp_min);

    const nombreCiudad = document.createElement('h2');
    nombreCiudad.classList.add('text-2xl', 'font-bold', 'mb-4');
    nombreCiudad.innerHTML = `${name}`;

    const actual = document.createElement('p');
    actual.classList.add('text-6xl', 'mb-3');
    actual.innerHTML = `${tempActual}&#8451;`;

    const max = document.createElement('p');
    max.classList.add('text-xl', 'mb-3');
    max.innerHTML = `Max: ${tempMax}&#8451;`;
    
    const min = document.createElement('p');
    min.classList.add('text-xl');
    min.innerHTML = `Min: ${tempMin}&#8451;`;

    resultado.append(nombreCiudad, actual, max, min);
}

const kelvinToCelsius = temp => parseInt(temp - 273.15);

function limpiarResultado(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner(){

    limpiarResultado();

    const spinner = document.createElement('DIV');
    spinner.classList.add('sk-chase', 'mx-auto');

    spinner.innerHTML = `
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
    `;

    resultado.appendChild(spinner);
}