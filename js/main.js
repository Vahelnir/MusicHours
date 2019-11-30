const PageOk = document.querySelector('.pageOut');
const FirstPage = document.querySelector('.prePage')
PageOk.style.opacity = 1;
FirstPage.style.opacity = 0;

let key = '';
let units = 'metrics';

let localisation = "Grenoble";
var valeurMeteoOK = "unset";

function changeLocation(){
    let location = prompt("Entrez votre ville :");
    searchWeather(location);
}

function searchWeather(ville){
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ville}&APPID=${key}&units=${units}`)
    .then(response => response.json())
    .then(result => {
        //console.log(result);
        valeurMeteoOK = result.weather[0].main;
        console.log(`Il fait ${valeurMeteoOK} à ${result.name}`);
        if(valeurMeteoOK == "Rain"){
            valeurMeteoTEMP = "pluie";
        }
        else{
            valeurMeteoTEMP = "normal";
        }
        changebg(verifHeureBG());
});
}

let valeurMeteo = ["normal", "pluie"];

let valeurMeteoTEMP = "normal";

searchWeather("Nantes");

let now = new Date();
let heure = now.getHours();
let musique = new Howl({
    src: [`musiques/${valeurMeteoTEMP}/${heure}.mp3`],
    autoplay: false,
    loop: true,
    volume: 0.5
});

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
const RainSelector = document.querySelector('.front-row');
const BgEtoiles = document.querySelector('.bgStars1');
const TextColor = document.querySelector('#heure');
const PlayerColor = document.querySelector('#playpause');
const SliderColor = document.querySelector('#myRange');
const VolumeIcon = document.querySelectorAll('#volume');

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
    if(valeurMeteoTEMP == "pluie"){
        BgColor.className = `bgPluie${valeurBG}`;
        BgInColor.id = `pageInBGPluie${valeurBG}`;
        NuageImage1.className = `nuage1 nuageImagePluie${valeurBG}`;
        NuageImage2.className = `nuage2 nuageImagePluie${valeurBG}`;
        BgEtoiles.className = `bgStarsPluie${valeurBG}`;
        TextColor.className = `cPluie${valeurBG}`;
        BgRain.className = `bgRain${valeurBG}`;
        RainSelector.className = 'rain rainVisible front-row';
        PlayerColor.className = `cPluie${valeurBG} material-icons`;
        LocationButton.className = `cPluie${valeurBG} material-icons`;
        VolumeIcon[0].className = `cPluie${valeurBG} material-icons`;
        SliderColor.className = `cbgPluie${valeurBG} slider`;
        lancerPluie();
    }
    else if(valeurMeteoTEMP == "normal"){
        BgColor.className = `bg${valeurBG}`;
        BgInColor.id = `pageInBG${valeurBG}`;
        BgRain.className = 'bgRainNormal';
        RainSelector.className = 'rainNormal rainInvisible front-row';
        NuageImage1.className = `nuage1 nuageImage${valeurBG}`;
        NuageImage2.className = `nuage2 nuageImage${valeurBG}`;
        BgEtoiles.className = `bgStars${valeurBG}`;
        TextColor.className = `c${valeurBG}`;
        PlayerColor.className = `c${valeurBG} material-icons`;
        LocationButton.className = `c${valeurBG} material-icons`;
        VolumeIcon[0].className = `c${valeurBG} material-icons`;
        SliderColor.className = `cbg${valeurBG} slider`;
    }
}

changebg(heureBG);

LocationButton.addEventListener("click", function(){
    changeLocation();
});


//rgb(228, 156, 62)
let tempverif = true;
var Timer = setInterval(myTimer);
function myTimer(){
    let date = new Date();
    tempverif = true;
    afficheHeure.innerHTML = date.toLocaleTimeString();
    if(date.getHours() != HeureLancement && tempverif == true){ //Permet de savoir quand il y a un changement d'heure
            tempverif = false;
            HeureLancement = date.getHours();

            if(heureBG != verifHeureBG()){
                heureBG = verifHeureBG();
                changebg(heureBG);
            }

            let isplaying = true;
            if(musique.playing() == false){
                isplaying = false;
            }

            changeMouvement();

            musique.fade(slider.value/100, 0, 2000);
            setTimeout(musiquechange1, 2000); 
            function musiquechange1(){
                musique.pause();
                musique.unload();
                musique._src = `musiques/${valeurMeteoTEMP}/${HeureLancement}.mp3`;
                musique.load();
                if(isplaying == true){
                    musique.play();
                    setTimeout(musiquechange2, 1000); 
                     function musiquechange2(){
                        musique.fade(0, slider.value/100, 1000);
                } 
            }
        }
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
            setTimeout(mafonction, 300); 
            function mafonction(){
            musique.fade(0,1, 300);
            }
        } 
    }
    else{
        player.innerHTML = "play_circle_outline";
        musique.fade(1,0, 300);
        setTimeout(mafonction2, 300); 
        function mafonction2(){
            musique.pause();
        }
    }
}

const slider = document.getElementById("myRange");
Howler.volume(slider.value/100);

slider.oninput = function() {
    Howler.volume(slider.value/100);
    /*if(slider.value/100 == 0){
        player.innerHTML = "play_circle_outline";
        musique.pause();
    }
    else{
        if(musique.playing() == false){
            player.innerHTML = "pause_circle_outline";
            musique.play();
        }
    }*/
}

document.addEventListener('keydown', logKey);

function logKey(e) {
  if(e.code == 'Space'){
    playpause();
  } 
}

$(document).ready(function(){
    $("#volume").click(function(){
        $(".musiccontainer").slideToggle("slow");
    });
});
