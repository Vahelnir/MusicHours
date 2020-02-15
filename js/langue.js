let arrLang = {
    "en": {

        // SplashScreen
        "splashTitre": "Enter your city:",
        "splashDesc": "(It will be saved on your device.)",
        "splashBouton": "Confirm",
        "splashErreurVide": "Your field is empty!",
        "splashErreurNotFound": "City not found!",

        // MainPagePanel
        "mppText": "Enter your new city (currently ",
        "mppChangeCity": "Change",
        "mppResetCity": "Reset city",
        "weatherTomorrow": "Tomorrow : ",
        
        // About
        "text1": "MusicHours is a website allowing you to have a music and a theme adapting to the time and the weather from a city of your choice!",
        "text2": "All the music on the site comes from the OST of the game Animal Crossing: New Leaf, owned by Nintendo.",
        "text3": "Website made by ",
        "text4": "If you have any question, feel free to contact me on ",
	},
	
    "fr": {

        // SplashScreen
        "splashTitre": "Entrez votre ville :",
        "splashDesc": "(Elle sera sauvegardée sur votre appareil.)",
        "splashBouton": "Confirmer",
        "splashErreurVide": "Votre champ est vide !",
        "splashErreurNotFound": "Ville introuvable !",

        // MainPagePanel
        "mppText": "Entrez votre nouvelle ville (actuellement ",
        "mppChangeCity": "Changer",
        "mppResetCity": "Réinitialiser la ville",
        "weatherTomorrow": "Demain : ",
        
        // About
        "text1": "MusicHours est un site vous permettant, à partir d'une ville de votre choix, d'avoir une musique et un thème s'adaptant à l'heure et à la météo de celle-ci !",
        "text2": "La totalité des musiques présentes sur le site, viennent de l'OST du jeu Animal Crossing : New Leaf, propriété de Nintendo.",
        "text3": "Site fait par ",
        "text4": "Si vous avez la moindre question, n'hésitez pas à me contacter sur ",
    }
  };

  const ButtonFr = document.querySelector("#fr");
  const ButtonEn = document.querySelector("#en");

  let cityNew = "Entrez votre nouvelle ville (actuellement ";
  let erreurVide = "Votre champ est vide !";
  let erreurNotFound = "Ville introuvable !";

  ButtonEn.style.opacity = 0.3;
  ButtonEn.classList.add("translatehover");
  // Process translation
  const Placeholder = document.querySelector('#placeholder');

  $(function() {
    $('.translate').click(function() {
      var lang = $(this).attr('id');
      if(lang === "en"){
        ButtonFr.style.opacity = 0.3;
        ButtonFr.classList.add("translatehover");
        ButtonEn.style.opacity = 0.6;
        ButtonEn.classList.remove("translatehover");
        erreurVide = "Your field is empty!"
        erreurNotFound = "City not found!";
        cityNew = "Enter your new city (currently ";

        Placeholder.placeholder = "Ex : New York, London, Paris";
      }
      else{
        ButtonFr.style.opacity = 0.6;
        ButtonFr.classList.remove("translatehover");
        ButtonEn.style.opacity = 0.3;
        ButtonEn.classList.add("translatehover");
        erreurVide = "Votre champ est vide !";
        erreurNotFound = "Ville introuvable !";
        cityNew = "Entrez votre nouvelle ville (actuellement ";

        Placeholder.placeholder = "Ex : Grenoble, Paris, Nantes";
      }

      $('.lang').each(function(index, item) {
        $(this).text(arrLang[lang][$(this).attr('key')]);
      });
    });
  });
  