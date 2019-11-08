let now = new Date();
let heure = now.getHours();
let musique = new Howl({
    src: [`musiques/normal/${heure}.mp3`],
    autoplay: false,
    loop: true,
    volume: 0.5
});

const afficheHeure = document.querySelector('#heure');
const BgColor = document.querySelector('#b1');
const BgInColor = document.querySelector('#pageInBG1');
const Mouvement = document.querySelector(".astre");
const NuageImage1 = document.querySelector('.nuage1');
const NuageImage2 = document.querySelector('.nuage2');
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
    else{
        Mouvement.className = `astre position${HeureLancement}`;
    }
}

changeMouvement();

var heureBG = verifHeureBG();

function changebg(valeurBG){
    BgColor.className = `bg${valeurBG}`;
    BgInColor.id = `pageInBG${valeurBG}`;
    NuageImage1.className = `nuage1 nuageImage${valeurBG}`;
    NuageImage2.className = `nuage2 nuageImage${valeurBG}`;
    BgEtoiles.className = `bgStars${valeurBG}`;
    TextColor.className = `c${valeurBG}`;
    PlayerColor.className = `c${valeurBG} material-icons`;
    VolumeIcon[0].className = `c${valeurBG} material-icons`;
    SliderColor.className = `cbg${valeurBG} slider`;
}

changebg(heureBG);

//rgb(228, 156, 62)

var Timer = setInterval(myTimer);
function myTimer(){
    let date = new Date();
    afficheHeure.innerHTML = date.toLocaleTimeString();
    if(date.getHours() != HeureLancement){ //Permet de savoir quand il y a un changement d'heure
            HeureLancement = date.getHours();

            changeMouvement();

            if(heureBG != verifHeureBG()){
                heureBG = verifHeureBG();
                changebg(heureBG);
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
                musique._src = `musiques/normal/${HeureLancement}.mp3`;
                musique.load();
                if(isplaying == true){
                    musique.play();
                    setTimeout(musiquechange2, 1000); 
                     function musiquechange2(){
                        musique.fade(0, slider.value/100, 1000);
                } 
            }
        }
    }
}

const player = document.querySelector('i');
player.addEventListener("click", function(){
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
})

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

$(document).ready(function(){
    $("#volume").click(function(){
        $(".musiccontainer").slideToggle("slow");
    });
});
