/*
MusicHours : Un site par Théo Migeat
*/

let key = ''; //clé de l'API
let units = 'metric'; //On utilise les °C ici

var valeurMeteoOK = "unset"; //Cette valeur servira à récuperer la valeur finale de la météo
let firstPage = false; //Indique que l'utilisateur viens de venir sur le site
let changementHeure = false; //Nous servira à détecter un changement d'heure
let SplashScreen = true; //Permet de savoir si l'on est sur le SplashScreen
//setTimeout(clear, 1); //Fonction de shlag pour clear la console

let forecastOnce = true;

function clear() {
    window.console.clear();
}

//Selecteurs au chargement de la page, quand un utilisateur se log pour la première fois
const PageOk = document.querySelector('.pageOut'); //Page à afficher une fois que la localisation est entrée


/* Sélecteurs pour le formulaire du SplashScreen*/
const FirstPage = document.querySelector('.prePage');
const FirstPageForm = document.querySelector('form');
const FirstPageButton = document.querySelector('button');
const FirstPageFormError = document.querySelector('.formError');

/* Sélecteurs pour le formulaire permétant de changer de ville */
const cityPosTitre = document.querySelector('.cityPos h1');
const cityPosForm = document.querySelector('.cityPos form');
const cityPosReset = document.querySelectorAll('.cityPos button')[1];
const cityPosInput = document.querySelector('.cityPos form input');
const cityPosFormError = document.querySelector('.cityPosFormError');

const popUp = document.querySelector('.popup');
const buttonPopOn = document.querySelector('.buttonPopOn');
const buttonPopOff = document.querySelector('.popup div button');

/* Variable qui nous servira à stocker le décalage horraire entre l'heure de la ville et l'heure UTC*/
let HeureDeca = 0;

let tabSaisons = ['Hiver', 'Printemps', 'Normal', 'Fall'];
/*

PARTIE 1 : INITIALISATION

*/

buttonPopOn.addEventListener("click", function () {
    popUp.style.opacity = 1;
    popUp.style.zIndex = 99999999999999;
});

buttonPopOff.addEventListener("click", function () {
    popUp.style.opacity = 0;
    popUp.style.zIndex = -1;
});

//Detecte si l'utilisateur avait déjà rentré une ville auparavent, si ce n'est pas le cas, alors le SplashScreen s'affiche
if (localStorage.getItem("ville") == "" || localStorage.getItem("ville") == undefined) {
    PageOk.style.opacity = 0;
    FirstPage.style.opacity = 1;
    SplashScreen = true;
    PageOk.style.zIndex = -100000;
    FirstPage.style.zIndex = 100000;
} else {
    //Lancement du site
    PageOk.style.opacity = 1;
    PageOk.style.zIndex = 100000;
    FirstPage.style.opacity = 0;
    FirstPage.style.zIndex = -100000;
    forecastOnce = true;
    searchWeather(localStorage.getItem("ville"));
    SplashScreen = false;
}

//Permet de mettre le curseur sur le champ de texte
document.querySelector('input').focus();

//Vérification du contenu du formulaire du SplashScreen
FirstPageForm.addEventListener("submit", function (e) {
    let FirstPageInput = document.forms["form"]["ville"].value;
    if (FirstPageInput == "") {
        FirstPageFormError.innerHTML = erreurVide;
    } else {
        forecastOnce = true;
        searchWeather(FirstPageInput);
    }
    e.preventDefault();
});

//Vérification du contenu du formulaire pour changer de ville
cityPosForm.addEventListener("submit", function (e) {
    let cityPosFormInput = document.forms["villeForm"]["villePos"].value;
    if (cityPosFormInput == "") {
        cityPosFormError.innerHTML = erreurVide;
    } else {
        document.forms["villeForm"]["villePos"].value = "";
        forecastOnce = true;
        searchWeather(cityPosFormInput);
    }
    e.preventDefault();
});

//Fonction permettant de reset ça ville, remet le site à 0
function resetVille() {
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
    if (musique.playing()) {
        musique.fade(slider.value / 100, 0, 2000);
        setTimeout(musiquechange4, 2000);

        function musiquechange4() {
            playpause()
            musique.fade(0, slider.value / 100, 300);
        }
    }
}

//Event activant le reset de la ville quand l'utilisateur clique sur le bouton "reset la ville"
cityPosReset.addEventListener("click", resetVille);

let valeurMeteoMUSIQUE = "Normal"; //Variable servant à savoir quel type de musique est joué (Normal, Pluie ou Neige)
let valeurMeteoTEMP = "Normal";
let now = new Date();
let heure = now.getHours();
let musique = new Howl({
    src: [`musiques/${valeurMeteoMUSIQUE}/${heure}.mp3`],
    autoplay: false,
    loop: true,
    volume: 0.5
});

//Fonction servant à changer la météo sans prendre compte de celle de la ville. N'est utilisé qu'a des fins de présentation, directement dans la console
function changeMeteoBRUTE(meteo) {
    valeurMeteoTEMP = meteo;
    changebg(verifHeureBG());
    valeurMeteoOK = "Custom";

    if (valeurMeteoTEMP == "Pluie" || valeurMeteoTEMP == "Orage") {
        valeurMeteoMUSIQUE = "Pluie";
    } else if (valeurMeteoTEMP == "Neige") {
        valeurMeteoMUSIQUE = "Neige";
    } else {
        valeurMeteoMUSIQUE = "Normal";
    }

    let isplaying = true;
    if (musique.playing() == false) {
        isplaying = false;
    }

    musique.fade(slider.value / 100, 0, 2000);
    setTimeout(musiquechange1, 2000);

    function musiquechange1() {
        musique.pause();
        musique.unload();
        musique._src = `musiques/${valeurMeteoMUSIQUE}/${HeureLancement}.mp3`;
        musique.load();
        if (isplaying == true) {
            musique.play();
        }
        setTimeout(musiquechange2, 1000);

        function musiquechange2() {
            musique.fade(0, slider.value / 100, 1000);
        }
    }
}

//Coeur du programme, permet de chercher la météo et change la musique, l'arière plan et la position du soleil
function searchWeather(ville) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ville}&APPID=${key}&units=${units}`)
        .then(response => response.json())
        .then(result => {
            console.log(result);
            if (result.cod == 404) {
                document.querySelector('input').value = "";
                cityPosFormError.innerHTML = erreurNotFound;
                FirstPageFormError.innerHTML = erreurNotFound;
            } 
            else if(result.cod == 429){
                console.log("ERREUR CRITIQUE : Nombre max de requètes dépassés !");
                alert("Erreur ! Le site est en maintence suite à un problème d'API, retour à l'écran de base.");
                resetVille();
            }
            else if(result.cod == 401){
                console.log("ERREUR CRITIQUE : Clé API invalide !");
                alert("Erreur ! Le site est en maintence suite à un problème d'API, retour à l'écran de base.");
                resetVille();
            }
            else {
                HeureDeca = result.timezone / 3600;
                console.log(result.coord.lat);
                if (result.coord.lat < 0) {
                    tabSaisons = ['Normal', 'Fall', 'Hiver', 'Printemps'];
                } else {
                    tabSaisons = ['Hiver', 'Printemps', 'Normal', 'Fall'];
                }

                let dateFinale = new Date(Date.now() + now.getTimezoneOffset() * 60000);
                dateFinale.setHours(dateFinale.getHours() + HeureDeca);
                console.log(dateFinale.toLocaleTimeString());

                if (HeureLancement != dateFinale.getHours() && valeurMeteoOK == result.weather[0].main && !changementHeure) {
                    HeureLancement = dateFinale.getHours();
                    changebg(verifHeureBG());

                    let isplaying = true;
                    if (musique.playing() == false) {
                        isplaying = false;
                    }

                    if (firstPage == true) {
                        musique.fade(slider.value / 100, 0, 2000);
                        setTimeout(musiquechange1, 2000);

                        function musiquechange1() {
                            musique.pause();
                            musique.unload();
                            musique._src = `musiques/${valeurMeteoMUSIQUE}/${HeureLancement}.mp3`;
                            musique.load();
                            if (isplaying == true) {
                                musique.play();
                            }
                            setTimeout(musiquechange2, 1000);

                            function musiquechange2() {
                                musique.fade(0, slider.value / 100, 1000);
                            }
                        }
                    }
                }

                HeureLancement = dateFinale.getHours();
                heure = dateFinale.getHours();

                changeMouvement();

                Temperature.innerHTML = `${result.main.temp}°C`;

                if(forecastOnce){
                    forecastOnce = false;
                    //Pour avoir les prévisions pour le lendemain
                    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${ville}&APPID=${key}&units=${units}`)
                    .then(responseDemain => responseDemain.json())
                    .then(resultDemain => {
                            let meteoWeatherDemain = resultDemain.list[0].weather[0].main;
                            console.log(meteoWeatherDemain);
                            if (meteoWeatherDemain == "Rain") {
                                MeteoDemainIcon.className = "fas fa-cloud-showers-heavy";
                            } else if (meteoWeatherDemain == "Thunderstorm") {
                                MeteoDemainIcon.className = "fas fa-bolt";
                            } else if (meteoWeatherDemain == "Clear") {
                                MeteoDemainIcon.className = "fas fa-sun";
                            } else if (meteoWeatherDemain == "Mist" || valeurMeteoOK == "Fog") {
                                MeteoDemainIcon.className = "fas fa-smog";
                            } else if (meteoWeatherDemain == "Snow") {
                                MeteoDemainIcon.className = "fas fa-snowflake";
                            } else {
                                MeteoDemainIcon.className = "fas fa-cloud";
                            }
                        } 
                    );
                }
                
                isUp = true;
                document.querySelector(".cityPos form input").blur();
                SplashScreen = false;
                FirstPageFormError.innerHTML = ""
                cityPosFormError.innerHTML = ""
                cityPosTitre.innerHTML = `${cityNew}${result.name}) :`;
                $(".cityPos").slideUp("slow");
                localStorage.setItem("ville", ville);
                console.log(localStorage.getItem("ville"));
                PageOk.style.opacity = 1;
                FirstPage.style.opacity = 0;
                PageOk.style.zIndex = 100000;
                FirstPage.style.zIndex = -100000;

                if (valeurMeteoOK == result.weather[0].main && !changementHeure) {
                    console.log("La météo n'a pas changé");
                } else {
                    changementHeure = false;
                    valeurMeteoOK = result.weather[0].main;
                    //valeurMeteoOK = "Snow";
                    console.log(`Il fait ${valeurMeteoOK} à ${result.name}`);
                    if (valeurMeteoOK == "Rain") {
                        valeurMeteoTEMP = "Pluie";
                        valeurMeteoMUSIQUE = "Pluie";
                    } else if (valeurMeteoOK == "Thunderstorm") {
                        valeurMeteoTEMP = "Orage";
                        valeurMeteoMUSIQUE = "Pluie";
                    } else if (valeurMeteoOK == "Clear") {
                        valeurMeteoTEMP = "Clear";
                        valeurMeteoMUSIQUE = "Normal";
                    } else if (valeurMeteoOK == "Mist" || valeurMeteoOK == "Fog") {
                        valeurMeteoTEMP = "Brouillard";
                        valeurMeteoMUSIQUE = "Normal";
                    } else if (valeurMeteoOK == "Snow") {
                        valeurMeteoTEMP = "Neige";
                        valeurMeteoMUSIQUE = "Neige";
                    } else {
                        valeurMeteoTEMP = "Normal";
                        valeurMeteoMUSIQUE = "Normal";
                    }
                    playPluie();
                    changebg(verifHeureBG());
                    let isplaying = true;
                    if (musique.playing() == false) {
                        isplaying = false;
                    }

                    if (firstPage == true) {
                        musique.fade(slider.value / 100, 0, 2000);
                        setTimeout(musiquechange1, 2000);

                        function musiquechange1() {
                            musique.pause();
                            musique.unload();
                            musique._src = `musiques/${valeurMeteoMUSIQUE}/${HeureLancement}.mp3`;
                            musique.load();
                            if (isplaying == true) {
                                musique.play();
                            }
                            setTimeout(musiquechange2, 1000);

                            function musiquechange2() {
                                musique.fade(0, slider.value / 100, 1000);
                            }
                        }
                    } else {
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

let makeItRain = function () {
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

let musiquePluie = new Howl({
    src: [`musiques/PluieSound/pluie.mp3`],
    autoplay: false,
    loop: true,
    volume: 0.05
});

function playPluie() {
    let pluiePlay = false;
    if ((valeurMeteoTEMP == "Pluie" || valeurMeteoTEMP == "Orage") && musique.playing() == true && pluiePlay == false) {
        musiquePluie.play();
        pluiePlay = true;
    } else {
        pluiePlay = false;
        musiquePluie.pause();
    }
}

function rainOpacity() {
    pluie.classList = "rain rainVisible front-row"
}

function lancerPluie() {
    if (pluieOk == false) {
        pluie.classList = "rain rainInvisible front-row"
        makeItRain();
        setTimeout(rainOpacity, 650);
        playPluie();
        pluieOk = true;
    }
}

let musiqueEclair = new Howl({
    src: [`musiques/Eclair/1.mp3`],
    autoplay: false,
    loop: false,
    volume: 0.3
});

function EclairSound() {
    if (musique.playing() == true) {
        musiqueEclair.unload();
        musiqueEclair._src = `musiques/Eclair/${Math.floor((3)*Math.random()+1)}.mp3`;
        musiqueEclair.load();
        musiqueEclair.play();
    }
    setTimeout(changePosLightling, 2000);
}

function activerLightning() {
    setInterval(EclairSound, 7000);
}

function changePosLightling() {
    let PosAlea = Math.floor((40) * Math.random() - 20);
    Lightning.style.marginLeft = `${PosAlea}vw`;
}
/*Selecteurs*/

const TranslateSection = document.querySelectorAll(".translate");
const Temperature = document.querySelector("#temp");
const MeteoDemain = document.querySelector("#demain");
const MeteoDemainIcon = document.querySelector('#demainIcon');
const MeteoDemainText = document.querySelector('#demainTexte');

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

function verifHeureBG() {
    let heureBGF;

    if (HeureLancement <= 5 || HeureLancement >= 20) {
        heureBGF = 3;
    } else if (HeureLancement == 6 || HeureLancement == 7 || HeureLancement == 18 || HeureLancement == 19) {
        heureBGF = 2;
    } else {
        heureBGF = 1;
    }

    return heureBGF;
}

function changeMouvement() {
    if (HeureLancement == 6) {
        Mouvement.style.opacity = 0;
        Mouvement.className = "astre position222";
        setTimeout(resetPosAstre, 2000);

        function resetPosAstre() {
            Mouvement.style.opacity = 0;
            Mouvement.className = "astre position111";
        }
        setTimeout(resetPosAstre2, 4000);

        function resetPosAstre2() {
            Mouvement.className = "astre position6";
            Mouvement.style.opacity = 1;
        }
    } else if (HeureLancement == 19) {
        Mouvement.style.opacity = 0;
        Mouvement.className = "astre position222";
        setTimeout(resetPosAstre, 2000);

        function resetPosAstre() {
            Mouvement.className = "astre position111";
        }
        setTimeout(resetPosAstre2, 4000);

        function resetPosAstre2() {
            Mouvement.className = "astre position19";
            Mouvement.style.opacity = 1;
        }
    } else {
        Mouvement.className = `astre position${HeureLancement}`;
    }
}

changeMouvement();

let heureBG = verifHeureBG();
let neigeOn = false;

function changebg(valeurBG) {
    buttonPopOn.className = `c${valeurMeteoTEMP}${valeurBG} material-icons buttonPopOn`;
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
    document.querySelectorAll('.cityPos button')[0].className = `lang cityPosButtonColor${valeurMeteoTEMP}${valeurBG}`;
    document.querySelectorAll('.cityPos button')[1].className = `lang cityPosButtonColor${valeurMeteoTEMP}${valeurBG}`;

    TranslateSection[0].className = `cityPosButtonColor${valeurMeteoTEMP}${valeurBG} translate`;
    TranslateSection[1].className = `cityPosButtonColor${valeurMeteoTEMP}${valeurBG} translate`;

    Temperature.className = `c${valeurMeteoTEMP}${valeurBG}`;
    MeteoDemain.className = `c${valeurMeteoTEMP}${valeurBG} lang`;
    

    Mouvement.style.opacity = 1;
    Lightning.style.opacity = 0;
    Lightning.style.animationName = "none";
    musiqueEclair.volume(0);
    NeigeFalling.style.opacity = 0;

    if ((now.getMonth() == 11 && now.getDate() >= 21) || now.getMonth() == 0 || now.getMonth() == 1 || (now.getMonth() == 2 && now.getDate() <= 19)) {
        BgInColor.style.backgroundImage = `url("medias/Plaineflat${tabSaisons[0]}.png")`;
    } else if ((now.getMonth() == 2 && now.getDate() >= 20) || now.getMonth() == 3 || now.getMonth() == 4 || (now.getMonth() <= 5 && now.getDate() <= 19)) {
        BgInColor.style.backgroundImage = `url("medias/Plaineflat${tabSaisons[1]}.png")`;
    } else if ((now.getMonth() >= 5 && now.getDate() >= 20) || now.getMonth() == 6 || now.getMonth() == 7 || (now.getMonth() <= 8 && now.getDate() <= 21)) {
        BgInColor.style.backgroundImage = `url("medias/Plaineflat${tabSaisons[2]}.png")`;
    } else {
        BgInColor.style.backgroundImage = `url("medias/Plaineflat${tabSaisons[3]}.png")`;
    }

    if (valeurMeteoTEMP == "Pluie") {
        BgRain.className = `bgRain${valeurBG}`;
        RainSelector.className = 'rain rainVisible front-row';
        lancerPluie();
        Mouvement.style.opacity = 0.2;
    } else if (valeurMeteoTEMP == "Orage") {
        BgRain.className = `bgRainOrage${valeurBG}`;
        RainSelector.className = 'rain rainVisible front-row';
        lancerPluie();
        Mouvement.style.opacity = 0.2;
        Lightning.style.opacity = 0;
        Lightning.style.animationName = "eclair";
        setTimeout(activerLightning, 1500);
        musiqueEclair.volume(0.2);
    } else if (valeurMeteoTEMP == "Neige") {
        BgInColor.style.backgroundImage = 'url("medias/Plaine\ flatNeige.png")';
        BgRain.className = `bgRainNeige${valeurBG}`;
        RainSelector.className = 'rain rainInvisible front-row';
        Mouvement.style.opacity = 0.5;
        NeigeFalling.style.opacity = 1;
        
        if(!neigeOn){
            setTimeout(function () {
                Snowflake.init(document.getElementById('snow'));
            }, 500);
        }

        neigeOn = true;
    } else if (valeurMeteoTEMP == "Brouillard") {
        Mouvement.style.opacity = 0.2;
        RainSelector.className = 'rain rainInvisible front-row';
        BgRain.className = `bgRainBrouillard`;
    } else {
        BgRain.className = `bgRain`;
        RainSelector.className = 'rain rainInvisible front-row';
    }
}

//rgb(228, 156, 62)
let tempverif = true;
var Timer = setInterval(myTimer);

function myTimer() {
    let date = new Date(Date.now() + now.getTimezoneOffset() * 60000);
    date.setHours(date.getHours() + HeureDeca);

    tempverif = true;
    afficheHeure.innerHTML = date.toLocaleTimeString();
    if (date.getHours() != HeureLancement && tempverif == true && SplashScreen == false) { //Permet de savoir quand il y a un changement d'heure
        tempverif = false;
        changementHeure = true;
        HeureLancement = date.getHours();
        searchWeather(localStorage.getItem("ville"));

        if (heureBG != verifHeureBG()) {
            heureBG = verifHeureBG();
            changebg(heureBG);
        }

        changeMouvement();
        tempverif = true;
    }
}

const player = document.querySelectorAll('i')[1];
player.addEventListener("click", playpause);

function playpause() {
    if (player.innerHTML === "play_circle_outline") {
        player.innerHTML = "pause_circle_outline";
        if (lancement == true) {
            musique.play();
            lancement = false;
        } else {
            musique.play();
        }
    } else {
        player.innerHTML = "play_circle_outline";
        musique.pause();
    }
    playPluie();
}

const slider = document.getElementById("myRange");
musique.volume(slider.value / 100);

slider.addEventListener("input", function () {
    musique.volume(slider.value / 100);
})


document.addEventListener('keydown', logKey);

let CityPosFocus = false;

cityPosInput.addEventListener("focusin", function () {
    CityPosFocus = true;
});

cityPosInput.addEventListener("focusout", function () {
    CityPosFocus = false;
});

function logKey(e) {
    if (e.code == 'Space' && firstPage == true && CityPosFocus == false) {
        playpause();
    }

    if (e.code == 'Escape') {
        popUp.style.opacity = 0;
        popUp.style.zIndex = -1;
    }
}

let isUp = true;

$(document).ready(function () {
    $("#volume").click(function () {
        $(".musiccontainer").slideToggle("slow");
        $(".cityPos").slideUp("slow");
    });
});

LocationButton.addEventListener("click", function () {
    $(".cityPos").slideToggle("slow");
    if (isUp == true) {
        document.querySelector(".cityPos form input").focus();
        isUp = false;
    } else {
        isUp = true;
    }
    $(".musiccontainer").slideUp("slow");
});


$(function () {
    $('.translate').click(function () {
        if(!cityPosFormError.innerHTML == ""){
            cityPosFormError.innerHTML = erreurVide;
        }

        if(!FirstPageFormError.innerHTML == ""){
            FirstPageFormError.innerHTML = erreurVide;
        }
        cityPosTitre.innerHTML = `${cityNew}${localStorage.getItem("ville")}) :`;
    });
});