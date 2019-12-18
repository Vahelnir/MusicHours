let key = '';
let units = 'metrics';

var valeurMeteoOK = "unset";
let firstPage = false;
let changementHeure = false;
let SplashScreen = true;
setTimeout(clear, 1);

function clear(){
    window.console.clear();
}

//Selecteurs au chargement de la page, quand un utilisateur se log pour la première fois
const PageOk = document.querySelector('.pageOut'); //Page à afficher une fois que la localisation est entrée

const FirstPage = document.querySelector('.prePage');
const FirstPageForm = document.querySelector('form');
const FirstPageButton = document.querySelector('button');
const FirstPageFormError = document.querySelector('.formError');

const cityPosTitre = document.querySelector('.cityPos h1');
const cityPosForm = document.querySelector('.cityPos form');
const cityPosReset = document.querySelectorAll('.cityPos button')[1];
const cityPosInput = document.querySelector('.cityPos form input');
const cityPosFormError = document.querySelector('.cityPosFormError');


if(localStorage.getItem("ville") == "" || localStorage.getItem("ville") == undefined){
    PageOk.style.opacity = 0;
    FirstPage.style.opacity = 1;
    SplashScreen = true;
    PageOk.style.zIndex = -100000;
    FirstPage.style.zIndex = 100000;
}
else{
    PageOk.style.opacity = 1;
    PageOk.style.zIndex = 100000;
    FirstPage.style.opacity = 0;
    FirstPage.style.zIndex = -100000;
    searchWeather(localStorage.getItem("ville"));
    SplashScreen = false;
}

//Permet de mettre le curseur sur le champ de texte
document.querySelector('input').focus();


FirstPageForm.addEventListener("submit", function(e){
    let FirstPageInput = document.forms["form"]["ville"].value;
    if(FirstPageInput == ""){
        FirstPageFormError.innerHTML = "Votre champ est vide !"
    }
    else{
        searchWeather(FirstPageInput);
    }
    e.preventDefault();
});

cityPosForm.addEventListener("submit", function(e){
    let cityPosFormInput = document.forms["villeForm"]["villePos"].value;
    if(cityPosFormInput == ""){
        cityPosFormError.innerHTML = "Votre champ est vide !"
    }
    else{
        document.forms["villeForm"]["villePos"].value = "";
        searchWeather(cityPosFormInput);
    }
    e.preventDefault();
});

function resetVille(){
    $(".cityPos").slideUp("slow");
    FirstPageFormError.innerHTML = ""
    localStorage.setItem("ville", "");
    PageOk.style.opacity = 0;
    FirstPage.style.opacity = 1;
    PageOk.style.zIndex = -100000;
    FirstPage.style.zIndex = 100000;
    firstPage = false;
    SplashScreen = true;
    document.querySelector('input').value = "";
    document.querySelector('input').focus();
    if(musique.playing()){
        musique.fade(slider.value/100, 0, 2000);
        setTimeout(musiquechange4, 2000); 
        function musiquechange4(){
            playpause()
            musique.fade(0, slider.value/100, 300);
        }
    }
}

cityPosReset.addEventListener("click", resetVille);

let valeurMeteoMUSIQUE = "Normal";
let valeurMeteoTEMP = "Normal";
let now = new Date();
let heure = now.getHours();
let musique = new Howl({
    src: [`musiques/${valeurMeteoMUSIQUE}/${heure}.mp3`],
    autoplay: false,
    loop: true,
    volume: 0.5
});


function changeLocation(){
    let localisation = prompt("Entrez votre ville :");
    searchWeather(localisation);
}

function changeMeteoBRUTE(meteo){
    valeurMeteoTEMP = meteo;
    changebg(verifHeureBG());
    valeurMeteoOK = "Custom";

    if(valeurMeteoTEMP == "Pluie" || valeurMeteoTEMP == "Orage"){
        valeurMeteoMUSIQUE = "Pluie";
    }
    else if(valeurMeteoTEMP == "Neige"){
        valeurMeteoMUSIQUE = "Neige";
    }
    else{
        valeurMeteoMUSIQUE = "Normal";
    }

    let isplaying = true;
    if(musique.playing() == false){
        isplaying = false;
    }

    musique.fade(slider.value/100, 0, 2000);
    setTimeout(musiquechange1, 2000); 
    function musiquechange1(){
        musique.pause();
        musique.unload();
        musique._src = `musiques/${valeurMeteoMUSIQUE}/${HeureLancement}.mp3`;
        musique.load();
        if(isplaying == true){
            musique.play();
        }
        setTimeout(musiquechange2, 1000); 
        function musiquechange2(){
            musique.fade(0, slider.value/100, 1000);
        } 
    }
}

//Coeur du programme, permet de chercher la météo et change la musique, l'arière plan et la position du soleil
function searchWeather(ville){
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ville}&APPID=${key}&units=${units}`)
    .then(response => response.json())
    .then(result => {
        console.log(result);
        if(result.cod == 404){
            document.querySelector('input').value = "";
            cityPosFormError.innerHTML = "Ville introuvable !";
            FirstPageFormError.innerHTML = "Ville introuvable !";
        }
        else{
            SplashScreen = false;
            FirstPageFormError.innerHTML = ""
            cityPosFormError.innerHTML = ""
            cityPosTitre.innerHTML = `Entrez votre nouvelle ville (actuellement ${result.name}) :`;
            $(".cityPos").slideUp("slow");
            localStorage.setItem("ville", ville);
            console.log(localStorage.getItem("ville"));
            PageOk.style.opacity = 1;
            FirstPage.style.opacity = 0;
            PageOk.style.zIndex = 100000;
            FirstPage.style.zIndex = -100000;

            if(valeurMeteoOK == result.weather[0].main && !changementHeure){
                console.log("La météo n'a pas changé");
            }
            else{
                changementHeure = false;
                valeurMeteoOK = result.weather[0].main;
                //valeurMeteoOK = "Snow";
                console.log(`Il fait ${valeurMeteoOK} à ${result.name}`);
                if(valeurMeteoOK == "Rain"){
                    valeurMeteoTEMP = "Pluie";
                    valeurMeteoMUSIQUE = "Pluie";
                }
                else if(valeurMeteoOK == "Thunderstorm"){
                    valeurMeteoTEMP = "Orage";
                    valeurMeteoMUSIQUE = "Pluie";
                }
                else if(valeurMeteoOK == "Clear"){
                    valeurMeteoTEMP = "Clear";
                    valeurMeteoMUSIQUE = "Normal";
                }
                else if(valeurMeteoOK == "Mist" || valeurMeteoOK == "Fog"){
                    valeurMeteoTEMP = "Brouillard";
                    valeurMeteoMUSIQUE = "Normal";
                }
                else if(valeurMeteoOK == "Snow"){
                    valeurMeteoTEMP = "Neige";
                    valeurMeteoMUSIQUE = "Neige";
                }
                else{
                    valeurMeteoTEMP = "Normal";
                    valeurMeteoMUSIQUE = "Normal";
                }
                changebg(verifHeureBG());
                let isplaying = true;
                if(musique.playing() == false){
                    isplaying = false;
                }
        
                if(firstPage == true){
                musique.fade(slider.value/100, 0, 2000);
                setTimeout(musiquechange1, 2000); 
                function musiquechange1(){
                    musique.pause();
                    musique.unload();
                    musique._src = `musiques/${valeurMeteoMUSIQUE}/${HeureLancement}.mp3`;
                    musique.load();
                    if(isplaying == true){
                        musique.play();
                    }
                    setTimeout(musiquechange2, 1000); 
                    function musiquechange2(){
                        musique.fade(0, slider.value/100, 1000);
                    } 
                }
                }
                else{
                    firstPage = true;
                    musique.unload();
                    musique._src = `musiques/${valeurMeteoMUSIQUE}/${HeureLancement}.mp3`;
                    musique.load();
                }
            }
        }
    });
}

/*Pour la pluie !*/

let makeItRain = function() {
    //clear out everything
    $('.rain').empty();

    let increment = 0;
    let drops = "";
    let backDrops = "";

    while (increment < 100) {
        //couple random numbers to use for various randomizations
        //random number between 98 and 1
        var randoHundo = (Math.floor(Math.random() * (98 - 1 + 1) + 1));
        //random number between 5 and 2
        var randoFiver = (Math.floor(Math.random() * (5 - 2 + 1) + 2));
        //increment
        increment += randoFiver;
        //add in a new raindrop with various randomizations to certain CSS properties
        drops += '<div class="drop" style="left: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"><div class="stem" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div><div class="splat" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div></div>';
    }

        $('.rain.front-row').append(drops);
        $('.rain.back-row').append(backDrops);

    };

let pluieOk = false;

function rainOpacity(){
        pluie.classList = "rain rainVisible front-row"
}

function lancerPluie(){
    if(pluieOk == false){
        pluie.classList = "rain rainInvisible front-row"
        makeItRain();
        setTimeout(rainOpacity, 650);

        pluieOk = true;
    }
}

let musiqueEclair = new Howl({
    src: [`musiques/Eclair/1.mp3`],
    autoplay: false,
    loop: false,
    volume: 0.2
});

function EclairSound(){
    if(musique.playing() == true){
        musiqueEclair.unload();
        musiqueEclair._src = `musiques/Eclair/${Math.floor((3)*Math.random()+1)}.mp3`;
        musiqueEclair.load();
        musiqueEclair.play();
    }
    setTimeout(changePosLightling, 2000);
} 

function activerLightning(){
    setInterval(EclairSound, 7000);
}

function changePosLightling(){
    let PosAlea = Math.floor((40)*Math.random()-20);
    Lightning.style.marginLeft = `${PosAlea}vw`;
}
/*Selecteurs*/

const LocationButton = document.querySelector("#locationButton");
const pluie = document.querySelector(".rain");
const afficheHeure = document.querySelector('#heure');
const BgColor = document.querySelector('#b1');
const BgInColor = document.querySelector('#pageInBG1');
const Mouvement = document.querySelector(".astre");
const NuageImage1 = document.querySelector('.nuage1');
const NuageImage2 = document.querySelector('.nuage2');
const BgRain = document.querySelector('#bgRainSelector');
const Lightning = document.querySelector('.lightning');
const RainSelector = document.querySelector('.front-row');
const BgEtoiles = document.querySelector('.bgStars1');
const TextColor = document.querySelector('#heure');
const PlayerColor = document.querySelector('#playpause');
const SliderColor = document.querySelector('#myRange');
const VolumeIcon = document.querySelectorAll('#volume');
const NeigeFalling = document.querySelector('#snow');

let lancement = true;
let HeureLancement = heure;

function verifHeureBG(){
    let heureBGF;

    if(HeureLancement <= 5  || HeureLancement >= 20){
        heureBGF = 3;
    }
    else if(HeureLancement == 6 || HeureLancement == 7 || HeureLancement == 18 || HeureLancement == 19){
        heureBGF = 2;
    }
    else{
        heureBGF = 1;
    }

    return heureBGF;
}

function changeMouvement(){
    if(HeureLancement == 6){
        Mouvement.className = "astre position222";
        setTimeout(resetPosAstre, 2000);
        function resetPosAstre(){
            Mouvement.className = "astre position111";
        }
        setTimeout(resetPosAstre2, 2000);
        function resetPosAstre2(){
            Mouvement.className = "astre position6";
        }
    }
    else if(HeureLancement == 19){
        Mouvement.className = "astre position 222";
        setTimeout(resetPosAstre, 2000);
        function resetPosAstre(){
            Mouvement.className = "astre position111";
        }
        setTimeout(resetPosAstre2, 2000);
        function resetPosAstre2(){
            Mouvement.className = "astre position19";
        }
    }
    else{
        Mouvement.className = `astre position${HeureLancement}`;
    }
}

changeMouvement();

var heureBG = verifHeureBG();

function changebg(valeurBG){
    BgColor.className = `bg${valeurMeteoTEMP}${valeurBG}`;
    BgInColor.id = `pageInBG${valeurMeteoTEMP}${valeurBG}`;
    NuageImage1.className = `nuage1 nuageImage${valeurMeteoTEMP}${valeurBG}`;
    NuageImage2.className = `nuage2 nuageImage${valeurMeteoTEMP}${valeurBG}`;
    BgEtoiles.className = `bgStars${valeurMeteoTEMP}${valeurBG}`;
    TextColor.className = `c${valeurMeteoTEMP}${valeurBG}`;
    PlayerColor.className = `c${valeurMeteoTEMP}${valeurBG} material-icons`;
    LocationButton.className = `c${valeurMeteoTEMP}${valeurBG} material-icons`;
    VolumeIcon[0].className = `c${valeurMeteoTEMP}${valeurBG} material-icons`;
    SliderColor.className = `cbg${valeurMeteoTEMP}${valeurBG} slider`;
    cityPosTitre.className = `c${valeurMeteoTEMP}${valeurBG}`;
    cityPosInput.className = `cityPosInputColor${valeurMeteoTEMP}${valeurBG}`;
    cityPosFormError.className = `c${valeurMeteoTEMP}${valeurBG} cityPosFormError`;
    document.querySelectorAll('.cityPos button')[0].className = `cityPosButtonColor${valeurMeteoTEMP}${valeurBG}`;
    document.querySelectorAll('.cityPos button')[1].className = `cityPosButtonColor${valeurMeteoTEMP}${valeurBG}`;
    Mouvement.style.opacity = 1;
    Lightning.style.opacity = 0;
    Lightning.style.animationName = "none";
    musiqueEclair.volume(0);
    NeigeFalling.style.opacity = 0;
    BgInColor.style.backgroundImage = 'url("medias/Plaine\ flat2.png")';

    if(valeurMeteoTEMP == "Pluie"){
        BgRain.className = `bgRain${valeurBG}`;
        RainSelector.className = 'rain rainVisible front-row';
        lancerPluie();
        Mouvement.style.opacity = 0.2;
    }
    else if(valeurMeteoTEMP == "Orage"){
        BgRain.className = `bgRainOrage${valeurBG}`;
        RainSelector.className = 'rain rainVisible front-row';
        lancerPluie();
        Mouvement.style.opacity = 0.2;
        Lightning.style.opacity = 0;
        Lightning.style.animationName = "eclair";
        setTimeout(activerLightning, 1500);
        musiqueEclair.volume(0.2);
    }
    else if(valeurMeteoTEMP == "Neige"){
        BgInColor.style.backgroundImage = 'url("medias/Plaine\ flatNeige.png")';
        BgRain.className = `bgRainNeige${valeurBG}`;
        RainSelector.className = 'rain rainInvisible front-row';
        Mouvement.style.opacity = 0.5;
        NeigeFalling.style.opacity = 1;
    }
    else if(valeurMeteoTEMP == "Brouillard"){
        Mouvement.style.opacity = 0.2;
    }
    else{
        BgRain.className = `bgRain`;
        RainSelector.className = 'rain rainInvisible front-row';
    }
}

//changebg(heureBG);

//rgb(228, 156, 62)
let tempverif = true;
var Timer = setInterval(myTimer);
function myTimer(){
    let date = new Date();
    tempverif = true;
    afficheHeure.innerHTML = date.toLocaleTimeString();
    if(date.getHours() != HeureLancement && tempverif == true && SplashScreen == false){ //Permet de savoir quand il y a un changement d'heure
            tempverif = false;
            changementHeure = true;
            HeureLancement = date.getHours();
            searchWeather(localStorage.getItem("ville"));

            if(heureBG != verifHeureBG()){
                heureBG = verifHeureBG();
                changebg(heureBG);
            }

        changeMouvement();
        tempverif = true;
    }
}

const player = document.querySelector('i');
player.addEventListener("click", playpause);

function playpause(){
    if(player.innerHTML === "play_circle_outline"){
        player.innerHTML = "pause_circle_outline";
        if(lancement == true){
            musique.play();
            lancement = false;
        }
        else{
            musique.play();
            }
    }
    else{
        player.innerHTML = "play_circle_outline";
        musique.pause();
        }
}

const slider = document.getElementById("myRange");
musique.volume(slider.value/100);

slider.addEventListener("input", function(){
    musique.volume(slider.value/100);
})


document.addEventListener('keydown', logKey);

function logKey(e) {
  if(e.code == 'Space' && firstPage == true){
    playpause();
  } 
}

$(document).ready(function(){
    $("#volume").click(function(){
        $(".musiccontainer").slideToggle("slow");
        $(".cityPos").slideUp("slow");
    });
});

LocationButton.addEventListener("click", function(){
    //changeLocation();
    $(".cityPos").slideToggle("slow");
    $(".musiccontainer").slideUp("slow");
});


