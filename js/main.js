let now = new Date();
let heure = now.getHours();
let musique = new Howl({
    src: [`musiques/normal/${heure}.mp3`],
    autoplay: true,
    loop: true,
    volume: 0.5
});

const afficheHeure = document.querySelector('#heure');

var Timer = setInterval(myTimer);
function myTimer(){
    let date = new Date();
    afficheHeure.innerHTML = date.toLocaleTimeString();
    if(date.getHours() != HeureLancement){
            HeureLancement = date.getHours();

            let isplaying = true;
            if(musique.playing() == false){
                isplaying = false;
            }

            musique.fade(1,0, 2000);
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
                        musique.fade(0,1, 1000);
                } 
            }
        }
    }
}

let lancement = true;
let HeureLancement = heure;

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
    if(slider.value/100 == 0){
        player.innerHTML = "play_circle_outline";
        musique.pause();
    }
    else{
        if(musique.playing() == false){
            player.innerHTML = "pause_circle_outline";
            musique.play();
        }
    }
}
