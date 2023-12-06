function init(){
    var submit = document.getElementById("submit");
    submit.addEventListener("click", (event)=>{
        event.preventDefault();
        register();
    });
}

function register(){
    var xhttp = new XMLHttpRequest();
    var name = document.getElementById("username").value;
    var pass = document.getElementById("password").value;
    var date = document.getElementById("date").value;
    xhttp.open("POST", "./register");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({username:name,password:pass,dob:date}));
    xhttp.onload = ()=>{
        if(xhttp.status != 200){
            alert(xhttp.responseText);
            return;
        }
        alert(xhttp.responseText);
        window.open("/", "_self");
    }
}