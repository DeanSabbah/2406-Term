//adds event listener to the new game form
function init(){
    document.getElementById("newGameForm").addEventListener("submit", formSubmit);
}

//sends HTTPRequest to post the new game to the server. If successful, the user is redirected to the new game's page
function formSubmit(event) {
    event.preventDefault();
    var xhttp = new XMLHttpRequest();
    xhttp.open('POST', "newGame");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.onload = ()=>{
        if(xhttp.status == 200){
            window.open(`/games/${JSON.parse(xhttp.response).id}`, "_self");
        }
        else{
            alert(xhttp.responseText);
        }
    };
    var game = {};
    new FormData(event.target).forEach((value, key) =>{
        game[key] = value;
    })
    xhttp.send(JSON.stringify(game));
}