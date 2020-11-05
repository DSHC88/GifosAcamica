var sugerenciasBox = document.getElementById('busseg');
var inputBusqueda = document.getElementById("input");
var btnX = document.getElementById("x-btn");
var divSugerencias = document.getElementById("busseg-esc");
window.onload = function() {
    for (let index = 0; index < limitSugerencias; index++) {
        getSugerencias(arraySugerencias);
    }
    getTendencias();
    inputBusqueda.value = '';
};

var misGuifos = document.getElementById("misGif");
misGuifos.addEventListener("click", () => {
    location.assign("pages/mis-gif/mis-gif.html");
});
var upload = document.getElementById("upload");
upload.addEventListener("click", () => {
    location.assign("pages/upload/upload.html");
});
var btnBuscar = document.getElementById('btn-buscar');
btnBuscar.addEventListener('click', () => {
    buscar(inputBusqueda.value, mostrarResultados);
});
inputBusqueda.addEventListener('input', event => {
    let valor = inputBusqueda.value.trim();
    if (valor) {
        document.getElementById("btn-buscar").disabled = false;
        mostrarEsconder(btnX, mostrar);
        obtSugerencias(valor);
    } else {
        document.getElementById("btn-buscar").disabled = true;
        mostrarEsconder(btnX, esconder);
        mostrarEsconder(divSugerencias, esconder);
    }
});
inputBusqueda.addEventListener('keyup', event => {
    if (event.keyCode == 13) {
        buscar(inputBusqueda.value.trim());
        return;
    }
});

function obtSugerencias(palabra, callback) {
    // console.log("haciendo la consulta");
    let url = BusquedaUrl + '&q=' + palabra;
    updateScripts(url, callback);
}

function updateScripts(url, callback) {
    let newScript = document.createElement("script");
    newScript.setAttribute("src", url);
    newScript.setAttribute("id", "jsonp");
    let oldScript = document.getElementById("jsonp");
    let body = document.getElementsByTagName("body")[0];

    if (oldScript == null) {
        body.appendChild(newScript);
    } else {
        body.replaceChild(newScript, oldScript);
    }

}

function mostrarJsonp(obj) {
    // console.log("muestro el obj");
    arrSugerencias = obj[1];
    colocarSugBus(arrSugerencias);
}

function colocarSugBus(sugArr) {
    while (sugerenciasBox.firstChild) {
        sugerenciasBox.removeChild(sugerenciasBox.firstChild);
    }
    if (sugArr.length == 0) {

        mostrarEsconder(divSugerencias, esconder);

    } else {
        mostrarEsconder(divSugerencias, mostrar);

        if (sugArr.length >= maxSugerencias) {
            for (let index = 0; index < maxSugerencias; index++) {
                insertarBtnSug(sugArr[index]);
            }

        } else {
            for (let index = 0; index < sugArr.length; index++) {
                insertarBtnSug(sugArr[index]);
            }
        }

    }
}

function insertarBtnSug(texto) {
    let boton = document.createElement('button');
    boton.setAttribute('class', 'bus-btn-pre');
    boton.setAttribute('onclick', 'buscar("' + texto + '")');
    boton.textContent = texto;
    sugerenciasBox.appendChild(boton);
}

function buscar(palabra) {
    document.getElementById("buscar-texto").innerText = palabra + ' (resultados)';
    inputBusqueda.value = palabra;
    obtSugerencias(palabra);
    mostrarEsconder(btnX, mostrar);
    const found = fetch(endPointBusqueda + 'q=' + palabra + '&api_key=' + apiKey + "&limit=" + limitBusquedas)
        .then(response => {
            return response.json();
        })
        .then(resdata => {
            var datos = resdata.data;

            mostrarResultados(datos);
            return datos;
        })
        .catch(error => {
            // console.log(error);
            return error;
        });
    return found;
}

function mostrarResultados(data) {
    mostrarEsconder(divSugerencias, esconder);
    mostrarEsconder(document.getElementById('busqueda'), mostrar);
    var gridBusqueda = document.getElementById("gridBusqueda");
    while (gridBusqueda.firstChild) {
        gridBusqueda.removeChild(gridBusqueda.firstChild);
    }
    if (data.length == 0) {
        let card = document.createElement("div");
        card.setAttribute("class", "cardGif");
        card.innerHTML +=
            '<img src = "../../assets/noresult.gif" >' +
            '<div class = "foot">' +
            '<p>No se encontraron resultados</p>' +
            '</div>';
        gridBusqueda.appendChild(card);
    } else {
        data.forEach(element => {
            let card = document.createElement("div");
            card.setAttribute("class", "cardGif");
            card.innerHTML +=
                ' <img src =' + element.images.downsized.url + '>' +
                ' <div class = "foot">' +
                '  <p>' + element.title + '</p>' +
                ' </div>';
            gridBusqueda.appendChild(card);
        });
    }
    botonesSugeridos(arrSugerencias);
}

function resetBusqueda() {
    mostrarEsconder(document.getElementById('busqueda'), esconder);
    inputBusqueda.value = "";
    document.getElementById("btn-buscar").disabled = true;
    mostrarEsconder(btnX, esconder);
    mostrarEsconder(divSugerencias, esconder);
}

function botonesSugeridos(arraySug) {
    let btnSugeBus = document.getElementById('btn-suge-cont');
    let iteracion = 0;
    while (btnSugeBus.firstChild) {
        btnSugeBus.removeChild(btnSugeBus.firstChild);
    }
    if (arraySug.length > 3) {
        iteracion = 3
    } else {
        iteracion = arraySug.length
    }
    for (let index = 0; index < iteracion; index++) {
        let boton = document.createElement('button');
        boton.setAttribute('class', 'btn');
        boton.innerText = '#' + arraySug[index];
        boton.setAttribute('onclick', 'buscar("' + arraySug[index] + '")');
        btnSugeBus.appendChild(boton);
    }
}

function cargarSugerencia() {
    getSugerencias(arraySugerencias);
}

function insertarSugerencia(array) {
    let sugerencias = document.getElementById("sugerencias");
    while (sugerencias.firstChild) {
        sugerencias.removeChild(sugerencias.firstChild);
    }
    for (let index = 0; index < array.length; index++) {
        let card = document.createElement("DIV");
        card.setAttribute("class", "suge-traje");
        let title = array[index].titulo;
        card.innerHTML =
            ' <section class = "suge-header" >' +
            '<p> #' + array[index].titulo + '  </p>' +
            '<img class="eliminar-sug"  onclick="borrarSug(' + index + ')" src = "assets/close.svg" alt = "" > ' +
            '</section> <img class = "suge-gif" src =' + array[index].url + ' alt = "" >' +
            '<button class = "suge-btn-vmas" onclick="buscar(\'' + title + '\')"> ver mas... </button>';
        sugerencias.appendChild(card);
    }
}

function getSugerencias(array) {
    const found = fetch(randonEndPoint + '&api_key=' + apiKey)
        .then(response => {
            return response.json();
        })
        .then(resdata => {
            var datos = resdata.data;
            array.push({ url: datos.images.downsized.url, titulo: datos.title });
            insertarSugerencia(array);
            return datos;
        })
        .catch(error => {
            // console.log(error);
            return error;
        });
    return found;
}

function borrarSug(index) {
    arraySugerencias.splice(index, 1);
    getSugerencias(arraySugerencias);
}

function getTendencias() {

    const found = fetch(tendenciasEndPoint + '&api_key=' + apiKey + "&limit=" + limitTendencias)
        .then(response => {
            return response.json();
        })
        .then(resdata => {
            var datos = resdata.data;
            mostrarTendencias(datos);
            return datos;
        })
        .catch(error => {
            // console.log(error);
            return error;
        });


    return found;
}

function mostrarTendencias(data) {
    var gridTendencias = document.getElementById("tendencias");
    data.forEach(element => {
        var card = document.createElement("div");
        card.setAttribute("class", "cardGif");
        card.innerHTML +=
            '<img src =' + element.images.downsized.url + '>' +
            ' <div class = "foot">' +
            ' <p>' + element.title + '</p>' +
            '</div>'
        gridTendencias.appendChild(card);
    });
}