function init(){
    var submit = document.getElementById("submit");
    submit.addEventListener("click", (event)=>{
        event.preventDefault();
        login();
    });
}

function login(){
    var xhttp = new XMLHttpRequest();
    var name = document.getElementById("username").value;
    var pass = document.getElementById("password").value;
    xhttp.open("POST", "./login");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({username:name,password:pass}));
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
}