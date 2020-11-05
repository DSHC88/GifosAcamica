const apiKey = 'bS4ZDliw5vXjhV3wauN6zzQ6ZXCfsGkP'; //my api key vieja
const endPointBusqueda = 'https://api.giphy.com/v1/gifs/search?';
const randonEndPoint = 'https://api.giphy.com/v1/gifs/random?';
const tendenciasEndPoint = 'https://api.giphy.com/v1/gifs/trending?';
const subidaEndPoint = 'https://upload.giphy.com/v1/gifs?';
const buscarProId = 'https://api.giphy.com/v1/gifs/';
const BusquedaUrl = 'https://suggestqueries.google.com/complete/search?output=firefox&callback=mostrarJsonp';

var arrSugerencias = [];
var maxSugerencias = 3;
var limitTendencias = 24;
var limitBusquedas = 24;
var limitSugerencias = 4;
var userName = 'dhenaosc';
var resultado;
var mostrar = true;
var esconder = false;
var arraySugerencias = [];
var constrains = {
    audio: false,
    video: {
        facingMode: "user",
        width: { min: 640, ideal: 1280, max: 1920 },
        height: { min: 480, ideal: 720, max: 1080 }
    }
}

function openDorpDown() {
    document.getElementById("menu").classList.toggle("mostrar");
}

function closeDorpDown() {
    document.getElementById("menu").classList.remove("mostrar");
}

function cambiaTema(nombreTema) {
    window.localStorage.setItem('tema', nombreTema);
    var bodyTag = document.getElementsByTagName("body");
    var i;
    for (i = 0; i < bodyTag.length; i++) {
        bodyTag[i].setAttribute("color-theme", nombreTema);
    }
    if (nombreTema == 'Sailor-Day') {
        document.getElementById("logo").setAttribute("src", "assets/gifOF_logo.png");
    }
    if (nombreTema == 'Sailor-Night') {
        document.getElementById("logo").setAttribute("src", "assets/gifOF_logo_dark.png");
    }

}
cargarTema();

function cargarTema() {
    let valor = localStorage.getItem('tema')
    if (valor != null) {
        cambiaTema(valor);
    }
}

function mostrarEsconder(comp, mostrar) {
    mostrar ? comp.setAttribute("style", "display:block;") : comp.setAttribute("style", "display:none;");
    return;
}

function loadGifLocalStorage(galeria) {
    //busco los id en el array
    let arrMyGif = JSON.parse(localStorage.getItem('GifList'));
    for (let gifUrl of arrMyGif) {
        //creo los elementos html
        let card = document.createElement("div");
        card.setAttribute("class", "cardGif");
        card.innerHTML +=
            '<img src =' + gifUrl + '>'
        galeria.appendChild(card);
    }
}

function notificacion(timeout, objeto) {
    console.log("mostrando ");
    //mostrar la card
    mostrarEsconder(objeto, mostrar);
    setTimeout(function() { mostrarEsconder(objeto, esconder); }, timeout);
}