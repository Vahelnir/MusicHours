/*const PageOk = document.querySelector('.pageOut');
const FirstPage = document.querySelector('.prePage')
PageOk.style.opacity = 1;
FirstPage.style.opacity = 0;

let key = '';
let units = 'metrics';

let localisation = "Grenoble";
var valeurMeteoOK = "unset";

function searchWeather(ville){
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ville}&APPID=${key}&units=${units}`)
    .then(response => response.json())
    .then(result => {
        console.log(result);
        valeurMeteoOK = result.weather[0].main;
        console.log(valeurMeteoOK);
        return valeurMeteoOK;
});
}

console.log(searchWeather("Nantes"));*/