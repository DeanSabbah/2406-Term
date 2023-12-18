//adds event listener to the register form
function init(){
    document.getElementById("form").addEventListener("submit", register);
}

//Sends HTTPRequest to register a new user. If successful, the user is logged in and returned to their previous page
function register(event){
    event.preventDefault();
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "./register");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.onload = ()=>{
        if(xhttp.status != 200){
            alert(xhttp.responseText);
            return;
        }
        alert(xhttp.responseText);
        if(document.referrer == ""){
            window.open("/", "_self");
            return;
        }
        window.open(document.referrer, "_self");
    }
    var user = {};
    new FormData(event.target).forEach((value, key) =>{
        user[key] = value;
    });
    xhttp.send(JSON.stringify(user));
}