async function init_header(){
    if(await logInCheck()){
        showElms()
    }
}

function logout(){
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/auth/logout");
    xhttp.send();
    xhttp.onload = ()=>{
        alert(xhttp.responseText);
        if(xhttp.status == 200){
            location.reload();
        }
    }
}
function showNotification() {
    document.getElementById("notifications").classList.toggle("show");
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/users/notificaiton");
    xhttp.send();
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

function showElms(){
    document.getElementById("myProfile").removeAttribute("hidden");
    document.getElementById("logout").removeAttribute("hidden");
    document.getElementById("dropButton").removeAttribute("hidden")
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/users/notificaiton");
    xhttp.send();
    xhttp.onload = ()=>{
        var dataIn = JSON.parse(xhttp.response);
        if (dataIn.notifications.length <= 0){
            return;
        }
        var notifications = document.getElementById("notifications");
        var badge = document.createElement("span");
        badge.classList.add("badge");
        notifications.innerHTML = "";
        var badgeNum = 0;
        for(item in dataIn.notifications){
            badgeNum++;
            document.getElementById("dropdown").appendChild(badge);
            console.log(dataIn.notifications);
            if(dataIn.notifications[item].docModel == "Game"){
                notifications.innerHTML += `<a href="/games/${dataIn.notifications[item].doc._id}"> ${dataIn.notifications[item].doc.name} by ${dataIn.notifications[item].doc.publisher[0]}</a>`;
            }
            else{
                notifications.innerHTML += `<a href="/workshops/${dataIn.notifications[item].doc._id}"> ${dataIn.notifications[item].doc.name} by ${dataIn.notifications[item].doc.publisher[0]}</a>`;
            }
        }
        badge.innerText = badgeNum;
    }
}

async function logInCheck(){
    return new Promise((resolve, reject)=>{
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", "/auth/checkLogin");
        xhttp.onload = ()=>{
            resolve(xhttp.responseText === "true");
        }
        xhttp.onerror = ()=>{
            reject(xhttp.status);
        }
    xhttp.send()
    })
}

async function pubCheck(){
    return new Promise((resolve, reject)=>{
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", "/auth/checkPub");
        xhttp.onload = ()=>{
            resolve(xhttp.responseText === "true");
        }
        xhttp.onerror = ()=>{
            reject(xhttp.status);
        }
    xhttp.send()
    })
}