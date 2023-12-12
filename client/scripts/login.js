function init(){
    document.getElementById("form").addEventListener("submit", login);
}

function login(event){
    event.preventDefault();
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "./login");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.onload = ()=>{
        if(xhttp.status == 401){
            alert("please check username or password");
            return;
        }else if(xhttp.status != 200){
            alert("Something went wrong");
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