var gridGifSubidos = document.getElementById("gifSubidos");
var home = document.getElementById("logo");
home.addEventListener("click", () => {
    location.assign("../../index.html");
});
var upload = document.getElementById("upload");
upload.addEventListener("click", () => {
    location.assign("../upload/upload.html");
});
window.onload = function() {
    if (localStorage.getItem('GifList')) {
        loadGifLocalStorage(gridGifSubidos);
    } else {
        console.log("no hay gif guardados en esta seseion");
    }
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