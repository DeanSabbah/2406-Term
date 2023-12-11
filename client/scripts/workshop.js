var workId;

async function init(wid){
    workId = wid;
    if(await logInCheck()){
        isOwn();
        checkEnrolled();
    }
    else{
        document.getElementById("enroll").disabled = true;
    }
}

function isOwn(){
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/workshops/isOwn");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({wid:workId}));
    xhttp.onload = ()=>{
        if(xhttp.responseText === "true"){
            document.getElementById("enroll").hidden = true;
        }
    }
}

function checkEnrolled(){
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/workshops/checkEnrolled");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({wid:workId}));
    xhttp.onload = ()=>{
        if(xhttp.responseText === "true"){
            document.getElementById("enroll").setAttribute("onclick", "unEnroll()");
            document.getElementById("enroll").innerText = "Enrolled";
        }
    }
}

function enroll(){
    var xhttp = new XMLHttpRequest()
    xhttp.open("PUT", "enroll");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({wid:workId}));
    xhttp.onload = ()=>{
        if(xhttp.status == 200){
            location.reload();
        }
    }
}
function unEnroll(){
    var xhttp = new XMLHttpRequest()
    xhttp.open("DELETE", "enroll");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({wid:workId}));
    xhttp.onload = ()=>{
        if(xhttp.status == 200){
            location.reload();
        }
    }
}