/*const PageOk = document.querySelector('.pageOut');
const FirstPage = document.querySelector('.prePage');
const FirstPageForm = document.querySelector('form');
const FirstPageButton = document.querySelector('button');

if(localStorage.getItem("ville") == ""){
    PageOk.style.opacity = 0;
    FirstPage.style.opacity = 1;
}
else{
    PageOk.style.opacity = 1;
    FirstPage.style.opacity = 0;
    searchWeather(localStorage.getItem("ville"));
}

document.querySelector('input').focus();

FirstPageForm.addEventListener("submit", function(e){
    let FirstPageInput = document.forms["form"]["ville"].value;
    if(FirstPageInput == ""){
        alert("Entre quelque chose ptn");
    }
    else{
        searchWeather(FirstPageInput);
    }
    e.preventDefault();
});

function resetVille(){
    localStorage.setItem("ville", "");
}
*/