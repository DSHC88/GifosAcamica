const video = document.getElementById("video");
const saveVideo = document.getElementById('saveVideo');
const btnStart = document.getElementById("btnStart");
const btnStop = document.getElementById("btnStop");
btnStart.addEventListener('click', comenzarGrabacion);
btnStop.addEventListener('click', terminarGrabacion);
var blob;
var grabacion;
var myCamera;
var data;
var horaInicio;
var misGif = [];
const baropciones = {
    strokeWidth: 3,
    easing: 'easeInOut',
    duration: 5000,
    color: '#F7C9F3',
    trailColor: '#999999',
    trailWidth: 3,
    svgStyle: { width: '100%', height: '100%' }
}
var barra = new ProgressBar.Line(document.getElementById('conteprogresbar'), baropciones);
var upBar = new ProgressBar.Line(document.getElementById('conteprogresbar-subir'), baropciones);
var gifUploaded = document.getElementById('misGif');
var home = document.getElementById("logo");
home.addEventListener("click", () => {
    location.assign("../../index.html");
});
var flechaAtras = document.getElementById("flecha");
flechaAtras.addEventListener("click", () => {
    location.assign("../../index.html");
});
var cancelar = document.getElementById("cancelar");
cancelar.addEventListener("click", () => {
    location.reload();
});
var btnCopiEnl = document.getElementById("btn-copiEnla");
btnCopiEnl.addEventListener('click', function(event) {
    let text = btnCopiEnl.getAttribute('value');
    navigator.clipboard.writeText(text).then(function() {
        notificacion(3000, document.getElementById('noticover'));
    }, function() {});
});
window.onload = function() {
    if (localStorage.getItem('GifList')) {
        loadGifLocalStorage(gifUploaded);
    } else {}
    let atributo = document.getElementById('logo').getAttribute('src');
    atributo = atributo.split('/');
    atributo = atributo[1].split('.');
    console.log(atributo[0]);
    if (atributo[0].endsWith('dark')) {
        document.getElementById('logo').setAttribute('src', '../../assets/gifOF_logo_dark.png')
        console.log('Dark');
    } else {
        document.getElementById('logo').setAttribute('src', '../../assets/gifOF_logo.png')
        console.log('Day');
    }
}

function mostrarVistaPrevia() {
    mostrarEsconder(document.getElementById("cartel"), esconder);
    mostrarEsconder(document.getElementById("barrratitulo"), esconder);
    mostrarEsconder(document.getElementById("misGif"), esconder);
    mostrarEsconder(document.getElementById("cartel-video"), mostrar);
    mostrarEsconder(document.getElementById("title1"), mostrar);
    return;
}

function vistaPreviaVideo() {
    mostrarVistaPrevia();
    navigator.mediaDevices.getUserMedia(constrains)
        .then(stream => {
            myCamera = stream;
            video.srcObject = myCamera;
        })
        .catch(console.error)
}

function comenzarGrabacion() {
    grabacion = crearGrabador(myCamera);
    mostrarEsconder(document.getElementById("title1"), esconder);
    mostrarEsconder(document.getElementById("title2"), mostrar);
    mostrarEsconder(document.getElementById("foot-comenzar"), esconder);
    mostrarEsconder(document.getElementById("foot-parar"), mostrar);
    grabacion.startRecording();
    horaInicio = new Date().getTime();
    temporizador();
    return;
}

function terminarGrabacion() {
    mostrarEsconder(document.getElementById("title2"), esconder);
    mostrarEsconder(document.getElementById("title3"), mostrar);
    mostrarEsconder(document.getElementById("foot-parar"), esconder);
    mostrarEsconder(document.getElementById("foot-subir"), mostrar);
    grabacion.stopRecording(() => {
        blob = grabacion.getBlob();
        saveVideo.src = grabacion.toURL();
        mostrarEsconder(document.getElementById("saveVideo"), mostrar);
        mostrarEsconder(document.getElementById("video"), esconder);
        grabacion.destroy();
        grabacion = null;
        myCamera.getTracks().forEach(function(track) {
            track.stop();
        });
    });
    barra.set(0.0);
    barra.animate(1.0);
}

function crearGrabador(transmision) {
    return RecordRTC(transmision, {
        disableLogs: true,
        type: "gif",
        frameRate: 1,
        quality: 10,
        width: 360,
        hidden: 240,
        timeSlice: 1000,
    });
}

function recapturar() {
    mostrarEsconder(document.getElementById("title3"), esconder);
    mostrarEsconder(document.getElementById("video"), mostrar);
    mostrarEsconder(document.getElementById("saveVideo"), esconder);
    mostrarEsconder(document.getElementById("foot-comenzar"), mostrar);
    mostrarEsconder(document.getElementById("foot-subir"), esconder);
    vistaPreviaVideo();
}

function subirGif() {
    upBar.animate(1.0);
    mostrarEsconder(document.getElementById("cartel-video"), esconder);
    mostrarEsconder(document.getElementById("cartel-subida"), mostrar);
    data = new FormData();
    data.append('file', blob, 'misGif.gif');
    var parametros = {
        method: 'POST',
        body: data,
    };
    let URL = subidaEndPoint + '&api_key=' + apiKey + '&username=' + userName;
    const found = fetch(URL, parametros)
        .then(response => {
            mostrarcartelDescargar();
            return response.json();
        }).then(datos => {
            guandarGifLocalStorage(datos.data.id);
        })

    .catch(error => {
        return error;
    });
    return found;
}

function cancelarSubida() {
    mostrarEsconder(document.getElementById("cartel-subida"), esconder);
    vistaPreviaVideo();
    recapturar();
}


function mostrarcartelDescargar() {
    mostrarEsconder(document.getElementById("cartel-subida"), esconder);
    mostrarEsconder(document.getElementById("cartel-muestr-desc"), mostrar);
    let gifURL = URL.createObjectURL(blob);
    document.getElementById('muestra-gif').src = gifURL;
}

function guandarGifLocalStorage(id) {
    fetch(buscarProId + id + '?' + '&api_key=' + apiKey)
        .then(response => {
            return response.json();
        })
        .then(dataGif => {

            let url = dataGif.data.images.downsized.url
            document.getElementById("btn-copiEnla").setAttribute("value", url);
            if (localStorage.getItem('GifList')) {
                misGif = JSON.parse(localStorage.getItem('GifList'));
                misGif.push(url);
                localStorage.setItem('GifList', JSON.stringify(misGif));
            } else {
                misGif.push(url);
                localStorage.setItem('GifList', JSON.stringify(misGif));
            }
        });
}


function descargarGif() {
    invokeSaveAsDialog(blob, 'migif.gif');
}

function terminadoElGif() {
    mostrarEsconder(document.getElementById("cartel-muestr-desc"), esconder);
    window.location.replace("../mis-gif/mis-gif.html");
}

function temporizador() {
    if (!grabacion) {
        return;
    }
    document.getElementById('temporizadortag').innerText = calcularDuracion((new Date().getTime() - horaInicio) / 1000);
    setTimeout(temporizador, 1000);
}

function calcularDuracion(segundos) {
    var hr = Math.floor(segundos / 3600);
    var min = Math.floor((segundos - (hr * 3600)) / 60);
    var seg = Math.floor(segundos - (hr * 3600) - (min * 60));
    if (min < 10) {
        min = "0" + min;
    }
    if (seg < 10) {
        seg = "0" + seg;
    }
    if (hr <= 0) {
        return min + ':' + seg;
    }
    return hr + ':' + min + ':' + seg;
}